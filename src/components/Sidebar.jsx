import React from 'react';
import { useSelector } from 'react-redux';
import { getLangColor, formatNumber } from '../utils/helpers';

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

export default function Sidebar() {
  const { user, languages, totalStars, totalForks, repos, status } = useSelector(s => s.github);

  if (status === 'loading') {
    return (
      <aside className="sidebar">
        {[80, 120, 60, 100, 80].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 16, width: `${w}%`, margin: '12px 0', borderRadius: 8 }} />
        ))}
      </aside>
    );
  }

  if (!user) {
    return (
      <aside className="sidebar">
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 40 }}>
          Search a GitHub username to get started
        </div>
      </aside>
    );
  }

  const totalRepos = repos.length;
  const langTotal = languages.reduce((s, l) => s + l.count, 0);

  return (
    <aside className="sidebar">
      {/* Avatar & identity */}
      <img className="profile-avatar" src={user.avatar_url} alt={user.login} />
      <div className="profile-name">{user.name || user.login}</div>
      <div className="profile-login">@{user.login}</div>
      {user.bio && <div className="profile-bio">{user.bio}</div>}

      {/* Meta */}
      <div className="profile-meta">
        {user.company && <div className="meta-row">🏢 {user.company}</div>}
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
        {user.twitter_username && (
          <div className="meta-row">𝕏 @{user.twitter_username}</div>
        )}
      </div>

      {/* Stats */}
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

      {/* Language breakdown */}
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

      {/* Contribution grid */}
      <div className="section">
        <div className="section-title">
          <span className="pulse-dot" />
          Activity
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
