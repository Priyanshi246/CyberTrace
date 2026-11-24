import { PieChart, BarChart3 } from 'lucide-react';
import type { FraudCase, RiskLevel } from '@/lib/types';

export function RiskDonut({ cases }: { cases: FraudCase[] }) {
  const counts: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  cases.forEach((c) => counts[c.riskLevel]++);
  const total = cases.length || 1;

  const segments = [
    { level: 'HIGH' as RiskLevel, color: '#DC2626', count: counts.HIGH },
    { level: 'MEDIUM' as RiskLevel, color: '#F59E0B', count: counts.MEDIUM },
    { level: 'LOW' as RiskLevel, color: '#16A34A', count: counts.LOW },
  ];

  const R = 60;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-8 flex-wrap">
      <svg width="170" height="170" viewBox="0 0 160 160" className="flex-shrink-0">
        <circle cx="80" cy="80" r={R} fill="none" stroke="#EEF2F9" strokeWidth="20" />
        {segments.map((s) => {
          const frac = s.count / total;
          const dash = frac * C;
          const el = (
            <circle
              key={s.level}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
              className="transition-all duration-700"
            />
          );
          offset += dash;
          return el;
        })}
        <text x="80" y="76" textAnchor="middle" className="fill-navy-deep font-display" style={{ fontSize: 26, fontWeight: 700 }}>
          {cases.length}
        </text>
        <text x="80" y="96" textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          TOTAL CASES
        </text>
      </svg>
      <div className="space-y-2.5">
        {segments.map((s) => (
          <div key={s.level} className="flex items-center gap-3 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="text-slate-600 w-16">{s.level}</span>
            <span className="font-bold text-navy">{s.count}</span>
            <span className="text-slate-400 text-xs">({Math.round((s.count / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryBar({ cases }: { cases: FraudCase[] }) {
  const catCounts = new Map<string, number>();
  cases.forEach((c) => catCounts.set(c.category, (catCounts.get(c.category) || 0) + 1));
  const sorted = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div className="space-y-2.5">
      {sorted.map(([cat, count]) => (
        <div key={cat} className="flex items-center gap-3">
          <span className="text-xs text-slate-600 w-44 truncate" title={cat}>
            {cat}
          </span>
          <div className="flex-1 h-5 rounded-md bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-royal to-accent-cyan transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(12, (count / max) * 100)}%` }}
            >
              <span className="text-[10px] font-bold text-white">{count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineChart({ cases }: { cases: FraudCase[] }) {
  const byDate = new Map<string, number>();
  cases.forEach((c) => {
    const d = c.incidentDate;
    byDate.set(d, (byDate.get(d) || 0) + 1);
  });
  const sorted = Array.from(byDate.entries()).sort().slice(-14);
  const max = Math.max(...sorted.map(([, n]) => n), 1);

  if (sorted.length === 0) {
    return <p className="text-sm text-slate-400 italic">No dated reports yet.</p>;
  }

  return (
    <div className="flex items-end gap-1.5 h-36">
      {sorted.map(([date, count]) => (
        <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
          <span className="text-[10px] font-bold text-navy opacity-0 group-hover:opacity-100 transition">{count}</span>
          <div
            className="w-full rounded-t bg-gradient-to-t from-navy to-royal transition-all duration-500 group-hover:from-royal group-hover:to-accent-cyan"
            style={{ height: `${Math.max(8, (count / max) * 100)}%` }}
          />
          <span className="text-[9px] text-slate-400">{date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: 'pie' | 'bar';
  children: React.ReactNode;
}) {
  const Icon = icon === 'pie' ? PieChart : BarChart3;
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-navy mb-4 flex items-center gap-2">
        <Icon size={17} className="text-royal" />
        {title}
      </h3>
      {children}
    </div>
  );
}
