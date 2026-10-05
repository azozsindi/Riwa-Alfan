import React from 'react';
import { ShieldCheck, Shield, Lock, MapPin, Instagram, Video, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { FahadsLogo } from './FahadsLogo';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenPolicies?: () => void;
  onOpenTools?: () => void;
  onOpenSites?: () => void;
  onOpenFaq?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPolicies, 
  onOpenTools,
  onOpenSites,
  onOpenFaq,
}) => {
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

            {/* Marina Location GPS Link */}
            {config.locationConfig?.googleMapsUrl && (
              <a 
                href={config.locationConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <MapPin className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>{language === 'ar' ? config.locationConfig.marinaNameAr : config.locationConfig.marinaNameEn}</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
              </a>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{config.brand.padiNumber || 'PADI Member #482910 · PADI EFR Instructor'}</span>
            </div>

            {/* Social Media Links */}
            {config.socialLinks && config.socialLinks.showInFooter !== false && (
              <div className="flex items-center gap-2 pt-1">
                {config.socialLinks.instagram && (
                  <a
                    href={config.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600/20 text-slate-400 hover:text-pink-400 border border-slate-800 flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {config.socialLinks.tiktok && (
                  <a
                    href={config.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-cyan-600/20 text-slate-400 hover:text-cyan-400 border border-slate-800 flex items-center justify-center transition-colors"
                    aria-label="TikTok"
                  >
                    <Video className="w-4 h-4" />
                  </a>
                )}
                {config.socialLinks.snapchat && (
                  <a
                    href={config.socialLinks.snapchat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-yellow-500/20 text-slate-400 hover:text-yellow-400 border border-slate-800 flex items-center justify-center transition-colors text-sm"
                    aria-label="Snapchat"
                  >
                    👻
                  </a>
                )}
                {config.socialLinks.twitter && (
                  <a
                    href={config.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors font-bold text-xs"
                    aria-label="Twitter / X"
                  >
                    𝕏
                  </a>
                )}
              </div>
            )}
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
              {onOpenTools && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenTools}
                    className="hover:text-[#E0BA84] text-[#C59B5F] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🧮</span>
                    <span>{isRtl ? 'حاسبات وأدوات الغواصين' : t.navTools}</span>
                  </button>
                </li>
              )}
              <li>
                {onOpenSites ? (
                  <button
                    type="button"
                    onClick={onOpenSites}
                    className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🌊</span>
                    <span>{t.navSites}</span>
                  </button>
                ) : (
                  <a href="#dive-sites" className="hover:text-blue-400 transition-colors">{t.navSites}</a>
                )}
              </li>
              <li>
                {onOpenFaq ? (
                  <button
                    type="button"
                    onClick={onOpenFaq}
                    className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>❓</span>
                    <span>{t.navFaq}</span>
                  </button>
                ) : (
                  <a href="#faq" className="hover:text-blue-400 transition-colors">{t.navFaq}</a>
                )}
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

        {/* Bottom copyright & Trust verification line */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span>{t.footerCopyright}</span>
            {config.trustBadges?.freelanceDocNumber && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">
                  {isRtl ? `وثيقة العمل الحر: ${config.trustBadges.freelanceDocNumber}` : `Freelance License: ${config.trustBadges.freelanceDocNumber}`}
                </span>
              </>
            )}
            {config.trustBadges?.crNumber && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">
                  {isRtl ? `سجل تجاري: ${config.trustBadges.crNumber}` : `CR: ${config.trustBadges.crNumber}`}
                </span>
              </>
            )}
          </div>
          <div className="text-slate-400 font-mono flex items-center gap-2">
            <span>{t.footerCountry}</span>
            {config.trustBadges?.padiFiveStar && (
              <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                PADI Certified
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
