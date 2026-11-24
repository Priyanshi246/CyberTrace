import { PhoneCall, Globe, ShieldAlert, Lock, FileDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { downloadCasePdf } from '@/lib/pdfReport';

export function HelpSafety() {
  const { cases, t } = useApp();
  const latest = cases[0];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">{t('help.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">Immediate guidance for cyber fraud victims and safety best practices.</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-risk-high to-red-700 text-white p-8 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <ShieldAlert size={28} />
        <h2 className="font-display font-bold text-2xl mt-3">Lost money through online fraud?</h2>
        <p className="text-sm text-white/85 mt-2 max-w-2xl leading-relaxed">
          Act immediately — the first hour ("golden hour") gives the best chance of freezing stolen funds. Call the
          cyber fraud helpline and file a complaint on the official portal. CYBERTRACE does not replace these official
          channels.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a href="tel:1930" className="inline-flex items-center gap-3 rounded-2xl bg-white/15 border border-white/25 px-6 py-4 hover:bg-white/25 transition">
            <PhoneCall size={22} />
            <div>
              <p className="text-xs text-white/80">{t('help.helpline')}</p>
              <p className="font-display font-bold text-2xl">1930</p>
            </div>
          </a>
          <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl bg-white/15 border border-white/25 px-6 py-4 hover:bg-white/25 transition">
            <Globe size={22} />
            <div>
              <p className="text-xs text-white/80">{t('help.portal')}</p>
              <p className="font-display font-bold text-lg">cybercrime.gov.in</p>
            </div>
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-navy flex items-center gap-2 mb-4">
            <Lock size={17} className="text-royal" /> Golden Safety Rules
          </h3>
          <ul className="space-y-3">
            {[
              'Never share OTPs — banks, delivery firms and police never ask for them.',
              'Never share banking passwords, CVV or UPI PIN with anyone.',
              'Do not install unknown APKs sent through messages or WhatsApp.',
              'Do not enter sensitive details on suspicious or look-alike websites.',
              'Contact your bank only through official channels — the number on your card or the official app.',
              'Be suspicious of urgency, threats and "guaranteed returns".',
            ].map((rule) => (
              <li key={rule} className="flex gap-2.5 text-sm text-slate-600">
                <span className="text-risk-low font-bold">✓</span> {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-navy flex items-center gap-2 mb-4">
            <FileDown size={17} className="text-royal" /> After Reporting
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Your submission becomes a demo case with a unique Case ID.</li>
            <li>It is analysed by the rule engine and appears in My Reports.</li>
            <li>Investigators see it in the Police Dashboard with Scam DNA correlation.</li>
            {latest && (
              <li className="rounded-xl bg-ice/70 border border-slate-100 p-3">
                Example: your most recent case <strong>{latest.id}</strong> — download its report:
                <button onClick={() => downloadCasePdf(latest, cases)} className="block mt-2 text-xs font-semibold text-royal hover:underline">
                  Download sample PDF report
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        CYBERTRACE is a hackathon prototype and must not be treated as an official complaint channel. Always use 1930 /
        cybercrime.gov.in for real incidents.
      </p>
    </div>
  );
}
