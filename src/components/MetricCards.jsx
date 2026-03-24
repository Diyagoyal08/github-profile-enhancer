import React from 'react';
import { useSelector } from 'react-redux';
import { formatNumber } from '../utils/helpers';

const CARDS = [
  { key: 'totalStars',  label: 'Total Stars',   emoji: '⭐', cls: 'mc-blue'   },
  { key: 'totalForks',  label: 'Total Forks',   emoji: '🍴', cls: 'mc-green'  },
  { key: 'public_repos',label: 'Public Repos',  emoji: '📦', cls: 'mc-purple' },
  { key: 'followers',   label: 'Followers',     emoji: '👥', cls: 'mc-orange' },
];

export default function MetricCards() {
  const { user, totalStars, totalForks, status } = useSelector(s => s.github);

  if (status === 'loading') {
    return (
      <div className="metrics-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="metric-card">
            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 4, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 12, width: '50%', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!user) return null;

  const values = {
    totalStars, totalForks,
    public_repos: user.public_repos,
    followers: user.followers,
  };

  return (
    <div className="metrics-grid">
      {CARDS.map(({ key, label, emoji, cls }) => (
        <div key={key} className={`metric-card ${cls}`}>
          <div className="metric-emoji">{emoji}</div>
          <div className="metric-value">{formatNumber(values[key])}</div>
          <div className="metric-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
