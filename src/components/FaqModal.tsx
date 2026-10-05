import React, { useState } from 'react';
import { X, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { FAQS } from '../data/divingData';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  if (!isOpen) return null;

  const faqsList = config.faqs && config.faqs.length > 0 ? config.faqs : FAQS;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappUrl = `https://wa.me/${config.brand.whatsappNumber}?text=${encodeURIComponent(
    isRtl 
      ? 'السلام عليكم، لدي استفسار إضافي حول دورات الغوص والرحلات في رواء الفن.'
      : 'Hello, I have an inquiry regarding diving courses and trips at Riwa Alfan.'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[92vh] overflow-y-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>{t.faqKicker}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {t.faqTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {t.faqDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق / Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-colors hover:border-blue-500/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.question[language]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900/80">
                    {faq.answer[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Support Prompt */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">
              {isRtl ? 'هل لديك سؤال آخر لم تجد إجابته؟' : 'Have a question not listed here?'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isRtl ? 'تواصل مباشرة مع الكابتن فهد وفريق التدريب عبر الواتساب' : 'Speak directly with our instructors via WhatsApp'}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isRtl ? 'محادثة فورية واتساب' : 'Chat on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
