import React, { useState } from 'react';
import { ShieldCheck, Shield, Award, MapPin, Instagram, Video, ExternalLink, Building2, X, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { DEFAULT_TRUST_BADGES } from '../data/defaultConfig';
import { PartnerLogoItem } from '../types/admin';
import { FahadsLogo } from './FahadsLogo';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenPolicies?: () => void;
  onOpenTools?: () => void;
  onOpenSites?: () => void;
  onOpenFaq?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenAdmin,
  onOpenPolicies, 
  onOpenTools, 
  onOpenSites, 
  onOpenFaq 
}) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const [selectedPartner, setSelectedPartner] = useState<PartnerLogoItem | null>(null);
  const t = UI_TRANSLATIONS[language];

  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;
  const brandSub = language === 'ar' 
    ? (config.brand.subtitleAr || 'دورات تدريب الغوص المعتمدة · كابتن فهد الهويملي PADI')
    : (config.brand.subtitleEn || 'Certified PADI Diving Training · Capt. Fahad Al-Huwaimli');

  const brandBio = language === 'ar'
    ? (config.brand.bioAr || 'رواء الفن للغوص (Riwa Alfan Diving) بجدة بقيادة كابتن فهد الهويملي (PADI). نلتزم بأعلى معايير السلامة المهنية لحماية وتأهيل الغواصين واستكشاف جمال البحر الأحمر.')
    : (config.brand.bioEn || 'Riwa Alfan Diving in Jeddah led by Captain Fahad Al-Huwaimli (PADI). Committed to the highest professional safety standards for diver training and exploring the Red Sea.');

  // Partner logos & accreditation list (filter out removed Saudi Business & Freelance, ensure EFR exists)
  const rawPartners = (config.trustBadges?.partnerLogos && config.trustBadges.partnerLogos.length > 0)
    ? config.trustBadges.partnerLogos
    : (DEFAULT_TRUST_BADGES.partnerLogos || []);

  const cleanedPartners = rawPartners.filter(
    (p) =>
      p.id !== 'partner-saudi-business' &&
      p.id !== 'partner-freelance' &&
      !/منصة الأعمال|منصة العمل الحر|FL-2918401/i.test(`${p.nameAr} ${p.nameEn}`)
  );

  const hasEfr = cleanedPartners.some(
    (p) => p.id === 'partner-efr' || /\befr\b/i.test(`${p.nameAr} ${p.nameEn}`)
  );
  const defaultEfr = (DEFAULT_TRUST_BADGES.partnerLogos || []).find((p) => p.id === 'partner-efr');
  const partnerLogos: PartnerLogoItem[] = hasEfr || !defaultEfr
    ? cleanedPartners
    : [...cleanedPartners, defaultEfr];

  return (
    <footer className={`bg-slate-950 border-t border-slate-900 text-slate-400 py-12 sm:py-16 ${
      isRtl ? 'text-right' : 'text-left'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info with Logo & Legal Identifiers */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                config.brand.logoBg === 'dark'
                  ? 'bg-slate-900 border border-[#C59B5F]/30'
                  : 'bg-white border border-slate-200/90 shadow-md'
              }`}>
                <FahadsLogo 
                  size="sm" 
                  theme={config.brand.logoBg === 'dark' ? 'dark' : 'light'} 
                  showWordmark={false}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-brand-arabic">
                  {(() => {
                    const words = (brandName || '').trim().split(' ');
                    if (words.length > 1) {
                      return (
                        <>
                          <span>{words[0]} </span>
                          <span className="text-[#C59B5F]">{words.slice(1).join(' ')}</span>
                        </>
                      );
                    }
                    return <span className="text-[#C59B5F]">{brandName}</span>;
                  })()}
                </span>
                <span className="text-[10px] sm:text-xs text-[#C59B5F] font-semibold tracking-wider uppercase">
                  {brandSub}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {brandBio}
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

            {/* Social Media Links */}
            {config.socialLinks && config.socialLinks.showInFooter !== false && (
              <div className="flex items-center gap-2 pt-1">
                {config.socialLinks.snapchat && (
                  <a
                    href={config.socialLinks.snapchat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-yellow-500/20 text-slate-400 hover:text-yellow-400 border border-slate-800 flex items-center justify-center transition-colors text-base"
                    aria-label="Snapchat"
                    title="سناب شات"
                  >
                    👻
                  </a>
                )}
                {config.socialLinks.instagram && (
                  <a
                    href={config.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600/20 text-slate-400 hover:text-pink-400 border border-slate-800 flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                    title="إنستغرام"
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
                    title="تيك توك"
                  >
                    <Video className="w-4 h-4" />
                  </a>
                )}
                {config.socialLinks.twitter && (
                  <a
                    href={config.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors font-bold text-xs"
                    aria-label="Twitter / X"
                    title="منصة إكس"
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
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#home" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span>{t.navHome}</span>
                </a>
              </li>
              <li>
                <a href="#instructor" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span>{t.navInstructor}</span>
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span>{t.navCourses}</span>
                </a>
              </li>
              {onOpenTools && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenTools}
                    className="hover:text-[#E0BA84] text-[#C59B5F] transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
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
                  <a href="#dive-sites" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <span>🌊</span>
                    <span>{t.navSites}</span>
                  </a>
                )}
              </li>
              {onOpenFaq ? (
                <li>
                  <button
                    type="button"
                    onClick={onOpenFaq}
                    className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>❓</span>
                    <span>{t.navFaq}</span>
                  </button>
                </li>
              ) : (
                <li>
                  <a href="#faq" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <span>❓</span>
                    <span>{t.navFaq}</span>
                  </a>
                </li>
              )}
              {onOpenAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="hover:text-[#E0BA84] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 pt-0.5"
                  >
                    <span>🔐</span>
                    <span>{isRtl ? 'بوابة إدارة الموقع' : 'Admin Portal'}</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={onOpenPolicies}
                  className="hover:text-blue-400 transition-colors text-right cursor-pointer flex items-center gap-1 text-slate-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{isRtl ? 'سياسة الاسترداد وإلغاء الرحلات' : 'Refund & Cancellation Policy'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Safety Disclaimer */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'ar'
                  ? (config.designContent?.footerDisclaimerTitleAr || 'إخلاء مسؤولية ومعايير السلامة')
                  : (config.designContent?.footerDisclaimerTitleEn || 'Safety & Regulation Disclaimer')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-900">
              {language === 'ar'
                ? (config.designContent?.footerDisclaimerTextAr || 'رياضة الغوص بمعدات التنفس تحت الماء (Scuba Diving) تتطلب تدريباً وتأهيلاً رسمياً وحصولاً على شهادة معتمدة من منظمة دولية معترف بها. الحاسبات المعروضة هنا هي أدوات مساعدة وتثقيفية ولا تغني عن حاسوب الغوص المعتمد وخطة الغوص الرسمية.')
                : (config.designContent?.footerDisclaimerTextEn || t.footerDisclaimerText)}
            </p>
            {onOpenPolicies && (
              <button
                type="button"
                onClick={onOpenPolicies}
                className="inline-flex items-center gap-1.5 text-xs text-[#C59B5F] hover:text-[#E0BA84] font-bold cursor-pointer mt-1 group"
              >
                <span>
                  {language === 'ar'
                    ? (config.designContent?.footerPolicyBtnAr || 'عرض اللائحة الرسمية للاسترداد والتدريب والسلامة ❯')
                    : (config.designContent?.footerPolicyBtnEn || 'View Official Refund & Safety Regulations ❯')}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Official Accreditations & Partner Platform Badges Section */}
        <div className="pt-8 border-t border-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#C59B5F]" />
              <span>
                {language === 'ar' 
                  ? (config.trustBadges?.sectionTitleAr || 'الاعتمادات الرسمية ومنصات التوثيق الشريكة') 
                  : (config.trustBadges?.sectionTitleEn || 'Official Accreditations & Partner Platforms')}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {language === 'ar'
                ? (config.trustBadges?.sectionSubtitleAr || 'توثيق رسمي ومعتمد بالمملكة العربية السعودية')
                : (config.trustBadges?.sectionSubtitleEn || 'Officially Verified & Registered in Saudi Arabia')}
            </span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {partnerLogos.filter(p => p.active !== false).map((partner) => {
              const partnerName = isRtl ? partner.nameAr : (partner.nameEn || partner.nameAr);
              const badgeLabel = isRtl 
                ? (partner.badgeTextAr || 'معتمد رسمي') 
                : (partner.badgeTextEn || 'Verified');

              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-full p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-[#C59B5F]/50 transition-all flex items-center justify-between gap-2.5 group cursor-pointer ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={partnerName} 
                        className="w-8 h-8 object-contain rounded-lg shrink-0" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                        <Award className="w-4 h-4 text-[#C59B5F]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white block truncate transition-colors">
                        {partnerName}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        {badgeLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#C59B5F] group-hover:text-[#E0BA84] shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#C59B5F]/10 border border-[#C59B5F]/20">
                    <FileText className="w-3 h-3" />
                    <span className="hidden md:inline">{isRtl ? 'عرض الرخصة' : 'License'}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom copyright & Trust verification line */}
        <div className="pt-6 border-t border-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              {language === 'ar'
                ? (config.trustBadges?.copyrightTextAr || `جميع الحقوق محفوظة © ${new Date().getFullYear()} رواء الفن للغوص (Riwa Alfan) · كابتن فهد الهويملي PADI`)
                : (config.trustBadges?.copyrightTextEn || t.footerCopyright)}
            </span>
          </div>
          <div className="text-slate-400 font-mono flex items-center gap-2">
            <span>
              {language === 'ar'
                ? (config.trustBadges?.countryTextAr || 'المملكة العربية السعودية')
                : (config.trustBadges?.countryTextEn || 'Kingdom of Saudi Arabia')}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
              PADI Certified
            </span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#C59B5F]/40 text-slate-400 hover:text-[#E0BA84] text-[10px] font-sans flex items-center gap-1 transition-colors cursor-pointer"
                title={isRtl ? 'لوحة تحكم وإدارة الموقع' : 'Admin Portal'}
              >
                <span>🔐</span>
                <span>{isRtl ? 'لوحة الإدارة' : 'Admin'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Accreditation & License Display Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className={`bg-slate-900 border border-[#C59B5F]/40 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl ${
              isRtl ? 'text-right' : 'text-left'
            }`}
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                {selectedPartner.logoUrl ? (
                  <img
                    src={selectedPartner.logoUrl}
                    alt={isRtl ? selectedPartner.nameAr : (selectedPartner.nameEn || selectedPartner.nameAr)}
                    className="w-12 h-12 object-contain rounded-xl bg-slate-950 p-1.5 border border-slate-800 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#C59B5F]/15 border border-[#C59B5F]/40 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-[#C59B5F]" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-emerald-400 font-mono block">
                    {isRtl ? (selectedPartner.badgeTextAr || 'معتمد رسمي') : (selectedPartner.badgeTextEn || 'Verified')}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white font-brand-arabic leading-snug">
                    {isRtl ? selectedPartner.nameAr : (selectedPartner.nameEn || selectedPartner.nameAr)}
                  </h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label={isRtl ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* License Number */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                {isRtl ? 'رقم / بيانات الرخصة والاعتماد:' : 'License Number & Details:'}
              </span>
              {selectedPartner.licenseNumber ? (
                <div className="text-lg sm:text-xl font-black font-mono text-[#E0BA84] tracking-wide">
                  {selectedPartner.licenseNumber}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  {isRtl ? 'معتمد رسمياً (يمكن إدخال رقم الرخصة أو صورتها من لوحة التحكم)' : 'Officially Accredited (License ID can be updated in Admin Panel)'}
                </div>
              )}

              {(isRtl ? selectedPartner.licenseDetailsAr : (selectedPartner.licenseDetailsEn || selectedPartner.licenseDetailsAr)) && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  {isRtl ? selectedPartner.licenseDetailsAr : (selectedPartner.licenseDetailsEn || selectedPartner.licenseDetailsAr)}
                </p>
              )}
            </div>

            {/* Optional Uploaded License Image */}
            {selectedPartner.licenseImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                <img
                  src={selectedPartner.licenseImageUrl}
                  alt={isRtl ? 'صورة الرخصة' : 'License Certificate'}
                  className="w-full max-h-[380px] object-contain rounded-xl mx-auto"
                />
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
              {selectedPartner.linkUrl && (
                <a
                  href={selectedPartner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-colors"
                >
                  <span>{isRtl ? 'زيارة الموقع الرسمي للجهة' : 'Visit Official Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="ms-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
