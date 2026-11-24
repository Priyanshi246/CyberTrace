import { useState } from 'react';
import { Lock, Hash, FileText, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RiskBadge } from '@/components/RiskBadge';
import { IdentifierChips } from '@/components/AnalysisCard';
import { Modal } from '@/components/Modal';
import { hashString } from '@/lib/storage';

export function EvidenceLocker() {
  const { cases } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = cases.find((c) => c.id === selectedId) || null;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-2.5">
          <Lock size={21} className="text-royal" /> Evidence Locker
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Case-based evidence records. Original submitted text is preserved verbatim, separate from any analysis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {cases.map((c) => {
          const hash = hashString(`${c.id}|${c.message}|${c.createdAt}`);
          return (
            <div key={c.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-navy">{c.id}</p>
                  <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <RiskBadge level={c.riskLevel} />
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                    <FileText size={12} /> Original submitted content (preserved)
                  </p>
                  <div className="rounded-lg bg-ice/70 border border-slate-100 p-3 text-xs whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                    {c.message || '— no message content —'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400">Submitted URL</p>
                    <p className="font-mono text-navy break-all">{c.url || '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Evidence File</p>
                    <p className="text-navy">{c.evidenceName || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1.5">Extracted Identifiers</p>
                  <IdentifierChips ids={c.identifiers} />
                </div>
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                    <Hash size={11} /> {hash}…
                  </p>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal hover:underline"
                  >
                    <Eye size={13} /> View Full Record
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected ? `${selected.id} — Evidence Record` : ''} wide>
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-slate-400 text-xs">Case ID</span><p className="font-semibold text-navy">{selected.id}</p></div>
              <div><span className="text-slate-400 text-xs">Submission Timestamp</span><p className="font-semibold text-navy">{new Date(selected.createdAt).toLocaleString('en-IN')}</p></div>
              <div><span className="text-slate-400 text-xs">Evidence File</span><p className="font-semibold text-navy">{selected.evidenceName || 'None attached'}</p></div>
              <div><span className="text-slate-400 text-xs">Analysis Result</span><p className="font-semibold text-navy">{selected.riskLevel} ({selected.riskScore}/100)</p></div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Original Submitted Content (verbatim — never modified)</span>
              <div className="mt-1 rounded-xl bg-ice/70 border border-slate-100 p-3 text-xs whitespace-pre-wrap break-words">{selected.message || '—'}</div>
            </div>
            {selected.description && (
              <div>
                <span className="text-slate-400 text-xs">Analysed Summary / Description</span>
                <p className="mt-1 text-slate-600">{selected.description}</p>
              </div>
            )}
            <div>
              <span className="text-slate-400 text-xs">Extracted Identifiers</span>
              <div className="mt-2"><IdentifierChips ids={selected.identifiers} /></div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">Evidence Hash (demo, non-cryptographic)</span>
              <p className="mt-1 font-mono text-xs text-navy bg-slate-50 border border-slate-100 rounded-lg p-3 break-all">
                {hashString(`${selected.id}|${selected.message}|${selected.createdAt}`)}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Chain-of-custody note: prototype demonstration only. Original text is stored unmodified; analysis results
              are kept separately above.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
