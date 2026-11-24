import { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  MessageSquareWarning,
  Link2,
  Globe,
  AppWindow,
  FileWarning,
  Inbox,
  Bot,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  Search,
  Dna,
  Flame,
  Lock,
  FileText,
  BarChart3,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LANGUAGES, type LanguageCode } from '@/lib/i18n';
import type { RiskLevel } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { CaseTable } from '@/pages/police/CaseTable';

function Shell({
  roleLabel,
  nav,
  active,
  onNavigate,
  children,
}: {
  roleLabel: string;
  nav: Array<{ key: string; label: string; icon: React.ReactNode; badge?: number }>;
  active: string;
  onNavigate: (k: string) => void;
  children: React.ReactNode;
}) {
  const { t, lang, setLang, setRole } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full bg-navy-deep text-slate-300">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 flex-shrink-0">
        <div className="h-9 w-9 rounded-xl bg-white/10 border border-accent-cyan/40 flex items-center justify-center">
          <Shield size={17} className="text-accent-cyan" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm tracking-wide leading-none">CYBERTRACE</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{roleLabel}</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {nav.map((n) => (
          <button
            key={n.key}
            onClick={() => {
              onNavigate(n.key);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
              active === n.key
                ? 'bg-royal text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className={active === n.key ? 'text-accent-cyan' : 'text-slate-400'}>{n.icon}</span>
            <span className="truncate">{n.label}</span>
            {typeof n.badge === 'number' && n.badge > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-risk-high text-white rounded-full px-1.5 py-0.5">
                {n.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <Globe size={17} className="text-slate-400" /> {LANGUAGES.find((l) => l.code === lang)?.native}
            </span>
            <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-xl shadow-deep py-2 z-20">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code as LanguageCode);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-ice ${
                    l.code === lang ? 'text-royal font-semibold' : 'text-navy-deep'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="text-[10px] text-slate-400">{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setRole(null)}
          className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 hover:bg-risk-high/20 hover:text-white transition"
        >
          <LogOut size={17} className="text-slate-400" /> {t('nav.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-ice">
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-navy-deep h-14 flex items-center justify-between px-4">
          <button onClick={() => setMobileOpen(true)} className="text-white p-2" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <p className="font-display font-bold text-white text-sm tracking-wide">CYBERTRACE</p>
          <button onClick={() => setRole(null)} className="text-slate-300 p-2" aria-label="Exit demo">
            <X size={20} />
          </button>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}

export function LoginScreen() {
  const { setRole } = useApp();
  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.6) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-white/10 border border-accent-cyan/40 flex items-center justify-center">
            <Shield size={30} className="text-accent-cyan" />
          </div>
          <h1 className="font-display font-bold text-white text-2xl mt-4 tracking-wide">CYBERTRACE</h1>
          <p className="text-slate-400 text-xs mt-1">Securing Rajasthan. Protecting Every Citizen.</p>
        </div>

        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-6 space-y-4 backdrop-blur">
          <div className="flex items-center gap-2 text-accent-cyan text-xs font-semibold">
            <Info size={13} /> DEMO LOGIN — for presentation purposes only. No real authentication.
          </div>
          <button
            onClick={() => setRole('citizen')}
            className="w-full flex items-center gap-4 rounded-xl bg-white text-navy p-4 hover:shadow-deep transition group text-left"
          >
            <div className="h-11 w-11 rounded-xl bg-royal/10 text-royal flex items-center justify-center group-hover:bg-royal group-hover:text-white transition">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <p className="font-display font-semibold">Continue as Citizen</p>
              <p className="text-xs text-slate-400">Check messages, URLs, websites & report fraud</p>
            </div>
          </button>
          <button
            onClick={() => setRole('police')}
            className="w-full flex items-center gap-4 rounded-xl bg-white text-navy p-4 hover:shadow-deep transition group text-left"
          >
            <div className="h-11 w-11 rounded-xl bg-navy/10 text-navy flex items-center justify-center group-hover:bg-navy group-hover:text-white transition">
              <Building2 size={20} />
            </div>
            <div>
              <p className="font-display font-semibold">Continue as Police Officer</p>
              <p className="text-xs text-slate-400">Authorised investigation dashboard (demo)</p>
            </div>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Prototype for Rajasthan Police Hackathon 2026 — not an official government platform.
        </p>
      </div>
    </div>
  );
}

export function PoliceAllCases() {
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

export function CitizenShell({ page, onNavigate, children }: { page: string; onNavigate: (p: string) => void; children: React.ReactNode }) {
  const { t } = useApp();
  const nav = [
    { key: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard size={17} /> },
    { key: 'message-checker', label: t('nav.messageChecker'), icon: <MessageSquareWarning size={17} /> },
    { key: 'url-checker', label: t('nav.urlChecker'), icon: <Link2 size={17} /> },
    { key: 'website-scanner', label: t('nav.websiteScanner'), icon: <Globe size={17} /> },
    { key: 'apk-scanner', label: t('nav.apkScanner'), icon: <AppWindow size={17} /> },
    { key: 'report', label: t('nav.reportFraud'), icon: <FileWarning size={17} /> },
    { key: 'my-reports', label: t('nav.myReports'), icon: <Inbox size={17} /> },
    { key: 'tracey', label: t('nav.tracey'), icon: <Bot size={17} /> },
    { key: 'help', label: t('nav.helpSafety'), icon: <LifeBuoy size={17} /> },
  ];
  return (
    <Shell roleLabel="CITIZEN PORTAL" nav={nav} active={page} onNavigate={onNavigate}>
      {children}
    </Shell>
  );
}

export function PoliceShell({ page, onNavigate, children }: { page: string; onNavigate: (p: string) => void; children: React.ReactNode }) {
  const { t, cases } = useApp();
  const highCount = cases.filter((c) => c.riskLevel === 'HIGH').length;
  const nav = [
    { key: 'overview', label: t('nav.overview'), icon: <BarChart3 size={17} /> },
    { key: 'all-cases', label: t('nav.allCases'), icon: <FileText size={17} /> },
    { key: 'high-risk', label: t('nav.highRisk'), icon: <AlertTriangle size={17} />, badge: highCount },
    { key: 'message-intel', label: t('nav.msgIntel'), icon: <MessageSquareWarning size={17} /> },
    { key: 'website-intel', label: t('nav.webIntel'), icon: <Globe size={17} /> },
    { key: 'apk-intel', label: t('nav.apkIntel'), icon: <AppWindow size={17} /> },
    { key: 'scam-dna', label: t('nav.scamDna'), icon: <Dna size={17} /> },
    { key: 'id-search', label: t('nav.idSearch'), icon: <Search size={17} /> },
    { key: 'heat-list', label: t('nav.heatList'), icon: <Flame size={17} /> },
    { key: 'evidence', label: t('nav.evidence'), icon: <Lock size={17} /> },
    { key: 'reports', label: t('nav.reports'), icon: <FileText size={17} /> },
    { key: 'tracey', label: t('nav.tracey'), icon: <Bot size={17} /> },
  ];
  return (
    <Shell roleLabel="POLICE INVESTIGATION PORTAL" nav={nav} active={page} onNavigate={onNavigate}>
      {children}
    </Shell>
  );
}

export function CasePeek({ level }: { level: RiskLevel }) {
  return <RiskBadge level={level} />;
}
