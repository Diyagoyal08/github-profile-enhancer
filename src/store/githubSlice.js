 import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'https://api.github.com';

const getHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// ── Fetch single user profile + repos ──────────────────────────────────────
export const fetchUser = createAsyncThunk(
  'github/fetchUser',
  async ({ username, token }, { rejectWithValue }) => {
    try {
      const headers = getHeaders(token);
      const [userRes, reposRes] = await Promise.all([
        axios.get(`${BASE}/users/${username}`, { headers }),
        axios.get(`${BASE}/users/${username}/repos?per_page=100&sort=updated`, { headers }),
      ]);

      const user = userRes.data;
      const repos = reposRes.data;

      // Language breakdown
      const langMap = {};
      repos.forEach((r) => {
        if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
      });
      const totalLangRepos = Object.values(langMap).reduce((a, b) => a + b, 0);
      const languages = Object.entries(langMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({
          name,
          count,
          pct: Math.round((count / totalLangRepos) * 100),
        }));

      // Stars & forks totals
      const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
      const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

      // Top 6 repos by stars
      const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);

      // Stars over time (monthly from repo created_at)
      const monthly = {};
      repos.forEach((r) => {
        const month = r.created_at.slice(0, 7);
        monthly[month] = (monthly[month] || 0) + r.stargazers_count;
      });
      const starsOverTime = Object.entries(monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([month, stars]) => ({ month, stars }));

      return { user, repos, languages, totalStars, totalForks, topRepos, starsOverTime };
    } catch (err) {
      if (err.response?.status === 404) return rejectWithValue('User not found');
      if (err.response?.status === 403) return rejectWithValue('Rate limit exceeded — add your token');
      return rejectWithValue(err.message);
    }
  }
);

// ── Fetch comparison user ──────────────────────────────────────────────────
export const fetchCompareUser = createAsyncThunk(
  'github/fetchCompareUser',
  async ({ username, token }, { rejectWithValue }) => {
    try {
      const headers = getHeaders(token);
      const [userRes, reposRes] = await Promise.all([
        axios.get(`${BASE}/users/${username}`, { headers }),
        axios.get(`${BASE}/users/${username}/repos?per_page=100&sort=updated`, { headers }),
      ]);
      const user = userRes.data;
      const repos = reposRes.data;
      const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
      const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
      const langMap = {};
      repos.forEach((r) => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
      const totalLangRepos = Object.values(langMap).reduce((a, b) => a + b, 0);
      const languages = Object.entries(langMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([name, count]) => ({ name, count, pct: Math.round((count / totalLangRepos) * 100) }));
      return { user, repos, languages, totalStars, totalForks };
    } catch (err) {
      if (err.response?.status === 404) return rejectWithValue('Compare user not found');
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────────────────
const githubSlice = createSlice({
  name: 'github',
  initialState: {
    // primary
    user: null, repos: [], languages: [], topRepos: [],
    totalStars: 0, totalForks: 0, starsOverTime: [],
    status: 'idle', error: null,
    // compare
    compareUser: null, compareRepos: [], compareLanguages: [],
    compareTotalStars: 0, compareTotalForks: 0,
    compareStatus: 'idle', compareError: null,
    // token
    token: '',
    // recent searches — persisted to localStorage
    recentSearches: JSON.parse(localStorage.getItem('gh-recent') || '[]'),
  },
  reducers: {
    setToken(state, action) { state.token = action.payload; },
    addRecentSearch(state, action) {
      const username = action.payload;
      const filtered = state.recentSearches.filter(s => s.login !== username);
      state.recentSearches = [{ login: username, avatar: action.payload.avatar }, ...filtered].slice(0, 8);
      localStorage.setItem('gh-recent', JSON.stringify(state.recentSearches));
    },
    removeRecentSearch(state, action) {
      state.recentSearches = state.recentSearches.filter(s => s.login !== action.payload);
      localStorage.setItem('gh-recent', JSON.stringify(state.recentSearches));
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
      localStorage.removeItem('gh-recent');
    },
    clearCompare(state) {
      state.compareUser = null; state.compareRepos = []; state.compareLanguages = [];
      state.compareTotalStars = 0; state.compareTotalForks = 0;
      state.compareStatus = 'idle'; state.compareError = null;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchUser.fulfilled, (s, { payload: p }) => {
        s.status = 'succeeded';
        s.user = p.user; s.repos = p.repos; s.languages = p.languages;
        s.topRepos = p.topRepos; s.totalStars = p.totalStars;
        s.totalForks = p.totalForks; s.starsOverTime = p.starsOverTime;
        // Save to recent searches
        const entry = { login: p.user.login, avatar: p.user.avatar_url, name: p.user.name || p.user.login };
        const filtered = s.recentSearches.filter(r => r.login !== entry.login);
        s.recentSearches = [entry, ...filtered].slice(0, 8);
        localStorage.setItem('gh-recent', JSON.stringify(s.recentSearches));
      })
      .addCase(fetchUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(fetchCompareUser.pending, (s) => { s.compareStatus = 'loading'; s.compareError = null; })
      .addCase(fetchCompareUser.fulfilled, (s, { payload: p }) => {
        s.compareStatus = 'succeeded';
        s.compareUser = p.user; s.compareRepos = p.repos; s.compareLanguages = p.languages;
        s.compareTotalStars = p.totalStars; s.compareTotalForks = p.totalForks;
      })
      .addCase(fetchCompareUser.rejected, (s, a) => { s.compareStatus = 'failed'; s.compareError = a.payload; });
  },
});

export const { setToken, clearCompare, clearError, addRecentSearch, removeRecentSearch, clearRecentSearches } = githubSlice.actions;
export default githubSlice.reducer;
