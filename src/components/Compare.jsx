import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompareUser, clearCompare } from '../store/githubSlice';
import { getLangColor, formatNumber } from '../utils/helpers';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';

const THEME = {
  dark:  { text: '#8b949e', grid: '#21262d', tooltip_bg: '#161b22', tooltip_border: '#30363d' },
  light: { text: '#656d76', grid: '#f0f2f5', tooltip_bg: '#ffffff', tooltip_border: '#d0d7de' },
};

export default function Compare() {
  const dispatch = useDispatch();
  const { user, totalStars, totalForks, repos, languages,
          compareUser, compareTotalStars, compareTotalForks, compareRepos, compareLanguages,
          compareStatus, compareError, token } = useSelector(s => s.github);
  const mode = useSelector(s => s.theme.mode);
  const t = THEME[mode];
  const [input, setInput] = useState('');

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Search a profile first</div>
        <div className="empty-state-desc">Load a primary GitHub profile before comparing.</div>
      </div>
    );
  }

  const handleCompare = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch(fetchCompareUser({ username: input.trim(), token }));
  };

  // Build radar data
  const normalize = (val, max) => max ? Math.round((val / max) * 100) : 0;
  const maxStars = Math.max(totalStars, compareTotalStars) || 1;
  const maxForks = Math.max(totalForks, compareTotalForks) || 1;
  const maxRepos = Math.max(repos.length, compareRepos.length) || 1;
  const maxFollowers = Math.max(user.followers, compareUser?.followers || 0) || 1;

  const radarData = [
    { metric: 'Stars',     A: normalize(totalStars, maxStars),        B: normalize(compareTotalStars, maxStars) },
    { metric: 'Forks',     A: normalize(totalForks, maxForks),        B: normalize(compareTotalForks, maxForks) },
    { metric: 'Repos',     A: normalize(repos.length, maxRepos),      B: normalize(compareRepos.length, maxRepos) },
    { metric: 'Followers', A: normalize(user.followers, maxFollowers), B: normalize(compareUser?.followers || 0, maxFollowers) },
  ];

  const STATS = [
    { label: 'Stars',     a: totalStars,      b: compareTotalStars      },
    { label: 'Forks',     a: totalForks,      b: compareTotalForks      },
    { label: 'Repos',     a: repos.length,    b: compareRepos.length    },
    { label: 'Followers', a: user.followers,  b: compareUser?.followers || 0 },
  ];

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleCompare} style={{ display:'flex', gap:8, marginBottom:24 }}>
        <input className="search-input" value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter GitHub username to compare…"
          style={{ maxWidth: 340 }} />
        <button type="submit" className="btn btn-primary">Compare</button>
        {compareUser && (
          <button type="button" className="btn btn-secondary"
            onClick={() => { dispatch(clearCompare()); setInput(''); }}>
            Clear
          </button>
        )}
      </form>

      {compareError && <div className="error-banner">⚠️ {compareError}</div>}

      {/* Profiles side by side */}
      <div className="compare-grid">
        <div className="compare-profile">
          <img src={user.avatar_url} alt={user.login}
            style={{ width:60, height:60, borderRadius:'50%', marginBottom:8 }} />
          <div style={{ fontWeight:700, fontSize:15 }}>{user.name || user.login}</div>
          <div style={{ fontSize:12, color:'var(--accent)', marginBottom:8 }}>@{user.login}</div>
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            {languages.slice(0,3).map(l => (
              <span key={l.name} className="badge badge-blue">{l.name}</span>
            ))}
          </div>
        </div>

        <div className="compare-vs">VS</div>

        <div className="compare-profile" style={{ opacity: compareStatus === 'loading' ? 0.5 : 1 }}>
          {compareUser ? (
            <>
              <img src={compareUser.avatar_url} alt={compareUser.login}
                style={{ width:60, height:60, borderRadius:'50%', marginBottom:8 }} />
              <div style={{ fontWeight:700, fontSize:15 }}>{compareUser.name || compareUser.login}</div>
              <div style={{ fontSize:12, color:'var(--accent)', marginBottom:8 }}>@{compareUser.login}</div>
              <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
                {compareLanguages.slice(0,3).map(l => (
                  <span key={l.name} className="badge badge-purple">{l.name}</span>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0' }}>
              {compareStatus === 'loading' ? '⏳ Loading…' : 'No comparison loaded'}
            </div>
          )}
        </div>
      </div>

      {/* Stat bars */}
      {compareUser && (
        <>
          <div className="compare-stat-row">
            {STATS.map(({ label, a, b }) => {
              const max = Math.max(a, b) || 1;
              return (
                <div key={label} className="compare-stat-card">
                  <div className="compare-stat-title">{label}</div>
                  <div className="compare-bars">
                    <div className="compare-bar-row">
                      <div className="compare-bar-label">{user.login}</div>
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill"
                          style={{ width:`${(a/max)*100}%`, background:'var(--accent)' }} />
                      </div>
                      <div className="compare-bar-val">{formatNumber(a)}</div>
                    </div>
                    <div className="compare-bar-row">
                      <div className="compare-bar-label">{compareUser.login}</div>
                      <div className="compare-bar-track">
                        <div className="compare-bar-fill"
                          style={{ width:`${(b/max)*100}%`, background:'var(--accent-purple)' }} />
                      </div>
                      <div className="compare-bar-val">{formatNumber(b)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Radar chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Skill radar</div>
              <div className="chart-sub">Normalized comparison across metrics</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={t.grid} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: t.text, fontSize: 12 }} />
                <Radar name={user.login} dataKey="A"
                  stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} />
                <Radar name={compareUser.login} dataKey="B"
                  stroke="#bc8cff" fill="#bc8cff" fillOpacity={0.25} />
                <Legend formatter={(v) => <span style={{ color: t.text, fontSize: 12 }}>{v}</span>} />
                <Tooltip
                  contentStyle={{ background: t.tooltip_bg, border: `1px solid ${t.tooltip_border}`, borderRadius: 8 }}
                  labelStyle={{ color: t.text }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
