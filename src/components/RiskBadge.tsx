import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';
import type { RiskLevel } from '@/lib/types';

const styles: Record<RiskLevel, { badge: string; bar: string; icon: typeof ShieldCheck; text: string }> = {
  LOW: {
    badge: 'bg-risk-low/10 text-risk-low border border-risk-low/20',
    bar: 'bg-risk-low',
    icon: ShieldCheck,
    text: 'text-risk-low',
  },
  MEDIUM: {
    badge: 'bg-risk-medium/10 text-risk-medium border border-risk-medium/20',
    bar: 'bg-risk-medium',
    icon: AlertTriangle,
    text: 'text-risk-medium',
  },
  HIGH: {
    badge: 'bg-risk-high/10 text-risk-high border border-risk-high/20',
    bar: 'bg-risk-high',
    icon: XCircle,
    text: 'text-risk-high',
  },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const s = styles[level];
  return (
    <span className={`badge ${s.badge}`}>
      {level === 'LOW' && <ShieldCheck size={12} />}
      {level === 'MEDIUM' && <AlertTriangle size={12} />}
      {level === 'HIGH' && <XCircle size={12} />}
      {level}
    </span>
  );
}

export function RiskScoreBar({ score, level }: { score: number; level: RiskLevel }) {
  const s = styles[level];
  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-medium text-slate-500">Risk Score</span>
        <span className={`text-sm font-bold ${s.text}`}>{score}/100</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${s.bar} transition-all duration-700`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
    </div>
  );
}

export { styles as riskStyles };
