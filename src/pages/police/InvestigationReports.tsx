import { useState } from 'react';
import { FileText, FileDown, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { downloadCasePdf, generateCaseHtml } from '@/lib/pdfReport';
import { Modal } from '@/components/Modal';

export function InvestigationReports() {
  const { cases } = useApp();
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = cases.filter(
    (c) => !query || c.id.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-2.5">
          <FileText size={21} className="text-royal" /> Investigation Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate branded, printable PDF investigation reports for any case (PS01 mandatory capability).
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        Reports open in a print-ready window — choose "Save as PDF" in the print dialog. If your browser blocks the
        pop-up, an HTML copy of the report downloads instead.
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by case ID or category…"
            className="input !pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-navy">{c.id}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.category}</p>
              </div>
              <span
                className={`badge ${
                  c.riskLevel === 'HIGH'
                    ? 'bg-risk-high/10 text-risk-high'
                    : c.riskLevel === 'MEDIUM'
                      ? 'bg-risk-medium/10 text-risk-medium'
                      : 'bg-risk-low/10 text-risk-low'
                }`}
              >
                {c.riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex-1 line-clamp-2">{c.description || c.message}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => downloadCasePdf(c, cases)} className="btn-primary flex-1 !px-3 !py-2 text-xs">
                <FileDown size={14} /> Download PDF
              </button>
              <button
                onClick={() => setPreview(generateCaseHtml(c, cases))}
                className="btn-outline !px-3 !py-2 text-xs"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="Report Preview" wide>
        {preview && (
          <iframe title="Report preview" srcDoc={preview} className="w-full h-[60vh] rounded-xl border border-slate-100" />
        )}
      </Modal>
    </div>
  );
}
