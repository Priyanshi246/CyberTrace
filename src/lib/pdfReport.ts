import type { FraudCase } from './types';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function relatedCases(caseItem: FraudCase, all: FraudCase[]): FraudCase[] {
  const mine = caseIdents(caseItem);
  return all.filter((c) => {
    if (c.id === caseItem.id) return false;
    return Array.from(caseIdents(c)).some((v) => mine.has(v));
  });
}

function caseIdents(c: FraudCase): Set<string> {
  const s = new Set<string>();
  for (const p of c.identifiers.phones) s.add(`phone:${p}`);
  for (const u of c.identifiers.upiIds) s.add(`upi:${u}`);
  for (const d of c.identifiers.domains) s.add(`domain:${d}`);
  for (const e of c.identifiers.emails) s.add(`email:${e}`);
  for (const ip of c.identifiers.ips) s.add(`ip:${ip}`);
  if (c.phone) s.add(`phone:${c.phone}`);
  if (c.upiId) s.add(`upi:${c.upiId}`);
  return s;
}

export function generateCaseHtml(caseItem: FraudCase, all: FraudCase[]): string {
  const related = relatedCases(caseItem, all);
  const date = new Date(caseItem.createdAt).toLocaleString('en-IN');
  const riskColor =
    caseItem.riskLevel === 'HIGH' ? '#DC2626' : caseItem.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A';

  const idRows: Array<[string, string]> = [
    ['Phone Numbers', caseItem.identifiers.phones.join(', ') || caseItem.phone || '—'],
    ['UPI IDs', caseItem.identifiers.upiIds.join(', ') || caseItem.upiId || '—'],
    ['URLs', caseItem.identifiers.urls.join(', ') || caseItem.url || '—'],
    ['Domains', caseItem.identifiers.domains.join(', ') || caseItem.website || '—'],
    ['Email Addresses', caseItem.identifiers.emails.join(', ') || '—'],
    ['IP Addresses', caseItem.identifiers.ips.join(', ') || '—'],
    ['Crypto Wallets', caseItem.identifiers.cryptoWallets.join(', ') || '—'],
  ];

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>CYBERTRACE Investigation Report — ${esc(caseItem.id)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #091A35; margin: 0; padding: 32px; background: #fff; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #102A56; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-mark { width: 42px; height: 42px; border-radius: 10px; background: #091A35; color: #38BDF8; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; }
  h1 { font-size: 20px; margin: 0; color: #102A56; }
  .tagline { font-size: 10px; color: #64748B; }
  .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; color: #fff; font-weight: 700; font-size: 12px; }
  h2 { font-size: 14px; color: #102A56; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-top: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  td, th { border: 1px solid #E2E8F0; padding: 8px 10px; text-align: left; vertical-align: top; }
  th { background: #F4F8FF; color: #102A56; width: 180px; }
  .content-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; font-size: 12px; white-space: pre-wrap; word-break: break-word; }
  ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
  li { margin-bottom: 4px; }
  .disclaimer { margin-top: 28px; background: #FFF7ED; border: 1px solid #FDBA74; border-radius: 8px; padding: 12px; font-size: 11px; color: #7C2D12; }
  .footer { margin-top: 24px; font-size: 10px; color: #94A3B8; text-align: center; }
  @media print { body { padding: 12px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div class="logo-mark">CT</div>
      <div>
        <h1>CYBERTRACE — Investigation Report</h1>
        <div class="tagline">Securing Rajasthan. Protecting Every Citizen. | Hackathon Prototype</div>
      </div>
    </div>
    <div style="text-align:right">
      <span class="badge" style="background:${riskColor}">${esc(caseItem.riskLevel)} RISK · ${caseItem.riskScore}/100</span>
      <div class="tagline" style="margin-top:6px">Generated ${new Date().toLocaleString('en-IN')}</div>
    </div>
  </div>

  <h2>Case Overview</h2>
  <table>
    <tr><th>Case ID</th><td>${esc(caseItem.id)}</td></tr>
    <tr><th>Submission Date</th><td>${esc(date)}</td></tr>
    <tr><th>Incident Date</th><td>${esc(caseItem.incidentDate)}</td></tr>
    <tr><th>Incident Category</th><td>${esc(caseItem.category)}</td></tr>
    <tr><th>Status</th><td>${esc(caseItem.status.replace('_', ' '))}</td></tr>
    <tr><th>Risk Assessment</th><td><b style="color:${riskColor}">${esc(caseItem.riskLevel)}</b> — Score ${caseItem.riskScore}/100</td></tr>
  </table>

  <h2>Submitted Content (Preserved Original)</h2>
  <div class="content-box">${esc(caseItem.message || 'No message content submitted.')}</div>
  ${caseItem.description ? `<h2>Incident Description</h2><div class="content-box">${esc(caseItem.description)}</div>` : ''}

  <h2>Detected Indicators</h2>
  ${
    caseItem.indicators.length
      ? `<ul>${caseItem.indicators.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
      : '<p style="font-size:12px">No indicators detected.</p>'
  }

  <h2>Extracted Digital Identifiers</h2>
  <table>
    ${idRows.map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join('')}
  </table>

  <h2>Related Case References (Shared Identifiers)</h2>
  ${
    related.length
      ? `<table><tr><th>Case ID</th><th>Category</th><th>Risk</th><th>Shared Identifier</th></tr>${related
          .map((r) => {
            const mine = [...caseIdents(caseItem)].filter((v) => caseIdents(r).has(v)).map((v) => v.split(':').slice(1).join(':'));
            return `<tr><td>${esc(r.id)}</td><td>${esc(r.category)}</td><td>${esc(r.riskLevel)}</td><td>${esc(mine.join(', '))}</td></tr>`;
          })
          .join('')}</table>`
      : '<p style="font-size:12px">No related cases found through shared identifiers.</p>'
  }

  <h2>Analysis Summary</h2>
  <p style="font-size:12px; line-height:1.6">
    This case was assessed by the CYBERTRACE prototype rule engine against ${caseItem.indicators.length} detected
    indicator(s). The submitted content scored <b>${caseItem.riskScore}/100</b> (risk level: <b>${esc(caseItem.riskLevel)}</b>).
    ${related.length ? `Scam DNA correlation identified <b>${related.length}</b> potentially connected case(s) through shared digital identifiers.` : 'Scam DNA correlation did not identify connected cases for this submission.'}
    Investigators should verify all findings through authorised channels before drawing conclusions.
  </p>

  <h2>Evidence Information</h2>
  <table>
    <tr><th>Uploaded Evidence</th><td>${esc(caseItem.evidenceName || 'None attached (prototype)')}</td></tr>
    <tr><th>Original Content Preserved</th><td>Yes — verbatim text retained above, unmodified.</td></tr>
  </table>

  <div class="disclaimer">
    <b>Disclaimer:</b> This report was generated by the CYBERTRACE hackathon prototype using rule-based simulation.
    It is not a verified forensic conclusion and does not constitute evidence of criminal activity.
    Shared identifiers indicate potential relationships for further investigation only — they do not establish
    common ownership or criminal responsibility. CYBERTRACE does not replace official complaint channels
    (cybercrime.gov.in / helpline 1930).
  </div>

  <div class="footer">CYBERTRACE · Rajasthan Police Hackathon 2026 · PS01 — Cyber Fraud / Phishing / Malicious Apps · Prototype demonstration output</div>
</body>
</html>`;
}

export function downloadCasePdf(caseItem: FraudCase, all: FraudCase[]) {
  const html = generateCaseHtml(caseItem, all);
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) {
    // Popup blocked — fall back to a blob download of the printable report.
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseItem.id}-cybertrace-report.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}
