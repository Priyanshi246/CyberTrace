import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTraceyResponse, suggestedQuestions } from '@/lib/tracey';
import type { ChatMessage } from '@/lib/types';

export function TraceyWidget() {
  const { lang } = useApp();
  const hindi = lang === 'hi';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getTraceyResponse(trimmed, hindi);
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }, { role: 'tracey', text: reply }]);
    setInput('');
  };

  const greeting: ChatMessage = {
    role: 'tracey',
    text: hindi
      ? 'नमस्ते! मैं ट्रेसी हूँ, आपकी साइबर सुरक्षा सहायक (प्रोटोटाइप)। फिशिंग, फर्ज़ी KYC या रिपोर्टिंग के बारे में पूछें।'
      : 'Hello! I am TRACEY, your Cyber Safety Assistant (prototype). Ask me about phishing, fake KYC, suspicious links, or reporting fraud.',
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-navy-deep text-white pl-4 pr-5 py-3 shadow-deep hover:bg-navy transition-all hover:scale-105"
        aria-label="Open TRACEY AI"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan" />
        </span>
        <Bot size={20} />
        <span className="font-display font-semibold text-sm hidden sm:inline">TRACEY AI</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-5 z-40 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] bg-white rounded-2xl shadow-deep border border-slate-100 flex flex-col overflow-hidden animate-fade-up">
          <div className="bg-navy-deep text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-royal/30 border border-accent-cyan/40 flex items-center justify-center">
                <Bot size={18} className="text-accent-cyan" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">TRACEY AI</p>
                <p className="text-[11px] text-slate-300">Your Cyber Safety Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[350px] bg-ice/50">
            {[greeting, ...messages].map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-royal text-white rounded-br-sm'
                      : 'bg-white border border-slate-100 text-navy-deep shadow-sm rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 0 && (
            <div className="px-4 pb-2 pt-1 bg-ice/50">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <Sparkles size={12} className="text-royal" /> {hindi ? 'सुझाए गए प्रश्न' : 'Suggested questions'}
              </p>
              <div className="flex flex-wrap gap-1.5 pb-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q.en}
                    onClick={() => send(hindi ? q.hi : q.en)}
                    className="text-[11px] rounded-full border border-royal/30 text-royal bg-white px-2.5 py-1 hover:bg-royal hover:text-white transition"
                  >
                    {hindi ? q.hi : q.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder={hindi ? 'अपना प्रश्न लिखें…' : 'Type your question…'}
              className="input flex-1 !py-2 text-[13px]"
            />
            <button
              onClick={() => send(input)}
              className="btn-primary !px-3.5 !py-2"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="bg-slate-50 text-center text-[10px] text-slate-400 py-1.5 px-3">
            Structured local response system — no live LLM connected.
          </p>
        </div>
      )}
    </>
  );
}
