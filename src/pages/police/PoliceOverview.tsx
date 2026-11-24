import { FileText, AlertTriangle, ShieldAlert, ShieldCheck, Link2, Fingerprint, Phone, Landmark, Globe, Mail, Network } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RiskDonut, CategoryBar, TimelineChart, ChartCard } from '@/components/Charts';
import { CaseTable } from './CaseTable';
import { RiskBadge } from '@/components/RiskBadge';

export function PoliceOverview() {
  const { cases } = useApp();

  const high = cases.filter((c) => c.riskLevel === 'HIGH').length;
  const medium = cases.filter((c) => c.riskLevel === 'MEDIUM').length;
  const low = cases.filter((c) => c.riskLevel === 'LOW').length;

  // Connected cases: share at least one identifier with another case
  const identKey = (c: (typeof cases)[number]) =>
    new Set([
      ...c.identifiers.phones.map((v) => `p:${v}`),
      ...c.identifiers.upiIds.map((v) => `u:${v}`),
      ...c.identifiers.domains.map((v) => `d:${v}`),
      ...c.identifiers.emails.map((v) => `e:${v}`),
      ...c.identifiers.ips.map((v) => `i:${v}`),
    ]);
  const keyLists = cases.map(identKey);
  const connected = cases.filter((c, i) => {
    const mine = keyLists[i];
    return keyLists.some((other, j) => i !== j && mine && other && Array.from(mine).some((k) => other.has(k)));
  }).length;

  const idFreq = new Map<string, number>();
  cases.forEach((c) => {
    const seen = new Set<string>();
    c.identifiers.phones.forEach((v) => seen.add(`PH · ${v}`));
    c.identifiers.upiIds.forEach((v) => seen.add(`UPI · ${v}`));
    c.identifiers.domains.forEach((v) => seen.add(`DOMAIN · ${v}`));
    c.identifiers.emails.forEach((v) => seen.add(`EMAIL · ${v}`));
    seen.forEach((s) => idFreq.set(s, (idFreq.get(s) || 0) + 1));
  });
  const topIdentifiers = Array.from(idFreq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxFreq = topIdentifiers[0]?.[1] || 1;

  const stats = [
    { icon: <FileText size={18} />, label: 'Total Reports', value: cases.length, tint: 'bg-royal/10 text-royal' },
    { icon: <AlertTriangle size={18} />, label: 'High-Risk Cases', value: high, tint: 'bg-risk-high/10 text-risk-high' },
    { icon: <ShieldAlert size={18} />, label: 'Medium-Risk Cases', value: medium, tint: 'bg-risk-medium/10 text-risk-medium' },
    { icon: <ShieldCheck size={18} />, label: 'Low-Risk Cases', value: low, tint: 'bg-risk-low/10 text-risk-low' },
    { icon: <Link2 size={18} />, label: 'Connected Cases', value: connected, tint: 'bg-accent-cyan/10 text-accent-cyanDark' },
    { icon: <Fingerprint size={18} />, label: 'Extracted Identifiers', value: topIdentifiers.reduce((s, [, n]) => s + n, 0), tint: 'bg-navy/10 text-navy' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">Investigation Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Intelligence dashboard over all citizen reports and demo seed cases.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${s.tint}`}>{s.icon}</div>
            <p className="font-display font-bold text-2xl text-navy mt-3">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Reports by Risk Level" icon="pie">
          <RiskDonut cases={cases} />
        </ChartCard>
        <ChartCard title="Cases by Fraud Category" icon="bar">
          <CategoryBar cases={cases} />
        </ChartCard>
        <ChartCard title="Reports Over Time" icon="bar">
          <TimelineChart cases={cases} />
        </ChartCard>
      </div>

      <ChartCard title="Frequently Reported Identifiers" icon="bar">
        <div className="space-y-2.5">
          {topIdentifiers.map(([id, count]) => (
            <div key={id} className="flex items-center gap-3">
              <span className="text-xs font-mono text-navy w-56 truncate">{id}</span>
              <div className="flex-1 h-5 rounded-md bg-slate-100 overflow-hidden">
                <div className="h-full rounded-md bg-gradient-to-r from-navy to-royal" style={{ width: `${(count / maxFreq) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-navy w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1"><Phone size={12} /> Phone</span>
          <span className="inline-flex items-center gap-1"><Landmark size={12} /> UPI</span>
          <span className="inline-flex items-center gap-1"><Globe size={12} /> Domain</span>
          <span className="inline-flex items-center gap-1"><Mail size={12} /> Email</span>
          <span className="inline-flex items-center gap-1"><Network size={12} /> IP</span>
        </div>
      </ChartCard>

      <div>
        <h2 className="font-display font-semibold text-navy mb-4">Recent Cases</h2>
        <CaseTable cases={cases.slice(0, 8)} />
      </div>
    </div>
  );
}

export function AllCases() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">All Cases</h1>
        <p className="text-sm text-slate-500 mt-1">Search, filter and update every reported case.</p>
      </div>
      <CaseTable />
    </div>
  );
}

export function HighRiskCases() {
  const { cases } = useApp();
  const high = cases.filter((c) => c.riskLevel === 'HIGH');
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-3">
          High-Risk Cases <RiskBadge level="HIGH" />
          <span className="text-sm font-normal text-slate-400">({high.length} cases)</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">Cases with strong fraud indicators requiring priority investigation.</p>
      </div>
      <CaseTable cases={high} />
    </div>
  );
}
