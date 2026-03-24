import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { getLangColor } from '../utils/helpers';

const THEME_VARS = {
  dark:  { text: '#8b949e', grid: '#21262d', tooltip_bg: '#161b22', tooltip_border: '#30363d' },
  light: { text: '#656d76', grid: '#f0f2f5', tooltip_bg: '#ffffff', tooltip_border: '#d0d7de' },
};

const CustomTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload?.length) return null;
  const t = THEME_VARS[mode];
  return (
    <div style={{
      background: t.tooltip_bg, border: `1px solid ${t.tooltip_border}`,
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <p style={{ color: t.text, marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Charts() {
  const { languages, starsOverTime, topRepos, status } = useSelector(s => s.github);
  const mode = useSelector(s => s.theme.mode);
  const t = THEME_VARS[mode];

  if (status === 'loading') {
    return (
      <>
        {[1,2].map(i => (
          <div key={i} className="chart-card">
            <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
          </div>
        ))}
      </>
    );
  }

  if (!languages.length) return null;

  // Top repos bar data
  const barData = topRepos.slice(0, 8).map(r => ({
    name: r.name.length > 12 ? r.name.slice(0, 12) + '…' : r.name,
    Stars: r.stargazers_count,
    Forks: r.forks_count,
  }));

  return (
    <>
      {/* Stars chart */}
      {barData.length > 0 && (
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Repository stats</div>
              <div className="chart-sub">Stars & forks by repo</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={14} barGap={4}>
              <CartesianGrid stroke={t.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: t.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip mode={mode} />} />
              <Bar dataKey="Stars" fill="#58a6ff" radius={[4,4,0,0]} />
              <Bar dataKey="Forks" fill="#3fb950" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Language pie */}
      {languages.length > 0 && (
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Language distribution</div>
              <div className="chart-sub">Based on public repositories</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={languages} dataKey="count" nameKey="name"
                cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                paddingAngle={3}>
                {languages.map(l => (
                  <Cell key={l.name} fill={getLangColor(l.name)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip mode={mode} />} />
              <Legend
                formatter={(v) => <span style={{ color: t.text, fontSize: 12 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stars over time */}
      {starsOverTime.length > 1 && (
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Stars timeline</div>
              <div className="chart-sub">Repository creation activity</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={starsOverTime}>
              <CartesianGrid stroke={t.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: t.text, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip mode={mode} />} />
              <Line type="monotone" dataKey="stars" name="Stars"
                stroke="#bc8cff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
