import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Maximize2, ShieldAlert, RotateCcw, Mic, MicOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { sendChatMessage, ChatMessage } from '../../services/aiChatService';
import { AiMessageRenderer } from './AiMessageRenderer';

export const AiFloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [typingMsgId, setTypingMsgId] = useState<string | null>(null);
  const activeTypingRef = useRef<{
    intervalId: any;
    msgId: string;
    fullText: string;
  } | null>(null);

  const toggleListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      toast.info("Voice input is supported in Google Chrome, Edge, and Android browsers.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Namaste! Main **Studolink AI Mitra** hu. 🎓\n\nAap mujhse kisi bhi educational hub (Kota, Patna, Delhi, Sikar) ke PGs, student room rent, mess food quality, ya safe booking advisory ke baare me pooch sakte hain. Bataiye, main aapki kya madad kar sakta hu?`,
      timestamp: Date.now(),
      suggestions: [
        'Kota me best PGs under ₹7,000?',
        'Patna Boring Road room rates?',
        'Online advance token dena chahiye?',
        'Student monthly budget kitna hota hai?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Only show the floating assistant popup on the home page ('/')
  const isHomePage = location.pathname === '/';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto focus input on desktop
      if (window.innerWidth >= 640) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [messages, isOpen, loading, typingMsgId]);

  useEffect(() => {
    return () => {
      if (activeTypingRef.current) {
        clearInterval(activeTypingRef.current.intervalId);
      }
    };
  }, []);

  const stopCurrentTyping = () => {
    if (activeTypingRef.current) {
      clearInterval(activeTypingRef.current.intervalId);
      const { msgId, fullText } = activeTypingRef.current;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, text: fullText } : m))
      );
      activeTypingRef.current = null;
      setTypingMsgId(null);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    stopCurrentTyping();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await sendChatMessage(query, history);

      const aiMsgId = `ai-${Date.now()}`;
      const fullText = response.text;

      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now(),
        suggestions: response.suggestions,
        actionLink: response.actionLink,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
      setTypingMsgId(aiMsgId);

      let charIndex = 0;
      const stepChunk = Math.max(3, Math.ceil(fullText.length / 75));

      const intervalId = setInterval(() => {
        charIndex += stepChunk;
        if (charIndex >= fullText.length) {
          charIndex = fullText.length;
          clearInterval(intervalId);
          activeTypingRef.current = null;
          setTypingMsgId(null);
        }

        const currentSlice = fullText.slice(0, charIndex);
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: currentSlice } : m))
        );
        scrollToBottom();
      }, 18);

      activeTypingRef.current = {
        intervalId,
        msgId: aiMsgId,
        fullText,
      };
    } catch {
      setLoading(false);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'Maaf kijiye, server se connect hone me thodi dikkat hui. Kripya thodi der baad dobara koshish karein ya prompt select karein.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const resetChat = () => {
    stopCurrentTyping();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Chat reset ho gaya hai! Bataiye, aaj aap kis educational hub ke baare me janna chahte hain?`,
        timestamp: Date.now(),
        suggestions: [
          'Kota me best PGs under ₹7,000?',
          'Patna Boring Road room rates?',
          'Online advance token fraud check',
          'Calculate monthly budget',
        ],
      },
    ]);
  };

  if (!isHomePage) return null;

  return (
    <>
      {/* Floating Trigger Button - Premium Circle Design (No Text) */}
      {!isOpen && (
        <div className="fixed bottom-24 md:bottom-7 right-4 md:right-7 z-[60] group">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="AI Mitra Assistant"
            title="Ask AI Mitra"
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
          >
            {/* Outer animated rotating / breathing gradient aura */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#00E5FF] via-[#8A2BE2] to-[#F5B731] opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg animate-pulse transition duration-500 pointer-events-none" />

            {/* Premium Metallic Gradient Ring */}
            <span className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-tr from-[#00E5FF] via-[#8A2BE2] to-[#F5B731] shadow-[0_0_25px_rgba(0,229,255,0.4),0_0_15px_rgba(138,43,226,0.35)]">
              {/* Dark Glass Inner Circle */}
              <span className="relative flex items-center justify-center w-full h-full rounded-full bg-[#0B0F19]/90 backdrop-blur-xl border border-white/20 transition-all duration-300 group-hover:bg-[#121829]/95 overflow-hidden">
                {/* Subtle Inner Radial Glow */}
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,229,255,0.25),transparent_60%)] pointer-events-none" />
                
                {/* Central AI Bot Icon & Sparkle */}
                <div className="relative flex items-center justify-center">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-[#00E5FF] group-hover:scale-110 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                  <Sparkles className="w-3 h-3 text-[#F5B731] absolute -top-1 -right-1 animate-ping opacity-75 pointer-events-none" />
                  <Sparkles className="w-3 h-3 text-[#F5B731] absolute -top-1 -right-1 drop-shadow-[0_0_4px_rgba(245,183,49,0.9)]" />
                </div>
              </span>
            </span>

            {/* Online Live Status Dot */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" />
            </span>
          </button>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[75] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Chat Drawer / Popup Window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-0 sm:top-auto sm:inset-x-auto sm:bottom-7 sm:right-7 z-[80] w-full sm:w-[440px] h-full sm:h-[620px] max-h-screen sm:max-h-[calc(100vh-2rem)] flex flex-col sm:rounded-2xl bg-[#0B0F19] sm:border sm:border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(138,43,226,0.35)] overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#141A2E] via-[#101524] to-[#141A2E] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#00E5FF] p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B0F19]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-wide">AI Mitra</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A2BE2]/30 text-[#00E5FF] font-bold border border-[#00E5FF]/30">
                    Student Guide
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Zero-Brokerage & Education Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Reset Chat"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/chat');
                }}
                title="Open Dedicated Fullscreen Chat"
                className="p-2 rounded-lg text-gray-400 hover:text-[#00E5FF] hover:bg-white/5 active:scale-95 transition-all"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Safety Advisory Strip */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 flex items-center gap-2 text-[11px] text-amber-300 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span className="truncate font-medium">
              Bina physical room visit kiye online advance token transfer na karein!
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#8A2BE2] to-[#6B11FF] text-white font-medium rounded-br-none'
                      : 'bg-[#141A2D] border border-white/10 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <AiMessageRenderer
                    content={msg.text}
                    role={msg.role}
                    actionLink={msg.actionLink}
                    onCloseParent={() => setIsOpen(false)}
                    isTyping={typingMsgId === msg.id}
                    onSkipTyping={stopCurrentTyping}
                  />
                </div>

                {/* Suggested prompt chips below AI response (show after typing completes) */}
                {msg.suggestions && msg.suggestions.length > 0 && typingMsgId !== msg.id && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%] animate-in fade-in duration-300">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sug)}
                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#8A2BE2]/25 border border-white/10 hover:border-[#00E5FF]/50 text-[11px] font-medium text-gray-300 hover:text-[#00E5FF] transition-all text-left active:scale-95 shadow-sm"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Bouncing 3-dot typing indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#141A2D] border border-white/10 w-fit shadow-md animate-in fade-in duration-300">
                <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-[#0B0F19] border border-white/10 shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 py-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:-0.3s] shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
                  <span className="w-2 h-2 rounded-full bg-[#8A2BE2] animate-bounce [animation-delay:-0.15s] shadow-[0_0_6px_rgba(138,43,226,0.8)]" />
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area (Visible & Safe on Mobile) */}
          <div className="p-3 sm:p-3.5 bg-[#0A0E18] border-t border-white/10 shrink-0 pb-safe">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isListening ? "Listening... Speak now..." : "Ask about Kota, Patna, PGs, rent, food..."}
                  disabled={loading}
                  className={`w-full bg-[#151B2E] text-white text-xs sm:text-sm pl-3.5 pr-10 py-3 rounded-xl border transition-all placeholder-gray-500 focus:outline-none ${
                    isListening
                      ? 'border-red-500 ring-2 ring-red-500/30'
                      : 'border-white/15 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Stop listening" : "Speak query (Hindi/English)"}
                  className={`absolute right-1.5 p-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                      : 'text-gray-400 hover:text-[#00E5FF] hover:bg-white/5'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                aria-label="Send message"
                className="p-3 rounded-xl bg-gradient-to-r from-[#8A2BE2] to-[#00E5FF] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 px-1">
              <span>Hinglish & Hindi friendly 🇮🇳</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/chat');
                }}
                className="text-[#00E5FF] hover:underline font-bold"
              >
                Open fullscreen /chat &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
