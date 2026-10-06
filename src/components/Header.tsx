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
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Zone 1: Brand Wordmark & Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
          className="flex items-center gap-2.5 sm:gap-3 text-slate-100 hover:opacity-90 transition-opacity group min-w-0 shrink"
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

          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-white transition-colors font-brand-arabic truncate">
              {language === 'ar' ? (
                <>
                  <span className="text-white group-hover:text-blue-300 transition-colors">رواء </span>
                  <span className="text-[#C59B5F] group-hover:text-[#E0BA84] transition-colors">الفن</span>
                </>
              ) : (
                <>
                  <span className="text-white group-hover:text-blue-300 transition-colors">Riwa </span>
                  <span className="text-[#C59B5F] group-hover:text-[#E0BA84] transition-colors">Alfan</span>
                </>
              )}
            </span>
            <span className="text-[10px] sm:text-xs text-[#C59B5F] font-semibold -mt-0.5 tracking-wider uppercase truncate">
              {brandSub}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (Streamlined & Clean) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            type="button"
            onClick={() => scrollTo('home')}
            className="hover:text-[#E0BA84] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navHome}
          </button>

          <button 
            type="button"
            onClick={() => scrollTo('instructor')}
            className="hover:text-[#E0BA84] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navInstructor}
          </button>

          <button 
            type="button"
            onClick={() => scrollTo('courses')}
            className="hover:text-[#E0BA84] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navCourses}
          </button>

          <button 
            type="button"
            onClick={() => onOpenSites ? onOpenSites() : scrollTo('dive-sites')}
            className="hover:text-[#E0BA84] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navSites}
          </button>

          <button 
            type="button"
            onClick={() => onOpenFaq ? onOpenFaq() : scrollTo('faq')}
            className="hover:text-[#E0BA84] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navFaq}
          </button>

          <button 
            type="button"
            onClick={() => scrollTo('contact')}
            className="hover:text-[#E0BA84] transition-colors whitespace-nowrap cursor-pointer"
          >
            {language === 'ar' ? 'تواصل معنا' : 'Contact'}
          </button>
        </nav>

        {/* Zone 3: Actions + Language */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Diver Calculators Drawer Trigger */}
          {onOpenTools && (
            <button
              type="button"
              onClick={onOpenTools}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E0BA84] hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-[#C59B5F]/35 hover:border-[#C59B5F] rounded-xl transition-all cursor-pointer shadow-sm"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
            aria-label="تغيير اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.langSwitch}</span>
          </button>

          {/* CTA Book Button */}
          <button
            onClick={() => onOpenBooking()}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 gold-gradient-btn rounded-xl transition-all shadow-lg shadow-[#C59B5F]/20 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Anchor className="w-4 h-4 text-slate-950" />
            <span>{t.ctaBook}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-[#C59B5F]"
            aria-label="القائمة / Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-200">
            <button 
              type="button"
              onClick={() => scrollTo('home')}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 text-start"
            >
              {t.navHome}
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('instructor')}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 text-start"
            >
              {t.navInstructor}
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('courses')}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 text-start"
            >
              {t.navCourses}
            </button>

            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSites) onOpenSites();
                else scrollTo('dive-sites');
              }}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 text-start flex items-center justify-between"
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
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 text-start flex items-center justify-between"
            >
              <span>{t.navFaq}</span>
              <span className="text-xs text-blue-400">❓</span>
            </button>

            <button 
              type="button"
              onClick={() => scrollTo('contact')}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 text-start"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact'}
            </button>

            {onOpenTools && (
              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTools();
                }}
                className="px-3 py-2 rounded-lg bg-slate-900/80 text-[#E0BA84] font-bold text-start flex items-center gap-2 border border-[#C59B5F]/30"
              >
                <span>🧮</span>
                <span>{isRtl ? 'حاسبات وأدوات الغواصين' : 'Diver Calculators'}</span>
              </button>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C59B5F]/20"
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
