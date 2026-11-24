export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Indicator {
  label: string;
  detail: string;
  weight: number;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  score: number;
  indicators: Indicator[];
  explanation: string;
  recommendations: string[];
  identifiers: ExtractedIdentifiers;
}

export interface ExtractedIdentifiers {
  phones: string[];
  emails: string[];
  urls: string[];
  upiIds: string[];
  ips: string[];
  domains: string[];
  cryptoWallets: string[];
  bankAccounts: string[];
}

export type CaseStatus = 'NEW' | 'UNDER_REVIEW' | 'INVESTIGATING' | 'CLOSED';

export type IncidentCategory =
  | 'Fake Bank KYC'
  | 'Phishing Message'
  | 'Fake Parcel / Delivery'
  | 'Fake Electricity Bill'
  | 'Fake Job / Internship'
  | 'Fake Instant Loan'
  | 'Investment / Trading Fraud'
  | 'Betting Platform'
  | 'Malicious App (APK)'
  | 'Other';

export interface FraudCase {
  id: string;
  createdAt: string;
  incidentDate: string;
  category: IncidentCategory;
  message: string;
  url: string;
  website: string;
  phone: string;
  upiId: string;
  description: string;
  evidenceName: string;
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: string[];
  identifiers: ExtractedIdentifiers;
  source: 'SEED' | 'CITIZEN';
  status: CaseStatus;
}

export interface ChatMessage {
  role: 'user' | 'tracey';
  text: string;
}
