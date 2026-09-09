import React from 'react';
import { RotateCcw, Info, Phone, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import { ShomanLogo } from '../UI/ShomanLogo';

interface ChatHeaderProps {
  onNewChat: () => void;
  hasMessages: boolean;
  onOpenFirmInfo?: () => void;
  onOpenBooking?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNewChat,
  hasMessages,
  onOpenFirmInfo,
  onOpenBooking
}) => {
  return (
    <header
      id="main-chat-header"
      className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0d1117]/95 border-b border-white/[0.08]"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Right (RTL): Law Firm Emblem & Title */}
        <div className="flex items-center min-w-0 flex-shrink">
          <ShomanLogo size="sm" showSubtitle />
        </div>

        {/* Left (RTL): Restrained, Classy Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Gemini AI Powered Badge */}
          <div
            id="gemini-status-badge"
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-white/[0.03] text-xs border border-white/[0.06] min-h-[38px]"
            title="متصل ومزود بنموذج الذكاء الاصطناعي Google Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-mono text-[11px] text-[#c8d1db] whitespace-nowrap hidden xs:inline">
              Gemini AI
            </span>
          </div>

          {/* Direct Phone Link (Tablet & Desktop) */}
          <a
            href="tel:01066650075"
            dir="ltr"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#8b97a5] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors min-h-[38px]"
            title="الاتصال المباشر بالمكتب"
          >
            <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-mono text-[11.5px]">01066650075</span>
          </a>

          {/* Direct WhatsApp Quick Link */}
          <a
            href="https://wa.me/201066650075"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-[#8b97a5] hover:text-[#25D366] hover:bg-white/[0.04] transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="محادثة واتساب مباشرة"
            aria-label="محادثة واتساب"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          {/* Firm Directory & Team Modal */}
          {onOpenFirmInfo && (
            <button
              type="button"
              id="firm-info-btn"
              onClick={onOpenFirmInfo}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs text-[#8b97a5] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors flex items-center gap-1.5 min-w-[38px] min-h-[38px] justify-center"
              title="بيانات المكتب وفريق المحامين"
              aria-label="بيانات مكتب شومان"
            >
              <Info className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden lg:inline font-sans">عن المكتب</span>
            </button>
          )}

          {/* Book Consultation Button */}
          {onOpenBooking && (
            <button
              type="button"
              id="book-consultation-btn"
              onClick={onOpenBooking}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b16b] text-[#0d1117] font-semibold text-xs transition-all shadow-xs active:scale-[0.98] min-h-[38px] whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="hidden xs:inline">حجز موعد</span>
              <span className="xs:hidden">حجز</span>
            </button>
          )}

          {/* New Chat Reset Button */}
          {hasMessages && (
            <button
              type="button"
              id="new-chat-btn"
              onClick={onNewChat}
              aria-label="بدء محادثة جديدة"
              className="p-2 rounded-lg text-[#8b97a5] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="بدء محادثة جديدة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

