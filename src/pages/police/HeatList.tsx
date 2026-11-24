import { useMemo, useState } from 'react';
import { Flame, AppWindow, Phone, Landmark, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RiskBadge } from '@/components/RiskBadge';

type Tab = 'DOMAINS' | 'PHONES' | 'UPI' | 'APPS';

export function HeatList() {
  const { cases } = useApp();
  const [tab, setTab] = useState<Tab>('PHONES');

  const rows = useMemo(() => {
    interface Row {
      identifier: string;
      reportCount: number;
      caseIds: string[];
      lastReported: string;
      riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
      verified: boolean;
    }
    const map = new Map<string, Row>();

    const add = (identifier: string, c: (typeof cases)[number]) => {
      const row = map.get(identifier) || { identifier, reportCount: 0, caseIds: [], lastReported: '', riskLevel: 'LOW' as const, verified: false };
      row.reportCount += 1;
      row.caseIds.push(c.id);
      if (!row.lastReported || c.incidentDate > row.lastReported) row.lastReported = c.incidentDate;
      if (c.riskLevel === 'HIGH') row.riskLevel = 'HIGH';
      else if (c.riskLevel === 'MEDIUM' && row.riskLevel !== 'HIGH') row.riskLevel = 'MEDIUM';
      map.set(identifier, row);
    };

    cases.forEach((c) => {
      c.identifiers.phones.forEach((v) => add(v, c));
      c.identifiers.upiIds.forEach((v) => add(v, c));
      c.identifiers.domains.forEach((v) => add(v, c));
    });

    // Synthetic "verified malicious" markers for demo differentiation
    const verified = new Set(['frauddemo@upi', '193.29.14.2', 'investment-demo.test']);
    for (const row of map.values()) {
      if (verified.has(row.identifier)) row.verified = true;
    }

    return Array.from(map.values()).sort((a, b) => b.reportCount - a.reportCount);
  }, [cases]);

  const filtered = rows.filter((r) => {
    if (tab === 'PHONES') return /^\d+$/.test(r.identifier);
    if (tab === 'UPI') return r.identifier.includes('@') && !r.identifier.includes('.');
    if (tab === 'DOMAINS') return r.identifier.includes('.');
    return false;
  });

  const tabs: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
    { key: 'PHONES', label: 'Phone Numbers', icon: <Phone size={15} /> },
    { key: 'DOMAINS', label: 'Domains', icon: <Globe size={15} /> },
    { key: 'UPI', label: 'UPI IDs', icon: <Landmark size={15} /> },
    { key: 'APPS', label: 'Applications', icon: <AppWindow size={15} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-2.5">
          <Flame size={22} className="text-risk-high" /> Heat-List
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Frequently reported suspicious identifiers across all complaints (synthetic demonstration data).
        </p>
      </div>

      <div className="rounded-xl bg-ice border border-slate-100 px-4 py-3 text-xs text-slate-600">
        <strong className="text-navy">Note:</strong>{' '}
        <span className="font-semibold text-risk-medium">Frequently Reported</span> means multiple citizens flagged this
        identifier. <span className="font-semibold text-risk-high">Verified Malicious</span> means confirmed by analysis
        — the two are not the same.
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === tb.key ? 'bg-navy text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-royal hover:text-royal'
            }`}
          >
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        {tab === 'APPS' ? (
          <div className="p-6 space-y-3">
            {[
              { name: 'bank-app-update.apk (SBI Quick Update)', count: 4, last: '2 days ago', risk: 'HIGH' as const, verified: true },
              { name: 'loan-fast-cash.apk (FastCash Loan)', count: 3, last: '6 days ago', risk: 'HIGH' as const, verified: false },
            ].map((a) => (
              <div key={a.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-ice/50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy font-mono">{a.name}</p>
                  <p className="text-xs text-slate-400">Reported {a.count} times · Last: {a.last}</p>
                </div>
                <div className="flex items-center gap-2">
                  {a.verified && <span className="badge bg-risk-high text-white">Verified Malicious</span>}
                  <RiskBadge level={a.risk} />
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400">Sample APK intelligence records — demonstration data.</p>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Identifier</th>
                <th className="px-5 py-3.5">Report Count</th>
                <th className="px-5 py-3.5">Associated Cases</th>
                <th className="px-5 py-3.5">Last Reported</th>
                <th className="px-5 py-3.5">Risk Level</th>
                <th className="px-5 py-3.5">Classification</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.identifier} className="border-b border-slate-50 hover:bg-ice/60 transition">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-navy">{r.identifier}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-display font-bold ${r.reportCount >= 3 ? 'text-risk-high' : 'text-navy'}`}>{r.reportCount}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {r.caseIds.slice(0, 4).map((id) => (
                        <span key={id} className="badge bg-slate-100 text-slate-600 text-[10px]">{id}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{r.lastReported}</td>
                  <td className="px-5 py-3.5"><RiskBadge level={r.riskLevel} /></td>
                  <td className="px-5 py-3.5">
                    {r.verified ? (
                      <span className="badge bg-risk-high text-white">Verified Malicious</span>
                    ) : (
                      <span className="badge bg-risk-medium/10 text-risk-medium">Frequently Reported</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400 italic">
                    No identifiers in this category yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
