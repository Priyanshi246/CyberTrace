import { useState } from 'react';
import { Link2, Eraser, Lock, Unlock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { analyzeUrl } from '@/lib/analysis';
import { sampleUrls } from '@/lib/sampleData';
import type { AnalysisResult } from '@/lib/types';
import { AnalysisCard } from '@/components/AnalysisCard';

export function UrlChecker() {
  const { t } = useApp();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const run = () => {
    if (!url.trim()) return;
    setResult(analyzeUrl(url));
  };

  const clear = () => {
    setUrl('');
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">Phishing URL Checker</h1>
        <p className="text-sm text-slate-500 mt-1">
          Structural URL analysis: HTTPS, look-alike domains, IP hosts, shorteners and phishing keyword patterns.
        </p>
      </div>

      <div className="card p-6">
        <label className="label" htmlFor="url-input">URL to analyse</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="https://example.com"
            className="input flex-1"
          />
          <div className="flex gap-3">
            <button onClick={run} disabled={!url.trim()} className="btn-primary">
              <Link2 size={16} /> {t('common.analyseUrl')}
            </button>
            <button onClick={clear} className="btn-outline">
              <Eraser size={16} /> {t('common.clear')}
            </button>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-500 mt-4 mb-2">Example demo URLs (safe, reserved test domains):</p>
        <div className="flex flex-wrap gap-2">
          {sampleUrls.map((u) => (
            <button
              key={u}
              onClick={() => setUrl(u)}
              className="text-xs rounded-lg border border-slate-200 bg-ice/60 px-3 py-1.5 hover:border-royal hover:text-royal transition"
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <>
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy mb-4 flex items-center gap-2">URL Structure</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-ice/70 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  {/^https:/i.test(url) ? <Lock size={12} className="text-risk-low" /> : <Unlock size={12} className="text-risk-high" />}
                  HTTPS Status
                </p>
                <p className={`font-semibold ${/^https:/i.test(url) ? 'text-risk-low' : 'text-risk-high'}`}>
                  {/^https:/i.test(url) ? 'HTTPS (encrypted)' : /^http:/i.test(url) ? 'No TLS (unencrypted)' : 'Not specified'}
                </p>
              </div>
              <div className="rounded-xl bg-ice/70 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Domain Name</p>
                <p className="font-semibold text-navy break-all">{result.identifiers.domains[0] || '—'}</p>
              </div>
              <div className="rounded-xl bg-ice/70 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Full URL</p>
                <p className="font-semibold text-navy break-all">{url}</p>
              </div>
            </div>
          </div>
          <AnalysisCard result={result} title="URL Analysis Result" />
        </>
      )}
    </div>
  );
}
