import React from 'react';
import { useSelector } from 'react-redux';
import { getLangColor, formatNumber, timeAgo } from '../utils/helpers';

export default function RepoGrid() {
  const { topRepos, status } = useSelector(s => s.github);

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

  if (!topRepos.length) return null;

  return (
    <div className="repo-grid">
      {topRepos.map(repo => (
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
