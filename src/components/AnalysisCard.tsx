import { FileText, Fingerprint, Globe, Mail, Phone, Wallet, Landmark, Network } from 'lucide-react';
import type { ExtractedIdentifiers } from '@/lib/types';
import type { AnalysisResult } from '@/lib/types';
import { RiskBadge, RiskScoreBar } from './RiskBadge';
import { useApp } from '@/context/AppContext';

function IdChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-ice border border-slate-200 px-2.5 py-1 text-xs font-medium text-navy">
      {icon}
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

export function IdentifierChips({ ids }: { ids: ExtractedIdentifiers }) {
  const entries: Array<{ label: string; icon: React.ReactNode; items: string[] }> = [
    { label: 'PH', icon: <Phone size={12} className="text-royal" />, items: ids.phones },
    { label: 'UPI', icon: <Landmark size={12} className="text-royal" />, items: ids.upiIds },
    { label: 'URL', icon: <Globe size={12} className="text-royal" />, items: ids.urls },
    { label: '@', icon: <Mail size={12} className="text-royal" />, items: ids.emails },
    { label: 'IP', icon: <Network size={12} className="text-royal" />, items: ids.ips },
    { label: 'DOM', icon: <Globe size={12} className="text-royal" />, items: ids.domains },
    { label: 'WALLET', icon: <Wallet size={12} className="text-royal" />, items: ids.cryptoWallets },
  ];

  const hasAny = entries.some((e) => e.items.length > 0);
  if (!hasAny) {
    return <p className="text-xs text-slate-400 italic">No digital identifiers extracted.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries
        .filter((e) => e.items.length > 0)
        .flatMap((e) =>
          e.items.slice(0, 4).map((v) => <IdChip key={`${e.label}-${v}`} icon={e.icon} label={e.label} value={v} />)
        )}
    </div>
  );
}

export function AnalysisCard({ result, title }: { result: AnalysisResult; title: string }) {
  const { t } = useApp();

  return (
    <div className="card p-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-display font-semibold text-navy flex items-center gap-2">
          <FileText size={18} className="text-royal" />
          {title}
        </h3>
        <RiskBadge level={result.riskLevel} />
      </div>

      <RiskScoreBar score={result.score} level={result.riskLevel} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <h4 className="text-sm font-semibold text-navy mb-2">{t('common.indicators')}</h4>
          {result.indicators.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No suspicious indicators found by the rule engine.</p>
          ) : (
            <ul className="space-y-2">
              {result.indicators.map((ind, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span
                    className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      ind.weight >= 25 ? 'bg-risk-high' : ind.weight >= 15 ? 'bg-risk-medium' : 'bg-royal'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-navy">{ind.label}</span>
                    <span className="text-slate-500"> — {ind.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-navy mb-2">{t('common.explanation')}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-navy mb-2">{t('common.recommendations')}</h4>
            <ul className="space-y-1.5">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-royal font-bold">→</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
          <Fingerprint size={15} className="text-royal" />
          {t('common.identifiers')}
        </h4>
        <IdentifierChips ids={result.identifiers} />
      </div>

      <p className="mt-5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
        Prototype assessment for demonstration only — not a verified forensic conclusion.
      </p>
    </div>
  );
}
