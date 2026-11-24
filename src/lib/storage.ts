import type { FraudCase } from './types';
import { buildSeedCases } from './sampleData';

const CASES_KEY = 'cybertrace_cases_v1';
const LANG_KEY = 'cybertrace_lang_v1';
const ROLE_KEY = 'cybertrace_role_v1';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadCases(): FraudCase[] {
  const raw = localStorage.getItem(CASES_KEY);
  const stored = safeParse<FraudCase[]>(raw);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  const seeds = buildSeedCases();
  localStorage.setItem(CASES_KEY, JSON.stringify(seeds));
  return seeds;
}

export function saveCases(cases: FraudCase[]) {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

export function resetCases(): FraudCase[] {
  localStorage.removeItem(CASES_KEY);
  return loadCases();
}

export function saveLanguage(lang: string) {
  localStorage.setItem(LANG_KEY, lang);
}

export function loadLanguage(): string | null {
  return localStorage.getItem(LANG_KEY);
}

export function saveRole(role: string | null) {
  if (role) localStorage.setItem(ROLE_KEY, role);
  else localStorage.removeItem(ROLE_KEY);
}

export function loadRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function generateCaseId(existing: FraudCase[]): string {
  const nums = existing
    .map((c) => parseInt(c.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `CASE-${String(next).padStart(3, '0')}`;
}

export function hashString(input: string): string {
  // Simple deterministic demo hash (FNV-1a style) — NOT cryptographic.
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').repeat(4).slice(0, 32);
}
