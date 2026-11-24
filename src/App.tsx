import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { LandingPage } from '@/pages/LandingPage';
import { CitizenShell, PoliceShell } from '@/pages/Shell';
import { CitizenDashboard } from '@/pages/citizen/CitizenDashboard';
import { MessageChecker } from '@/pages/citizen/MessageChecker';
import { UrlChecker } from '@/pages/citizen/UrlChecker';
import { WebsiteScanner } from '@/pages/citizen/WebsiteScanner';
import { ApkScanner } from '@/pages/citizen/ApkScanner';
import { ReportForm } from '@/pages/citizen/ReportForm';
import { MyReports } from '@/pages/citizen/MyReports';
import { HelpSafety } from '@/pages/citizen/HelpSafety';
import { PoliceOverview, AllCases, HighRiskCases } from '@/pages/police/PoliceOverview';
import { CaseTable } from '@/pages/police/CaseTable';
import { ScamDna } from '@/pages/police/ScamDna';
import { IdentifierSearch } from '@/pages/police/IdentifierSearch';
import { HeatList } from '@/pages/police/HeatList';
import { EvidenceLocker } from '@/pages/police/EvidenceLocker';
import { InvestigationReports } from '@/pages/police/InvestigationReports';
import { MessageIntel, WebsiteIntel, ApkIntel } from '@/pages/police/IntelPages';
import { TraceyWidget } from '@/components/TraceyWidget';
import { LoginScreen } from '@/pages/Shell';

function CitizenPortal() {
  const [page, setPage] = useState('dashboard');

  const content = () => {
    switch (page) {
      case 'dashboard':
        return <CitizenDashboard onNavigate={setPage} />;
      case 'message-checker':
        return <MessageChecker />;
      case 'url-checker':
        return <UrlChecker />;
      case 'website-scanner':
        return <WebsiteScanner />;
      case 'apk-scanner':
        return <ApkScanner />;
      case 'report':
        return <ReportForm />;
      case 'my-reports':
        return <MyReports />;
      case 'tracey':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="font-display font-bold text-2xl text-navy">TRACEY AI — Cyber Assistant</h1>
              <p className="text-sm text-slate-500 mt-1">
                Your Cyber Safety Assistant. Use the floating chat button at the bottom-right to ask questions about
                phishing, fake KYC, suspicious links and reporting. A structured local response system — no live AI
                service is connected.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-royal/10 text-royal flex items-center justify-center text-xl font-display font-bold">
                T
              </div>
              <p className="font-display font-semibold text-navy mt-4">TRACEY AI is ready</p>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Open the assistant from the button in the bottom-right corner. Suggested questions are provided inside
                the chat. Responses are available in English and Hindi.
              </p>
            </div>
          </div>
        );
      case 'help':
        return <HelpSafety />;
      default:
        return <CitizenDashboard onNavigate={setPage} />;
    }
  };

  return (
    <CitizenShell page={page} onNavigate={setPage}>
      {content()}
      <TraceyWidget />
    </CitizenShell>
  );
}

function PolicePortal() {
  const [page, setPage] = useState('overview');
  const { cases } = useApp();

  const content = () => {
    switch (page) {
      case 'overview':
        return <PoliceOverview />;
      case 'all-cases':
        return <AllCases />;
      case 'high-risk':
        return <HighRiskCases />;
      case 'message-intel':
        return <MessageIntel />;
      case 'website-intel':
        return <WebsiteIntel />;
      case 'apk-intel':
        return <ApkIntel />;
      case 'scam-dna':
        return <ScamDna />;
      case 'id-search':
        return <IdentifierSearch />;
      case 'heat-list':
        return <HeatList />;
      case 'evidence':
        return <EvidenceLocker />;
      case 'reports':
        return <InvestigationReports />;
      case 'tracey':
        return (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="font-display font-bold text-2xl text-navy">TRACEY AI — Investigator Assistant</h1>
              <p className="text-sm text-slate-500 mt-1">
                Ask about Scam DNA, risk scores, identifier correlation and reporting. Opens bottom-right. Structured
                local responses only — no live AI service.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-royal/10 text-royal flex items-center justify-center text-xl font-display font-bold">
                T
              </div>
              <p className="font-display font-semibold text-navy mt-4">TRACEY AI is ready</p>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Open the assistant from the floating button to ask about connected-case logic and evidence handling.
              </p>
            </div>
          </div>
        );
      default:
        return <PoliceOverview />;
    }
  };

  return (
    <PoliceShell page={page} onNavigate={setPage}>
      {content()}
      <TraceyWidget />
      <p className="text-[11px] text-slate-400 mt-8 text-center">
        Authorised-user view (demo). {cases.length} cases loaded · All data is synthetic demonstration data stored in
        this browser.
      </p>
    </PoliceShell>
  );
}

function AppContent() {
  const { role } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  if (role === 'citizen') return <CitizenPortal />;
  if (role === 'police') return <PolicePortal />;
  if (showLogin) return <LoginScreen />;
  return <LandingPage onLogin={() => setShowLogin(true)} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
