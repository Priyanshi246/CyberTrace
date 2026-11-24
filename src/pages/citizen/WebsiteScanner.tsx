import { useState } from 'react';
import { Globe, Eraser, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { analyzeWebsite } from '@/lib/analysis';
import { sampleWebsites } from '@/lib/sampleData';
import type { AnalysisResult } from '@/lib/types';
import { AnalysisCard } from '@/components/AnalysisCard';

export function WebsiteScanner() {
  const { t } = useApp();
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const run = () => {
    if (!url.trim() && !content.trim()) return;
    setResult(analyzeWebsite(url, content));
  };

  const clear = () => {
    setUrl('');
    setContent('');
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">Website Intelligence Scanner</h1>
        <p className="text-sm text-slate-500 mt-1">
          Analyse a website address plus its pasted page content for fraud, MLM, betting and fake-loan indicators.
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        Simulated analysis: this prototype does not fetch live websites. Paste the page text yourself or load one of the
        safe predefined sample pages (reserved .test domains). Nothing is downloaded from the internet.
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label" htmlFor="site-url">Website URL</label>
          <input
            id="site-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://investment-demo.test"
            className="input"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <label className="label !mb-0" htmlFor="site-content">Website page content (paste text)</label>
            <div className="flex flex-wrap gap-2">
              {sampleWebsites.map((s) => (
                <button
                  key={s.name}
                  onClick={() => {
                    setUrl(s.url);
                    setContent(s.content);
                  }}
                  className="text-xs rounded-lg border border-slate-200 bg-ice/60 px-2.5 py-1 hover:border-royal hover:text-royal transition"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <textarea
            id="site-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Paste the visible text of the webpage here — offers, payment instructions, contact details…"
            className="input resize-y leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={run} disabled={!url.trim() && !content.trim()} className="btn-primary">
            <Globe size={16} /> Analyse Website
          </button>
          <button onClick={clear} className="btn-outline">
            <Eraser size={16} /> {t('common.clear')}
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy mb-4 flex items-center gap-2">
              <FileText size={17} className="text-royal" /> Website Overview
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-ice/70 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Domain</p>
                <p className="font-semibold text-navy break-all">{result.identifiers.domains[0] || '—'}</p>
              </div>
              <div className="rounded-xl bg-ice/70 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Content Length Analysed</p>
                <p className="font-semibold text-navy">{content.length} characters</p>
              </div>
              <div className="rounded-xl bg-ice/70 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Indicators Found</p>
                <p className="font-semibold text-navy">{result.indicators.length}</p>
              </div>
            </div>
          </div>
          <AnalysisCard result={result} title="Website Analysis Report" />
        </>
      )}
    </div>
  );
}
