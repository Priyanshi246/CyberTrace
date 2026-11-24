import { useState } from 'react';
import { MessageSquareWarning, Link2, Globe, FileWarning, Inbox, ShieldAlert, Lightbulb, ScanSearch } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { FraudCase } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { IdentifierChips } from '@/components/AnalysisCard';
import { MessageChecker } from './MessageChecker';

export function CitizenDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { cases, t } = useApp();
  const citizenCases = cases.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="rounded-2xl bg-gradient-to-r from-navy-deep via-navy to-royal text-white p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-cyan/15 blur-3xl" />
        <h1 className="font-display font-bold text-2xl sm:text-3xl">{t('citizen.welcome')}</h1>
        <p className="text-slate-300 text-sm mt-2">
          Check suspicious content, report fraud, and track your submissions — all in one place.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: <MessageSquareWarning size={22} />, label: t('citizen.action1'), page: 'message-checker', tint: 'bg-royal/10 text-royal' },
          { icon: <Link2 size={22} />, label: t('citizen.action2'), page: 'url-checker', tint: 'bg-accent-cyan/10 text-accent-cyanDark' },
          { icon: <Globe size={22} />, label: t('citizen.action3'), page: 'website-scanner', tint: 'bg-navy/10 text-navy' },
          { icon: <FileWarning size={22} />, label: t('citizen.action4'), page: 'report', tint: 'bg-risk-high/10 text-risk-high' },
        ].map((a) => (
          <button
            key={a.page}
            onClick={() => onNavigate(a.page)}
            className="card p-6 text-left group hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${a.tint} group-hover:scale-110 transition-transform`}>
              {a.icon}
            </div>
            <p className="font-display font-semibold text-navy mt-4 text-sm leading-snug">{a.label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-navy flex items-center gap-2 mb-4">
            <Inbox size={17} className="text-royal" /> Recent Reports
          </h3>
          {citizenCases.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No cases yet. Submit one from Report Cyber Fraud.</p>
          ) : (
            <div className="space-y-3">
              {citizenCases.map((c: FraudCase) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-ice/50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy">{c.id} · {c.category}</p>
                    <p className="text-xs text-slate-400 truncate">{c.description || c.message}</p>
                  </div>
                  <RiskBadge level={c.riskLevel} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-navy flex items-center gap-2 mb-4">
            <ScanSearch size={17} className="text-royal" /> Recent Analysis Results
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Fake bank KYC SMS — sample', level: 'HIGH' as const },
              { label: 'Courier delivery-fee message — sample', level: 'HIGH' as const },
              { label: 'Team meeting reminder — sample', level: 'LOW' as const },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-ice/50 px-4 py-3">
                <p className="text-sm text-navy-deep">{r.label}</p>
                <RiskBadge level={r.level} />
              </div>
            ))}
            <p className="text-xs text-slate-400 pt-1">Demonstration data — run your own from the Message Checker.</p>
          </div>
        </div>
      </div>

      <div className="card p-6 border-l-4 !border-l-risk-high">
        <h3 className="font-display font-semibold text-navy flex items-center gap-2 mb-3">
          <ShieldAlert size={17} className="text-risk-high" /> Safety Awareness
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Never share OTPs — no genuine organisation ever asks.',
            'Banks never do KYC over SMS, WhatsApp or links.',
            'Do not install apps (APKs) sent through messages.',
            'Never scan QR codes sent by strangers "to receive money".',
            'Verify job offers — genuine employers never charge fees.',
            'Lost money? Call 1930 immediately — the first hour matters.',
          ].map((tip) => (
            <div key={tip} className="flex gap-2.5 text-sm text-slate-600 items-start">
              <Lightbulb size={15} className="text-risk-medium mt-0.5 flex-shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>

      <MessageChecker embedded />
    </div>
  );
}
