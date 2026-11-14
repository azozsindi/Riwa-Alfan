import React from 'react';
import { Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

interface AnnouncementBarProps {
  onClaimOffer?: (courseId?: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = () => {
  const { language } = useLanguage();
  const { config } = useSiteConfig();

  const { announcement } = config;

  if (!announcement.enabled) {
    return null;
  }

  const badgeText = language === 'ar' ? announcement.badgeAr : announcement.badgeEn;
  const mainText = language === 'ar' ? announcement.textAr : announcement.textEn;

  return (
    <aside 
      aria-label={badgeText}
      className="bg-gradient-to-r from-[#0C172B] via-[#162E52] to-[#0C172B] text-white text-xs py-2 sm:py-2.5 px-3 sm:px-4 relative z-50 shadow-md border-b border-[#C59B5F]/35"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 sm:gap-3">
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
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
          <span className="font-medium text-slate-200 tracking-wide text-xs sm:text-[13px] leading-snug">
            {mainText}
          </span>
        </div>
      </div>
    </aside>
  );
};
