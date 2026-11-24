import { useRef, useState } from 'react';
import { Upload, FileArchive, ShieldAlert, CheckCircle2, PackageSearch, Eraser } from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';
import { sampleApks, type SampleApk } from '@/lib/sampleData';

interface UploadedState {
  name: string;
  size: string;
  simulated: SampleApk;
}

export function ApkScanner() {
  const [upload, setUpload] = useState<UploadedState | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploaded' | 'analysed'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    // Pick a deterministic sample record based on the file name so the demo
    // stays consistent for the same input.
    const idx = file.name.length % sampleApks.length;
    setUpload({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      simulated: sampleApks[idx],
    });
    setStatus('uploaded');
  };

  const analyse = () => {
    setStatus('analysed');
  };

  const clear = () => {
    setUpload(null);
    setStatus('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  const rec = upload?.simulated;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-navy">APK Analysis Module</h1>
        <p className="text-sm text-slate-500 mt-1">
          Preliminary application screening for the prototype — full static analysis is not performed.
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
        <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
        <span>
          Only submit applications you are authorised to analyse. Uploaded files are not executed. This prototype shows
          simulated sample analysis records — it does not inspect the actual contents of your file.
        </span>
      </div>

      <div className="card p-6">
        <label
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-ice/50 px-6 py-10 text-center cursor-pointer hover:border-royal hover:bg-ice transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || undefined)}
          />
          <div className="h-12 w-12 rounded-xl bg-royal/10 text-royal flex items-center justify-center">
            <Upload size={22} />
          </div>
          <div>
            <p className="font-semibold text-navy text-sm">Upload an APK file (name only — prototype)</p>
            <p className="text-xs text-slate-400 mt-1">Drag & drop or click. The file is never uploaded or executed.</p>
          </div>
        </label>

        <div className="flex flex-wrap gap-2 mt-4">
          <p className="text-xs font-semibold text-slate-500 w-full mb-1">Or view a sample APK record:</p>
          {sampleApks.map((s) => (
            <button
              key={s.name}
              onClick={() => {
                setUpload({ name: s.name, size: s.size, simulated: s });
                setStatus('analysed');
              }}
              className="text-xs rounded-lg border border-slate-200 bg-ice/60 px-3 py-1.5 hover:border-royal hover:text-royal transition"
            >
              {s.name}
            </button>
          ))}
        </div>

        {upload && (
          <div className="mt-5 rounded-xl border border-slate-100 bg-ice/50 p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <FileArchive size={18} className="text-royal" />
              <div className="flex-1 min-w-[160px]">
                <p className="font-semibold text-navy break-all">{upload.name}</p>
                <p className="text-xs text-slate-400">
                  {upload.size} · APK (Android package) ·{' '}
                  {status === 'idle' ? 'Awaiting analysis' : status === 'uploaded' ? 'Received (not executed)' : 'Simulated analysis complete'}
                </p>
              </div>
              <div className="flex gap-2">
                {status !== 'analysed' ? (
                  <button onClick={analyse} className="btn-primary !px-4 !py-2 text-sm">
                    <PackageSearch size={15} /> Simulate Analysis
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-risk-low">
                    <CheckCircle2 size={15} /> Done
                  </span>
                )}
                <button onClick={clear} className="btn-ghost">
                  <Eraser size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {status === 'analysed' && rec && upload && (
        <div className="card p-6 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-display font-semibold text-navy">{rec.appName}</h3>
              <p className="text-xs text-slate-400 font-mono">{rec.packageId}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-slate-100 text-slate-500">Simulated analysis</span>
              <RiskBadge level={rec.riskLevel} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-navy mb-2">Requested Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {rec.permissions.map((p) => (
                  <span
                    key={p}
                    className={`badge ${
                      /SMS|ACCESSIBILITY|CONTACTS|CALL_LOG|LOCATION|GALLERY|INSTALL/.test(p)
                        ? 'bg-risk-high/10 text-risk-high'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-navy mt-5 mb-2">Suspicious Permission Combinations</h4>
              {rec.flags.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No suspicious combinations found in this sample.</p>
              ) : (
                <ul className="space-y-1.5">
                  {rec.flags.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-600">
                      <ShieldAlert size={14} className="text-risk-high mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-navy mb-2">Embedded URLs & IPs (sample)</h4>
              <ul className="space-y-1.5 text-xs font-mono text-navy-deep bg-ice/70 rounded-xl p-4 border border-slate-100">
                {rec.urls.map((u) => (
                  <li key={u} className="break-all">🔗 {u}</li>
                ))}
                {rec.ips.map((ip) => (
                  <li key={ip} className="break-all">🌐 {ip}</li>
                ))}
                {rec.urls.length === 0 && rec.ips.length === 0 && <li className="text-slate-400 italic">None in sample</li>}
              </ul>
              <p className="text-xs text-slate-400 mt-3">Risk score: {rec.riskScore}/100 · Sample record for demonstration.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
