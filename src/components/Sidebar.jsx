 import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLangColor, formatNumber } from '../utils/helpers';
import { removeRecentSearch, clearRecentSearches, fetchUser } from '../store/githubSlice';

const CONTRIB_LEVELS = ['', 'c-l1', 'c-l2', 'c-l3', 'c-l4'];

function generateContrib() {
  return Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => {
      const r = Math.random();
      return r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.80 ? 2 : r < 0.92 ? 3 : 4;
    })
  );
}

const contribData = generateContrib();

// ── Reusable recent item row ──────────────────────────────────────────────
function RecentItem({ s, active, onClick, onRemove }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 8px', borderRadius: 8, marginBottom: 4,
        cursor: 'pointer', transition: 'background 0.15s',
        background: hovered || active ? 'var(--bg-elevated)' : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img src={s.avatar} alt={s.login}
        style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
          @{s.login}
        </div>
      </div>
      {active && (
        <div style={{ width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent-green)', flexShrink: 0 }} />
      )}
      <button
        onClick={e => { e.stopPropagation(); onRemove(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 16, padding: '0 2px',
          lineHeight: 1, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
        ×
      </button>
    </div>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user, languages, repos, status, recentSearches, token } = useSelector(s => s.github);

  const handleRecentClick = (login) => {
    dispatch(fetchUser({ username: login, token }));
  };

  // ── HOME STATE: no active profile ─────────────────────────────
  if (!user && status !== 'loading') {
    return (
      <aside className="sidebar">
        {recentSearches.length > 0 ? (
          <div className="section">
            <div style={{ display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Recent searches</div>
              <button onClick={() => dispatch(clearRecentSearches())}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: 'var(--text-muted)', fontFamily: 'inherit', padding: 0 }}>
                Clear all
              </button>
            </div>
            {recentSearches.map(s => (
              <RecentItem key={s.login} s={s} active={false}
                onClick={() => handleRecentClick(s.login)}
                onRemove={() => dispatch(removeRecentSearch(s.login))} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)',
            fontSize: 13, marginTop: 48, lineHeight: 1.9 }}>
            🔍<br />Search a GitHub<br />username to get started
          </div>
        )}
      </aside>
    );
  }

  // ── LOADING STATE ──────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12, marginTop: 8 }}>
          <div className="skeleton" style={{ width: 72, height: 72, borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: '40%', height: 12, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 8, margin: '20px 0' }}>
          {[1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
          ))}
        </div>
        {[100, 80, 90, 70].map((w, i) => (
          <div key={i} className="skeleton"
            style={{ height: 12, width: `${w}%`, margin: '8px 0', borderRadius: 6 }} />
        ))}
      </aside>
    );
  }

  // ── ACTIVE PROFILE ─────────────────────────────────────────────
  // Only shows profile info — recent searches hidden here
  const totalRepos = repos.length;

  return (
    <aside className="sidebar">
      <img className="profile-avatar" src={user.avatar_url} alt={user.login} />
      <div className="profile-name">{user.name || user.login}</div>
      <div className="profile-login">@{user.login}</div>
      {user.bio && <div className="profile-bio">{user.bio}</div>}

      <div className="profile-meta">
        {user.company  && <div className="meta-row">🏢 {user.company}</div>}
        {user.location && <div className="meta-row">📍 {user.location}</div>}
        {user.blog && (
          <div className="meta-row">
            🔗 <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank" rel="noreferrer"
              style={{ color: 'var(--accent)', fontSize: 12 }}>
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {user.twitter_username && <div className="meta-row">𝕏 @{user.twitter_username}</div>}
      </div>

      <div className="stat-row">
        <div className="stat-item">
          <div className="stat-num">{formatNumber(user.followers)}</div>
          <div className="stat-lbl">Followers</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{formatNumber(user.following)}</div>
          <div className="stat-lbl">Following</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{totalRepos}</div>
          <div className="stat-lbl">Repos</div>
        </div>
      </div>

      <hr className="divider" />

      {languages.length > 0 && (
        <div className="section">
          <div className="section-title">Languages</div>
          <div className="lang-track">
            {languages.map(l => (
              <div key={l.name} className="lang-segment"
                style={{ width: `${l.pct}%`, background: getLangColor(l.name) }} />
            ))}
          </div>
          {languages.map(l => (
            <div key={l.name} className="lang-item">
              <div className="lang-dot" style={{ background: getLangColor(l.name) }} />
              <span className="lang-name">{l.name}</span>
              <span className="lang-pct">{l.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <hr className="divider" />

      <div className="section">
        <div className="section-title">
          <span className="pulse-dot" />Activity
        </div>
        <div className="contrib-wrap">
          {contribData.map((week, wi) => (
            <div key={wi} className="contrib-week">
              {week.map((lvl, di) => (
                <div key={di} className={`contrib-cell ${CONTRIB_LEVELS[lvl]}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}