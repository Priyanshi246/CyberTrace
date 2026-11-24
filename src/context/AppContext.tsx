import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FraudCase, CaseStatus } from '@/lib/types';
import { loadCases, saveCases, loadLanguage, saveLanguage, loadRole, saveRole } from '@/lib/storage';
import { translate, type LanguageCode } from '@/lib/i18n';

export type PortalRole = 'citizen' | 'police' | null;

interface AppContextValue {
  cases: FraudCase[];
  addCase: (c: FraudCase) => void;
  updateCaseStatus: (id: string, status: CaseStatus) => void;
  resetDemoData: () => void;
  role: PortalRole;
  setRole: (r: PortalRole) => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<FraudCase[]>(() => loadCases());
  const [role, setRoleState] = useState<PortalRole>(() => loadRole() as PortalRole);
  const [lang, setLangState] = useState<LanguageCode>(() => (loadLanguage() as LanguageCode) || 'en');

  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  const addCase = useCallback((c: FraudCase) => {
    setCases((prev) => [c, ...prev]);
  }, []);

  const updateCaseStatus = useCallback((id: string, status: CaseStatus) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const resetDemoData = useCallback(() => {
    setCases(loadCases());
  }, []);

  const setRole = useCallback((r: PortalRole) => {
    setRoleState(r);
    saveRole(r);
  }, []);

  const setLang = useCallback((l: LanguageCode) => {
    setLangState(l);
    saveLanguage(l);
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo(
    () => ({ cases, addCase, updateCaseStatus, resetDemoData, role, setRole, lang, setLang, t }),
    [cases, addCase, updateCaseStatus, resetDemoData, role, setRole, lang, setLang, t]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
