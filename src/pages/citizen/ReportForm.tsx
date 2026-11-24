import { useState } from 'react';
import { CheckCircle2, Send, Upload } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { analyzeMessage } from '@/lib/analysis';
import { generateCaseId } from '@/lib/storage';
import type { FraudCase, IncidentCategory } from '@/lib/types';

const CATEGORIES: IncidentCategory[] = [
  'Fake Bank KYC',
  'Phishing Message',
  'Fake Parcel / Delivery',
  'Fake Electricity Bill',
  'Fake Job / Internship',
  'Fake Instant Loan',
  'Investment / Trading Fraud',
  'Betting Platform',
  'Malicious App (APK)',
  'Other',
];

export function ReportForm() {
  const { cases, addCase, t } = useApp();
  const [form, setForm] = useState({
    category: CATEGORIES[0] as IncidentCategory,
    message: '',
    url: '',
    website: '',
    phone: '',
    upiId: '',
    description: '',
    incidentDate: new Date().toISOString().slice(0, 10),
    evidenceName: '',
  });
  const [created, setCreated] = useState<FraudCase | null>(null);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.message.trim() && !form.url.trim() && !form.phone.trim() && !form.upiId.trim() && !form.description.trim()) {
      setError('Please provide at least one detail: a message, URL, phone number, UPI ID or description.');
      return;
    }
    const analysis = analyzeMessage(`${form.message} ${form.url} ${form.website} ${form.phone} ${form.upiId} ${form.description}`);
    const newCase: FraudCase = {
      id: generateCaseId(cases),
      createdAt: new Date().toISOString(),
      incidentDate: form.incidentDate,
      category: form.category,
      message: form.message,
      url: form.url,
      website: form.website,
      phone: form.phone,
      upiId: form.upiId,
      description: form.description,
      evidenceName: form.evidenceName,
      riskLevel: analysis.riskLevel,
      riskScore: analysis.score,
      indicators: analysis.indicators.map((i) => i.label),
      identifiers: analysis.identifiers,
      source: 'CITIZEN',
      status: 'NEW',
    };
    addCase(newCase);
    setCreated(newCase);
  };

  if (created) {
    return (
      <div className="card p-8 max-w-2xl mx-auto text-center animate-fade-up">
        <div className="mx-auto h-16 w-16 rounded-full bg-risk-low/10 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-risk-low" />
        </div>
        <h2 className="font-display font-bold text-2xl text-navy mt-5">{t('report.success')}</h2>
        <p className="text-sm text-slate-500 mt-2">
          Your submission has been analysed and saved as a demo case. It is now visible in the Police Investigation
          Dashboard (exit to the landing page and choose Police Login to see it).
        </p>
        <div className="mt-6 inline-block rounded-xl bg-ice border border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">{t('report.caseCreated')}</p>
          <p className="font-display font-bold text-2xl text-royal mt-1">{created.id}</p>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Risk assessment: <span className="font-semibold">{created.riskLevel}</span> ({created.riskScore}/100)
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button className="btn-primary" onClick={() => setCreated(null)}>
            Submit another report
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-6">{t('report.disclaimer')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">{t('report.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit suspicious content for analysis and investigation. Only minimal details are collected.
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        Hackathon prototype submission — stored only in this browser. Do not enter real personal data. To report real
        financial fraud, call <strong>1930</strong> or visit <strong>cybercrime.gov.in</strong>.
      </div>

      <form onSubmit={submit} className="card p-6 sm:p-8 space-y-5">
        <div>
          <label className="label" htmlFor="r-category">{t('report.category')} *</label>
          <select id="r-category" value={form.category} onChange={set('category')} className="input">
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="r-message">{t('report.message')}</label>
          <textarea id="r-message" value={form.message} onChange={set('message')} rows={5} className="input resize-y" placeholder="Paste the suspicious SMS / WhatsApp / email here…" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="r-url">{t('report.url')}</label>
            <input id="r-url" value={form.url} onChange={set('url')} className="input" placeholder="https://…" />
          </div>
          <div>
            <label className="label" htmlFor="r-website">{t('report.website')}</label>
            <input id="r-website" value={form.website} onChange={set('website')} className="input" placeholder="example.test" />
          </div>
          <div>
            <label className="label" htmlFor="r-phone">{t('report.phone')}</label>
            <input id="r-phone" value={form.phone} onChange={set('phone')} className="input" placeholder="98XXXXXX10" />
          </div>
          <div>
            <label className="label" htmlFor="r-upi">{t('report.upi')}</label>
            <input id="r-upi" value={form.upiId} onChange={set('upiId')} className="input" placeholder="name@upi" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="r-desc">{t('report.description')}</label>
          <textarea id="r-desc" value={form.description} onChange={set('description')} rows={3} className="input resize-y" placeholder="What happened? When? Did you pay anything?" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="r-date">{t('report.date')}</label>
            <input id="r-date" type="date" value={form.incidentDate} onChange={set('incidentDate')} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="r-evidence">{t('report.evidence')}</label>
            <div className="flex gap-2">
              <input
                id="r-evidence"
                value={form.evidenceName}
                onChange={set('evidenceName')}
                className="input flex-1"
                placeholder="screenshot.png"
                readOnly
              />
              <label className="btn-outline !px-4 cursor-pointer">
                <Upload size={15} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setForm((f) => ({ ...f, evidenceName: e.target.files?.[0]?.name || '' }))}
                />
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-1">Prototype stores the file name only — the file itself never leaves your device.</p>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-risk-high bg-risk-high/5 border border-risk-high/20 rounded-lg px-4 py-2.5">{error}</p>}

        <button type="submit" className="btn-primary w-full sm:w-auto !px-8">
          <Send size={16} /> {t('common.submit')}
        </button>
      </form>
    </div>
  );
}
