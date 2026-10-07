import React from 'react';
import { Waves, HelpCircle, Calculator, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

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
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const d = config.designContent;
  const portalsKicker = language === 'ar'
    ? (d?.portalsKickerAr || 'استكشف المزيد من خدماتنا')
    : (d?.portalsKickerEn || 'Explore More Resources');
  const portalsTitle = language === 'ar'
    ? (d?.portalsTitleAr || 'أدلة الأعماق، الأسئلة الشائعة، وحاسبات الغواص')
    : (d?.portalsTitleEn || 'Dive Guides, FAQs & Diver Tools');

  return (
    <section className="py-12 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Subtle Section Header */}
        <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="text-xs font-semibold text-[#C59B5F] tracking-wider">
            {portalsKicker}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
            {portalsTitle}
          </h2>
        </div>

        {/* 3 Sleek Compact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Dive Sites */}
          <div 
            onClick={onOpenSites}
            className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-brand-arabic">
                  {isRtl ? 'أبرز مواقع الغوص في جدة' : 'Jeddah Dive Sites & Reefs'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isRtl 
                    ? 'استكشف حطام السفن، شعب مسماري، وأبو طير وتفاصيل الأعماق والرحلات.'
                    : 'Discover Jeddah coral reefs, historic wrecks, and boat safaris.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 pt-2 border-t border-slate-800/80">
              <span>{isRtl ? 'استعراض المواقع والحطام' : 'Explore Sites'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: FAQs */}
          <div 
            onClick={onOpenFaq}
            className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors font-brand-arabic">
                  {isRtl ? 'الأسئلة الشائعة حول الغوص' : 'Frequently Asked Questions'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isRtl 
                    ? 'إجابات وافية حول السباحة، الشهادات الدولية، الفحص الطبي، والتدريب النسائي.'
                    : 'Clear answers on prerequisites, medicals, certification, and ladies training.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 pt-2 border-t border-slate-800/80">
              <span>{isRtl ? 'قراءة جميع الأسئلة' : 'Read FAQs'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Diver Calculators */}
          <div 
            onClick={onOpenTools}
            className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-[#C59B5F]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#C59B5F]/10 border border-[#C59B5F]/20 text-[#E0BA84] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5 text-[#C59B5F]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#E0BA84] transition-colors font-brand-arabic">
                  {isRtl ? 'حاسبات وأدوات الغواصين' : 'Interactive Diver Tools'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isRtl 
                    ? 'حاسبة أقصى عمق للنيتروكس (MOD)، وقائمة BWRAF، ومعدل استهلاك الغاز (SAC).'
                    : 'Nitrox MOD, SAC air consumption, and PADI BWRAF safety checklists.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0BA84] pt-2 border-t border-slate-800/80">
              <span>{isRtl ? 'فتح الحاسبات التفاعلية' : 'Open Tools'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
