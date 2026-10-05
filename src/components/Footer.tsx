import React from 'react';
import { ShieldCheck, Shield, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { FahadsLogo } from './FahadsLogo';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenPolicies?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicies }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;
  const brandSub = language === 'ar' 
    ? (config.brand.subtitleAr || t.brandSubtitle || 'مركز تدريب غوص معتمد · جدة PADI')
    : (config.brand.subtitleEn || t.brandSubtitle || 'Certified PADI Dive Center · Jeddah');

  return (
    <footer className={`bg-slate-950 border-t border-slate-900 text-slate-400 py-16 ${
      isRtl ? 'text-right' : 'text-left'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info with Logo */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-1.5 rounded-xl bg-slate-900 border border-[#C59B5F]/30 flex items-center justify-center">
                <FahadsLogo 
                  size="sm" 
                  theme="dark" 
                  showWordmark={false}
                  customImageUrl={config.brand.logoType === 'custom-image' ? config.brand.customLogoUrl : undefined}
                  customTitle={config.brand.logoText}
                  customSubtext={config.brand.logoSubtext}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white font-brand-arabic">
                  {language === 'ar' ? (
                    <>
                      <span>رواء </span>
                      <span className="text-[#C59B5F]">الفن</span>
                    </>
                  ) : (
                    <>
                      <span>Riwa </span>
                      <span className="text-[#C59B5F]">Alfan</span>
                    </>
                  )}
                </span>
                <span className="text-xs text-[#C59B5F] font-semibold tracking-wider uppercase">{brandSub}</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footerBio}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{config.brand.padiNumber || 'PADI Member #482910 · PADI EFR Instructor'}</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              {t.footerQuickLinks}
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#home" className="hover:text-blue-400 transition-colors">{t.navHome}</a>
              </li>
              <li>
                <a href="#instructor" className="hover:text-blue-400 transition-colors">{t.navInstructor}</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-blue-400 transition-colors">{t.navCourses}</a>
              </li>
              <li>
                <a href="#diver-tools" className="hover:text-blue-400 transition-colors">{t.navTools}</a>
              </li>
              <li>
                <a href="#dive-sites" className="hover:text-blue-400 transition-colors">{t.navSites}</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition-colors">{t.navFaq}</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPolicies}
                  className="hover:text-blue-400 transition-colors text-right cursor-pointer flex items-center gap-1 text-slate-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? 'سياسة الاسترداد وإلغاء الرحلات' : 'Refund & Cancellation Policy'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Safety Disclaimer */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              {t.footerDisclaimerTitle}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerDisclaimerText}
            </p>
            {onOpenPolicies && (
              <button
                type="button"
                onClick={onOpenPolicies}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer mt-1"
              >
                <span>{isRtl ? 'عرض اللائحة الرسمية للاسترداد والتدريب والسلامة ❯' : 'View Official Refund & Safety Regulations ❯'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>{t.footerCopyright}</div>
          <div className="text-slate-400 font-mono">{t.footerCountry}</div>
        </div>
      </div>
    </footer>
  );
};
