import React from 'react';

interface ShomanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const ShomanLogo: React.FC<ShomanLogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const imageSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-20 h-20 rounded-2xl'
  };

  const textSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-[15px] font-semibold',
    lg: 'text-lg font-bold',
    xl: 'text-2xl font-bold'
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none min-w-0">
      {/* Official Shoman Firm Logo Image */}
      <div
        className={`relative ${imageSizes[size]} overflow-hidden bg-[#161b22] border border-white/10 shadow-sm flex-shrink-0 transition-opacity hover:opacity-90`}
      >
        <img
          src="/logo.jpg"
          alt="شعار مكتب شومان للمحاماة والاستشارات القانونية"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-col text-right min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`text-[#f0ede6] ${textSizes[size]} font-serif tracking-tight truncate`}>
            مكتب شومان للمحاماة
          </span>
          <span className="hidden sm:inline-block text-[9.5px] sm:text-[10px] tracking-wider text-[#c5a059] uppercase font-sans font-medium px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] whitespace-nowrap flex-shrink-0">
            SHOMAN LAW
          </span>
        </div>
        {showSubtitle && (
          <span className="hidden md:inline text-[11px] text-[#8b97a5] tracking-normal font-sans truncate">
            الاستشارات القانونية والمحاماة • القاهرة
          </span>
        )}
      </div>
    </div>
  );
};
