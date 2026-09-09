import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div
      id="typing-indicator"
      className="flex flex-col items-start gap-1 py-3 px-4 rounded-2xl bg-[#0c2233] border border-[#cfa23b]/30 text-[#cfa23b] w-fit max-w-[200px] shadow-sm animate-in fade-in duration-200"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold tracking-wider text-[#d8ab42] uppercase">
        <span>SHOMAN AI</span>
      </div>
      <div className="flex items-center gap-1.5 py-1 px-0.5">
        <span className="w-2 h-2 rounded-full bg-[#cfa23b] animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 rounded-full bg-[#cfa23b] animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-[#cfa23b] animate-bounce"></span>
      </div>
    </div>
  );
};
