import React, { useState } from 'react';
import { Copy, Check, FileText, Phone, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { Message, MessageAction } from '../../types';
import { isArabic } from '../../utils/text';

interface MessageBubbleProps {
  message: Message;
  onOpenBooking?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onOpenBooking }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAr = isArabic(message.content);
  const textDirection = isAr ? 'rtl' : 'ltr';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedTime = new Intl.DateTimeFormat('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  const handleActionClick = (action: MessageAction) => {
    if (action.actionType === 'call' && action.payload) {
      window.location.href = `tel:${action.payload}`;
    } else if (action.actionType === 'whatsapp') {
      window.open(action.payload || 'https://wa.me/201066650075', '_blank');
    } else if (action.actionType === 'location') {
      window.open(action.payload || 'https://maps.google.com/?q=مدينة+نصر+القاهرة', '_blank');
    } else if (action.actionType === 'book') {
      if (onOpenBooking) {
        onOpenBooking();
      }
    }
  };

  if (isUser) {
    return (
      <div
        id={`msg-${message.id}`}
        className="flex w-full justify-end my-2 sm:my-3 animate-in fade-in duration-200"
      >
        <div className="flex flex-col items-end max-w-[88%] sm:max-w-[80%] md:max-w-[72%]">
          {message.attachmentName && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 mb-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-[#c5a059] max-w-full truncate">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">مستند مرفق: {message.attachmentName}</span>
            </div>
          )}

          <div
            dir={textDirection}
            className={`py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-2xl bg-[#1c2430] text-[#f0ede6] border border-white/[0.08] text-[13.5px] sm:text-[14.5px] leading-relaxed shadow-xs break-words ${
              isAr ? 'text-right rounded-br-sm' : 'text-left rounded-bl-sm'
            }`}
          >
            {message.content}
          </div>
          <span className="text-[10px] text-[#637080] mt-1 px-1 font-sans">
            {formattedTime}
          </span>
        </div>
      </div>
    );
  }

  // AI Assistant Response
  return (
    <div
      id={`msg-${message.id}`}
      className="flex w-full items-start gap-2.5 sm:gap-3 my-3 sm:my-4 animate-in fade-in duration-200"
    >
      {/* Law Firm Avatar */}
      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-[#161b22] border border-white/10 mt-1 select-none shadow-xs">
        <img
          src="/logo.jpg"
          alt="شعار مكتب شومان"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-col flex-1 max-w-[94%] sm:max-w-[88%] md:max-w-[82%] text-right min-w-0">
        {/* Subtle Sender Header */}
        <div className="flex items-center justify-between mb-1 px-0.5">
          <span className="text-xs font-medium text-[#e6edf3]">
            مكتب شومان للمحاماة
          </span>
          <span className="text-[10px] sm:text-[10.5px] text-[#637080] font-sans">
            {formattedTime}
          </span>
        </div>

        {/* Message Body */}
        <div
          dir={textDirection}
          className={`py-3 px-3.5 sm:py-3.5 sm:px-4.5 rounded-2xl bg-[#161b22] border border-white/[0.07] text-[#d6dee7] text-[13.5px] sm:text-[14.5px] leading-relaxed shadow-xs ${
            isAr ? 'text-right' : 'text-left'
          }`}
        >
          <div className="whitespace-pre-wrap space-y-2 leading-relaxed break-words">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-[#c5a059] animate-pulse" />
            )}
          </div>
        </div>

        {/* Subtle Action Chips */}
        {message.actions && message.actions.length > 0 && !message.isStreaming && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
            {message.actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleActionClick(act)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.14] text-[#c8d1db] hover:text-[#ffffff] text-xs transition-colors min-h-[34px]"
              >
                {act.actionType === 'call' && <Phone className="w-3 h-3 text-[#c5a059] flex-shrink-0" />}
                {act.actionType === 'whatsapp' && <MessageSquare className="w-3 h-3 text-[#25D366] flex-shrink-0" />}
                {act.actionType === 'book' && <Calendar className="w-3 h-3 text-[#c5a059] flex-shrink-0" />}
                {act.actionType === 'location' && <MapPin className="w-3 h-3 text-[#c5a059] flex-shrink-0" />}
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Copy Action */}
        {!message.isStreaming && (
          <div className="flex items-center gap-2 mt-1 px-1">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] text-[#717e8e] hover:text-[#c8d1db] transition-colors py-1 px-1.5 rounded min-h-[28px]"
              title="نسخ النص"
              aria-label="نسخ النص"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>نسخ</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

