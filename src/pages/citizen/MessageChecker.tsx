import { useState } from 'react';
import { MessageSquareWarning, Eraser, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { analyzeMessage } from '@/lib/analysis';
import type { AnalysisResult } from '@/lib/types';
import { AnalysisCard } from '@/components/AnalysisCard';
import { sampleMessages } from '@/lib/sampleData';

export function MessageChecker({ embedded }: { embedded?: boolean }) {
  const { t } = useApp();
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const run = () => {
    if (!text.trim()) return;
    setResult(analyzeMessage(text));
  };

  const clear = () => {
    setText('');
    setResult(null);
  };

  const inputSection = (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display font-semibold text-navy flex items-center gap-2">
          <MessageSquareWarning size={19} className="text-royal" />
          {embedded ? 'Smart Message Checker' : 'Smart Message Checker'}
        </h2>
        <button
          onClick={() => setShowSamples((s) => !s)}
          className="text-xs font-semibold text-royal hover:text-navy flex items-center gap-1"
        >
          <Sparkles size={13} /> {showSamples ? 'Hide' : 'Try'} sample messages
        </button>
      </div>

      {showSamples && (
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {[...sampleMessages.suspicious.map((m) => ({ m, tag: 'suspicious' })), ...sampleMessages.genuine.map((m) => ({ m, tag: 'genuine' }))].map(
            ({ m, tag }, i) => (
              <button
                key={i}
                onClick={() => {
                  setText(m);
                  setShowSamples(false);
                }}
                className="text-left text-xs rounded-lg border border-slate-200 bg-ice/60 px-3 py-2.5 hover:border-royal hover:bg-white transition line-clamp-2"
              >
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold mr-1.5 ${
                    tag === 'suspicious' ? 'bg-risk-high/10 text-risk-high' : 'bg-risk-low/10 text-risk-low'
                  }`}
                >
                  {tag.toUpperCase()}
                </span>
                {m.slice(0, 80)}…
              </button>
            )
          )}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        placeholder="Paste the suspicious SMS, WhatsApp message, email, job offer, KYC notification, investment or loan offer here…"
        className="input resize-y font-normal leading-relaxed"
      />
      <p className="text-xs text-slate-400 mt-2">
        Paste only what you received — never enter real passwords or OTPs on this form.
      </p>

      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={run} disabled={!text.trim()} className="btn-primary">
          <ScanIcon /> {t('common.analyse')}
        </button>
        <button onClick={clear} className="btn-outline">
          <Eraser size={16} /> {t('common.clear')}
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="space-y-6">{result && <AnalysisCard result={result} title="Message Analysis Result" />}{inputSection}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">Smart Message Checker</h1>
        <p className="text-sm text-slate-500 mt-1">
          Rule-based analysis of SMS, WhatsApp, email, social media, job offers, fake KYC notices, investment and loan offers.
        </p>
      </div>
      {inputSection}
      {result && <AnalysisCard result={result} title="Message Analysis Result" />}
    </div>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" />
    </svg>
  );
}
