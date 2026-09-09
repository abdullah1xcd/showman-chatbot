import React from 'react';
import { Scale, MapPin, Clock, CalendarCheck, HelpCircle, ArrowLeft } from 'lucide-react';
import { SuggestedPromptItem } from '../../types';

interface SuggestedPromptProps {
  prompt: SuggestedPromptItem;
  onClick: (promptText: string) => void;
  disabled?: boolean;
}

export const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({
  prompt,
  onClick,
  disabled = false
}) => {
  const getIcon = () => {
    switch (prompt.iconName) {
      case 'scale':
        return <Scale className="w-4 h-4 text-[#c5a059]" />;
      case 'map-pin':
        return <MapPin className="w-4 h-4 text-[#c5a059]" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-[#c5a059]" />;
      case 'file-text':
        return <CalendarCheck className="w-4 h-4 text-[#c5a059]" />;
      case 'help-circle':
      default:
        return <HelpCircle className="w-4 h-4 text-[#c5a059]" />;
    }
  };

  return (
    <button
      type="button"
      id={`prompt-${prompt.id}`}
      disabled={disabled}
      onClick={() => onClick(prompt.text)}
      className="group relative flex items-center justify-between gap-3 p-3 sm:p-3.5 text-right rounded-xl bg-[#161b22] hover:bg-[#1a212b] border border-white/[0.07] hover:border-white/[0.16] transition-all duration-150 text-[#c8d1db] hover:text-[#f0ede6] active:scale-[0.99] w-full"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="p-2 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs sm:text-[13.5px] font-medium leading-snug text-[#e6edf3] group-hover:text-[#ffffff]">
            {prompt.text}
          </span>
          {prompt.description && (
            <span className="text-[11px] text-[#7d8b99] group-hover:text-[#9da7b3] pt-0.5 leading-tight line-clamp-1">
              {prompt.description}
            </span>
          )}
        </div>
      </div>
      <div className="p-1 text-[#657180] group-hover:text-[#c5a059] transition-colors flex-shrink-0">
        <ArrowLeft className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};

