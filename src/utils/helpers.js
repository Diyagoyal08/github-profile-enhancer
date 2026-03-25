 export const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
  Vue: '#41b883', Scala: '#c22d40', R: '#198CE7',
  SCSS: '#c6538c', Dockerfile: '#384d54', default: '#8b949e',
};

export const getLangColor = (lang) => LANG_COLORS[lang] || LANG_COLORS.default;

export const formatNumber = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};
