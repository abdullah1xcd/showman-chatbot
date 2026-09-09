import React, { useState } from 'react';
import { X, Calendar, Phone, MessageSquare, CheckCircle, MapPin } from 'lucide-react';
import { FIRM_DATA } from '../../data/firmData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialTopic = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(initialTopic || 'استشارة عامة');
  const [meetingType, setMeetingType] = useState<'office' | 'phone' | 'whatsapp'>('office');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setIsSubmitted(true);
  };

  const generateWhatsAppLink = () => {
    const meetingText =
      meetingType === 'office'
        ? 'حضور بمقر المكتب بمدينة نصر'
        : meetingType === 'phone'
        ? 'استشارة هاتفية'
        : 'استشارة عبر واتساب';

    const text = `طلب حجز استشارة قانونية - مكتب شومان للمحاماة:
الاسم: ${fullName}
رقم الهاتف: ${phone}
مجال الاستشارة: ${serviceType}
طريقة المقابلة: ${meetingText}
${notes ? `ملاحظات: ${notes}` : ''}`;

    return `https://wa.me/201066650075?text=${encodeURIComponent(text)}`;
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-2xl p-4 sm:p-6 text-right text-[#e6edf3]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <button
            type="button"
            onClick={handleReset}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-[#717e8e] hover:text-[#e6edf3] hover:bg-white/[0.05] transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h2 id="booking-modal-title" className="text-base sm:text-lg font-medium font-serif text-[#f0ede6]">
                حجز موعد استشارة قانونية
              </h2>
              <p className="text-[11px] text-[#8b97a5] font-sans">
                مكتب شومان للمحاماة • مدينة نصر، القاهرة
              </p>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          /* Confirmation View */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#c5a059]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-medium text-[#f0ede6] font-serif mb-1">
                تم تسجيل طلب الاستشارة بنجاح
              </h3>
              <p className="text-xs text-[#8b97a5] max-w-sm mx-auto leading-relaxed">
                شكراً لك يا أستاذ/ة <strong className="text-[#f0ede6]">{fullName}</strong>. سيتواصل معك فريق المكتب عبر الهاتف لتأكيد الموعد المناسب.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#25D366] font-medium text-xs sm:text-sm transition-colors min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span>إرسال تفاصيل الحجز فوراً عبر واتساب</span>
              </a>

              <a
                href="tel:01066650075"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#c8d1db] text-xs transition-colors border border-white/[0.06] min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                <span className="font-mono">اتصال مباشر: 01066650075</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-4 text-xs text-[#717e8e] hover:text-[#e6edf3] underline p-2"
            >
              العودة
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 pt-3.5 text-sm font-sans">
            {/* Full Name */}
            <div>
              <label htmlFor="booking-name" className="block text-xs font-medium text-[#8b97a5] mb-1.5">
                الاسم بالكامل <span className="text-[#c5a059]">*</span>
              </label>
              <input
                id="booking-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكريم..."
                className="w-full py-2.5 px-3 rounded-xl bg-[#0d1117] border border-white/[0.08] focus:border-white/[0.2] text-[#e6edf3] placeholder-[#556372] text-base sm:text-sm outline-none transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="booking-phone" className="block text-xs font-medium text-[#8b97a5] mb-1.5">
                رقم الهاتف / واتساب <span className="text-[#c5a059]">*</span>
              </label>
              <input
                id="booking-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01066650075"
                dir="ltr"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0d1117] border border-white/[0.08] focus:border-white/[0.2] text-[#e6edf3] placeholder-[#556372] text-base sm:text-sm outline-none transition-colors text-right"
              />
            </div>

            {/* Legal Area */}
            <div>
              <label htmlFor="booking-service" className="block text-xs font-medium text-[#8b97a5] mb-1.5">
                مجال القضية أو الاستشارة
              </label>
              <select
                id="booking-service"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0d1117] border border-white/[0.08] focus:border-white/[0.2] text-[#e6edf3] text-base sm:text-sm outline-none transition-colors"
              >
                {FIRM_DATA.services.map((srv) => (
                  <option key={srv} value={srv} className="bg-[#0d1117] text-white">
                    {srv}
                  </option>
                ))}
                <option value="استشارة عامة" className="bg-[#0d1117] text-white">
                  استشارة عامة أخرى
                </option>
              </select>
            </div>

            {/* Meeting Type */}
            <div>
              <span className="block text-xs font-medium text-[#8b97a5] mb-1.5">
                طريقة المقابلة المفضلة
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingType('office')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-xs transition-all min-h-[44px] ${
                    meetingType === 'office'
                      ? 'bg-white/[0.08] border-[#c5a059] text-[#ffffff] font-medium'
                      : 'bg-[#0d1117] border-white/[0.06] text-[#717e8e] hover:text-[#e6edf3]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 mb-1 text-[#c5a059]" />
                  <span className="text-[11px] sm:text-xs">بمقر المكتب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('phone')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-xs transition-all min-h-[44px] ${
                    meetingType === 'phone'
                      ? 'bg-white/[0.08] border-[#c5a059] text-[#ffffff] font-medium'
                      : 'bg-[#0d1117] border-white/[0.06] text-[#717e8e] hover:text-[#e6edf3]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 mb-1 text-[#c5a059]" />
                  <span className="text-[11px] sm:text-xs">اتصال هاتفي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('whatsapp')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-xs transition-all min-h-[44px] ${
                    meetingType === 'whatsapp'
                      ? 'bg-white/[0.08] border-[#c5a059] text-[#ffffff] font-medium'
                      : 'bg-[#0d1117] border-white/[0.06] text-[#717e8e] hover:text-[#e6edf3]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 mb-1 text-[#25D366]" />
                  <span className="text-[11px] sm:text-xs">عبر واتساب</span>
                </button>
              </div>
            </div>

            {/* Brief Notes */}
            <div>
              <label htmlFor="booking-notes" className="block text-xs font-medium text-[#8b97a5] mb-1.5">
                موجز الموضوع (اختياري)
              </label>
              <textarea
                id="booking-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تفاصيل موجزة لمساعدة المحامي في التحضير..."
                className="w-full py-2.5 px-3 rounded-xl bg-[#0d1117] border border-white/[0.08] focus:border-white/[0.2] text-[#e6edf3] placeholder-[#556372] text-base sm:text-sm outline-none transition-colors resize-none"
              />
            </div>

            {/* Legal Privilege Note */}
            <p className="text-[11px] text-[#5b6877] leading-relaxed">
              تخضع كافة البيانات للسرية المهنية وحصانة المحاماة طبقاً لقانون المحاماة المصري.
            </p>

            {/* Submit Button */}
            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#c5a059] hover:bg-[#d6b16b] text-[#0d1117] font-semibold text-xs sm:text-sm transition-colors active:scale-[0.99] min-h-[44px]"
              >
                تأكيد حجز الاستشارة
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8b97a5] text-xs transition-colors min-h-[44px]"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

