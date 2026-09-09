import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="py-2 px-4 text-center select-none">
      <p className="text-[11px] text-[#5b6877] leading-relaxed max-w-2xl mx-auto font-sans">
        <span>المعلومات المقدمة استرشادية ولا تغني عن استشارة محامٍ مرخص.</span>
        <span className="hidden sm:inline mx-2 opacity-30">•</span>
        <span className="hidden sm:inline text-[10.5px] opacity-75 font-normal">
          Informational only and does not constitute formal legal counsel.
        </span>
      </p>
    </div>
  );
};

