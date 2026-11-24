import { useMemo, useState } from 'react';
import { Search, Fingerprint, FileDown, Link2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { FraudCase } from '@/lib/types';
import { Modal } from '@/components/Modal';
import { CaseDetailBody } from './CaseTable';
import { downloadCasePdf } from '@/lib/pdfReport';
import { RiskBadge } from '@/components/RiskBadge';

interface SearchHit {
  caseItem: FraudCase;
  matched: string[];
}

const ID_FIELDS: Array<{ key: keyof FraudCase['identifiers']; label: string }> = [
  { key: 'phones', label: 'Phone' },
  { key: 'upiIds', label: 'UPI' },
  { key: 'domains', label: 'Domain' },
  { key: 'emails', label: 'Email' },
  { key: 'ips', label: 'IP' },
];

function identsOf(c: FraudCase): Array<{ value: string; label: string }> {
  return ID_FIELDS.flatMap((f) => c.identifiers[f.key].map((v) => ({ value: v.toLowerCase(), label: f.label })));
}

export function IdentifierSearch() {
  const { cases } = useApp();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('');
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);

  const run = () => setActive(query.trim().toLowerCase());

  const results = useMemo(() => {
    if (!active) return null;
    const hits: SearchHit[] = [];
    for (const c of cases) {
      const matched = identsOf(c).filter((i) => i.value.includes(active));
      if (matched.length > 0 || c.id.toLowerCase() === active) {
        hits.push({
          caseItem: c,
          matched: c.id.toLowerCase() === active ? ['CASE-ID'] : matched.map((m) => `${m.label}: ${m.value}`),
        });
      }
    }
    return hits;
  }, [active, cases]);

  const relatedIdents = useMemo(() => {
    if (!results || results.length === 0) return [];
    const caseIds = new Set(results.map((r) => r.caseItem.id));
    const freq = new Map<string, number>();
    for (const c of cases) {
      if (caseIds.has(c.id)) continue;
      for (const i of identsOf(c)) {
        const found = results.some((r) => r.matched.some((m) => m.endsWith(i.value)));
        if (found) freq.set(`${i.label}: ${i.value}`, (freq.get(`${i.label}: ${i.value}`) || 0) + 1);
      }
    }
    return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [results, cases]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-2.5">
          <Fingerprint size={22} className="text-royal" /> Identifier Search
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search by phone number, UPI ID, domain, email, IP address or Case ID to find matching and connected cases.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="e.g. 9876543210, frauddemo@upi, investment-demo.test, CASE-001"
            className="input flex-1 font-mono"
          />
          <button onClick={run} disabled={!query.trim()} className="btn-primary">
            <Search size={16} /> Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-slate-400 py-1">Try:</span>
          {['9876543210', 'frauddemo@upi', '9123456780', 'investment-demo.test', 'CASE-001'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                setActive(s.toLowerCase());
              }}
              className="text-xs font-mono rounded-lg border border-slate-200 bg-ice/60 px-2.5 py-1 hover:border-royal hover:text-royal transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <>
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy mb-1">
              {results.length === 0 ? 'No matching cases' : `${results.length} matching case(s)`}
            </h3>
            {results.length > 0 && (
              <p className="text-xs text-slate-400 mb-4">
                Query "<span className="font-mono">{active}</span>" — occurrences across {results.length} case(s)
              </p>
            )}
            <div className="space-y-3">
              {results.map(({ caseItem: c, matched }) => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-ice/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-navy text-sm">{c.id} · {c.category}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Matched {matched.length} identifier(s) · Status {c.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge level={c.riskLevel} />
                      <button onClick={() => setSelectedCase(c)} className="text-xs font-semibold text-royal hover:underline inline-flex items-center gap-1">
                        <Link2 size={13} /> Open case
                      </button>
                      <button onClick={() => downloadCasePdf(c, cases)} className="text-xs font-semibold text-slate-500 hover:text-royal inline-flex items-center gap-1">
                        <FileDown size={13} /> PDF
                      </button>
                    </div>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {matched.map((m) => (
                      <span key={m} className="badge bg-royal/10 text-royal font-mono text-[11px]">{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {relatedIdents.length > 0 && (
            <div className="card p-6">
              <h3 className="font-display font-semibold text-navy mb-3">Related Identifiers (from connected cases)</h3>
              <div className="flex flex-wrap gap-2">
                {relatedIdents.map(([id, n]) => (
                  <span key={id} className="badge bg-slate-100 text-navy font-mono text-[11px]">
                    {id} <span className="text-slate-400">×{n}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={Boolean(selectedCase)} onClose={() => setSelectedCase(null)} title={selectedCase ? `${selectedCase.id} — Case Details` : ''} wide>
        {selectedCase && <CaseDetailBody c={selectedCase} onDownload={() => downloadCasePdf(selectedCase, cases)} />}
      </Modal>
    </div>
  );
}
