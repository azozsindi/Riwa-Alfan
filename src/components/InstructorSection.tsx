import React from 'react';
import { Award, CheckCircle2, Shield, HeartHandshake, Sparkles, UserCheck, MessageSquare, PhoneCall, Lock, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { DEFAULT_FEMALE_INSTRUCTOR } from '../data/defaultConfig';
import { FahadsLogo } from './FahadsLogo';

interface InstructorSectionProps {
  onOpenBooking: () => void;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({ onOpenBooking }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

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

  const femaleInst = config.femaleInstructor || DEFAULT_FEMALE_INSTRUCTOR;
  const femaleName = language === 'ar' ? femaleInst.nameAr : femaleInst.nameEn;
  const femaleTitle = language === 'ar' ? femaleInst.titleAr : femaleInst.titleEn;
  const femaleBadge = language === 'ar' ? femaleInst.badgeAr : femaleInst.badgeEn;
  const femaleBio = language === 'ar' ? femaleInst.bioAr : femaleInst.bioEn;
  const femaleFeatures = language === 'ar' ? femaleInst.featuresListAr : femaleInst.featuresListEn;
  const femaleSpecialties = language === 'ar' ? femaleInst.specialtiesAr : femaleInst.specialtiesEn;
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
            {t.instSectionKicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand-arabic">
            {t.instSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.instSectionDesc}
          </p>
        </div>

        {/* Premier Instructors Row: Captain Fahad & Female Training Division side by side! */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          
          {/* Card 1: Captain Fahad Al-Huwaimli */}
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

            {/* Action */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={onOpenBooking}
                className="gold-gradient-btn w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-lg shadow-[#C59B5F]/20 text-slate-950 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>{isRtl ? 'احجز تدريبك مع كابتن فهد' : 'Book Training with Capt. Fahad'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Female Training Division (جمب الكابتن فهد مباشرة) */}
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
                  <span>{isRtl ? 'خصوصية تامة 100%' : '100% Full Privacy'}</span>
                </span>
              </div>

              {/* Profile Header without image box */}
              <div className="space-y-2 border-b border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic pt-1">{femaleName}</h3>
                <p className="text-xs text-[#C59B5F] font-semibold">{femaleTitle}</p>
                <p className="text-xs text-slate-400 font-medium font-sans">
                  {femaleInst.padiNumber || 'PADI Certified Instructor'} · {femaleInst.experienceYears || '5+ Years'}
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

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={onOpenBooking}
                className="gold-gradient-btn flex-1 w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-lg shadow-[#C59B5F]/20 text-slate-950 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isRtl ? 'حجز تدريب نسائي خاص' : 'Book Ladies Training'}</span>
              </button>

              <a
                href={femaleWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isRtl ? 'واتساب مباشر' : 'WhatsApp'}</span>
              </a>
            </div>

          </div>

        </div>

        {/* The 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-xl bg-[#C59B5F]/15 text-[#C59B5F] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">{t.pillar1Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.pillar1Desc}
            </p>
          </div>

          <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">{t.pillar2Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.pillar2Desc}
            </p>
          </div>

          <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">{t.pillar3Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.pillar3Desc}
            </p>
          </div>
        </div>

        {/* Quote banner */}
        <div className={`p-6 rounded-2xl bg-gradient-to-r from-[#162E52]/40 via-slate-900 to-[#0C172B] border border-[#C59B5F]/30 ${isRtl ? 'text-right' : 'text-left'}`}>
          <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-2 text-xs font-semibold text-[#C59B5F]">
            — {name}
          </div>
        </div>

        {/* Team of Captains & Instructors (Dynamic from Admin!) */}
        {config.captains && config.captains.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-slate-800/80 space-y-8">
            <div className={`max-w-3xl space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="text-xs font-semibold text-[#C59B5F] tracking-wider uppercase">
                {isRtl ? 'طاقم التدريب المعتمد' : 'Certified Instructors Team'}
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight font-brand-arabic">
                {isRtl ? 'نخبة كباتن ومدربي رواء الفن' : 'Riwa Alfan Elite Captains & Instructors'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {isRtl 
                  ? 'مدربون سعوديون معتمدون دولياً بخبرات عريقة في أعماق البحر الأحمر لضمان تدريب شخصي صبور وآمن 100%.' 
                  : 'Internationally certified PADI instructors dedicated to patient, high-safety coaching.'}
              </p>
            </div>

            {/* Captains Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.captains.map((cap) => (
                <div 
                  key={cap.id}
                  className={`rounded-3xl bg-slate-900/90 border p-6 flex flex-col justify-between space-y-5 transition-all group relative overflow-hidden shadow-lg shadow-black/20 ${
                    cap.isLead 
                      ? 'border-[#C59B5F]/50 ring-1 ring-[#C59B5F]/30' 
                      : 'border-slate-800 hover:border-[#C59B5F]/40'
                  } ${isRtl ? 'text-right' : 'text-left'}`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Badges without image */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C59B5F]/15 border border-[#C59B5F]/30 text-[#C59B5F] flex items-center justify-center font-bold text-sm shadow-inner">
                        {cap.isLead ? '👑' : '🤿'}
                      </div>

                      {cap.roleAr && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C59B5F]/15 text-[#E0BA84] border border-[#C59B5F]/30">
                          {isRtl ? cap.roleAr : (cap.roleEn || cap.roleAr)}
                        </span>
                      )}
                    </div>

                    {/* Captain Name & Rank */}
                    <div>
                      <h4 className="text-lg font-black text-white group-hover:text-[#E0BA84] transition-colors">
                        {language === 'ar' ? cap.nameAr : (cap.nameEn || cap.nameAr)}
                      </h4>
                      <p className="text-xs text-[#C59B5F] font-semibold mt-0.5">
                        {language === 'ar' ? cap.titleAr : (cap.titleEn || cap.titleAr)}
                      </p>
                      {cap.padiNumber && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B5F]" />
                          <span>{cap.padiNumber}</span>
                          {cap.experienceYears && (
                            <>
                              <span className="text-slate-600">·</span>
                              <span>{cap.experienceYears}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {cap.bioAr && (
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {language === 'ar' ? cap.bioAr : (cap.bioEn || cap.bioAr)}
                      </p>
                    )}

                    {/* Specialties */}
                    {((language === 'ar' ? cap.specialtiesAr : cap.specialtiesEn) || cap.specialtiesAr) && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {((language === 'ar' ? cap.specialtiesAr : (cap.specialtiesEn && cap.specialtiesEn.length > 0 ? cap.specialtiesEn : cap.specialtiesAr)) || []).slice(0, 3).map((spec, i) => (
                          <span 
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            {spec}
                          </span>
                        ))}
                        {(cap.specialtiesAr || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5">
                            +{(cap.specialtiesAr || []).length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions: Book / WhatsApp */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="gold-gradient-btn flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-center active:scale-95"
                    >
                      {isRtl ? 'احجز تدريبك' : 'Book Training'}
                    </button>

                    {cap.whatsappNumber && (
                      <a
                        href={`https://wa.me/${cap.whatsappNumber}?text=${encodeURIComponent(
                          isRtl 
                            ? `السلام عليكم ${cap.nameAr}، أود الاستفسار والتنسيق معك بشأن دورات الغوص والرحلات القادمة في رواء الفن بجدة.` 
                            : `Hello ${cap.nameEn || cap.nameAr}, I would like to inquire about diving training sessions with you at Riwa Alfan.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        title={isRtl ? `تواصل واتساب مع ${cap.nameAr}` : `WhatsApp with ${cap.nameEn || cap.nameAr}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
