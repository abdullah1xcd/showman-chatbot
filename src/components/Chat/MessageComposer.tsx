import React, { useState, useRef, KeyboardEvent } from 'react';
import { ArrowUp, Loader2, Paperclip, X, FileText } from 'lucide-react';
import { useAutoResizeTextarea } from '../../hooks/useAutoResizeTextarea';
import { getTextDirection } from '../../utils/text';
import { Disclaimer } from '../UI/Disclaimer';

interface MessageComposerProps {
  onSendMessage: (content: string, attachmentName?: string) => void;
  isLoading: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  isLoading
}) => {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useAutoResizeTextarea(input, 150);

  const direction = getTextDirection(input);
  const trimmed = input.trim();
  const canSend = (trimmed.length > 0 || !!attachedFile) && !isLoading;

  const handleSubmit = () => {
    if (!canSend) return;
    onSendMessage(trimmed, attachedFile || undefined);
    setInput('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
    e.target.value = '';
  };

  return (
    <div
      id="message-composer-wrapper"
      className="w-full bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 sm:px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* Hidden native file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />

        {/* Attached Document Preview Badge */}
        {attachedFile && (
          <div className="mb-2 inline-flex items-center gap-2 py-1 px-3 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-[#e6edf3] animate-in fade-in duration-150">
            <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-sans truncate max-w-[200px] sm:max-w-xs">مستند مرفق: {attachedFile}</span>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="p-1 rounded text-[#717e8e] hover:text-white transition-colors"
              title="إزالة المرفق"
              aria-label="إزالة المرفق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Container */}
        <div className="relative flex items-end gap-1.5 sm:gap-2 rounded-2xl bg-[#161b22] border border-white/[0.08] focus-within:border-white/[0.2] transition-colors p-1.5 sm:p-2 shadow-sm">
          {/* Document Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 rounded-xl text-[#717e8e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors flex-shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center"
            title="إرفاق مستند (PDF / عقد)"
            aria-label="إرفاق مستند"
          >
            <Paperclip className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Text Area - Uses text-base (16px) on mobile to prevent iOS Safari auto-zoom */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            dir={direction}
            placeholder="اكتب استفسارك القانوني..."
            aria-label="رسالة الاستفسار القانوني"
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-2 py-2 text-base text-[#e6edf3] placeholder-[#556372] focus:outline-none leading-relaxed max-h-[140px] sm:max-h-[160px] min-h-[42px]"
          />

          {/* Send Button */}
          <div className="flex-shrink-0 mb-0.5 ml-0.5">
            <button
              type="button"
              id="send-message-btn"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="إرسال الرسالة"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                canSend
                  ? 'bg-[#c5a059] text-[#0d1117] hover:bg-[#d6b16b] active:scale-95 shadow-xs font-semibold'
                  : 'bg-white/[0.04] text-[#4d5966] cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0d1117]" />
              ) : (
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
              )}
            </button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
};

