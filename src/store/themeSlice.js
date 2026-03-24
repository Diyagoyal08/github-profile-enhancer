import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('gh-theme');

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: saved || 'dark' },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('gh-theme', state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
