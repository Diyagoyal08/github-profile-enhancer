 import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './store/githubSlice';
import { toggleTheme } from './store/themeSlice';
import Sidebar from './components/Sidebar';
import MetricCards from './components/MetricCards';
import RepoGrid from './components/RepoGrid';
import Charts from './components/Charts';
import Compare from './components/Compare';
import TokenModal from './components/TokenModal';
import './styles/global.css';

const TABS = ['Overview', 'Charts', 'Compare'];

export default function App() {
  const dispatch = useDispatch();
  const { status, error, token, recentSearches } = useSelector(s => s.github);
  const mode = useSelector(s => s.theme.mode);

  const [query, setQuery]           = useState('');
  const [activeTab, setActiveTab]   = useState('Overview');
  const [showToken, setShowToken]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlighted, setHighlighted]  = useState(-1);

  const inputRef    = useRef(null);
  const dropdownRef = useRef(null);

  // Filter recent searches that match the current query
  const suggestions = query.trim().length > 0
    ? recentSearches.filter(s =>
        s.login.toLowerCase().includes(query.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes(query.toLowerCase()))
      )
    : recentSearches;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const runSearch = (username) => {
    if (!username.trim()) return;
    dispatch(fetchUser({ username: username.trim(), token }));
    setQuery(username.trim());
    setShowDropdown(false);
    setHighlighted(-1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, -1));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      runSearch(suggestions[highlighted].login);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlighted(-1);
    }
  };

  return (
    <div data-theme={mode} className="app-container">
      {/* ── TOP BAR ── */}
      <header className="topbar">
        <div className="topbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-primary)">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span className="brand-name"><span>github</span> profile enhancer</span>
        </div>

        {/* Search with autocomplete */}
        <form className="topbar-search" onSubmit={handleSearch}
          style={{ position: 'relative' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              ref={inputRef}
              className="search-input"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setShowDropdown(true);
                setHighlighted(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search GitHub username…"
              autoComplete="off"
            />

            {/* Autocomplete dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div ref={dropdownRef} style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 10, zIndex: 999, overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                <div style={{ padding: '8px 12px 4px',
                  fontSize: 10, color: 'var(--text-muted)',
                  fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {query.trim() ? 'Matching history' : 'Recent searches'}
                </div>
                {suggestions.map((s, i) => (
                  <div key={s.login}
                    onMouseDown={() => runSearch(s.login)}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', cursor: 'pointer', transition: 'background 0.1s',
                      background: highlighted === i ? 'var(--bg-elevated)' : 'transparent',
                    }}>
                    <img src={s.avatar} alt={s.login}
                      style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--accent)',
                        fontFamily: 'JetBrains Mono, monospace' }}>
                        @{s.login}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↵</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary"
            disabled={status === 'loading'}>
            {status === 'loading' ? '⏳' : 'Analyze'}
          </button>
        </form>

        <div className="topbar-actions">
          <button className="btn btn-icon" title={token ? 'Token active ✓' : 'Add token'}
            onClick={() => setShowToken(true)}>
            {token ? '🔑' : '🔐'}
          </button>
          <button className="btn btn-icon" onClick={() => dispatch(toggleTheme())}
            title="Toggle theme">
            {mode === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="main-layout">
        <Sidebar />

        <main className="main-content">
          {error && <div className="error-banner">⚠️ {error}</div>}

          <div className="tabs">
            {TABS.map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Overview' && (
            <>
              <MetricCards />
              <div className="section-title" style={{ marginBottom: 14 }}>Top repositories</div>
              <RepoGrid />
            </>
          )}

          {activeTab === 'Charts'  && <Charts />}
          {activeTab === 'Compare' && <Compare />}
        </main>
      </div>

      {showToken && <TokenModal onClose={() => setShowToken(false)} />}
    </div>
  );
}