import React from 'react';
import { ShieldCheck, Shield, Award, MapPin, Instagram, Video, ExternalLink, FileCheck2, Building2 } from 'lucide-react';
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
  onOpenFaq 
}) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const brandName = language === 'ar' ? config.brand.centerNameAr : config.brand.centerNameEn;
  const brandSub = language === 'ar' 
    ? (config.brand.subtitleAr || 'دورات تدريب الغوص المعتمدة · كابتن فهد الهويملي PADI')
    : (config.brand.subtitleEn || 'Certified PADI Diving Training · Capt. Fahad Al-Huwaimli');

  const brandBio = language === 'ar'
    ? (config.brand.bioAr || 'رواء الفن للغوص (Riwa Alfan Diving) بجدة بقيادة كابتن فهد الهويملي (PADI MSDT). نلتزم بأعلى معايير السلامة المهنية لحماية وتأهيل الغواصين واستكشاف جمال البحر الأحمر.')
    : (config.brand.bioEn || 'Riwa Alfan Diving in Jeddah led by Captain Fahad Al-Huwaimli (PADI MSDT). Committed to the highest professional safety standards for diver training and exploring the Red Sea.');

  const freelanceDoc = config.trustBadges?.freelanceDocNumber || config.brand.freelanceDocNumber || 'FL-2918401';
  const owsiLicense = config.trustBadges?.owsiNumber || config.brand.owsiNumber || 'PADI OWSI #482910';

  // Partner logos & accreditation list
  const partnerLogos = config.trustBadges?.partnerLogos || [
    {
      id: 'partner-saudi-business',
      nameAr: 'منصة الأعمال السعودية',
      nameEn: 'Saudi Business Platform',
      linkUrl: 'https://business.sa',
      active: true
    },
    {
      id: 'partner-watersports-fed',
      nameAr: 'الاتحاد السعودي للرياضات البحرية والغوص',
      nameEn: 'Saudi Water Sports & Diving Federation',
      linkUrl: '',
      active: true
    },
    {
      id: 'partner-freelance',
      nameAr: 'منصة العمل الحر (FL-2918401)',
      nameEn: 'Freelance Platform (FL-2918401)',
      linkUrl: 'https://freelance.sa',
      active: true
    },
    {
      id: 'partner-padi',
      nameAr: 'منظمة PADI الدولية للغوص',
      nameEn: 'PADI Worldwide (#482910)',
      linkUrl: 'https://www.padi.com',
      active: true
    }
  ];

  return (
    <footer className={`bg-slate-950 border-t border-slate-900 text-slate-400 py-16 ${
      isRtl ? 'text-right' : 'text-left'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info with Logo & Legal Identifiers */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-1.5 rounded-xl bg-slate-900 border border-[#C59B5F]/30 flex items-center justify-center shrink-0">
                <FahadsLogo 
                  size="sm" 
                  theme="dark" 
                  showWordmark={false}
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
                <span className="text-xs text-[#C59B5F] font-semibold tracking-wider uppercase">
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

            {/* Accreditations Badges in Footer Column */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/50 border border-blue-500/30 text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{owsiLicense}</span>
              </div>

              {freelanceDoc && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? `وثيقة العمل الحر: ${freelanceDoc}` : `Freelance: ${freelanceDoc}`}</span>
                </div>
              )}
            </div>

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
                  <a href="#faq" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <span>❓</span>
                    <span>{t.navFaq}</span>
                  </a>
                )}
              </li>
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
              <span>{isRtl ? 'إخلاء مسؤولية ومعايير السلامة' : 'Safety & Regulation Disclaimer'}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-900">
              {isRtl 
                ? 'رياضة الغوص بمعدات التنفس تحت الماء (Scuba Diving) تتطلب تدريباً وتأهيلاً رسمياً وحصولاً على شهادة معتمدة من منظمة دولية معترف بها. الحاسبات المعروضة هنا هي أدوات مساعدة وتثقيفية ولا تغني عن حاسوب الغوص المعتمد وخطة الغوص الرسمية.'
                : t.footerDisclaimerText}
            </p>
            {onOpenPolicies && (
              <button
                type="button"
                onClick={onOpenPolicies}
                className="inline-flex items-center gap-1.5 text-xs text-[#C59B5F] hover:text-[#E0BA84] font-bold cursor-pointer mt-1 group"
              >
                <span>{isRtl ? 'عرض اللائحة الرسمية للاسترداد والتدريب والسلامة ❯' : 'View Official Refund & Safety Regulations ❯'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Official Accreditations & Partner Platform Badges Section */}
        <div className="pt-8 border-t border-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#C59B5F]" />
              <span>{isRtl ? 'الاعتمادات الرسمية ومنصات التوثيق الشريكة' : 'Official Accreditations & Partner Platforms'}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {isRtl ? 'توثيق رسمي ومعتمد بالمملكة العربية السعودية' : 'Verified & Registered in Saudi Arabia'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {partnerLogos.filter(p => p.active !== false).map((partner) => {
              const partnerName = isRtl ? partner.nameAr : partner.nameEn;
              const content = (
                <div className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-[#C59B5F]/40 transition-all flex items-center gap-2.5 group">
                  {partner.logoUrl ? (
                    <img 
                      src={partner.logoUrl} 
                      alt={partnerName} 
                      className="w-7 h-7 object-contain rounded shrink-0" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      <Award className="w-4 h-4 text-[#C59B5F]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-slate-200 group-hover:text-white block truncate transition-colors">
                      {partnerName}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      {isRtl ? 'معتمد رسمي' : 'Verified'}
                    </span>
                  </div>
                </div>
              );

              return partner.linkUrl ? (
                <a 
                  key={partner.id} 
                  href={partner.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={partner.id}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom copyright & Trust verification line */}
        <div className="pt-6 border-t border-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span>{isRtl ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} رواء الفن للغوص (Riwa Alfan) · كابتن فهد الهويملي PADI` : t.footerCopyright}</span>
            {freelanceDoc && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">
                  {isRtl ? `وثيقة العمل الحر: ${freelanceDoc}` : `Freelance: ${freelanceDoc}`}
                </span>
              </>
            )}
            {owsiLicense && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">
                  {owsiLicense}
                </span>
              </>
            )}
          </div>
          <div className="text-slate-400 font-mono flex items-center gap-2">
            <span>{t.footerCountry}</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
              PADI Certified
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
