import { useState } from 'react';
import {
  Shield,
  MessageSquareWarning,
  Globe,
  FileWarning,
  ScanSearch,
  Link2,
  ArrowRight,
  ArrowRightLeft,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LANGUAGES, type LanguageCode } from '@/lib/i18n';
import { landingStats } from '@/lib/sampleData';

function Logo({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${light ? 'bg-white/10 border border-accent-cyan/40' : 'bg-navy-deep'}`}>
        <Shield size={20} className="text-accent-cyan" />
      </div>
      <div>
        <p className={`font-display font-bold tracking-wide leading-none ${light ? 'text-white' : 'text-navy'}`}>CYBERTRACE</p>
        <p className="text-[10px] text-slate-400 tracking-wider mt-0.5">RAJASTHAN POLICE · PROTOTYPE</p>
      </div>
    </div>
  );
}

export function LandingPage({ onLogin }: { onLogin: (role: 'citizen' | 'police') => void }) {
  const { t, lang, setLang } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.about'), href: '#about' },
  ];

  return (
    <div className="min-h-screen bg-ice">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy-deep/95 backdrop-blur border-b border-white/10">
        <div className="container-app flex items-center justify-between h-16">
          <Logo light />
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-slate-300 hover:text-accent-cyan transition font-medium">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-accent-cyan transition font-medium px-3 py-2"
              >
                {LANGUAGES.find((l) => l.code === lang)?.native || 'English'}
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-deep py-2 z-50">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code as LanguageCode);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-ice transition ${
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
            <button onClick={() => onLogin('citizen')} className="text-sm font-semibold text-white hover:text-accent-cyan transition px-3 py-2">
              {t('nav.citizenLogin')}
            </button>
            <button
              onClick={() => onLogin('police')}
              className="text-sm font-semibold bg-accent-cyan text-navy-deep hover:bg-white transition rounded-lg px-4 py-2"
            >
              {t('nav.policeLogin')}
            </button>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenu((m) => !m)} aria-label="Menu">
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-navy-deep border-t border-white/10 px-4 py-4 space-y-3">
            {navItems.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMobileMenu(false)} className="block text-sm text-slate-300 hover:text-accent-cyan">
                {n.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button onClick={() => onLogin('citizen')} className="flex-1 text-sm font-semibold border border-white/30 text-white rounded-lg py-2.5">
                {t('nav.citizenLogin')}
              </button>
              <button onClick={() => onLogin('police')} className="flex-1 text-sm font-semibold bg-accent-cyan text-navy-deep rounded-lg py-2.5">
                {t('nav.policeLogin')}
              </button>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="w-full bg-navy-mid text-white text-sm rounded-lg px-3 py-2.5 border border-white/20"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-navy">
                  {l.native} — {l.label}
                  {l.supported ? '' : ' (Hindi fallback)'}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative bg-navy-deep overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-royal/20 blur-[140px]" />
        <div className="container-app relative py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan px-4 py-1.5 text-xs font-semibold tracking-wide">
              <Shield size={13} /> RAJASTHAN POLICE HACKATHON 2026 · PS01
            </span>
            <h1 className="font-display font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.15] mt-6">
              {t('landing.heroSub') ? 'Securing Rajasthan.' : ''}
              <br />
              <span className="bg-gradient-to-r from-accent-cyan to-royal bg-clip-text text-transparent">
                Protecting Every Citizen.
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              {t('landing.heroSub')}
            </p>
            <p className="text-accent-cyan/90 text-sm mt-3 font-medium">राजस्थान री रक्षा, हर नागरिक री सुरक्षा।</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
              <button
                onClick={() => onLogin('citizen')}
                className="btn-cyan !px-8 !py-3.5 !text-base w-full sm:w-auto"
              >
                {t('landing.cta')} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onLogin('police')}
                className="btn w-full sm:w-auto !px-8 !py-3.5 !text-base border-2 border-white/25 text-white hover:border-accent-cyan hover:text-accent-cyan bg-white/5"
              >
                <Building2 size={18} /> {t('landing.policeCta')}
              </button>
            </div>
          </div>

          {/* Flow diagram */}
          <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4">
            {[
              { icon: <ScanSearch size={22} />, title: 'Citizen', desc: 'Reports & checks suspicious content' },
              { icon: <ArrowRightLeft size={22} />, title: 'AI Intelligence Engine', desc: 'Rule-based detection & identifier extraction' },
              { icon: <Search size={22} />, title: 'Police Investigation', desc: 'Scam DNA correlation & case reports' },
            ].map((step, i) => (
              <div key={step.title} className="contents">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center hover:border-accent-cyan/40 transition">
                  <div className="mx-auto h-11 w-11 rounded-xl bg-royal/25 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                    {step.icon}
                  </div>
                  <p className="font-display font-semibold text-white text-sm mt-3">{step.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <ArrowRight size={20} className="hidden sm:block text-accent-cyan/60 mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three action cards */}
      <section id="features" className="container-app py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <MessageSquareWarning size={24} />,
              title: t('landing.checkMessage'),
              desc: 'Paste any SMS, WhatsApp or email and get an explainable risk assessment with extracted identifiers.',
              action: 'citizen' as const,
            },
            {
              icon: <Link2 size={24} />,
              title: t('landing.checkUrl'),
              desc: 'Analyse URLs for HTTPS, look-alike domains, IP hosts, shorteners and phishing keyword patterns.',
              action: 'citizen' as const,
            },
            {
              icon: <FileWarning size={24} />,
              title: t('landing.reportFraud'),
              desc: 'Submit a structured fraud report. It becomes a case for investigators with Scam DNA correlation.',
              action: 'citizen' as const,
            },
          ].map((card) => (
            <button
              key={card.title}
              onClick={() => onLogin(card.action)}
              className="card p-7 text-left group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-royal/10 text-royal flex items-center justify-center group-hover:bg-royal group-hover:text-white transition">
                {card.icon}
              </div>
              <h3 className="font-display font-semibold text-navy mt-4">{card.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{card.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal mt-4">
                Open <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container-app pb-16">
        <div className="rounded-3xl bg-navy-deep px-6 py-12 sm:px-12 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-royal/25 blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-cyan/15 blur-[100px]" />
          <div className="relative">
            <p className="text-center text-xs font-semibold tracking-widest text-accent-cyan/80 uppercase">
              {t('landing.demoStats')} — illustrative prototype values
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {[
                { value: landingStats.reports, label: t('landing.stats.reports') },
                { value: landingStats.alerts, label: t('landing.stats.alerts') },
                { value: landingStats.connected, label: t('landing.stats.connected') },
                { value: landingStats.identifiers, label: t('landing.stats.identifiers') },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-3xl sm:text-4xl text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detect Connect Investigate */}
      <section id="how-it-works" className="container-app pb-16">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy text-center">
          Detect. Connect. Investigate.
        </h2>
        <p className="text-center text-slate-500 mt-3 max-w-2xl mx-auto">
          One unified pipeline takes a citizen's suspicion all the way to an investigation-ready case file.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { title: t('landing.detect'), desc: t('landing.detectDesc'), color: 'text-royal bg-royal/10' },
            { title: t('landing.connect'), desc: t('landing.connectDesc'), color: 'text-accent-cyanDark bg-accent-cyan/10' },
            { title: t('landing.investigate'), desc: t('landing.investigateDesc'), color: 'text-navy bg-navy/10' },
          ].map((step, i) => (
            <div key={step.title} className="card p-7 relative">
              <span className="absolute top-5 right-6 font-display font-bold text-5xl text-slate-100">{`0${i + 1}`}</span>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-display font-bold ${step.color}`}>
                {i + 1}
              </div>
              <h3 className="font-display font-semibold text-navy text-lg mt-4">{step.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="container-app pb-16">
        <div className="card p-8 sm:p-10 max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-navy">About CYBERTRACE</h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-6 text-sm text-slate-600 leading-relaxed">
            <div className="space-y-4">
              <p>
                CYBERTRACE is a hackathon prototype built for Rajasthan Police Hackathon 2026, problem statement PS01 —
                Cyber Fraud / Phishing / Malicious Apps. It unites citizens and authorised investigators on one platform
                for suspicious-content detection, digital identifier extraction, connected-fraud intelligence and
                investigation-ready reports.
              </p>
              <p>
                All analysis is rule-based and explainable, running entirely in your browser. Sample data uses reserved
                demonstration domains (.test / .example) and synthetic identifiers — no real personal information.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-navy">Demo authentication only.</strong> "Citizen Login" and "Police Login" are
                presentation shortcuts. This platform is not an official Rajasthan Police deployment and does not
                replace official complaint channels.
              </p>
              <p className="rounded-xl bg-ice border border-slate-100 p-4">
                <strong className="text-risk-high">In a real emergency:</strong> call the cyber fraud helpline{' '}
                <a href="tel:1930" className="font-bold text-royal">1930</a> and report at{' '}
                <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" className="font-bold text-royal">
                  cybercrime.gov.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep text-slate-400">
        <div className="container-app py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <Logo light />
            <p className="mt-4 text-xs leading-relaxed">
              Securing Rajasthan. Protecting Every Citizen.
              <br />
              राजस्थान री रक्षा, हर नागरिक री सुरक्षा।
              <br />
              One Platform. Multiple Languages. One Safer Rajasthan.
            </p>
          </div>
          <div>
            <h4 className="text-white font-display font-semibold text-sm mb-3">Demo Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Phone size={13} className="text-accent-cyan" /> Demo helpline: 1800-XXX-XXXX</li>
              <li className="flex items-center gap-2"><Mail size={13} className="text-accent-cyan" /> demo@cybertrace-prototype.test</li>
              <li className="flex items-center gap-2"><MapPin size={13} className="text-accent-cyan" /> Jaipur, Rajasthan (prototype)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-semibold text-sm mb-3">Cybercrime Reporting Guidance</h4>
            <ul className="space-y-2 text-xs">
              <li>Cyber Fraud Helpline: <a href="tel:1930" className="text-accent-cyan font-semibold">1930</a></li>
              <li>
                Portal:{' '}
                <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" className="text-accent-cyan font-semibold">
                  cybercrime.gov.in
                </a>
              </li>
              <li>Report within the golden hour for the best chance of freezing funds.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-semibold text-sm mb-3">Privacy Notice</h4>
            <p className="text-xs leading-relaxed">
              This prototype stores all submissions only in your own browser (localStorage). No data leaves your device
              and no real personal information should be entered. CYBERTRACE does not replace official complaint
              channels.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">
          CYBERTRACE · Rajasthan Police Hackathon 2026 · PS01 Prototype — not an official government platform
        </div>
      </footer>
    </div>
  );
}
