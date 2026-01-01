import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const generateSessionId = () => `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;

const DEFAULT_QUICK_REPLIES = [
  "Bu akşam için masa ayırtmak istiyorum",
  "Yarın akşam 4 kişilik masa arıyorum",
  "Menü hakkında bilgi alabilir miyim?"
];

const getContextQuickReplies = (lastMessage: string): string[] | null => {
  const lowerMessage = lastMessage.toLowerCase();

  if (lowerMessage.includes('sigara içmek istiyor') || lowerMessage.includes('sigara içiyor musunuz')) {
    return ["Evet, sigara içiyorum", "Hayır, sigara içmiyorum"];
  }
  if (lowerMessage.includes('cam kenarı')) {
    return ["Cam kenarı olsun", "Cam kenarı olmasa da olur"];
  }
  if (lowerMessage.includes('vip oda')) {
    return ["VIP oda istiyorum", "Normal masa yeterli"];
  }
  if (lowerMessage.includes('onaylıyor musunuz') || lowerMessage.includes('onay verir misiniz')) {
    return ["Evet, onaylıyorum", "Hayır, değiştirmek istiyorum"];
  }

  return null;
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(DEFAULT_QUICK_REPLIES);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(generateSessionId());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const contextReplies = getContextQuickReplies(lastMessage.content);
        setQuickReplies(contextReplies || []);
      }
    }
  }, [messages]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && messages.length === 0) {
      setQuickReplies(DEFAULT_QUICK_REPLIES);
    }
  };

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setQuickReplies([]);
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        message: trimmed,
        session_id: sessionIdRef.current
      });
      const reply: string = response.data.reply;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Üzgünüm, şu an biraz yoğunuz. Lütfen biraz sonra tekrar deneyin.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Chat Window - Dark Theme */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex flex-col glass-dark border border-white/10 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        style={{
          width: '420px',
          maxWidth: 'calc(100vw - 48px)',
          height: '550px',
          maxHeight: 'calc(100vh - 140px)'
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0f1a2b] to-[#16233a] text-white flex items-center justify-between flex-shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <img src="/images/logo.png" alt="BORCELLE" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-playfair font-medium text-base">Rezervasyon Asistanı</div>
              <div className="text-xs text-white/60">BORCELLE Fine Dining</div>
            </div>
          </div>
          <button
            onClick={toggleOpen}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages - Dark Theme */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0f1a2b]/50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#cfd4dc]/20 to-[#cfd4dc]/5 border border-white/10 flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
              <div className="font-playfair text-white text-lg font-medium mb-2">Merhaba!</div>
              <div className="text-white/50 text-sm leading-relaxed">
                Masa rezervasyonu yapmak için<br />size yardımcı olabilirim.
              </div>
            </div>
          )}
          {messages.map((m, index) => (
            <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#cfd4dc]/20 to-[#cfd4dc]/5 border border-white/10 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                  🍽️
                </div>
              )}
              <div
                className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.role === 'user'
                  ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white rounded-br-md'
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-md'
                  }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#cfd4dc]/20 to-[#cfd4dc]/5 border border-white/10 flex items-center justify-center text-sm">
                🍽️
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies - Dark Theme */}
        {quickReplies.length > 0 && !isLoading && (
          <div className="px-4 py-3 bg-[#0f1a2b]/80 border-t border-white/10 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 text-xs bg-white/5 border border-white/20 text-white/80 rounded-full hover:bg-white/10 hover:border-white/30 transition-colors font-medium"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input - Dark Theme */}
        <div className="border-t border-white/10 px-4 py-3 bg-[#0f1a2b]/80 flex items-center gap-3 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2.5 text-sm border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white flex items-center justify-center hover:bg-[#cfd4dc]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            aria-label="Gönder"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Elegant Chat Button */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 z-50 group transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
        aria-label="Rezervasyon asistanını aç"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a2b] to-[#16233a] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />

          {/* Button */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f1a2b] to-[#16233a] text-white shadow-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
            <img src="/images/logo.png" alt="Chat" className="w-8 h-8 object-cover rounded-lg" />
          </div>

          {/* Indicator dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0f1a2b] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#0f1a2b] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Rezervasyon Asistanı
        </div>
      </button>
    </>
  );
}

export default Chatbot;
