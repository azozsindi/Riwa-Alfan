import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { FahadsLogo } from './FahadsLogo';

interface HeaderProps {
  onOpenBooking?: (courseId?: string) => void;
  onOpenTools?: () => void;
  onOpenSites?: () => void;
  onOpenFaq?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenBooking,
  onOpenTools,
  onOpenSites,
  onOpenFaq,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-[#C59B5F]/20 shadow-lg shadow-black/30 transition-all">
      <div className="w-full max-w-[1536px] mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-6">
        
        {/* Zone 1: Brand Wordmark & Logo */}
        <div className="flex items-center min-w-0 shrink-0 me-2 sm:me-3 xl:me-4">
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
            className="flex items-center gap-2.5 sm:gap-3 text-slate-100 hover:opacity-90 transition-opacity group min-w-0"
            title="Riwa Alfan Dive Center"
          >
            {/* Logo Artwork */}
            <div className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              config.brand.logoBg === 'dark'
                ? 'bg-slate-900/90 border border-[#C59B5F]/30 group-hover:border-[#C59B5F]/70 shadow-sm'
                : 'bg-white border border-slate-200/90 shadow-md group-hover:shadow-lg'
            }`}>
              <FahadsLogo 
                size="sm" 
                theme={config.brand.logoBg === 'dark' ? 'dark' : 'light'} 
                showWordmark={false}
                customImageUrl={config.brand.logoType === 'custom-image' ? config.brand.customLogoUrl : undefined}
                customTitle={config.brand.logoText}
                customSubtext={config.brand.logoSubtext}
              />
            </div>

            <div className="flex flex-col min-w-0 max-w-[150px] xs:max-w-[190px] sm:max-w-[240px] md:max-w-[280px] xl:max-w-[320px]">
              <span className="text-sm xs:text-base sm:text-lg xl:text-xl font-black tracking-tight text-white transition-colors font-brand-arabic truncate">
                {(() => {
                  const words = (brandName || '').trim().split(' ');
                  if (words.length > 1) {
                    return (
                      <>
                        <span className="text-white group-hover:text-blue-300 transition-colors">{words[0]} </span>
                        <span className="text-[#C59B5F] group-hover:text-[#E0BA84] transition-colors">{words.slice(1).join(' ')}</span>
                      </>
                    );
                  }
                  return <span className="text-[#C59B5F] group-hover:text-[#E0BA84] transition-colors">{brandName}</span>;
                })()}
              </span>
            </div>
          </a>
        </div>

        {/* Subtle Visual Divider separating Brand from Navigation on Desktop */}
        <div className="hidden xl:block h-6 w-px bg-slate-800/80 me-2 xl:me-4 shrink-0" aria-hidden="true" />

        {/* Zone 2: Navigation Links (Visible on desktop xl+, never overlaps) */}
        <nav className="hidden xl:flex items-center gap-1 xl:gap-2 2xl:gap-3.5 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-slate-300 shrink-0">
          <button 
            type="button"
            onClick={() => scrollTo('home')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer text-slate-200"
          >
            {t.navHome}
          </button>

          <button 
            type="button"
            onClick={() => scrollTo('instructor')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {t.navInstructor}
          </button>

          <button 
            type="button"
            onClick={() => scrollTo('courses')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {isRtl ? 'الدورات' : 'Courses'}
          </button>

          <button 
            type="button"
            onClick={() => onOpenSites ? onOpenSites() : scrollTo('dive-sites')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {isRtl ? 'مواقع الغوص' : 'Dive Sites'}
          </button>

          <button 
            type="button"
            onClick={() => onOpenFaq ? onOpenFaq() : scrollTo('faq')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {isRtl ? 'الأسئلة' : 'FAQ'}
          </button>

          <button 
            type="button"
            onClick={() => onOpenBooking ? onOpenBooking() : scrollTo('footer')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {language === 'ar' ? 'احجز تدريبك' : 'Book Dive'}
          </button>
        </nav>

        {/* Zone 3: Actions + Language */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ms-auto">
          {/* Diver Tools Quick Icon (wide screens only, compact icon with tooltip) */}
          {onOpenTools && (
            <button
              type="button"
              onClick={onOpenTools}
              className="hidden 2xl:flex items-center justify-center p-2 text-sm text-[#E0BA84] hover:text-white bg-slate-900 hover:bg-slate-800 border border-[#C59B5F]/35 hover:border-[#C59B5F] rounded-xl transition-all cursor-pointer shadow-sm shrink-0 min-h-[38px] min-w-[38px]"
              title={isRtl ? 'حاسبات وأدوات الغواصين التفاعلية' : 'Interactive Diver Tools'}
              aria-label={isRtl ? 'حاسبات وأدوات الغواصين' : 'Diver Tools'}
            >
              <span>🧮</span>
            </button>
          )}

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer shrink-0 min-h-[38px] sm:min-h-[40px]"
            aria-label="تغيير اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="uppercase font-mono text-[11px] font-bold">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-[#C59B5F] shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="القائمة / Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-200">
            <button 
              type="button"
              onClick={() => scrollTo('home')}
              className="px-4 py-3 rounded-xl hover:bg-slate-900 active:bg-slate-800 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold min-h-[44px]"
            >
              <span>{t.navHome}</span>
              <span className="text-sm">🏠</span>
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('instructor')}
              className="px-4 py-3 rounded-xl hover:bg-slate-900 active:bg-slate-800 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold min-h-[44px]"
            >
              <span>{t.navInstructor}</span>
              <span className="text-sm text-amber-400">👑</span>
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('courses')}
              className="px-4 py-3 rounded-xl hover:bg-slate-900 active:bg-slate-800 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold min-h-[44px]"
            >
              <span>{t.navCourses}</span>
              <span className="text-sm text-[#C59B5F]">🤿</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSites) onOpenSites();
                else scrollTo('dive-sites');
              }}
              className="px-4 py-3 rounded-xl hover:bg-slate-900 active:bg-slate-800 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold min-h-[44px]"
            >
              <span>{t.navSites}</span>
              <span className="text-sm text-cyan-400">🌊</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenFaq) onOpenFaq();
                else scrollTo('faq');
              }}
              className="px-4 py-3 rounded-xl hover:bg-slate-900 active:bg-slate-800 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold min-h-[44px]"
            >
              <span>{t.navFaq}</span>
              <span className="text-sm text-blue-400">❓</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBooking) onOpenBooking();
                else scrollTo('footer');
              }}
              className="px-4 py-3 rounded-xl hover:bg-slate-900 active:bg-slate-800 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold min-h-[44px]"
            >
              <span>{language === 'ar' ? 'احجز دورة أو تجربة غوص' : 'Book a Dive or Course'}</span>
              <span className="text-sm text-[#E0BA84]">✦</span>
            </button>

            {onOpenTools && (
              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTools();
                }}
                className="px-4 py-3 rounded-xl bg-slate-900/90 text-[#E0BA84] font-bold text-start flex items-center justify-between border border-[#C59B5F]/30 min-h-[44px]"
              >
                <span>{isRtl ? 'حاسبات وأدوات الغواصين' : 'Diver Calculators'}</span>
                <span>🧮</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
