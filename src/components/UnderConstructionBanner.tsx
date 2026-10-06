import React, { useState } from 'react';
import { Hammer, Wrench, MessageCircle, X, AlertTriangle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export const UnderConstructionBanner: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  
  const [isDismissed, setIsDismissed] = useState(false);

  const uc = config.underConstruction;
  const isVisible = (uc?.enabled ?? true) && (config.visibleSections?.underConstructionBar !== false);

  if (!isVisible || isDismissed) {
    return null;
  }

  const badge = language === 'ar' 
    ? (uc?.badgeAr || 'الموقع قيد الإنشاء والتحديث 🚧') 
    : (uc?.badgeEn || 'Under Development & Updates 🚧');

  const message = language === 'ar'
    ? (uc?.textAr || 'الموقع قيد التجهيز والتطوير حالياً · يسعدنا استقبال استفساراتكم وحجوزات دورات الغوص عبر الواتساب مباشرة')
    : (uc?.textEn || 'Website is currently under development & updates · Welcoming inquiries and course bookings via WhatsApp');

  const cleanPhone = (config.brand.whatsappNumber || '966530549675').replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isRtl
      ? 'السلام عليكم كابتن فهد، رأيت أن الموقع قيد التحديث وأود الاستفسار عن تفاصيل دورات الغوص والرحلات القادمة بجدة'
      : 'Hello Captain Fahad, I saw the website is being updated and would like to inquire about diving courses in Jeddah'
  )}`;

  return (
    <div 
      role="banner"
      aria-label={badge}
      className="bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-b border-amber-500/40 text-amber-200 text-xs py-2 px-3 sm:px-4 relative z-50 shadow-lg shadow-amber-950/20 backdrop-blur-md"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left / Center Message */}
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-start">
          
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
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all whitespace-nowrap shadow-sm shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
            </a>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md text-amber-400/70 hover:text-amber-200 hover:bg-amber-500/10 transition-colors shrink-0 cursor-pointer"
          title={isRtl ? 'إخفاء مؤقت' : 'Dismiss'}
          aria-label={isRtl ? 'إغلاق شريط التنبيه' : 'Close notice'}
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
