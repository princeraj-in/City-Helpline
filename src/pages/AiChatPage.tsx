import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, ShieldAlert, ArrowRight, RotateCcw, 
  Building2, Utensils, BookOpen, Calculator, HeartHandshake, ShoppingBag, 
  MapPin, CheckCircle2, PhoneCall, Mic, MicOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendChatMessage, ChatMessage } from '../services/aiChatService';
import { AiMessageRenderer } from '../components/ai/AiMessageRenderer';
import { SEOHead } from '../components/common/SEOHead';

const TOPIC_SHORTCUTS = [
  {
    icon: Building2,
    title: 'Kota PGs & Hostels',
    prompt: 'Kota me Allen aur PW ke paas budget single/double room PG batao with food options.',
    badge: 'Popular',
  },
  {
    icon: Building2,
    title: 'Patna Student Rooms',
    prompt: 'Patna Boring Road aur Kankarbagh me PGs ka average rent aur library facility kaisa hai?',
    badge: 'Trending',
  },
  {
    icon: ShieldAlert,
    title: 'Anti-Scam & Token Rules',
    prompt: 'Owner bol raha hai ₹2000 advance token do tab room dekhne milega, dedu kya?',
    badge: 'Security',
  },
  {
    icon: Calculator,
    title: 'Monthly Student Budget',
    prompt: 'Tier-2 coaching hubs me ek student ka mahine ka total kharcha kitna hota hai?',
    badge: 'Finance',
  },
  {
    icon: Utensils,
    title: 'Mess & Food Hygiene',
    prompt: 'Hostel mess choose karte waqt food hygiene aur RO water me kya check karein?',
    badge: 'Daily Life',
  },
  {
    icon: BookOpen,
    title: 'Quiet AC Libraries',
    prompt: 'Self-study ke liye shift-wise AC library membership ke average charges kya hote hain?',
    badge: 'Study',
  },
  {
    icon: ShoppingBag,
    title: '2nd-Hand Books & Cooler',
    prompt: 'Studolink marketplace par second-hand cooler aur coaching modules kaise milenge?',
    badge: 'Save Money',
  },
  {
    icon: HeartHandshake,
    title: 'Exam Stress & Tele-MANAS',
    prompt: 'Exam tension aur pressure me concentrate nahi ho raha, kya karu?',
    badge: 'Wellness',
  },
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'init-msg',
        role: 'model',
        text: `Namaste! Main **Studolink AI Mitra** hu. 🎓\n\nMain desh bhar ke coaching hubs (Kota, Patna, Delhi NCR, Sikar, Prayagraj, Indore) me students ki accommodation, monthly budget, safe room booking, aur coaching guide me help karta hu.\n\nAap mujhse kisi bhi sawal ka jawab le sakte hain. Niche diye gaye topics par click karein ya apna sawal type karein!`,
        timestamp: Date.now(),
        suggestions: [
          'Kota me Allen ke paas best PGs?',
          'Patna Boring Road room rent rates?',
          'Online advance token dena chahiye ya nahi?',
          'Ek student ka mahine ka average budget kitna hota hai?',
        ],
      },
    ];
  });

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
      recognition.lang = 'hi-IN'; // Supports Hindi, Hinglish and Indian English
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, typingMsgId]);

  // Sync title and SEO
  useEffect(() => {
    document.title = 'AI Mitra - 24/7 Student Advisor | Studolink';
  }, []);

  // Cleanup typewriter interval on unmount
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

    // If currently typing, finish previous text instantly
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

      // Create initial AI placeholder message
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

      // Start typewriter streaming animation
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
        text: 'Maaf kijiye, server se connect karne me dikkat hui. Kripya dobara poochhein.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleReset = () => {
    stopCurrentTyping();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Chat reset ho gaya hai! Bataiye, aaj aap kis educational hub ya topic ke baare me janna chahte hain?`,
        timestamp: Date.now(),
        suggestions: [
          'Kota me best PGs under ₹7,000?',
          'Patna Boring Road room rent rates?',
          'Online advance token dena chahiye ya nahi?',
          'Student monthly budget kitna hota hai?',
        ],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <div className="max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#141A2E] via-[#0E1322] to-[#141A2E] border border-white/10 p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8A2BE2]/20 to-[#00E5FF]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8A2BE2] to-[#00E5FF] p-0.5 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-7 h-7 text-[#00E5FF]" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B0F19]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Studolink AI Mitra
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8A2BE2]/30 text-[#00E5FF] border border-[#00E5FF]/30">
                    24/7 Student Guide
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">
                  AI-powered advisor for PGs, hostels, monthly budget, anti-fraud tips & city guides
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8A2BE2] to-[#00E5FF] text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Browse PGs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Anti-Scam Alert Banner */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-3.5 flex items-center justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Student Safety Rule:</strong> Kisi bhi owner ko room bina physically dekhe online advance token money na transfer karein!
            </span>
          </div>
          <button
            onClick={() => navigate('/safety')}
            className="hidden sm:inline-flex items-center gap-1 text-[#00E5FF] hover:underline font-semibold flex-shrink-0"
          >
            <span>Safety Advisory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Main Grid: Sidebar Topics + Chat Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Curated Student Topics */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl bg-[#0E1322] border border-white/10 p-4">
              <h2 className="text-sm font-black text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span>Popular Student Queries</span>
              </h2>

              <div className="space-y-2">
                {TOPIC_SHORTCUTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(item.prompt)}
                      className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-[#8A2BE2]/15 border border-white/5 hover:border-[#00E5FF]/40 transition-all group flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-black/40 text-[#00E5FF] group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-xs font-bold text-gray-200 group-hover:text-white truncate">
                            {item.title}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-medium">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Helpline Emergency Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1A1333] to-[#0E1322] border border-[#8A2BE2]/30 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF] mb-2">
                <PhoneCall className="w-4 h-4" />
                <span>24/7 Government Student Helplines</span>
              </div>
              <ul className="text-xs text-gray-300 space-y-1.5">
                <li className="flex items-center justify-between">
                  <span>Tele-MANAS (Mental Health):</span>
                  <strong className="text-emerald-400">14416 (Toll-Free)</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>National Emergency:</span>
                  <strong className="text-amber-400">112</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Studolink Support:</span>
                  <span className="text-gray-400">support@imprince.me</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel: Chat Thread & Input */}
          <div className="lg:col-span-8 flex flex-col h-[700px] rounded-2xl bg-[#0E1322] border border-white/10 overflow-hidden shadow-2xl">
            {/* Chat Messages Viewport */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#8A2BE2] to-[#6B11FF] text-white font-medium rounded-br-none'
                        : 'bg-[#151B2E] text-gray-200 border border-white/10 rounded-bl-none text-sm'
                    }`}
                  >
                    <AiMessageRenderer
                      content={msg.text}
                      role={msg.role}
                      actionLink={msg.actionLink}
                      isTyping={typingMsgId === msg.id}
                      onSkipTyping={stopCurrentTyping}
                    />
                  </div>

                  {/* Suggestion Chips (show after typing completes) */}
                  {msg.suggestions && msg.suggestions.length > 0 && typingMsgId !== msg.id && (
                    <div className="mt-2.5 flex flex-wrap gap-2 max-w-[90%] animate-in fade-in duration-300">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#8A2BE2]/20 border border-white/10 hover:border-[#00E5FF]/40 text-xs text-gray-300 hover:text-[#00E5FF] transition-all text-left active:scale-95 shadow-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Natural Typing Indicator while waiting for AI */}
              {loading && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#151B2E] border border-white/10 w-fit max-w-[85%] shadow-lg animate-in fade-in duration-300">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#00E5FF] p-0.5 shrink-0 shadow-md">
                    <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B0F19]" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-200">AI Mitra</span>
                      <span className="text-[10px] text-gray-400">writing response...</span>
                    </div>

                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2] animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(138,43,226,0.8)]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-bounce shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#0B0F19] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2.5"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isListening ? "Listening... Speak in Hindi or English..." : "Type or speak (e.g., 'Kota me Allen ke paas room rates?')..."}
                    disabled={loading}
                    className={`w-full bg-[#151B2E] text-white text-sm pl-4 pr-11 py-3 rounded-xl border transition-all placeholder-gray-500 focus:outline-none ${
                      isListening 
                        ? 'border-red-500/80 ring-2 ring-red-500/30' 
                        : 'border-white/10 focus:border-[#00E5FF]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Speak your query (Hindi/English)"}
                    className={`absolute right-2 p-2 rounded-lg transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                        : 'text-gray-400 hover:text-[#00E5FF] hover:bg-white/5'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#8A2BE2] to-[#00E5FF] text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-1.5 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 px-1">
                <span>Direct link: <code className="text-[#00E5FF]">studolink.imprince.me/chat</code></span>
                <span>Zero Brokerage Student Guide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
