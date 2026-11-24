import type { FraudCase, IncidentCategory, RiskLevel } from './types';
import { extractIdentifiers } from './analysis';

interface SeedSpec {
  id: string;
  daysAgo: number;
  category: IncidentCategory;
  message: string;
  url: string;
  website: string;
  phone: string;
  upiId: string;
  description: string;
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: string[];
  status: FraudCase['status'];
  evidenceName?: string;
}

const seeds: SeedSpec[] = [
  {
    id: 'CASE-001',
    daysAgo: 2,
    category: 'Fake Bank KYC',
    message: 'Dear Customer, your SBI account will be BLOCKED within 24 hours. Complete KYC immediately: https://secure-bank-demo.test/kyc Update your PAN & Aadhaar. - SBIB',
    url: 'https://secure-bank-demo.test/kyc',
    website: '',
    phone: '9876543210',
    upiId: 'frauddemo@upi',
    description: 'Received SMS claiming my bank account will be blocked. It asked for PAN and Aadhaar on a link.',
    riskLevel: 'HIGH',
    riskScore: 85,
    indicators: ['Fake KYC request', 'Account-blocking threat', 'Urgency / threatening language', 'Suspicious external URL(s)'],
    status: 'UNDER_REVIEW',
  },
  {
    id: 'CASE-002',
    daysAgo: 4,
    category: 'Investment / Trading Fraud',
    message: 'Guaranteed 100% returns! Double your money in 7 days on investment-demo.test. Limited slots, join now!',
    url: 'https://investment-demo.test/join',
    website: 'investment-demo.test',
    phone: '',
    upiId: 'frauddemo@upi',
    description: 'Telegram group promising doubled returns on a trading website.',
    riskLevel: 'HIGH',
    riskScore: 90,
    indicators: ['Guaranteed-return claim', 'Suspicious external URL(s)'],
    status: 'INVESTIGATING',
  },
  {
    id: 'CASE-003',
    daysAgo: 6,
    category: 'Fake Instant Loan',
    message: 'Instant loan approved! No documents needed. Download app from fake-loan-demo.test and get ₹50,000 in 10 minutes.',
    url: 'https://fake-loan-demo.test/app',
    website: 'fake-loan-demo.test',
    phone: '9123456780',
    upiId: '',
    description: 'App-based instant loan offer demanding access to contacts.',
    riskLevel: 'HIGH',
    riskScore: 78,
    indicators: ['Instant-loan offer pattern', 'Suspicious external URL(s)'],
    status: 'NEW',
  },
  {
    id: 'CASE-004',
    daysAgo: 8,
    category: 'Fake Parcel / Delivery',
    message: 'Your parcel is stuck at customs. Pay delivery charge of ₹499 via UPI support@fraud-demo.example or call 9876543210.',
    url: '',
    website: '',
    phone: '9876543210',
    upiId: 'support@fraud-demo.example',
    description: 'Fake courier message demanding a small delivery fee.',
    riskLevel: 'HIGH',
    riskScore: 72,
    indicators: ['Fake parcel / delivery pattern', 'Suspicious payment request', 'UPI payment identifier found'],
    status: 'INVESTIGATING',
    evidenceName: 'parcel-sms-screenshot.png',
  },
  {
    id: 'CASE-005',
    daysAgo: 10,
    category: 'Fake Electricity Bill',
    message: 'Electricity will be DISCONNECTED tonight. Last warning! Pay bill at urgent-kyc-demo.example immediately. RajEntre Board',
    url: 'http://urgent-kyc-demo.example/pay',
    website: 'urgent-kyc-demo.example',
    phone: '',
    upiId: '',
    description: 'Fake electricity board disconnection notice received on WhatsApp.',
    riskLevel: 'HIGH',
    riskScore: 80,
    indicators: ['Fake utility-bill threat', 'Account-blocking threat', 'Urgency / threatening language', 'Not using HTTPS'],
    status: 'CLOSED',
  },
  {
    id: 'CASE-006',
    daysAgo: 12,
    category: 'Fake Job / Internship',
    message: 'Congratulations! You are selected for work-from-home internship. Pay registration fee ₹1,499 to hr-intern@upi. Earn ₹15,000 weekly guaranteed.',
    url: '',
    website: '',
    phone: '',
    upiId: 'hr-intern@upi',
    description: 'Internship offer asking for a registration fee upfront.',
    riskLevel: 'HIGH',
    riskScore: 76,
    indicators: ['Job / internship offer pattern', 'Registration / advance fee demand', 'Guaranteed-return claim', 'Suspicious payment request'],
    status: 'NEW',
  },
  {
    id: 'CASE-007',
    daysAgo: 14,
    category: 'Betting Platform',
    message: 'Join satta-king-demo.test betting platform. Casino, teen patti, colour prediction. Assured daily income. Contact 9123456780',
    url: 'https://satta-king-demo.test',
    website: 'satta-king-demo.test',
    phone: '9123456780',
    upiId: '',
    description: 'Betting platform advertisement circulated on social media.',
    riskLevel: 'MEDIUM',
    riskScore: 55,
    indicators: ['Betting-related content', 'Guaranteed-return claim'],
    status: 'UNDER_REVIEW',
  },
  {
    id: 'CASE-008',
    daysAgo: 16,
    category: 'Phishing Message',
    message: 'Dear Customer, you have won ₹25,00,000 in a lucky draw! Claim your prize: www.prize-demo.test. Send processing fee to claim.',
    url: 'https://www.prize-demo.test',
    website: '',
    phone: '',
    upiId: '',
    description: 'Lottery winnings message received on email.',
    riskLevel: 'HIGH',
    riskScore: 70,
    indicators: ['Lottery / prize scam pattern', 'Registration / advance fee demand', 'Impersonation language'],
    status: 'NEW',
  },
  {
    id: 'CASE-009',
    daysAgo: 18,
    category: 'Malicious App (APK)',
    message: 'Update your bank app for new features. Install: secure-bank-demo.test/app.apk',
    url: 'https://secure-bank-demo.test/app.apk',
    website: '',
    phone: '',
    upiId: '',
    description: 'APK file shared on WhatsApp impersonating a banking app.',
    riskLevel: 'HIGH',
    riskScore: 88,
    indicators: ['Link / app-install push', 'Suspicious external URL(s)'],
    status: 'INVESTIGATING',
    evidenceName: 'bank-app-update.apk',
  },
  {
    id: 'CASE-010',
    daysAgo: 20,
    category: 'Other',
    message: 'Your KYC expires soon. Verify at demo-genuine-portal.test to continue services.',
    url: 'https://demo-genuine-portal.test/kyc',
    website: '',
    phone: '',
    upiId: '',
    description: 'Service notification — assessed as low risk after verification.',
    riskLevel: 'LOW',
    riskScore: 15,
    indicators: [],
    status: 'CLOSED',
  },
  {
    id: 'CASE-011',
    daysAgo: 22,
    category: 'Fake Bank KYC',
    message: 'RBI notification: your account re-KYC is pending. Server will deactivate your account today. Click http://193.29.14.2/kyc-login',
    url: 'http://193.29.14.2/kyc-login',
    website: '',
    phone: '',
    upiId: '',
    description: 'Phishing page hosted on a raw IP address.',
    riskLevel: 'HIGH',
    riskScore: 92,
    indicators: ['IP-address-based URL', 'Fake KYC request', 'Authority impersonation', 'Not using HTTPS'],
    status: 'UNDER_REVIEW',
  },
  {
    id: 'CASE-012',
    daysAgo: 24,
    category: 'Investment / Trading Fraud',
    message: 'Trading expert group. We give assured returns. Send amount to frauddemo@upi and start earning from tomorrow.',
    url: '',
    website: '',
    phone: '',
    upiId: 'frauddemo@upi',
    description: 'Fake trading expert group collecting deposits over UPI.',
    riskLevel: 'HIGH',
    riskScore: 82,
    indicators: ['Guaranteed-return claim', 'Suspicious payment request', 'UPI payment identifier found'],
    status: 'INVESTIGATING',
  },
];

export function buildSeedCases(): FraudCase[] {
  return seeds.map((s) => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - s.daysAgo);
    const incidentDate = createdAt.toISOString().slice(0, 10);
    return {
      id: s.id,
      createdAt: createdAt.toISOString(),
      incidentDate,
      category: s.category,
      message: s.message,
      url: s.url,
      website: s.website,
      phone: s.phone,
      upiId: s.upiId,
      description: s.description,
      evidenceName: s.evidenceName || '',
      riskLevel: s.riskLevel,
      riskScore: s.riskScore,
      indicators: s.indicators,
      identifiers: extractIdentifiers(
        `${s.message} ${s.url} ${s.website} ${s.phone} ${s.upiId}`
      ),
      source: 'SEED',
      status: s.status,
    };
  });
}

export const sampleMessages = {
  suspicious: [
    'Dear Customer, your SBI account will be BLOCKED within 24 hours. Complete KYC immediately at secure-bank-demo.test/kyc. - SBIB',
    'Your parcel is stuck at customs. Pay delivery charge of ₹499 via UPI paytm-claim@upi or call 9876543210.',
    'URGENT! Electricity will be DISCONNECTED tonight. Last warning! Pay at urgent-kyc-demo.example now.',
    'Congratulations! You are selected for work-from-home internship. Pay registration fee ₹1,499 to hr-intern@upi. Earn ₹15,000 weekly guaranteed.',
    'Instant loan approved! No documents needed. Get ₹50,000 in 10 minutes. Download app from fake-loan-demo.test.',
  ],
  genuine: [
    'Hi Mummy, I reached Jaipur safely. Will call you after dinner.',
    'Your order #48392 has been shipped and will arrive on Friday. Track it in the app. - DemoStore',
    'Reminder: Team meeting tomorrow at 10 AM in conference room B. - Ravi',
    'Thank you for visiting City Hospital. Here is your appointment summary for 12 March.',
    'Hello, this is your weekly neighbourhood newsletter. Handloom mela on Sunday at 10 AM near the community hall.',
  ],
};

export const sampleUrls = [
  'https://example.com',
  'https://secure-bank-demo.test',
  'http://urgent-kyc-demo.test',
  'https://bit.ly/3xKdemo',
  'http://193.29.14.2/kyc-login',
];

export interface SampleWebsite {
  name: string;
  url: string;
  content: string;
}

export const sampleWebsites: SampleWebsite[] = [
  {
    name: 'Investment scheme page',
    url: 'https://investment-demo.test',
    content:
      'Guaranteed 100% returns! Double your money in 7 days. Referral bonus for every friend you join. Limited slots. Contact support@fraud-demo.example or pay to frauddemo@upi',
  },
  {
    name: 'Fake loan portal',
    url: 'http://fake-loan-demo.test',
    content:
      'Instant personal loan without documents! Approved in 10 minutes. Advance processing fee required. Download our app. Call 9123456780 now.',
  },
  {
    name: 'Betting platform',
    url: 'https://satta-king-demo.test',
    content:
      'Best online casino and teen patti. Colour prediction game. Assured daily income. Bet now and double your money!',
  },
];

export interface SampleApk {
  name: string;
  appName: string;
  packageId: string;
  size: string;
  permissions: string[];
  urls: string[];
  ips: string[];
  riskLevel: RiskLevel;
  riskScore: number;
  flags: string[];
}

export const sampleApks: SampleApk[] = [
  {
    name: 'bank-app-update.apk',
    appName: 'SBI Quick Update',
    packageId: 'com.sbi.demo.update',
    size: '8.4 MB',
    permissions: ['READ_SMS', 'RECEIVE_SMS', 'ACCESSIBILITY_SERVICES', 'REQUEST_INSTALL_PACKAGES', 'READ_CONTACTS'],
    urls: ['https://secure-bank-demo.test/c2', 'http://193.29.14.2/upload'],
    ips: ['193.29.14.2'],
    riskLevel: 'HIGH',
    riskScore: 95,
    flags: ['Reads SMS (OTP interception)', 'Accessibility service abuse (screen overlay)', 'Auto-install behaviour', 'Contacts exfiltration'],
  },
  {
    name: 'loan-fast-cash.apk',
    appName: 'FastCash Loan',
    packageId: 'com.fastcash.demo.loan',
    size: '12.1 MB',
    permissions: ['READ_CONTACTS', 'READ_GALLERY', 'READ_CALL_LOG', 'FINE_LOCATION'],
    urls: ['https://fake-loan-demo.test/api'],
    ips: [],
    riskLevel: 'HIGH',
    riskScore: 82,
    flags: ['Contacts + gallery harvesting', 'Call-log access unrelated to lending', 'Location tracking'],
  },
  {
    name: 'demo-game.apk',
    appName: 'Block Puzzle Demo',
    packageId: 'com.demo.puzzle.game',
    size: '22.7 MB',
    permissions: ['INTERNET', 'VIBRATE'],
    urls: ['https://demo-puzzle.test/api'],
    ips: [],
    riskLevel: 'LOW',
    riskScore: 12,
    flags: [],
  },
];

export const landingStats = {
  reports: '12,847',
  alerts: '1,392',
  connected: '268',
  identifiers: '5,741',
};
