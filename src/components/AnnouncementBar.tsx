import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, X, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface AnnouncementBarProps {
  onClaimOffer: (courseId?: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onClaimOffer }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const [isDismissed, setIsDismissed] = useState(false);

  const { announcement } = config;

  if (!announcement.enabled || isDismissed) {
    return null;
  }

  const badgeText = language === 'ar' ? announcement.badgeAr : announcement.badgeEn;
  const mainText = language === 'ar' ? announcement.textAr : announcement.textEn;
  const ctaText = language === 'ar' ? announcement.ctaTextAr : announcement.ctaTextEn;

  return (
    <aside 
      aria-label={badgeText}
      className="bg-gradient-to-r from-[#0C172B] via-[#162E52] to-[#0C172B] text-white text-xs py-2 px-3 sm:px-4 relative z-50 shadow-md border-b border-[#C59B5F]/35"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left / Center content */}
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-start">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C59B5F]/20 backdrop-blur-sm text-[#E0BA84] font-bold text-[11px] border border-[#C59B5F]/40">
            <Tag className="w-3 h-3 text-[#DDB67E]" />
            <span>{badgeText}</span>
            {announcement.discountPercentage && (
              <span className="bg-[#C59B5F] text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                {announcement.discountPercentage}% OFF
              </span>
            )}
          </span>

          {/* Text */}
          <span className="font-medium text-slate-200 tracking-wide">
            {mainText}
          </span>

          {/* Action button */}
          <button
            onClick={() => onClaimOffer(announcement.highlightCourseId)}
            className="inline-flex items-center gap-1 font-bold text-[#E0BA84] hover:text-white underline decoration-[#C59B5F] underline-offset-4 hover:decoration-white transition-all cursor-pointer text-xs"
          >
            <span>{ctaText}</span>
            {isRtl ? (
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            ) : (
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title={isRtl ? 'إغلاق الإعلان' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
