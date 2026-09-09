import React from 'react';
import { SUGGESTED_PROMPTS, FIRM_DATA } from '../../data/firmData';
import { SuggestedPrompt } from './SuggestedPrompt';
import { Calendar, Phone, MessageSquare } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
  onOpenBooking?: () => void;
  isLoading?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPrompt,
  onOpenBooking,
  isLoading = false
}) => {
  // Select 4 most prominent, varied prompts
  const featuredPrompts = SUGGESTED_PROMPTS.slice(0, 4);

  return (
    <div
      id="welcome-screen"
      className="flex flex-col items-center justify-center text-center px-3 sm:px-4 max-w-3xl mx-auto py-4 sm:py-8 md:py-10 animate-in fade-in duration-300 w-full"
    >
      {/* Official Law Firm Crest */}
      <div className="relative mb-3 sm:mb-4 select-none">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-[#161b22] border border-white/10 shadow-lg mx-auto">
          <img
            src="/logo.jpg"
            alt="شعار مكتب شومان للمحاماة والاستشارات القانونية"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Firm Name & Tagline */}
      <div className="mb-2 sm:mb-3 select-none">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede6] font-serif mb-1">
          {FIRM_DATA.nameAr}
        </h1>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#c5a059] font-sans font-medium">
          SHOMAN LAW FIRM • CAIRO
        </p>
      </div>

      <p className="text-xs sm:text-sm md:text-[15px] text-[#9da7b3] font-normal leading-relaxed max-w-xl mb-5 sm:mb-7 px-2">
        مرحباً بك في المساعد الرقمي لمكتب شومان للمحاماة. يمكنك الاستفسار عن مجالات التخصص القضائي، حجز موعد مقابلة، أو طلب توجيه قانوني أولي.
      </p>

      {/* Direct Quick Concierge Links */}
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 mb-6 sm:mb-8 select-none w-full max-w-md sm:max-w-none">
        {onOpenBooking && (
          <button
            type="button"
            onClick={onOpenBooking}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] sm:text-xs text-[#e6edf3] transition-colors min-h-[40px]"
          >
            <Calendar className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
            <span className="truncate">حجز موعد</span>
          </button>
        )}

        <a
          href="https://wa.me/201066650075"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] sm:text-xs text-[#e6edf3] transition-colors min-h-[40px]"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
          <span className="truncate">واتساب</span>
        </a>

        <a
          href="tel:01066650075"
          dir="ltr"
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] sm:text-xs text-[#e6edf3] transition-colors font-mono min-h-[40px]"
        >
          <Phone className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
          <span className="truncate">اتصال</span>
        </a>
      </div>

      {/* Restrained Inquiries List */}
      <div className="w-full">
        <div className="text-[11px] sm:text-xs text-[#6e7b8c] font-medium mb-2.5 text-right pr-1">
          استفسارات شائعة:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-right">
          {featuredPrompts.map((prompt) => (
            <SuggestedPrompt
              key={prompt.id}
              prompt={prompt}
              onClick={onSelectPrompt}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Calm, Dignified Legal Accreditation Line */}
      <div className="mt-6 sm:mt-8 pt-3 border-t border-white/[0.05] text-center text-[10.5px] sm:text-[11px] text-[#5b6877] max-w-lg mx-auto space-y-1">
        <p>
          المقر: الحي السابع، مدينة نصر، القاهرة • قيد محاكم الاستئناف ومجلس الدولة
        </p>
        <p className="text-[9.5px] sm:text-[10px] text-[#4d5966]">
          الاستشارات الرقمية استرشادية وتخضع لسرية المهنة طبقاً لقانون المحاماة المصري
        </p>
      </div>
    </div>
  );
};

