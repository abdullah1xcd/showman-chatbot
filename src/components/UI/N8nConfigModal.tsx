import React, { useState, useEffect } from 'react';
import { X, Check, Globe, Zap, AlertCircle, Copy, ArrowRight } from 'lucide-react';
import { N8nMode, getN8nMode, setN8nMode, N8N_ENDPOINTS } from '../../services/n8n';

interface N8nConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModeChanged?: (newMode: N8nMode) => void;
}

export const N8nConfigModal: React.FC<N8nConfigModalProps> = ({
  isOpen,
  onClose,
  onModeChanged
}) => {
  const [currentMode, setCurrentMode] = useState<N8nMode>('test');
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentMode(getN8nMode());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectMode = (mode: N8nMode) => {
    setCurrentMode(mode);
    setN8nMode(mode);
    onModeChanged?.(mode);
  };

  const activeUrl = N8N_ENDPOINTS[currentMode];

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="n8n-config-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-2xl p-4 sm:p-6 text-right text-[#e6edf3]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-[#717e8e] hover:text-[#e6edf3] hover:bg-white/[0.05] transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 id="n8n-config-modal-title" className="text-base font-medium font-serif text-[#f0ede6]">
                إعدادات ربط n8n Webhook
              </h2>
              <p className="text-[11px] text-[#8b97a5]">
                ربط واجهة المحادثة بمساعد SHOMAN AI عبر n8n
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="my-4 space-y-3">
          <label className="block text-xs font-medium text-[#8b97a5]">
            اختر وضع الـ Webhook الحالي:
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Test Mode */}
            <button
              type="button"
              onClick={() => handleSelectMode('test')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                currentMode === 'test'
                  ? 'bg-amber-500/10 border-amber-500/40 text-[#ffffff]'
                  : 'bg-[#0d1117] border-white/[0.06] text-[#717e8e] hover:text-[#e6edf3]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-xs font-semibold text-[#f0ede6]">وضع التجربة (Test)</span>
              </div>
              <p className="text-[11px] text-[#8b97a5] leading-relaxed">
                /webhook-test/shoman-ai
              </p>
            </button>

            {/* Production Mode */}
            <button
              type="button"
              onClick={() => handleSelectMode('production')}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                currentMode === 'production'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-[#ffffff]'
                  : 'bg-[#0d1117] border-white/[0.06] text-[#717e8e] hover:text-[#e6edf3]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-semibold text-[#f0ede6]">وضع الإنتاج (Production)</span>
              </div>
              <p className="text-[11px] text-[#8b97a5] leading-relaxed">
                /webhook/shoman-ai
              </p>
            </button>
          </div>

          {/* Current URL Box */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8b97a5]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
                الرابط النشط حالياً:
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1 text-[11px] text-[#c5a059] hover:underline"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-xs text-[#c8d1db] break-all select-all py-1 px-2 rounded bg-white/[0.02]" dir="ltr">
              {activeUrl}
            </p>
          </div>

          {/* Contextual Notice */}
          {currentMode === 'test' ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>تنبيه هام لوضع الاختبار:</strong>
                <p className="mt-0.5 text-amber-200/80">
                  قبل إرسال الرسالة من الموقع، افتح n8n واضغط على زر <strong className="text-white">Execute Workflow</strong> أولاً حتى يستمع الـ Test Webhook للطلب.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>وضع الإنتاج المباشر:</strong>
                <p className="mt-0.5 text-emerald-200/80">
                  يتصل مباشرة بـ <code className="font-mono text-[11px] text-white">/webhook/shoman-ai</code> على مدار الساعة. تأكد من تفعيل الـ Workflow (زر Active في n8n).
                </p>
              </div>
            </div>
          )}

          {/* Payload Specification */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-white/[0.06] text-xs text-[#8b97a5] space-y-1">
            <div className="flex items-center justify-between">
              <span>هيكل الطلب (POST Body):</span>
              <span className="font-mono text-[10px] text-[#c5a059]">Content-Type: application/json</span>
            </div>
            <pre className="font-mono text-[11px] text-[#c8d1db] p-2 rounded bg-white/[0.02] overflow-x-auto" dir="ltr">
{`{
  "message": "استفسار العميل...",
  "language": "ar"
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-[#5b6877]">
            الحفظ يتم تلقائياً
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#c5a059] text-xs font-semibold text-[#0d1117] hover:bg-[#d6b16b] transition-colors"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
