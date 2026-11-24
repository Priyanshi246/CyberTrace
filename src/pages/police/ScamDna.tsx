import { useMemo, useState } from 'react';
import { Dna, Maximize2, Minimize2, FileDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { FraudCase } from '@/lib/types';
import { Modal } from '@/components/Modal';
import { CaseDetailBody } from './CaseTable';
import { downloadCasePdf } from '@/lib/pdfReport';

interface GNode {
  id: string;
  kind: 'case' | 'identifier';
  label: string;
  x: number;
  y: number;
  riskLevel?: string;
}
interface GEdge {
  from: string;
  to: string;
  shared: string[];
}

const W = 900;
const H = 560;

function buildGraph(cases: FraudCase[]): { nodes: GNode[]; edges: GEdge[] } {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];

  const caseNodes = cases.slice(0, 12);
  const idMap = new Map<string, { cases: string[]; kind: string }>();

  const identsOf = (c: FraudCase): Array<{ key: string; kind: string }> => [
    ...c.identifiers.phones.map((v) => ({ key: `PH ${v}`, kind: 'phone' })),
    ...c.identifiers.upiIds.map((v) => ({ key: `UPI ${v}`, kind: 'upi' })),
    ...c.identifiers.domains.map((v) => ({ key: `DOM ${v}`, kind: 'domain' })),
    ...c.identifiers.emails.map((v) => ({ key: `EMAIL ${v}`, kind: 'email' })),
    ...c.identifiers.ips.map((v) => ({ key: `IP ${v}`, kind: 'ip' })),
  ];

  caseNodes.forEach((c) => {
    for (const { key, kind } of identsOf(c)) {
      const entry = idMap.get(key) || { cases: [], kind };
      entry.cases.push(c.id);
      idMap.set(key, entry);
    }
  });

  // Only identifiers shared by 2+ cases become graph nodes (the interesting links)
  const sharedIdents = Array.from(idMap.entries()).filter(([, v]) => v.cases.length > 1);

  const caseCount = caseNodes.length;
  caseNodes.forEach((c, i) => {
    const angle = (i / caseCount) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: `case:${c.id}`,
      kind: 'case',
      label: c.id,
      x: W / 2 + Math.cos(angle) * 330,
      y: H / 2 + Math.sin(angle) * 210,
      riskLevel: c.riskLevel,
    });
  });

  sharedIdents.forEach(([key], i) => {
    const count = sharedIdents.length;
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: `id:${key}`,
      kind: 'identifier',
      label: key,
      x: W / 2 + Math.cos(angle) * 140,
      y: H / 2 + Math.sin(angle) * 90,
    });
  });

  for (const [key, entry] of sharedIdents) {
    for (let i = 0; i < entry.cases.length; i++) {
      for (let j = i + 1; j < entry.cases.length; j++) {
        const a = entry.cases[i];
        const b = entry.cases[j];
        let edge = edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));
        if (!edge) {
          edge = { from: a, to: b, shared: [] };
          edges.push(edge);
        }
        edge.shared.push(key);
      }
    }
    for (const cid of entry.cases) {
      edges.push({ from: cid, to: key, shared: [] });
    }
  }

  return { nodes, edges };
}

export function ScamDna() {
  const { cases } = useApp();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const { nodes, edges } = useMemo(() => buildGraph(cases), [cases]);

  const connectedToSelection = (nodeId: string | null) => {
    if (!nodeId) return new Set<string>();
    const s = new Set<string>([nodeId]);
    if (nodeId.startsWith('case:')) {
      const label = nodeId.slice(5);
      edges.forEach((e) => {
        if (e.from === label) s.add(`id:${e.to}`);
        if (e.to === label) s.add(`id:${e.from}`);
      });
    } else {
      edges.forEach((e) => {
        if (e.to === nodeId) s.add(`case:${e.from}`);
      });
    }
    return s;
  };

  const active = connectedToSelection(selectedNode);

  const nodeById = (id: string) => nodes.find((n) => n.id === id);
  const caseEdgesFor = (caseLabel: string) =>
    edges.filter((e) => e.shared.length > 0 && (e.from === caseLabel || e.to === caseLabel));

  const selectedCaseNode = selectedNode?.startsWith('case:') ? nodeById(selectedNode) : null;

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy flex items-center gap-2.5">
            <Dna size={22} className="text-royal" /> Scam DNA — Connected Case Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Cases are linked when they share digital identifiers (phone, UPI, domain, email, IP). Click any node to
            highlight its connections and view details.
          </p>
        </div>
        <button onClick={() => setZoomed((z) => !z)} className="btn-outline !px-4 !py-2 text-sm">
          {zoomed ? <Minimize2 size={15} /> : <Maximize2 size={15} />} {zoomed ? 'Fit view' : 'Enlarge'}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="bg-navy-deep px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-risk-high inline-block" /> High-risk case</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-risk-medium inline-block" /> Medium-risk case</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-risk-low inline-block" /> Low-risk case</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent-cyan inline-block" /> Shared identifier</span>
          <span className="ml-auto text-slate-400">Case ↔ identifier ↔ related case</span>
        </div>

        <div className={`relative bg-gradient-to-br from-ice to-white ${zoomed ? '' : ''}`}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={`w-full transition-all ${zoomed ? 'h-[70vh]' : 'h-[560px]'}`}
            onClick={() => setSelectedNode(null)}
          >
            {edges.map((e, i) => {
              if (e.shared.length === 0) {
                // case-identifier spoke
                const a = nodeById(e.from.startsWith('CASE') ? `case:${e.from}` : `id:${e.from}`);
                const b = nodeById(e.to.startsWith('CASE') ? `case:${e.to}` : `id:${e.to}`);
                if (!a || !b) return null;
                const lit = selectedNode && active.has(a.id) && active.has(b.id);
                return (
                  <line
                    key={`spoke-${i}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={lit ? '#2563EB' : '#CBD5E1'}
                    strokeWidth={lit ? 2.5 : 1.2}
                    className="transition-all duration-300"
                  />
                );
              }
              const a = nodeById(`case:${e.from}`);
              const b = nodeById(`case:${e.to}`);
              if (!a || !b) return null;
              const lit = selectedNode && (active.has(a.id) || active.has(b.id));
              return (
                <g key={`link-${i}`}>
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={lit ? '#DC2626' : '#E2A1A1'}
                    strokeWidth={lit ? 3 : 2}
                    strokeDasharray="6 4"
                    className="transition-all duration-300"
                  />
                  {lit && (
                    <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" className="fill-risk-high" style={{ fontSize: 10, fontWeight: 700 }}>
                      {e.shared.join(', ')}
                    </text>
                  )}
                </g>
              );
            })}

            {nodes.map((n) => {
              const dim = selectedNode !== null && !active.has(n.id);
              const isCase = n.kind === 'case';
              const fill = isCase
                ? n.riskLevel === 'HIGH' ? '#DC2626' : n.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A'
                : '#38BDF8';
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelectedNode(n.id);
                  }}
                  className="cursor-pointer"
                  opacity={dim ? 0.25 : 1}
                >
                  {selectedNode === n.id && (
                    <circle r={24} fill="none" stroke="#2563EB" strokeWidth={2} strokeDasharray="4 3" className="animate-pulse-soft" />
                  )}
                  <circle r={isCase ? 17 : 13} fill={fill} stroke="#fff" strokeWidth={3} />
                  <text
                    y={isCase ? 32 : -20}
                    textAnchor="middle"
                    style={{
                      fontSize: isCase ? 12 : 10,
                      fontWeight: 700,
                      fill: isCase ? '#091A35' : '#0284C7',
                    }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {selectedNode && selectedCaseNode && (
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-card border border-slate-100 p-4 w-64 text-sm animate-fade-up">
              <p className="font-display font-semibold text-navy">{selectedCaseNode.label}</p>
              {(() => {
                const c = cases.find((x) => x.id === selectedCaseNode.label);
                if (!c) return null;
                return (
                  <>
                    <p className="text-xs text-slate-500 mt-1">{c.category} · Risk {c.riskScore}/100</p>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      {[
                        ...c.identifiers.phones.map((v) => `PH ${v}`),
                        ...c.identifiers.upiIds.map((v) => `UPI ${v}`),
                        ...c.identifiers.domains.map((v) => `DOM ${v}`),
                        ...c.identifiers.emails.map((v) => `EMAIL ${v}`),
                        ...c.identifiers.ips.map((v) => `IP ${v}`),
                      ].map((k) => (
                        <p key={k} className="font-mono">{k}</p>
                      ))}
                    </div>
                    {caseEdgesFor(c.id).length > 0 && (
                      <p className="mt-2 text-xs font-semibold text-risk-high">
                        Connected to {caseEdgesFor(c.id).length} related case(s) via shared identifiers
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setSelectedNode(null);
                      }}
                      className="mt-3 w-full text-xs font-semibold text-white bg-royal hover:bg-navy rounded-lg py-2 transition"
                    >
                      Open case details
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {selectedNode && !selectedCaseNode && (
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-card border border-slate-100 p-4 w-64 text-sm animate-fade-up">
              <p className="font-display font-semibold text-navy break-all font-mono text-xs">{selectedNode.slice(3)}</p>
              <p className="text-xs text-slate-500 mt-1">Shared identifier linking multiple complaints.</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        Disclaimer: shared identifiers indicate potential relationships for further investigation. They do not establish
        common ownership or criminal responsibility.
      </div>

      <Modal open={Boolean(selectedCase)} onClose={() => setSelectedCase(null)} title={selectedCase ? `${selectedCase.id} — Case Details` : ''} wide>
        {selectedCase && <CaseDetailBody c={selectedCase} onDownload={() => downloadCasePdf(selectedCase, cases)} />}
      </Modal>
    </div>
  );
}
