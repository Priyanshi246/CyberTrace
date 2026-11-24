import type {
  AnalysisResult,
  ExtractedIdentifiers,
  Indicator,
  RiskLevel,
} from './types';

export const emptyIdentifiers = (): ExtractedIdentifiers => ({
  phones: [],
  emails: [],
  urls: [],
  upiIds: [],
  ips: [],
  domains: [],
  cryptoWallets: [],
  bankAccounts: [],
});

export function extractIdentifiers(text: string): ExtractedIdentifiers {
  const ids = emptyIdentifiers();
  if (!text) return ids;

  ids.phones = unique(
    text.match(/(?:\+?91[\s-]?)?\b[6-9]\d{9}\b/g) || []
  );
  ids.emails = unique(
    text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
  );
  ids.urls = unique(
    text.match(/https?:\/\/[^\s"'<>)]+|www\.[^\s"'<>)]+|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|in|test|example|info|xyz|top|click|link|online|site)\b[^\s"'<>)]*/gi) || []
  );
  ids.upiIds = unique(
    text.match(/\b[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}\b/g) || []
  );
  ids.ips = unique(
    text.match(/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g) || []
  );
  ids.cryptoWallets = unique(
    text.match(/\b(?:0x[a-fA-F0-9]{40}|(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39})\b/g) || []
  );
  ids.bankAccounts = unique(
    text.match(/\b(?:a\/c|acc(?:ount)?\.?(?:\s*(?:no\.?|number))?)\s*[:#=]?\s*(\d{9,18})\b/gi) || []
  );

  ids.domains = unique(
    ids.urls
      .map((u) => safeDomain(u))
      .filter((d): d is string => Boolean(d))
  );

  return ids;
}

function safeDomain(url: string): string | null {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  } catch {
    return null;
  }
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

interface Rule {
  pattern: RegExp;
  indicator: (match: string) => Indicator;
}

const messageRules: Rule[] = [
  {
    pattern: /\b(urgent|immediately|within\s+\d+\s+(?:hours?|minutes?|days?)|act\s+now|last\s+(?:chance|warning)|final\s+notice|expire[sd]?\b|expiry\b)/i,
    indicator: (m) => ({ label: 'Urgency / threatening language', detail: `Found: "${m.trim()}"`, weight: 18 }),
  },
  {
    pattern: /\b(kyc|re-?kyc|e-?kyc|know\s+your\s+customer)\b/i,
    indicator: (m) => ({ label: 'Fake KYC request', detail: `References KYC: "${m.trim()}"`, weight: 25 }),
  },
  {
    pattern: /\b(block|blocked|suspend(?:ed)?|deactivate[d]?|disabled|frozen)\b[^.?!]*(?:account|card|wallet)?/i,
    indicator: (m) => ({ label: 'Account-blocking threat', detail: `Found: "${m.trim()}"`, weight: 22 }),
  },
  {
    pattern: /\b(otp|one\s+time\s+password|pin|password|cvv|cv2)\b/i,
    indicator: (m) => ({ label: 'OTP / password request', detail: `References sensitive credential: "${m.trim()}"`, weight: 30 }),
  },
  {
    pattern: /\b(pay|send|transfer|deposit)\b[^.?!]*\b(rs\.?|₹|rupees?|inr)\b|\b₹\s?\d+|\brs\.?\s?\d+/i,
    indicator: (m) => ({ label: 'Suspicious payment request', detail: `Found: "${m.trim()}"`, weight: 20 }),
  },
  {
    pattern: /\b(registration\s+fee|processing\s+fee|advance\s+(?:payment|fee|deposit)|security\s+deposit|token\s+amount|shipping\s+fee|delivery\s+charge)\b/i,
    indicator: (m) => ({ label: 'Registration / advance fee demand', detail: `Found: "${m.trim()}"`, weight: 25 }),
  },
  {
    pattern: /\b(guaranteed|100%|assured|risk-?free|double\s+your\s+money|fixed\s+return)\b[^.?!]*(?:return|profit|income|money|gain)?/i,
    indicator: (m) => ({ label: 'Guaranteed-return claim', detail: `Found: "${m.trim()}"`, weight: 25 }),
  },
  {
    pattern: /\b(won|winner|lottery|prize|lucky\s+draw|cashback|refund)\b[^.?!]*\b(₹|rs\.?|rupees?|lakh|crore|amount)\b/i,
    indicator: (m) => ({ label: 'Lottery / prize scam pattern', detail: `Found: "${m.trim()}"`, weight: 22 }),
  },
  {
    pattern: /\b(resume|cv|internship|job\s+offer|hiring|recruitment|work\s+from\s+home|part\s+time\s+job)\b/i,
    indicator: (m) => ({ label: 'Job / internship offer pattern', detail: `Found: "${m.trim()}" — verify the employer independently`, weight: 12 }),
  },
  {
    pattern: /\b(loan|lending|credit)\b[^.?!]*\b(instant|immediate|within\s+\d+|no\s+documents?|without\s+documents?)\b/i,
    indicator: (m) => ({ label: 'Instant-loan offer pattern', detail: `Found: "${m.trim()}"`, weight: 18 }),
  },
  {
    pattern: /\b(dear\s+customer|dear\s+user|dear\s+ beneficiary|respected\s+customer)\b/i,
    indicator: (m) => ({ label: 'Impersonation language', detail: `Generic greeting: "${m.trim()}" — banks use your name`, weight: 10 }),
  },
  {
    pattern: /\b(rbi|reserve\s+bank|income\s+tax|tax\s+refund|govt\.?|government|police|cbi)\b/i,
    indicator: (m) => ({ label: 'Authority impersonation', detail: `References official body: "${m.trim()}"`, weight: 20 }),
  },
  {
    pattern: /\b(click\s+(?:here|below|this\s+link)|download\s+(?:the\s+)?app|update\s+your\s+app|\.apk)\b/i,
    indicator: (m) => ({ label: 'Link / app-install push', detail: `Found: "${m.trim()}"`, weight: 15 }),
  },
  {
    pattern: /\b(betting|bet\s+now|satta|casino|cas©?ino|teen\s+patti|colour\s+prediction|color\s+prediction)\b/i,
    indicator: (m) => ({ label: 'Betting-related content', detail: `Found: "${m.trim()}"`, weight: 20 }),
  },
  {
    pattern: /\b(parcel|package|delivery|shipment|consignment|courier)\b[^.?!]*\b(stuck|held|pending|address|fee|charge)\b/i,
    indicator: (m) => ({ label: 'Fake parcel / delivery pattern', detail: `Found: "${m.trim()}"`, weight: 20 }),
  },
  {
    pattern: /\b(electricity|power\s+bill|meter)\b[^.?!]*(?:disconnect|due|cut|reconnect)?/i,
    indicator: (m) => ({ label: 'Fake utility-bill threat', detail: `Found: "${m.trim()}"`, weight: 18 }),
  },
];

export function analyzeMessage(text: string): AnalysisResult {
  const indicators: Indicator[] = [];
  const lower = text.toLowerCase();

  for (const rule of messageRules) {
    const match = text.match(rule.pattern);
    if (match) {
      indicators.push(rule.indicator(match[0]));
    }
  }

  const ids = extractIdentifiers(text);

  if (ids.urls.length > 0) {
    indicators.push({
      label: 'Suspicious external URL(s)',
      detail: `Found ${ids.urls.length} URL(s): ${ids.urls.slice(0, 3).join(', ')}`,
      weight: 15,
    });
  }
  if (ids.upiIds.length > 0) {
    indicators.push({
      label: 'UPI payment identifier found',
      detail: `Found: ${ids.upiIds.join(', ')} — verify the payee name carefully`,
      weight: 15,
    });
  }
  if (ids.phones.length > 0) {
    indicators.push({
      label: 'Phone number(s) found',
      detail: `Found: ${ids.phones.join(', ')}`,
      weight: 5,
    });
  }
  if (ids.cryptoWallets.length > 0) {
    indicators.push({
      label: 'Cryptocurrency wallet pattern found',
      detail: `Found: ${ids.cryptoWallets[0]}`,
      weight: 25,
    });
  }
  if (ids.bankAccounts.length > 0) {
    indicators.push({
      label: 'Bank account reference found',
      detail: `Found: ${ids.bankAccounts[0]}`,
      weight: 15,
    });
  }

  // All-caps shouting heuristic
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 20 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
    indicators.push({
      label: 'ALL-CAPS shouting',
      detail: 'Entire message is capitalised — common pressure tactic',
      weight: 8,
    });
  }

  const score = Math.min(100, indicators.reduce((s, i) => s + i.weight, 0));
  const riskLevel: RiskLevel = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';

  return {
    riskLevel,
    score,
    indicators,
    explanation: buildExplanation(riskLevel, indicators.length, 'message'),
    recommendations: buildRecommendations(riskLevel, 'message', indicators),
    identifiers: ids,
  };
}

export function analyzeUrl(rawUrl: string): AnalysisResult {
  const indicators: Indicator[] = [];
  const input = rawUrl.trim();
  const hasScheme = /^https?:\/\//i.test(input);
  const isHttps = /^https:\/\//i.test(input);

  if (!hasScheme) {
    indicators.push({
      label: 'No protocol specified',
      detail: 'The URL does not start with http:// or https:// — treat with caution',
      weight: 8,
    });
  } else if (!isHttps) {
    indicators.push({
      label: 'Not using HTTPS',
      detail: 'Data sent to this site is not encrypted',
      weight: 20,
    });
  }

  const domain = safeDomain(input) || input.split('/')[0];

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) {
    indicators.push({
      label: 'IP-address-based URL',
      detail: `The URL uses a raw IP address (${domain}) instead of a domain name`,
      weight: 30,
    });
  }

  if (/^[a-z0-9-]+-[a-z0-9-]+\.(com|net|org|in)$/i.test(domain) && /(secure|login|verify|account|bank|pay|update|wallet)/i.test(domain)) {
    indicators.push({
      label: 'Look-alike domain indicator',
      detail: `"${domain}" combines a brand word with a generic suffix — common in phishing`,
      weight: 25,
    });
  }

  if (domain.split('.').length > 3) {
    indicators.push({
      label: 'Unusual subdomain depth',
      detail: `"${domain}" has many subdomain levels, often used to confuse`,
      weight: 12,
    });
  }

  if (/(bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|shorturl)/i.test(input)) {
    indicators.push({
      label: 'URL shortening service',
      detail: 'Shortened links hide the true destination',
      weight: 20,
    });
  }

  const keywordRules: Array<[RegExp, string, number]> = [
    [/(kyc|re-?kyc)/i, 'KYC keyword', 20],
    [/(login|signin|verify|verification|authenticate)/i, 'Credential-capture keyword', 15],
    [/(bank|sbi|hdfc|icici|axis|kotak|paytm|phonepe)/i, 'Brand keyword in domain', 15],
    [/(otp|password|pin)/i, 'OTP / password keyword', 20],
    [/(bonus|win|jackpot|bet|casino|satta)/i, 'Gambling / bonus keyword', 18],
    [/(loan|credit|instant)/i, 'Loan keyword', 12],
    [/(refund|cashback|reward|prize|lottery)/i, 'Prize / refund keyword', 15],
    [/(invest|trading|crypto|doubled?|returns?)/i, 'Investment keyword', 15],
    [/(gift|offer|deal|free)/i, 'Freebie keyword', 10],
  ];

  for (const [pattern, label, weight] of keywordRules) {
    const m = input.match(pattern);
    if (m) {
      indicators.push({ label, detail: `Found: "${m[0]}"`, weight });
    }
  }

  const tld = domain.split('.').pop() || '';
  if (['xyz', 'top', 'click', 'link', 'online', 'site', 'info'].includes(tld)) {
    indicators.push({
      label: 'High-abuse TLD',
      detail: `".${tld}" domains are frequently used in phishing campaigns`,
      weight: 15,
    });
  }

  const score = Math.min(100, indicators.reduce((s, i) => s + i.weight, 0));
  const riskLevel: RiskLevel = score >= 55 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';

  return {
    riskLevel,
    score,
    indicators,
    explanation: buildExplanation(riskLevel, indicators.length, 'url'),
    recommendations: buildRecommendations(riskLevel, 'url', indicators),
    identifiers: {
      ...emptyIdentifiers(),
      urls: input ? [input] : [],
      domains: domain ? [domain] : [],
    },
  };
}

export function analyzeWebsite(url: string, content: string): AnalysisResult {
  const urlResult = analyzeUrl(url);
  const contentResult = analyzeMessage(content);
  const indicators = [...urlResult.indicators, ...contentResult.indicators];
  const ids = extractIdentifiers(`${url}\n${content}`);

  // merge url/domain from urlResult
  ids.urls = Array.from(new Set([...urlResult.identifiers.urls, ...ids.urls]));
  ids.domains = Array.from(new Set([...urlResult.identifiers.domains, ...ids.domains]));

  const score = Math.min(100, Math.round((urlResult.score + contentResult.score) / 2 + Math.max(urlResult.score, contentResult.score) * 0.2));
  const riskLevel: RiskLevel = score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';

  return {
    riskLevel,
    score,
    indicators,
    explanation: buildExplanation(riskLevel, indicators.length, 'website'),
    recommendations: buildRecommendations(riskLevel, 'website', indicators),
    identifiers: ids,
  };
}

function buildExplanation(riskLevel: RiskLevel, count: number, kind: string): string {
  if (riskLevel === 'HIGH') {
    return `This ${kind} shows ${count} strong fraud indicator(s) consistent with known cyber-fraud patterns. Do not interact with it, and do not share OTPs, passwords or payments.`;
  }
  if (riskLevel === 'MEDIUM') {
    return `This ${kind} shows ${count} suspicious indicator(s) that warrant caution. Verify independently through official channels before responding or paying anything.`;
  }
  return `No strong fraud indicators were found in this ${kind} with the prototype rules. However, absence of indicators is not a guarantee of safety — stay alert.`;
}

function buildRecommendations(riskLevel: RiskLevel, kind: string, indicators: Indicator[]): string[] {
  const recs: string[] = [];
  if (kind === 'url' || kind === 'website') {
    recs.push('Do not enter personal, banking or card details on this website.');
  }
  if (kind === 'message') {
    recs.push('Do not reply, click links, or call numbers inside the message.');
  }
  if (riskLevel === 'HIGH') {
    recs.push('Report it at cybercrime.gov.in or call helpline 1930 immediately.');
    recs.push('If money was shared, inform your bank through official channels right away.');
  } else if (riskLevel === 'MEDIUM') {
    recs.push('Verify directly with the organisation using its official website or app.');
    recs.push('Report it at cybercrime.gov.in if you suspect fraud.');
  } else {
    recs.push('Stay alert — verify unexpected requests through official channels.');
  }
  recs.push('Never share OTPs, PINs or banking passwords with anyone.');
  if (indicators.some((i) => i.label.includes('KYC'))) {
    recs.push('Banks never ask for KYC over SMS, WhatsApp or links — visit a branch or official app instead.');
  }
  return recs;
}
