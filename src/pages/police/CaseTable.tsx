import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, FileDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { CaseStatus, FraudCase } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { IdentifierChips } from '@/components/AnalysisCard';
import { Modal } from '@/components/Modal';
import { downloadCasePdf } from '@/lib/pdfReport';

export function CaseTable({
  cases: inputCases,
  onOpenCase,
}: {
  cases?: FraudCase[];
  onOpenCase?: (c: FraudCase) => void;
}) {
  const { cases: allCases, updateCaseStatus, t } = useApp();
  const all = inputCases ?? allCases;
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<'date' | 'risk'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<FraudCase | null>(null);

  const categories = useMemo(() => Array.from(new Set(all.map((c) => c.category))), [all]);

  const filtered = useMemo(() => {
    let rows = all.filter((c) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        Object.values(c.identifiers).some((arr) => (arr as string[]).some((v: string) => v.toLowerCase().includes(q))) ||
        c.phone.includes(q) ||
        c.upiId.toLowerCase().includes(q);
      const matchR = riskFilter === 'ALL' || c.riskLevel === riskFilter;
      const matchC = categoryFilter === 'ALL' || c.category === categoryFilter;
      return matchQ && matchR && matchC;
    });
    rows = [...rows].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === 'risk') return (a.riskScore - b.riskScore) * dir;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });
    return rows;
  }, [all, query, riskFilter, categoryFilter, sortKey, sortAsc]);

  const open = (c: FraudCase) => {
    setSelected(c);
    onOpenCase?.(c);
  };

  const SortHeader = ({ label, k }: { label: string; k: 'date' | 'risk' }) => (
    <button
      onClick={() => {
        setSortKey(k);
        setSortAsc((prev) => (sortKey === k ? !prev : false));
      }}
      className="inline-flex items-center gap-1 hover:text-royal transition"
    >
      {label}
      {sortKey === k && (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, identifiers, content…"
            className="input !pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="input !w-auto !py-2 text-xs">
            <option value="ALL">All Risk</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input !w-auto !py-2 text-xs max-w-[180px]">
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3.5">Case ID</th>
              <th className="px-5 py-3.5"><SortHeader label={t('common.date')} k="date" /></th>
              <th className="px-5 py-3.5">{t('common.category')}</th>
              <th className="px-5 py-3.5"><SortHeader label={t('common.risk')} k="risk" /></th>
              <th className="px-5 py-3.5">Identifier</th>
              <th className="px-5 py-3.5">{t('common.status')}</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const primaryId =
                c.identifiers.phones[0] ||
                c.identifiers.upiIds[0] ||
                c.identifiers.domains[0] ||
                c.identifiers.emails[0] ||
                c.identifiers.ips[0] ||
                c.phone ||
                c.upiId ||
                '—';
              return (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-ice/60 transition">
                  <td className="px-5 py-3.5 font-semibold text-navy whitespace-nowrap">{c.id}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{c.incidentDate}</td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-[180px] truncate">{c.category}</td>
                  <td className="px-5 py-3.5"><RiskBadge level={c.riskLevel} /></td>
                  <td className="px-5 py-3.5 font-mono text-xs text-royal max-w-[150px] truncate">{primaryId}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={c.status}
                      onChange={(e) => updateCaseStatus(c.id, e.target.value as CaseStatus)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1.5 focus:ring-2 focus:ring-royal/30 focus:outline-none"
                    >
                      <option value="NEW">New</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => open(c)} className="text-xs font-semibold text-royal hover:underline whitespace-nowrap">
                      {t('common.viewDetails')}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400 italic">
                  No cases match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `${selected.id} — Case Details` : ''} wide>
        {selected && <CaseDetailBody c={selected} onDownload={() => downloadCasePdf(selected, allCases)} />}
      </Modal>
    </div>
  );
}

export function CaseDetailBody({ c, onDownload }: { c: FraudCase; onDownload: () => void }) {
  return (
    <div className="space-y-5 text-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span className="text-slate-400 text-xs">Category</span><p className="font-semibold text-navy">{c.category}</p></div>
        <div><span className="text-slate-400 text-xs">Risk</span><p className="font-semibold text-navy">{c.riskLevel} ({c.riskScore}/100)</p></div>
        <div><span className="text-slate-400 text-xs">Submitted</span><p className="font-semibold text-navy">{new Date(c.createdAt).toLocaleString('en-IN')}</p></div>
        <div><span className="text-slate-400 text-xs">Source</span><p className="font-semibold text-navy">{c.source === 'CITIZEN' ? 'Citizen Submission' : 'Seeded Demo'}</p></div>
      </div>

      {c.message && (
        <div>
          <span className="text-slate-400 text-xs">Original Submitted Content (preserved verbatim)</span>
          <div className="mt-1 rounded-xl bg-ice/70 border border-slate-100 p-3 text-xs whitespace-pre-wrap break-words">{c.message}</div>
        </div>
      )}
      {c.description && (
        <div>
          <span className="text-slate-400 text-xs">Incident Description</span>
          <p className="mt-1 text-slate-600">{c.description}</p>
        </div>
      )}
      {c.indicators.length > 0 && (
        <div>
          <span className="text-slate-400 text-xs">Detected Indicators</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {c.indicators.map((i) => (
              <span key={i} className="badge bg-risk-high/5 text-risk-high border border-risk-high/15">{i}</span>
            ))}
          </div>
        </div>
      )}
      <div>
        <span className="text-slate-400 text-xs">Extracted Identifiers</span>
        <div className="mt-2"><IdentifierChips ids={c.identifiers} /></div>
      </div>
      {c.evidenceName && (
        <div>
          <span className="text-slate-400 text-xs">Evidence File</span>
          <p className="mt-1 text-slate-600">{c.evidenceName}</p>
        </div>
      )}
      <button onClick={onDownload} className="btn-primary w-full">
        <FileDown size={16} /> Download PDF Report
      </button>
    </div>
  );
}
