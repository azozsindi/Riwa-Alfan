import React from 'react';
import { Award, CheckCircle2, Shield, HeartHandshake, Sparkles, UserCheck, MessageSquare, PhoneCall, Lock, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { DEFAULT_FEMALE_INSTRUCTOR } from '../data/defaultConfig';
import { FahadsLogo } from './FahadsLogo';

interface InstructorSectionProps {
  onOpenBooking: () => void;
  showCaptainFahad?: boolean;
  showFemaleTraining?: boolean;
  showQuote?: boolean;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({ 
  onOpenBooking,
  showCaptainFahad = true,
  showFemaleTraining = true,
  showQuote = true,
}) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  if (!showCaptainFahad && !showFemaleTraining && !showQuote) {
    return null;
  }

  const inst = config.instructor;
  const name = language === 'ar' ? inst.nameAr : inst.nameEn;
  const title = language === 'ar' ? inst.titleAr : inst.titleEn;
  const accreditation = language === 'ar' 
    ? (inst.accreditationAr || 'مدرب محترف معتمد دولياً لدى منظمة PADI') 
    : (inst.accreditationEn || 'Internationally Certified PADI Diving Professional');
  const bio = language === 'ar' ? inst.bioAr : inst.bioEn;
  const quote = language === 'ar' ? inst.quoteAr : inst.quoteEn;
  const specialties = language === 'ar' ? inst.specialtiesAr : inst.specialtiesEn;
  const certsList = (language === 'ar' ? inst.certificatesListAr : inst.certificatesListEn) && (language === 'ar' ? inst.certificatesListAr : inst.certificatesListEn)!.length > 0
    ? (language === 'ar' ? inst.certificatesListAr : inst.certificatesListEn)!
    : [inst.padiMemberNumber, inst.owsiNumber, inst.danNumber, inst.efrNumber].filter(Boolean);

  const d = config.designContent;
  const sectionKicker = language === 'ar' ? (d?.instSectionKickerAr || t.instSectionKicker) : (d?.instSectionKickerEn || t.instSectionKicker);
  const sectionTitle = language === 'ar' ? (d?.instSectionTitleAr || t.instSectionTitle) : (d?.instSectionTitleEn || t.instSectionTitle);
  const sectionDesc = language === 'ar' ? (d?.instSectionDescAr || t.instSectionDesc) : (d?.instSectionDescEn || t.instSectionDesc);

  const activeQuote = language === 'ar' 
    ? (d?.quoteTextAr || inst.quoteAr)
    : (d?.quoteTextEn || inst.quoteEn);
  const activeQuoteAuthor = language === 'ar'
    ? (d?.quoteAuthorAr || name)
    : (d?.quoteAuthorEn || name);

  const pillar1Title = language === 'ar' ? (d?.pillar1TitleAr || t.pillar1Title) : (d?.pillar1TitleEn || t.pillar1Title);
  const pillar1Desc = language === 'ar' ? (d?.pillar1DescAr || t.pillar1Desc) : (d?.pillar1DescEn || t.pillar1Desc);

  const pillar2Title = language === 'ar' ? (d?.pillar2TitleAr || t.pillar2Title) : (d?.pillar2TitleEn || t.pillar2Title);
  const pillar2Desc = language === 'ar' ? (d?.pillar2DescAr || t.pillar2Desc) : (d?.pillar2DescEn || t.pillar2Desc);

  const pillar3Title = language === 'ar' ? (d?.pillar3TitleAr || t.pillar3Title) : (d?.pillar3TitleEn || t.pillar3Title);
  const pillar3Desc = language === 'ar' ? (d?.pillar3DescAr || t.pillar3Desc) : (d?.pillar3DescEn || t.pillar3Desc);

  const femaleInst = config.femaleInstructor || DEFAULT_FEMALE_INSTRUCTOR;
  const femaleName = language === 'ar' ? femaleInst.nameAr : femaleInst.nameEn;
  const femaleTitle = language === 'ar' ? femaleInst.titleAr : femaleInst.titleEn;
  const femaleBadge = language === 'ar' ? femaleInst.badgeAr : femaleInst.badgeEn;
  const femaleBio = language === 'ar' ? femaleInst.bioAr : femaleInst.bioEn;
  const femaleFeatures = language === 'ar' ? femaleInst.featuresListAr : femaleInst.featuresListEn;
  const femaleSpecialties = language === 'ar' ? femaleInst.specialtiesAr : femaleInst.specialtiesEn;
  const femalePrivacyText = language === 'ar' 
    ? (femaleInst.privacyTextAr || 'خصوصية تامة 100%') 
    : (femaleInst.privacyTextEn || '100% Full Privacy');
  const femaleBookingBtn = language === 'ar'
    ? (femaleInst.bookingBtnAr || 'حجز تدريب نسائي خاص')
    : (femaleInst.bookingBtnEn || 'Book Ladies Training');
  const femaleWhatsappUrl = `https://wa.me/${femaleInst.whatsappNumber || config.brand.whatsappNumber}?text=${encodeURIComponent(
    isRtl 
      ? `السلام عليكم، أود الاستفسار والتسجيل في برامج التدريب النسائي الخاص لدى رواء الفن بجدة.` 
      : `Hello, I would like to inquire about women's private diving training at Riwa Alfan Jeddah.`
  )}`;

  return (
    <section id="instructor" className="py-16 sm:py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-10 sm:mb-16 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-[#C59B5F] tracking-wider">
            {sectionKicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand-arabic">
            {sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {sectionDesc}
          </p>
        </div>

        {/* Premier Instructors Row: Captain Fahad & Female Training Division */}
        {(showCaptainFahad || showFemaleTraining) && (
          <div className={
            showCaptainFahad && showFemaleTraining
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-12"
              : "max-w-2xl mx-auto mb-12"
          }>
            
            {/* Card 1: Captain Fahad Al-Huwaimli */}
            {showCaptainFahad && (
              <div className={`rounded-3xl bg-slate-900 border border-[#C59B5F]/35 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl shadow-black/30 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="space-y-6">
                  
                  {/* Profile Header without image box */}
                  <div className="space-y-2 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#DDB67E]/20 via-[#C59B5F]/25 to-[#A4783B]/20 text-[#E0BA84] border border-[#C59B5F]/40 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                        <span>👑</span>
                        <span>{isRtl ? 'كبير المدربين ومؤسس رواء الفن' : 'Lead Instructor & Founder'}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold text-[11px]">
                        PADI OWSI
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic pt-1">{name}</h3>
                    <p className="text-xs text-[#C59B5F] font-semibold">{title}</p>
                    <p className="text-xs text-slate-400 font-medium">{accreditation}</p>
                  </div>

                  {/* Bio text */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {bio}
                  </p>

                  {/* Verified badges list (Dynamic certificates & license numbers) */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                    {certsList.map((certItem, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C59B5F] shrink-0" />
                        <span className="text-slate-200 font-medium font-sans">{certItem}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specialties preview */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-slate-400">
                      {t.instSpecialtiesHeading}:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {specialties.slice(0, 4).map((spec, idx) => (
                        <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: Dual 50% buttons side-by-side */}
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 sm:gap-3 items-stretch">
                  <button
                    onClick={onOpenBooking}
                    className="gold-gradient-btn py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-lg shadow-[#C59B5F]/20 text-slate-950 flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-slate-950 shrink-0" />
                    <span className="truncate">{isRtl ? 'احجز تدريبك' : 'Book Training'}</span>
                  </button>

                  <a
                    href={`https://wa.me/${config.brand.whatsappNumber}?text=${encodeURIComponent(
                      isRtl 
                        ? 'السلام عليكم كابتن فهد، أود الاستفسار والتنسيق معك حول دورات الغوص والرحلات القادمة في رواء الفن بجدة.' 
                        : 'Hello Capt. Fahad, I would like to inquire about diving training courses at Riwa Alfan Jeddah.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-[#C59B5F]/40 text-[#E0BA84] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0 text-[#C59B5F]" />
                    <span className="truncate">{isRtl ? 'واتساب مباشر' : 'WhatsApp'}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Card 2: Female Training Division */}
            {showFemaleTraining && (
              <div className={`rounded-3xl bg-gradient-to-b from-slate-900 via-[#16253D]/40 to-slate-900 border border-[#C59B5F]/45 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl shadow-black/30 relative overflow-hidden ring-1 ring-[#C59B5F]/25 ${isRtl ? 'text-right' : 'text-left'}`}>
                
                {/* Top decorative banner */}
                <div className="space-y-6">
                  
                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#DDB67E]/20 via-[#C59B5F]/25 to-[#A4783B]/20 text-[#E0BA84] border border-[#C59B5F]/40 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                      <span>🧕</span>
                      <span>{femaleBadge}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>{femalePrivacyText}</span>
                    </span>
                  </div>

                  {/* Profile Header without image box */}
                  <div className="space-y-2 border-b border-slate-800/80 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic pt-1">{femaleName}</h3>
                    <p className="text-xs text-[#C59B5F] font-semibold">{femaleTitle}</p>
                    <p className="text-xs text-slate-400 font-medium font-sans">
                      {femaleInst.padiNumber || 'PADI Certified Instructor'} · {femaleInst.experienceYears || '6+ سنوات خبرة'}
                    </p>
                  </div>

                  {/* Bio text */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {femaleBio}
                  </p>

                  {/* Features list (Private pools, accredited licenses, privacy) */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    {femaleFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specialties */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-semibold text-slate-400">
                      {isRtl ? 'الدورات والبرامج النسائية المتاحة:' : 'Available Women\'s Programs:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {femaleSpecialties.map((spec, idx) => (
                        <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Action buttons: Dual 50% buttons side-by-side (مربعين جمب بعض مو تحت بعض وماخذه نص الشاشة) */}
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 sm:gap-3 items-stretch">
                  <button
                    onClick={onOpenBooking}
                    className="gold-gradient-btn py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-lg shadow-[#C59B5F]/20 text-slate-950 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                    <span className="truncate">{femaleBookingBtn}</span>
                  </button>

                  <a
                    href={femaleWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate">{isRtl ? 'واتساب مباشر' : 'WhatsApp'}</span>
                  </a>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Sleek Unified Philosophy & Trust Banner (Combines Quote & 3 Pillars compactly) */}
        {showQuote && (
          <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#162E52]/40 via-slate-900 to-[#0C172B] border border-[#C59B5F]/35 space-y-5 shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
              &ldquo;{activeQuote}&rdquo;
            </p>
            <span className="text-xs font-bold text-[#E0BA84] shrink-0 font-brand-arabic">
              — {activeQuoteAuthor}
            </span>
          </div>

          {/* 3 Core Trust Badges in a single sleek row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <Shield className="w-4 h-4 text-[#C59B5F] shrink-0" />
              <div>
                <strong className="text-xs font-bold text-white block">{pillar1Title}</strong>
                <span className="text-[11px] text-slate-400">{pillar1Desc}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <HeartHandshake className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <strong className="text-xs font-bold text-white block">{pillar2Title}</strong>
                <span className="text-[11px] text-slate-400">{pillar2Desc}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong className="text-xs font-bold text-white block">{pillar3Title}</strong>
                <span className="text-[11px] text-slate-400">{pillar3Desc}</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Additional Certified Captains (Rendered only if there are other captains besides Lead Instructor) */}
        {(() => {
          const otherCaptains = (config.captains || []).filter(
            c => !c.isLead && c.id !== 'captain-fahad' && c.nameAr !== inst.nameAr
          );
          if (otherCaptains.length === 0) return null;

          return (
            <div className="mt-12 pt-8 border-t border-slate-800/80 space-y-6">
              <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="text-xs font-semibold text-[#C59B5F] tracking-wider uppercase">
                  {isRtl ? 'طاقم التدريب المعتمد' : 'Certified Instructors Team'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
                  {isRtl ? 'كباتن ومدربو رواء الفن' : 'Riwa Alfan Instructors'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherCaptains.map((cap) => (
                  <div 
                    key={cap.id}
                    className={`rounded-2xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-md ${isRtl ? 'text-right' : 'text-left'}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">
                          {language === 'ar' ? cap.nameAr : (cap.nameEn || cap.nameAr)}
                        </span>
                        {cap.roleAr && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C59B5F]/15 text-[#E0BA84] border border-[#C59B5F]/30">
                            {isRtl ? cap.roleAr : (cap.roleEn || cap.roleAr)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#C59B5F] font-medium">
                        {language === 'ar' ? cap.titleAr : (cap.titleEn || cap.titleAr)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onOpenBooking}
                        className="gold-gradient-btn flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-center"
                      >
                        {isRtl ? 'احجز تدريبك' : 'Book Training'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
};
