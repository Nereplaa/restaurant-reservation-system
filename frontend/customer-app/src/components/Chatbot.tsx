import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Generate a unique session ID for this browser session
const generateSessionId = () => `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;

// Default quick reply suggestions shown when chat opens
const DEFAULT_QUICK_REPLIES = [
  "Bu akşam için masa ayırtmak istiyorum",
  "Yarın akşam 4 kişilik masa arıyorum",
  "Sigara içilebilen alan var mı?"
];

// Context-aware quick replies based on last assistant message
const getContextQuickReplies = (lastMessage: string): string[] | null => {
  const lowerMessage = lastMessage.toLowerCase();

  // Yes/No questions
  if (lowerMessage.includes('sigara içmek istiyor') || lowerMessage.includes('sigara içiyor musunuz')) {
    return ["Evet, sigara içiyorum", "Hayır, sigara içmiyorum"];
  }
  if (lowerMessage.includes('cam kenarı') && (lowerMessage.includes('ister mi') || lowerMessage.includes('tercih eder mi'))) {
    return ["Cam kenarı olsun", "Cam kenarı olmasa da olur"];
  }
  if (lowerMessage.includes('vip oda') && (lowerMessage.includes('ister mi') || lowerMessage.includes('tercih eder mi'))) {
    return ["VIP oda istiyorum", "Normal masa yeterli"];
  }
  if (lowerMessage.includes('kutlama') || lowerMessage.includes('özel bir gün')) {
    return ["Evet, doğum günü kutlaması", "Hayır, özel bir durum yok"];
  }
  if (lowerMessage.includes('onaylıyor musunuz') || lowerMessage.includes('onay verir misiniz') || lowerMessage.includes('uygun mu')) {
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

  // Persist session ID across component re-renders (but not page reloads)
  const sessionIdRef = useRef<string>(generateSessionId());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update quick replies based on last assistant message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const contextReplies = getContextQuickReplies(lastMessage.content);
        if (contextReplies) {
          setQuickReplies(contextReplies);
        } else {
          setQuickReplies([]);
        }
      }
    }
  }, [messages]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    // Reset quick replies when opening
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
    setQuickReplies([]); // Clear quick replies while loading
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        message: trimmed,
        session_id: sessionIdRef.current
      });
      const reply: string = response.data.reply;
      const assistantMessage: Message = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, assistantMessage]);

      // Log if reservation was created
      if (response.data.action_executed && response.data.confirmation_number) {
        console.log(`Rezervasyon oluşturuldu: ${response.data.confirmation_number}`);
      }
    } catch (error) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Üzgünüm, şu an biraz yoğunuz. Lütfen biraz sonra tekrar deneyin.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window - Fixed to bottom-right corner */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200 ease-out origin-bottom-right ${isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
          }`}
        style={{
          width: '480px',
          maxWidth: 'calc(100vw - 48px)',
          height: '600px',
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <div className="text-lg font-semibold">Rezervasyon Asistanı</div>
              <div className="text-sm text-blue-100">
                Size yardımcı olmak için buradayım
              </div>
            </div>
          </div>
          <button
            onClick={toggleOpen}
            className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Sohbeti kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">👋</div>
              <div className="text-gray-700 text-lg font-medium mb-2">Merhaba!</div>
              <div className="text-gray-600 text-base leading-relaxed">
                Ben rezervasyon asistanınızım.<br />
                Masa ayırtmak için size yardımcı olabilirim.
              </div>
            </div>
          )}
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg mr-3 flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`px-5 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap text-base leading-relaxed ${m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-lg'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-lg shadow-sm'
                  }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg">
                🤖
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {quickReplies.length > 0 && !isLoading && (
          <div className="px-4 py-3 bg-gray-100 border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 text-sm bg-white border border-blue-200 text-blue-700 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm font-medium"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 px-4 py-4 bg-white flex items-center space-x-3 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı buraya yazın..."
            className="flex-1 px-5 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            aria-label="Gönder"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Bubble Button - Fixed to exact bottom-right corner */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl flex items-center justify-center hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
        aria-label="Rezervasyon asistanını aç"
      >
        <span className="text-3xl">🤖</span>
      </button>
    </>
  );
}

export default Chatbot;
