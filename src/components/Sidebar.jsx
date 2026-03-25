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
 
 export default function Sidebar() {
   const dispatch = useDispatch();
   const { user, languages, repos, status, recentSearches, token } = useSelector(s => s.github);
 
   const handleRecentClick = (login) => {
     dispatch(fetchUser({ username: login, token }));
   };
 
   const RecentSearches = () => {
     if (!recentSearches.length) return null;
     return (
       <div className="section">
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
           <div className="section-title" style={{ marginBottom: 0 }}>Recent searches</div>
           <button onClick={() => dispatch(clearRecentSearches())}
             style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11,
               color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', padding: 0 }}>
             Clear all
           </button>
         </div>
         {recentSearches.map(s => (
           <div key={s.login} style={{
             display: 'flex', alignItems: 'center', gap: 8,
             padding: '6px 8px', borderRadius: 8, marginBottom: 4,
             cursor: 'pointer', transition: 'background 0.15s',
             background: user?.login === s.login ? 'var(--bg-elevated)' : 'transparent',
           }}
             onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
             onMouseLeave={e => e.currentTarget.style.background = user?.login === s.login ? 'var(--bg-elevated)' : 'transparent'}
           >
             <img src={s.avatar} alt={s.login}
               onClick={() => handleRecentClick(s.login)}
               style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, cursor: 'pointer' }} />
             <div style={{ flex: 1, minWidth: 0 }} onClick={() => handleRecentClick(s.login)}>
               <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
                 overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                 {s.name}
               </div>
               <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                 @{s.login}
               </div>
             </div>
             {user?.login === s.login && (
               <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', flexShrink: 0 }} />
             )}
             <button
               onClick={(e) => { e.stopPropagation(); dispatch(removeRecentSearch(s.login)); }}
               style={{ background: 'none', border: 'none', cursor: 'pointer',
                 color: 'var(--text-muted)', fontSize: 14, padding: '0 2px',
                 lineHeight: 1, flexShrink: 0, opacity: 0.6 }}
               title="Remove">
               ×
             </button>
           </div>
         ))}
       </div>
     );
   };
 
   if (status === 'loading') {
     return (
       <aside className="sidebar">
         <RecentSearches />
         {recentSearches.length > 0 && <hr className="divider" />}
         {[80, 120, 60, 100, 80].map((w, i) => (
           <div key={i} className="skeleton" style={{ height: 16, width: `${w}%`, margin: '12px 0', borderRadius: 8 }} />
         ))}
       </aside>
     );
   }
 
   if (!user) {
     return (
       <aside className="sidebar">
         <RecentSearches />
         {!recentSearches.length && (
           <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 40 }}>
             Search a GitHub username to get started
           </div>
         )}
       </aside>
     );
   }
 
   const totalRepos = repos.length;
 
   return (
     <aside className="sidebar">
       {/* Recent searches at the top */}
       {recentSearches.length > 0 && (
         <>
           <RecentSearches />
           <hr className="divider" />
         </>
       )}
 
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
 