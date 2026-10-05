import React, { useState } from 'react';
import { Anchor, Menu, X, Globe, Shield, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { FahadsLogo } from './FahadsLogo';

interface HeaderProps {
  onOpenBooking: (courseId?: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;
  const brandSub = language === 'ar' 
    ? (config.brand.subtitleAr || t.brandSubtitle || 'مركز تدريب غوص معتمد · جدة PADI')
    : (config.brand.subtitleEn || t.brandSubtitle || 'Certified PADI Dive Center · Jeddah');

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Zone 1: Brand Wordmark & Logo */}
        <a 
          href="#home" 
          className="flex items-center gap-2.5 sm:gap-3 text-slate-100 hover:opacity-90 transition-opacity group min-w-0 shrink"
          title="Riwa Alfan Dive Center"
        >
          {/* Logo Artwork */}
          <div className="p-1.5 rounded-xl bg-slate-900/90 border border-[#C59B5F]/30 group-hover:border-[#C59B5F]/70 shadow-sm transition-colors flex items-center justify-center shrink-0">
            <FahadsLogo 
              size="sm" 
              theme="dark" 
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

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#home" className="hover:text-blue-400 transition-colors whitespace-nowrap">
            {t.navHome}
          </a>
          <a href="#instructor" className="hover:text-blue-400 transition-colors whitespace-nowrap">
            {t.navInstructor}
          </a>
          <a href="#courses" className="hover:text-blue-400 transition-colors whitespace-nowrap">
            {t.navCourses}
          </a>
          <a href="#diver-tools" className="hover:text-blue-400 transition-colors whitespace-nowrap">
            {t.navTools}
          </a>
          <a href="#dive-sites" className="hover:text-blue-400 transition-colors whitespace-nowrap">
            {t.navSites}
          </a>
          <a href="#faq" className="hover:text-blue-400 transition-colors whitespace-nowrap">
            {t.navFaq}
          </a>
          <a href="#policies" className="hover:text-blue-400 transition-colors whitespace-nowrap text-blue-300 font-semibold">
            {language === 'ar' ? 'السياسات والشروط' : 'Policies'}
          </a>
        </nav>

        {/* Zone 3: Actions + Language */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] rounded-xl transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap cursor-pointer"
          >
            <Anchor className="w-4 h-4" />
            <span>{t.ctaBook}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              {t.navHome}
            </a>
            <a 
              href="#instructor" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              {t.navInstructor}
            </a>
            <a 
              href="#courses" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              {t.navCourses}
            </a>
            <a 
              href="#diver-tools" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              {t.navTools}
            </a>
            <a 
              href="#dive-sites" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              {t.navSites}
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              {t.navFaq}
            </a>
            <a 
              href="#policies" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-blue-300 font-semibold"
            >
              {language === 'ar' ? 'السياسات والشروط الرسمية' : 'Official Policies & Regulations'}
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-850 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Anchor className="w-4 h-4" />
              <span>{t.ctaBook}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
