import { useState } from 'react';
import { MessageSquareWarning, Globe, AppWindow, FileDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RiskBadge } from '@/components/RiskBadge';
import { downloadCasePdf } from '@/lib/pdfReport';
import { sampleWebsites } from '@/lib/sampleData';
import { sampleApks } from '@/lib/sampleData';
import { Modal } from '@/components/Modal';

function IntelShell({
  title,
  icon,
  blurb,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-2.5">
          {icon} {title}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">{blurb}</p>
      </div>
      {children}
    </div>
  );
}

export function MessageIntel() {
  const { cases } = useApp();
  const [preview, setPreview] = useState<string | null>(null);
  const withMessages = cases.filter((c) => c.message);

  return (
    <IntelShell
      title="Message Intelligence"
      icon={<MessageSquareWarning size={21} className="text-royal" />}
      blurb="All submitted message content in one queue, with risk assessments and extracted identifiers for correlation."
    >
      <div className="space-y-3">
        {withMessages.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-navy text-sm">{c.id} · {c.category}</p>
              <div className="flex items-center gap-2">
                <RiskBadge level={c.riskLevel} />
                <button onClick={() => setPreview(c.message)} className="text-xs font-semibold text-royal hover:underline">
                  View original
                </button>
                <button onClick={() => downloadCasePdf(c, cases)} className="text-xs font-semibold text-slate-400 hover:text-royal inline-flex items-center gap-1">
                  <FileDown size={13} /> PDF
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.message}</p>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {c.indicators.slice(0, 3).map((i) => (
                <span key={i} className="badge bg-risk-high/5 text-risk-high border border-risk-high/15 text-[10px]">{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="Original Message (preserved verbatim)">
        <div className="rounded-xl bg-ice/70 border border-slate-100 p-4 text-sm whitespace-pre-wrap break-words">{preview}</div>
      </Modal>
    </IntelShell>
  );
}

export function WebsiteIntel() {
  const { cases } = useApp();
  const domains = Array.from(new Set(cases.flatMap((c) => c.identifiers.domains.length ? c.identifiers.domains : c.website ? [c.website] : [])));
  const relatedCases = (d: string) => cases.filter((c) => c.identifiers.domains.includes(d) || c.website === d || c.url.includes(d));

  return (
    <IntelShell
      title="Website Intelligence"
      icon={<Globe size={21} className="text-royal" />}
      blurb="Domains extracted from complaints and website scans, mapped to their associated cases."
    >
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3.5">Domain</th>
              <th className="px-5 py-3.5">Associated Cases</th>
              <th className="px-5 py-3.5">Highest Risk</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => {
              const rel = relatedCases(d);
              const worst = rel.some((r) => r.riskLevel === 'HIGH') ? 'HIGH' : rel.some((r) => r.riskLevel === 'MEDIUM') ? 'MEDIUM' : 'LOW';
              return (
                <tr key={d} className="border-b border-slate-50 hover:bg-ice/60">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-navy">{d}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {rel.map((r) => (
                        <span key={r.id} className="badge bg-slate-100 text-slate-600 text-[10px]">{r.id}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><RiskBadge level={worst} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-semibold text-navy mb-2">Sample Scanned Pages (simulated analysis)</h3>
        <div className="space-y-2.5">
          {sampleWebsites.map((s) => (
            <div key={s.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-ice/50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-navy">{s.name}</p>
                <p className="text-xs text-slate-400 font-mono">{s.url}</p>
              </div>
              <span className="badge bg-amber-50 text-amber-700 border border-amber-200">Simulated scan record</span>
            </div>
          ))}
        </div>
      </div>
    </IntelShell>
  );
}

export function ApkIntel() {
  return (
    <IntelShell
      title="APK Intelligence"
      icon={<AppWindow size={21} className="text-royal" />}
      blurb="Simulated static-analysis records for suspicious application samples. No files are executed."
    >
      <div className="space-y-4">
        {sampleApks.map((a) => (
          <div key={a.name} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-navy">{a.appName}</p>
                <p className="text-xs text-slate-400 font-mono">{a.packageId} · {a.name} · {a.size}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge bg-amber-50 text-amber-700 border border-amber-200">Simulated record</span>
                <RiskBadge level={a.riskLevel} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mt-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {a.permissions.map((p) => (
                    <span key={p} className={`badge text-[10px] ${/SMS|ACCESSIBILITY|CONTACTS|CALL_LOG|LOCATION|GALLERY|INSTALL/.test(p) ? 'bg-risk-high/10 text-risk-high' : 'bg-slate-100 text-slate-600'}`}>{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Flags / C2 endpoints</p>
                <ul className="space-y-1">
                  {a.flags.map((f) => (
                    <li key={f} className="text-xs text-slate-600">• {f}</li>
                  ))}
                  {a.urls.map((u) => (
                    <li key={u} className="text-xs font-mono text-royal">{u}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </IntelShell>
  );
}
