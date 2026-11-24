import { useMemo, useState } from 'react';
import { Inbox, Search, FileDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { FraudCase } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { IdentifierChips } from '@/components/AnalysisCard';
import { Modal } from '@/components/Modal';
import { downloadCasePdf } from '@/lib/pdfReport';

export function MyReports() {
  const { cases, t } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FraudCase | null>(null);

  const citizenCases = useMemo(() => cases.filter((c) => c.source === 'CITIZEN'), [cases]);
  const filtered = citizenCases.filter(
    (c) =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">{t('nav.myReports')}</h1>
        <p className="text-sm text-slate-500 mt-1">Reports you submitted in this demo, stored in your browser.</p>
      </div>

      <div className="card p-6">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by case ID, category or description…"
            className="input !pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Inbox size={36} className="mx-auto text-slate-300" />
          <p className="text-sm text-slate-500 mt-3">
            {citizenCases.length === 0
              ? 'You have not submitted any reports yet. Use "Report Cyber Fraud" to create your first demo case.'
              : 'No reports match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="card p-5 w-full text-left hover:shadow-card-hover transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-navy text-sm">
                    {c.id} <span className="text-slate-300">·</span> {c.category}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{c.description || c.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                  <RiskBadge level={c.riskLevel} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <IdentifierChips ids={c.identifiers} />
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `${selected.id} — Details` : ''} wide>
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-slate-400 text-xs">Category</span><p className="font-semibold text-navy">{selected.category}</p></div>
              <div><span className="text-slate-400 text-xs">Risk</span><p className="font-semibold text-navy">{selected.riskLevel} ({selected.riskScore}/100)</p></div>
              <div><span className="text-slate-400 text-xs">Incident Date</span><p className="font-semibold text-navy">{selected.incidentDate}</p></div>
              <div><span className="text-slate-400 text-xs">Status</span><p className="font-semibold text-navy">{selected.status.replace('_', ' ')}</p></div>
            </div>
            {selected.message && (
              <div>
                <span className="text-slate-400 text-xs">Submitted Content (original, preserved)</span>
                <div className="mt-1 rounded-xl bg-ice/70 border border-slate-100 p-3 text-xs whitespace-pre-wrap break-words">{selected.message}</div>
              </div>
            )}
            {selected.description && (
              <div>
                <span className="text-slate-400 text-xs">Description</span>
                <p className="mt-1 text-slate-600">{selected.description}</p>
              </div>
            )}
            {selected.indicators.length > 0 && (
              <div>
                <span className="text-slate-400 text-xs">Detected Indicators</span>
                <ul className="mt-1 space-y-1">
                  {selected.indicators.map((i) => (
                    <li key={i} className="text-slate-600 flex gap-2"><span className="text-royal">→</span>{i}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <span className="text-slate-400 text-xs">Extracted Identifiers</span>
              <div className="mt-2"><IdentifierChips ids={selected.identifiers} /></div>
            </div>
            {selected.evidenceName && (
              <div>
                <span className="text-slate-400 text-xs">Evidence File</span>
                <p className="mt-1 text-slate-600">{selected.evidenceName}</p>
              </div>
            )}
            <button onClick={() => downloadCasePdf(selected, cases)} className="btn-primary w-full">
              <FileDown size={16} /> {t('common.downloadPdf')}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
