import React, { useState } from 'react';
import {
  Waves,
  HelpCircle,
  Calculator,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { FAQS } from '../data/divingData';
import redSeaReefImg from '../assets/images/red_sea_reef_exploration_1794667111410.jpg';

interface QuickPortalsSectionProps {
  onOpenSites: () => void;
  onOpenFaq: () => void;
  onOpenTools: () => void;
}

export const QuickPortalsSection: React.FC<QuickPortalsSectionProps> = ({
  onOpenSites,
  onOpenFaq,
  onOpenTools,
}) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const d = config.designContent;
  const portalsKicker =
    language === 'ar'
      ? (d?.portalsKickerAr || 'استكشف المزيد من خدماتنا')
      : (d?.portalsKickerEn || 'Explore More Resources');
  const portalsTitle =
    language === 'ar'
      ? (d?.portalsTitleAr || 'أدلة الأعماق، الأسئلة الشائعة، وحاسبات الغواص')
      : (d?.portalsTitleEn || 'Dive Guides, FAQs & Diver Tools');

  const topFaqs = (config.faqs && config.faqs.length > 0 ? config.faqs : FAQS).slice(0, 4);

  return (
    <section id="explore" className="py-14 sm:py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className={`space-y-1.5 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="text-xs font-bold text-[#C59B5F] tracking-wider block">
            {portalsKicker}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-brand-arabic">
            {portalsTitle}
          </h2>
        </div>

        {/* 3 Sleek Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Dive Sites with Red Sea Reef Preview */}
          <div
            onClick={onOpenSites}
            className="rounded-2xl sm:rounded-3xl bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden shadow-xl shadow-black/25"
          >
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={redSeaReefImg}
                  alt={
                    isRtl
                      ? 'أبرز مواقع الغوص والشعاب المرجانية في جدة - البحر الأحمر'
                      : 'Jeddah Red Sea coral reefs and dive sites'
                  }
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-3 start-4 w-9 h-9 rounded-xl bg-slate-950/85 backdrop-blur border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                  <Waves className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-brand-arabic">
                  {isRtl ? 'أبرز مواقع الغوص في جدة' : 'Jeddah Dive Sites & Reefs'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {isRtl
                    ? 'استكشف حطام السفن، شِعاب المسماري، وأبو طير، وشرم أبحر وتفاصيل الأعماق والرحلات.'
                    : 'Discover Jeddah coral reefs, historic wrecks, Sharm Obhur, and boat safaris.'}
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <span>{isRtl ? 'استعراض المواقع والحطام' : 'Explore Sites'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: FAQs */}
          <div
            onClick={onOpenFaq}
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-xl shadow-black/25"
          >
            <div className="space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors font-brand-arabic">
                  {isRtl ? 'الأسئلة الشائعة حول الغوص' : 'Frequently Asked Questions'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {isRtl
                    ? 'إجابات وافية حول اشتراطات السباحة، الشهادات الدولية المعتمدة من PADI، الفحص الطبي، والتدريب النسائي الخاص.'
                    : 'Clear answers on swimming requirements, PADI international licensing, medicals, and ladies training.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 pt-3 border-t border-slate-800/80">
              <span>{isRtl ? 'قراءة جميع الأسئلة' : 'Read FAQs'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Diver Calculators */}
          <div
            onClick={onOpenTools}
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-[#C59B5F]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-xl shadow-black/25"
          >
            <div className="space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#C59B5F]/10 border border-[#C59B5F]/25 text-[#E0BA84] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5 text-[#C59B5F]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E0BA84] transition-colors font-brand-arabic">
                  {isRtl ? 'حاسبات وأدوات الغواصين' : 'Interactive Diver Tools'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {isRtl
                    ? 'حاسبة أقصى عمق للنيتروكس (MOD)، وقائمة فحص الأمان BWRAF، ومعدل استهلاك الغاز (SAC).'
                    : 'Nitrox MOD, SAC air consumption, and PADI BWRAF safety checklists.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0BA84] pt-3 border-t border-slate-800/80">
              <span>{isRtl ? 'فتح الحاسبات التفاعلية' : 'Open Tools'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Concise On-Page FAQ Strip for Visitors & Google Rich Results */}
        <div id="faq" className="rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-brand-arabic">
                {isRtl ? 'أسئلة سريعة عن دورات وتجربة الغوص في جدة' : 'Quick Answers About Diving in Jeddah'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRtl ? 'أهم الاستفسارات قبل حجزك الأول في أبحر الشمالية' : 'Essential answers before booking in North Obhur'}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenFaq}
              className="text-xs font-bold text-[#E0BA84] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              {isRtl ? 'عرض كافة الأسئلة والأحكام ❯' : 'View All FAQs & Policies ❯'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topFaqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/75 border border-slate-800/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className={`w-full p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-[#E0BA84] transition-colors cursor-pointer ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span>{faq.question[language]}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#C59B5F] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.answer[language]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
