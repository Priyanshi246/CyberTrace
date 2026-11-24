import type { ChatMessage } from './types';

interface TraceyAnswer {
  match: RegExp;
  en: string;
  hi: string;
}

const answers: TraceyAnswer[] = [
  {
    match: /phishing/i,
    en: 'Phishing is when fraudsters pretend to be a bank, company or government office to trick you into sharing OTPs, passwords, or clicking dangerous links. Warning signs: urgency ("act in 24 hours"), threats ("account will be blocked"), generic greetings ("Dear Customer"), and links that look almost right but are not official. Never click links in unexpected messages — open the official app or website instead.',
    hi: 'फिशिंग वह धोखा है जिसमें ठग बैंक, कंपनी या सरकारी कार्यालय बनकर आपसे OTP, पासवर्ड या खतरनाक लिंक पर क्लिक करवाते हैं। चेतावनी के संकेत: जल्दबाज़ी ("24 घंटे में कार्य करें"), धमकी ("खाता ब्लॉक होगा"), सामान्य अभिवादन ("प्रिय ग्राहक"), और लगभग सही दिखने वाले लिंक। अनजान संदेशों में लिंक पर क्लिक न करें — आधिकारिक ऐप या वेबसाइट खोलें।',
  },
  {
    match: /(fake\s+)?kyc|re-?kyc/i,
    en: 'Banks NEVER ask for KYC through SMS, WhatsApp or links. A "your KYC will expire, click here" message is almost always fraud. To complete KYC, visit your branch or use the official bank app you installed yourself. Never enter Aadhaar, PAN or OTP on a link received by message.',
    hi: 'बैंक कभी भी SMS, WhatsApp या लिंक से KYC नहीं करवाते। "आपका KYC एक्सपायर हो रहा है, यहाँ क्लिक करें" संदेश लगभग हमेशा धोखा है। KYC के लिए शाखा जाएँ या स्वयं इंस्टॉल किया गया आधिकारिक बैंक ऐप इस्तेमाल करें। संदेश से मिले लिंक पर आधार, पैन या OTP दर्ज न करें।',
  },
  {
    match: /internship|job|work\s*from\s*home|hiring/i,
    en: 'Warning signs of a fake job/internship offer: they ask for a registration, training or processing fee; they promise guaranteed weekly income; the interview happens entirely on WhatsApp/Telegram; they rush you to pay "to lock your slot". Genuine employers never ask candidates to pay money. Use the Message Checker to analyse the exact offer text.',
    hi: 'नकली इंटर्नशिप/नौकरी ऑफर के संकेत: रजिस्ट्रेशन या ट्रेनिंग फीस माँगना; हर सप्ताह गारंटीड् कमाई का वादा; पूरी बातचीत केवल WhatsApp/Telegram पर; "सीट पक्की करने के लिए" जल्दी पैसे भरवाना। असली नियोक्ता कभी पैसे नहीं माँगते। सटीक ऑफर टेक्स्ट को संदेश चेकर से जाँचें।',
  },
  {
    match: /click(ed|ing)?|suspicious link|opened a link/i,
    en: 'If you clicked a suspicious link: (1) Do NOT enter any details. (2) Close the page. (3) If you installed an app, uninstall it. (4) If you entered banking details, call your bank immediately through the number on your card. (5) Call cyber helpline 1930 and report at cybercrime.gov.in as soon as possible — fast reporting can help freeze fraudulent transactions.',
    hi: 'यदि आपने संदिग्ध लिंक पर क्लिक किया: (1) कोई विवरण भरें नहीं। (2) पेज बंद करें। (3) ऐप इंस्टॉल किया हो तो डिलीट करें। (4) बैंकिंग विवरण भरे हों तो कार्ड पर दिए नंबर से बैंक को तुरंत सूचित करें। (5) साइबर हेल्पलाइन 1930 पर कॉल करें और cybercrime.gov.in पर रिपोर्ट दर्ज करें — तेज़ रिपोर्टिंग लेनदेन रोकने में मदद कर सकती है।',
  },
  {
    match: /report|complaint|1930|cybercrime/i,
    en: 'To report online financial fraud: call the Cyber Fraud Helpline 1930 immediately, and file a complaint at https://cybercrime.gov.in/ — the official National Cyber Crime Reporting Portal. Report within the "golden hour" for the best chance of freezing the money. In CyberTrace you can also use Report Cyber Fraud to create a demo case for this hackathon prototype.',
    hi: 'ऑनलाइन वित्तीय धोखाधड़ी की रिपोर्ट के लिए: तुरंत साइबर धोखाधड़ी हेल्पलाइन 1930 पर कॉल करें और https://cybercrime.gov.in/ (राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल) पर शिकायत दर्ज करें। पैसा रुकवाने की सबसे अच्छी संभावना के लिए "गोल्डन आवर" में रिपोर्ट करें। इस हैकाथॉन प्रोटोटाइप में आप Report Cyber Fraud से डेमो प्रकरण भी बना सकते हैं।',
  },
  {
    match: /otp|one[\s-]?time/i,
    en: 'NEVER share an OTP with anyone — not even someone claiming to be from your bank, a delivery company or the police. No genuine organisation ever asks for it. If someone asks for your OTP, the call/message is fraud. Disconnect and report it.',
    hi: 'OTP किसी के साथ साझा न करें — चाहे वह बैंक, डिलीवरी कंपनी या पुलिस का दावा करने वाला ही क्यों न हो। कोई असली संस्था OTP नहीं माँगती। OTP माँगना ही धोखे की निशानी है। कॉल/संदेश बंद करें और रिपोर्ट करें।',
  },
  {
    match: /apk|app(le|lication)? install|unknown app/i,
    en: 'Do not install apps from links in messages — only from the official Play Store / App Store. Unknown APKs can read your SMS (stealing OTPs), overlay fake screens on banking apps and steal contacts. In this prototype, open the APK Scanner to see simulated analysis of a suspicious app sample.',
    hi: 'संदेशों में आए लिंक से ऐप इंस्टॉल न करें — केवल आधिकारिक Play Store / App Store से इंस्टॉल करें। अनजान APK आपके SMS पढ़ सकते हैं (OTP चुरा सकते हैं), बैंकिंग ऐप पर नकली स्क्रीन दिखा सकते हैं और संपर्क चुरा सकते हैं। इस प्रोटोटाइप में APK Scanner खोलकर नमूना विश्लेषण देखें।',
  },
  {
    match: /upi|payment|paytm|phonepe|gpay|vpa/i,
    en: 'Before paying over UPI, always verify the payee NAME shown in the app — not just the number. Fraudsters use names that look official. Never scan QR codes sent by strangers "to receive money" — scanning a QR and entering PIN sends money AWAY from you. If you paid a fraudster, call 1930 immediately.',
    hi: 'UPI से भुगतान से पहले हमेशा ऐप में दिख रहा प्राप्तकर्ता का नाम जाँचें — केवल नंबर नहीं। ठग आधिकारिक जैसे नाम इस्तेमाल करते हैं। अजनबियों के भेजे QR को "पैसा लेने के लिए" स्कैन न करें — QR स्कैन कर PIN डालने से पैसा आपसे दूर चला जाता है। ठग से भुगतान हुआ हो तो तुरंत 1930 पर कॉल करें।',
  },
  {
    match: /risk|score|analysis result/i,
    en: 'The risk score (0–100) comes from an explainable rule engine: each detected indicator (KYC threats, OTP requests, urgency, URLs, UPI IDs…) adds a fixed weight. The same input always gives the same score — nothing is random. HIGH means strong fraud patterns; MEDIUM means verify carefully; LOW means no strong indicators were found. It is a prototype assessment, not a forensic conclusion.',
    hi: 'जोखिम स्कोर (0–100) एक स्पष्ट नियम इंजन से आता है: प्रत्येक पहचाना गया संकेत (KYC धमकी, OTP माँग, जल्दबाज़ी, URL, UPI आईडी…) एक निश्चित वेट जोड़ता है। वही इनपुट हमेशा वही स्कोर देता है — कुछ भी यादृच्छिक नहीं। HIGH का अर्थ प्रबल धोखे के संकेत; MEDIUM का अर्थ सावधानी से जाँच; LOW का अर्थ प्रबल संकेत नहीं मिले। यह प्रोटोटाइप मूल्यांकन है, फोरेंसिक निष्कर्ष नहीं।',
  },
  {
    match: /scam dna|connected|correlation/i,
    en: 'Scam DNA compares the digital identifiers (phone numbers, UPI IDs, domains, emails, IPs) extracted from every complaint. When two cases share an identifier — for example the same UPI ID — the graph links them, showing investigators potentially connected fraud. Shared identifiers suggest relationships worth investigating; they do not prove ownership or guilt.',
    hi: 'स्कैम डीएनए हर शिकायत से निकाले गए डिजिटल पहचानकर्ताओं (फ़ोन, UPI आईडी, डोमेन, ईमेल, IP) की तुलना करता है। जब दो प्रकरणों में कोई पहचानकर्ता समान हो — जैसे वही UPI आईडी — तो ग्राफ़ उन्हें जोड़ता है, जिससे संभावित जुड़े धोखे दिखते हैं। समान पहचानकर्ता जाँच योग्य संबंध बताते हैं; स्वामित्व या अपराध सिद्ध नहीं करते।',
  },
];

const fallbackEn =
  "I'm TRACEY, your cyber safety assistant (prototype). I can explain phishing, fake KYC, OTP safety, APK risks, UPI safety, how risk scores work, and how to report fraud. Try one of the suggested questions below, or use the Message Checker for a detailed analysis.";

const fallbackHi =
  'मैं ट्रेसी हूँ, आपकी साइबर सुरक्षा सहायक (प्रोटोटाइप)। मैं फिशिंग, फर्ज़ी KYC, OTP सुरक्षा, APK जोखिम, UPI सुरक्षा, रिस्क स्कोर और रिपोर्टिंग समझा सकती हूँ। नीचे दिए सुझाए गए प्रश्न आज़माएँ, या विस्तृत विश्लेषण के लिए संदेश चेकर इस्तेमाल करें।';

export function getTraceyResponse(userText: string, hindi: boolean): string {
  const text = userText.trim();
  for (const a of answers) {
    if (a.match.test(text)) return hindi ? a.hi : a.en;
  }
  return hindi ? fallbackHi : fallbackEn;
}

export const suggestedQuestions = [
  { en: 'What is phishing?', hi: 'फिशिंग क्या है?' },
  { en: 'How do I identify a fake KYC message?', hi: 'फर्ज़ी KYC संदेश कैसे पहचानूँ?' },
  { en: 'Is this internship offer suspicious?', hi: 'क्या यह इंटर्नशिप ऑफर संदिग्ध है?' },
  { en: 'What should I do after clicking a suspicious link?', hi: 'संदिग्ध लिंक पर क्लिक करने के बाद क्या करूँ?' },
  { en: 'How do I report online financial fraud?', hi: 'ऑनलाइन वित्तीय धोखाधड़ी की रिपोर्ट कैसे करूँ?' },
];

export function buildEmptyChat(): ChatMessage[] {
  return [];
}
