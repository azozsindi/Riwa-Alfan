import React from 'react';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export const UnderConstructionBanner: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();

  const uc = config.underConstruction;
  const isVisible = (uc?.enabled ?? true) && (config.visibleSections?.underConstructionBar !== false);

  if (!isVisible) {
    return null;
  }

  const badge = language === 'ar' 
    ? (uc?.badgeTextAr || uc?.badgeAr || 'الموقع تحت التجربة والتطوير 🚧') 
    : (uc?.badgeTextEn || uc?.badgeEn || 'Website Under Testing & Updates 🚧');

  const message = language === 'ar'
    ? (uc?.messageAr || uc?.textAr || 'الموقع قيد التجربة والتجهيز حالياً · يسعدنا استقبال استفساراتكم وحجوزات دورات الغوص عبر الواتساب مباشرة')
    : (uc?.messageEn || uc?.textEn || 'Website is currently under testing & development · Welcoming inquiries and course bookings via WhatsApp');

  const whatsappBtnText = language === 'ar'
    ? (uc?.whatsappBtnTextAr || 'تواصل عبر واتساب')
    : (uc?.whatsappBtnTextEn || 'Chat on WhatsApp');

  const cleanPhone = (config.brand.whatsappNumber || '966530549675').replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isRtl
      ? 'السلام عليكم كابتن فهد، رأيت أن الموقع تحت التجربة والتحديث وأود الاستفسار عن تفاصيل دورات الغوص والرحلات القادمة بجدة'
      : 'Hello Captain Fahad, I saw the website is under testing and would like to inquire about diving courses in Jeddah'
  )}`;

  return (
    <div 
      role="banner"
      aria-label={badge}
      className="bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-b border-amber-500/40 text-amber-200 text-xs py-2 sm:py-2.5 px-3 sm:px-4 relative z-50 shadow-lg shadow-amber-950/20 backdrop-blur-md"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] shrink-0 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{badge}</span>
        </span>

        {/* Text Message */}
        <span className="text-slate-200 font-medium tracking-wide text-xs sm:text-[13px] leading-snug">
          {message}
        </span>

        {/* WhatsApp Direct Action Button */}
        {uc?.showWhatsAppButton !== false && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all whitespace-nowrap shadow-sm shrink-0 min-h-[30px]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{whatsappBtnText}</span>
          </a>
        )}
      </div>
    </div>
  );
};
