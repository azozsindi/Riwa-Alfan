import React, { useState } from 'react';
import { Anchor, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { FahadsLogo } from './FahadsLogo';

interface HeaderProps {
  onOpenBooking: (courseId?: string) => void;
  onOpenAdmin?: () => void;
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
  const brandSub = language === 'ar' 
    ? (config.brand.subtitleAr || 'دورات تدريب الغوص المعتمدة · كابتن فهد الهويملي PADI')
    : (config.brand.subtitleEn || 'Certified PADI Diving Training · Capt. Fahad Al-Huwaimli');

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        
        {/* Zone 1: Brand Wordmark & Logo */}
        <div className="flex items-center min-w-0 shrink-0 me-3 sm:me-4 lg:me-6 xl:me-8">
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

            <div className="flex flex-col min-w-0 max-w-[170px] xs:max-w-[210px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[220px] xl:max-w-[300px] 2xl:max-w-none">
              <span className="text-sm xs:text-base sm:text-lg lg:text-base xl:text-xl font-black tracking-tight text-white transition-colors font-brand-arabic truncate">
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
              <span className="text-[9px] sm:text-[11px] text-[#C59B5F] font-semibold -mt-0.5 tracking-wider uppercase truncate block">
                {brandSub}
              </span>
            </div>
          </a>
        </div>

        {/* Subtle Visual Divider separating Brand from Navigation on Desktop */}
        <div className="hidden lg:block h-6 w-px bg-slate-800 me-3 lg:me-4 xl:me-6 shrink-0" aria-hidden="true" />

        {/* Zone 2: Navigation Links (Streamlined & Clean with Generous Spacing) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5 2xl:gap-4 text-xs xl:text-sm font-semibold text-slate-300 min-w-0">
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
            {t.navCourses}
          </button>

          <button 
            type="button"
            onClick={() => onOpenSites ? onOpenSites() : scrollTo('dive-sites')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {t.navSites}
          </button>

          <button 
            type="button"
            onClick={() => onOpenFaq ? onOpenFaq() : scrollTo('faq')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {t.navFaq}
          </button>

          <button 
            type="button"
            onClick={() => scrollTo('contact')}
            className="px-2.5 py-1.5 rounded-xl hover:text-[#E0BA84] hover:bg-slate-900/90 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {language === 'ar' ? 'تواصل معنا' : 'Contact'}
          </button>
        </nav>

        {/* Zone 3: Actions + Language */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ms-auto">
          {/* Quick Diver Calculators Drawer Trigger (Wide desktop only to preserve navbar space) */}
          {onOpenTools && (
            <button
              type="button"
              onClick={onOpenTools}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E0BA84] hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-[#C59B5F]/35 hover:border-[#C59B5F] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
              title={isRtl ? 'حاسبات وأدوات الغواصين التفاعلية' : 'Interactive Diver Tools'}
            >
              <span>🧮</span>
              <span className="font-brand-arabic">{isRtl ? 'حاسبات الغواص' : 'Diver Tools'}</span>
            </button>
          )}

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer shrink-0"
            aria-label="تغيير اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden xs:inline">{t.langSwitch}</span>
            <span className="xs:hidden uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* CTA Book Button */}
          <button
            onClick={() => onOpenBooking()}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 xl:px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 gold-gradient-btn rounded-xl transition-all shadow-md shadow-[#C59B5F]/20 whitespace-nowrap cursor-pointer active:scale-95 shrink-0"
          >
            <Anchor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
            <span>{t.ctaBook}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-[#C59B5F] shrink-0"
            aria-label="القائمة / Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-200">
            <button 
              type="button"
              onClick={() => scrollTo('home')}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold"
            >
              <span>{t.navHome}</span>
              <span className="text-xs text-slate-500">🏠</span>
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('instructor')}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold"
            >
              <span>{t.navInstructor}</span>
              <span className="text-xs text-amber-400">👑</span>
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('courses')}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold"
            >
              <span>{t.navCourses}</span>
              <span className="text-xs text-[#C59B5F]">🤿</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSites) onOpenSites();
                else scrollTo('dive-sites');
              }}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold"
            >
              <span>{t.navSites}</span>
              <span className="text-xs text-cyan-400">🌊</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenFaq) onOpenFaq();
                else scrollTo('faq');
              }}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold"
            >
              <span>{t.navFaq}</span>
              <span className="text-xs text-blue-400">❓</span>
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('contact')}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-[#E0BA84] text-start flex items-center justify-between font-bold"
            >
              <span>{language === 'ar' ? 'تواصل معنا' : 'Contact'}</span>
              <span className="text-xs text-emerald-400">📞</span>
            </button>

            {onOpenTools && (
              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTools();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 text-[#E0BA84] font-bold text-start flex items-center justify-between border border-[#C59B5F]/30"
              >
                <span>{isRtl ? 'حاسبات وأدوات الغواصين' : 'Diver Calculators'}</span>
                <span>🧮</span>
              </button>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C59B5F]/20 cursor-pointer active:scale-95"
            >
              <Anchor className="w-4 h-4 text-slate-950" />
              <span>{t.ctaBook}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
