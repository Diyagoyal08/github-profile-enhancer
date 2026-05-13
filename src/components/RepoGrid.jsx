import React from 'react';
import { useSelector } from 'react-redux';
import { getLangColor, formatNumber, timeAgo } from '../utils/helpers';

export default function RepoGrid() {
  const { topRepos, repos, status } = useSelector(s => s.github);
  const displayRepos = topRepos.length ? topRepos : repos.slice(0, 6);

  if (status === 'loading') {
    return (
      <div className="repo-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="repo-card">
            <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 4, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 12, width: '70%', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (status !== 'loading' && !displayRepos.length) {
    return (
      <div className="empty-state" style={{ marginTop: 24 }}>
        <div className="empty-state-icon">📦</div>
        <div className="empty-state-title">No repositories found</div>
        <div className="empty-state-desc">This GitHub profile has no public repositories or they could not be loaded.</div>
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {displayRepos.map(repo => (
        <a key={repo.id} className="repo-card"
          href={repo.html_url} target="_blank" rel="noreferrer">
          <div className="repo-name">{repo.name}</div>
          <div className="repo-desc">
            {repo.description || 'No description provided.'}
          </div>
          <div className="repo-footer">
            {repo.language && (
              <span className="repo-stat">
                <span className="lang-dot-sm" style={{ background: getLangColor(repo.language) }} />
                {repo.language}
              </span>
            )}
            <span className="repo-stat">⭐ {formatNumber(repo.stargazers_count)}</span>
            <span className="repo-stat">🍴 {formatNumber(repo.forks_count)}</span>
            <span className="repo-stat" style={{ marginLeft: 'auto' }}>
              {timeAgo(repo.updated_at)}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
