import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, Clock, Scale, Users, Bot, FileText, Check, Copy } from 'lucide-react';
import { FIRM_DATA, FIRM_SYSTEM_INSTRUCTIONS } from '../../data/firmData';

interface FirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirmModal: React.FC<FirmModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'instructions'>('info');
  const [copiedInstructions, setCopiedInstructions] = useState(false);

  if (!isOpen) return null;

  const handleCopyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(FIRM_SYSTEM_INSTRUCTIONS);
      setCopiedInstructions(true);
      setTimeout(() => setCopiedInstructions(false), 2000);
    } catch {
      setCopiedInstructions(true);
      setTimeout(() => setCopiedInstructions(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="firm-modal-title"
    >
      <div className="relative w-full max-w-xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-2xl p-4 sm:p-6 text-right text-[#e6edf3]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-1.5 rounded-lg text-[#717e8e] hover:text-[#e6edf3] hover:bg-white/[0.05] transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h2 id="firm-modal-title" className="text-base sm:text-lg font-medium font-serif text-[#f0ede6]">
              {FIRM_DATA.nameAr}
            </h2>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0d1117] rounded-xl my-3 sm:my-4 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all min-h-[38px] ${
              activeTab === 'info'
                ? 'bg-white/[0.08] text-[#ffffff] shadow-xs'
                : 'text-[#717e8e] hover:text-[#e6edf3]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>بيانات المكتب</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all min-h-[38px] ${
              activeTab === 'instructions'
                ? 'bg-white/[0.08] text-[#ffffff] shadow-xs'
                : 'text-[#717e8e] hover:text-[#e6edf3]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>تعليمات المساعد الذكي</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 space-y-3.5 text-sm font-sans pr-0.5">
          {activeTab === 'info' ? (
            <>
              {/* Location */}
              <div className="flex items-start gap-3 bg-[#0d1117] p-3.5 rounded-xl border border-white/[0.06]">
                <MapPin className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8b97a5] mb-0.5">المقر الرئيسي</p>
                  <p className="text-[#e6edf3] leading-relaxed text-xs sm:text-sm">{FIRM_DATA.address}</p>
                </div>
              </div>

              {/* Contact Phones & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs text-[#8b97a5] mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>أرقام الهاتف</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {FIRM_DATA.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="block text-[#c8d1db] hover:text-[#c5a059] transition-colors"
                        dir="ltr"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs text-[#8b97a5] mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>البريد الإلكتروني</span>
                  </div>
                  <a
                    href={`mailto:${FIRM_DATA.email}`}
                    className="text-xs text-[#c8d1db] hover:text-[#c5a059] transition-colors block font-mono"
                    dir="ltr"
                  >
                    {FIRM_DATA.email}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-[#8b97a5] mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>مواعيد العمل</span>
                </div>
                <ul className="space-y-1 text-xs text-[#c8d1db]">
                  <li>• السبت إلى الخميس: 9:00 صباحاً إلى 6:00 مساءً</li>
                  <li>• الجمعة: عطلة أسبوعية</li>
                </ul>
              </div>

              {/* Key Practice Areas */}
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8b97a5] mb-2">
                  <Scale className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>مجالات التخصص</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FIRM_DATA.services.map((service) => (
                    <span
                      key={service}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[#0d1117] text-[#c8d1db] border border-white/[0.06]"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Leadership */}
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8b97a5] mb-2">
                  <Users className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>فريق العمل</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FIRM_DATA.team.map((member) => (
                    <div key={member.name} className="p-2.5 rounded-lg bg-[#0d1117] border border-white/[0.06] text-xs">
                      <span className="font-medium text-[#e6edf3] block">{member.name}</span>
                      <span className="text-[11px] text-[#717e8e]">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* System Instructions Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#0d1117] p-3 rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span className="text-xs text-[#c8d1db] font-medium">
                    تعليمات الـ AI Agent المعتمدة
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInstructions}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.09] text-[#c5a059] border border-white/[0.08] transition-colors"
                >
                  {copiedInstructions ? (
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

              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-white/[0.06] text-xs text-[#8b97a5] font-mono leading-relaxed whitespace-pre-wrap select-text">
                {FIRM_SYSTEM_INSTRUCTIONS}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.05] text-xs text-[#e6edf3] hover:bg-white/[0.09] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

