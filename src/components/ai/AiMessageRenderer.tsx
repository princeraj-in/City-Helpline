import React, { useState } from 'react';
import { 
  ShieldAlert, PhoneCall, Copy, Check, ExternalLink, 
  MapPin, Sparkles, Building2, Utensils, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AiMessageRendererProps {
  content: string;
  role: 'user' | 'model';
  actionLink?: {
    text: string;
    url: string;
  };
  onCloseParent?: () => void;
  isTyping?: boolean;
  onSkipTyping?: () => void;
}

export const AiMessageRenderer: React.FC<AiMessageRendererProps> = ({
  content,
  role,
  actionLink,
  onCloseParent,
  isTyping = false,
  onSkipTyping,
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (role === 'user') {
    return (
      <div className="text-sm font-medium leading-relaxed text-white">
        {content}
      </div>
    );
  }

  // Parse inline markdown bold, prices, and links
  const renderInlineFormatted = (text: string) => {
    // Regex for bold **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);

        // Highlight price ranges like ₹4,000 – ₹6,500
        if (/₹\s*[\d,]+/.test(inner)) {
          return (
            <span
              key={idx}
              className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mx-0.5"
            >
              {inner}
            </span>
          );
        }

        return (
          <strong key={idx} className="font-extrabold text-[#00E5FF]">
            {inner}
          </strong>
        );
      }

      // Check for standalone price tags outside bold
      const subParts = part.split(/(₹\s*[\d,]+(?:\s*[-–]\s*₹\s*[\d,]+)?(?:\s*\/\s*(?:month|mo|unit|student))?)/gi);
      if (subParts.length > 1) {
        return (
          <span key={idx}>
            {subParts.map((sub, sIdx) => {
              if (/₹\s*[\d,]+/.test(sub)) {
                return (
                  <span
                    key={sIdx}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mx-0.5"
                  >
                    {sub}
                  </span>
                );
              }
              return sub;
            })}
          </span>
        );
      }

      return part;
    });
  };

  // Split lines and structure into smart cards
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${keyPrefix}`} className="space-y-1.5 my-2 pl-1">
          {currentList.map((item, lIdx) => (
            <li key={lIdx} className="flex items-start gap-2 text-gray-200 text-xs sm:text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-2 shrink-0 shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
              <div className="flex-1 leading-relaxed">
                {renderInlineFormatted(item)}
              </div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // Check for Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      flushList(index);
      renderedElements.push(
        <div key={`hr-${index}`} className="my-2.5 border-t border-white/10" />
      );
      return;
    }

    // Check for Scam / Warning Alert blocks
    if (trimmed.startsWith('⚠️') || trimmed.toLowerCase().includes('dhoke se bacho') || trimmed.toLowerCase().includes('anti-scam')) {
      flushList(index);
      renderedElements.push(
        <div
          key={`alert-${index}`}
          className="my-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-200 text-xs sm:text-sm shadow-sm"
        >
          <div className="flex items-center gap-2 font-black text-amber-300 mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{renderInlineFormatted(trimmed.replace(/^⚠️\s*/, ''))}</span>
          </div>
        </div>
      );
      return;
    }

    // Check for Tele-MANAS / Mental Wellness blocks
    if (trimmed.includes('14416') || trimmed.includes('Tele-MANAS')) {
      flushList(index);
      renderedElements.push(
        <div
          key={`helpline-${index}`}
          className="my-2.5 p-3 rounded-xl bg-gradient-to-r from-[#8A2BE2]/20 via-[#6B11FF]/10 to-transparent border border-[#8A2BE2]/40 text-purple-200 text-xs sm:text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <PhoneCall className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span>{renderInlineFormatted(trimmed)}</span>
            </div>
            <a
              href="tel:14416"
              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
            >
              Call 14416
            </a>
          </div>
        </div>
      );
      return;
    }

    // Check for Headings: ### or ## or bold heading **Heading:**
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      flushList(index);
      const cleanTitle = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <div
          key={`h-${index}`}
          className="mt-3.5 mb-1.5 flex items-center gap-2 font-black text-white text-xs sm:text-sm tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="text-white border-b border-[#00E5FF]/40 pb-0.5">
            {renderInlineFormatted(cleanTitle)}
          </span>
        </div>
      );
      return;
    }

    // Check for Area guides (e.g. 📍 Area)
    if (trimmed.startsWith('📍') || trimmed.startsWith('🏢') || trimmed.startsWith('🍱')) {
      flushList(index);
      renderedElements.push(
        <div
          key={`hub-${index}`}
          className="mt-3 mb-1.5 p-2 rounded-lg bg-white/5 border border-white/10 font-bold text-xs sm:text-sm text-white flex items-center gap-2"
        >
          <span className="text-base">{trimmed.slice(0, 2)}</span>
          <span className="text-[#00E5FF]">{renderInlineFormatted(trimmed.slice(2).trim())}</span>
        </div>
      );
      return;
    }

    // Check for bullet list item: * or -
    if (/^[\*\-]\s+/.test(trimmed)) {
      currentList.push(trimmed.replace(/^[\*\-]\s+/, ''));
      return;
    }

    // Check for numbered list: 1. 2.
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList(index);
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch && numMatch[1]) {
        renderedElements.push(
          <div key={`num-${index}`} className="flex items-start gap-2 my-1.5 text-xs sm:text-sm text-gray-200">
            <span className="w-5 h-5 rounded-full bg-[#8A2BE2]/30 border border-[#00E5FF]/40 text-[#00E5FF] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <div className="flex-1 leading-relaxed">
              {renderInlineFormatted(numMatch[2] || '')}
            </div>
          </div>
        );
        return;
      }
    }

    // Normal paragraph
    flushList(index);
    renderedElements.push(
      <p key={`p-${index}`} className="my-1.5 text-xs sm:text-sm text-gray-200 leading-relaxed">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return (
    <div className="relative group">
      {/* Formatted Content */}
      <div className="space-y-1">
        {renderedElements}
        {isTyping && (
          <span
            className="inline-block w-2 h-4 ml-1.5 bg-[#00E5FF] animate-pulse rounded-[1px] shadow-[0_0_10px_rgba(0,229,255,1)] align-middle"
            title="Typing..."
          />
        )}
      </div>

      {/* Action Link Button if provided */}
      {!isTyping && actionLink && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (onCloseParent) onCloseParent();
              navigate(actionLink.url);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#8A2BE2] text-black font-extrabold text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(0,229,255,0.4)]"
          >
            <span>{actionLink.text}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer Controls: Skip while typing, or Copy & WhatsApp when completed */}
      <div className="mt-2.5 flex items-center justify-between min-h-[22px]">
        {isTyping ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#00E5FF] font-semibold flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              AI Mitra is typing...
            </span>
            {onSkipTyping && (
              <button
                onClick={onSkipTyping}
                className="text-[10px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded transition-all font-medium"
              >
                Skip ⏭️
              </button>
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-between">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*Studolink Student Guide - AI Mitra:*\n\n${content}\n\n📍 Check more on: https://app.imprince.me/chat`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors py-0.5 px-1.5 rounded hover:bg-emerald-500/10"
              title="Share with Parents or Friends on WhatsApp"
            >
              <span>📲 Share on WhatsApp</span>
            </a>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#00E5FF] transition-colors py-0.5 px-1.5 rounded hover:bg-white/5"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
