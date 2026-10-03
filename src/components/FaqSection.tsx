import React, { useState } from 'react';
import { FAQS } from '../data/divingData';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const faqsList = config.faqs && config.faqs.length > 0 ? config.faqs : FAQS;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`space-y-3 mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-blue-400 tracking-wider">
            {t.faqKicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            {t.faqDesc}
          </p>
        </div>

        {/* Accordion */}
        <div className={`space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
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
                  className={`w-full p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                >
                  <span className="text-base font-bold text-white">
                    {faq.question[language]}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-900/80">
                    {faq.answer[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
