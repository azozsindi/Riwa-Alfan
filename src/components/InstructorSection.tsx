import React from 'react';
import { Award, CheckCircle2, Shield, HeartHandshake, Sparkles, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
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

  return (
    <section id="instructor" className="py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-blue-400 tracking-wider">
            {t.instSectionKicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.instSectionTitle}
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            {t.instSectionDesc}
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Instructor Bio Card with Logo or Personal Photo */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              
              {/* Profile Avatar & Title */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-blue-500/40 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  {inst.photoUrl ? (
                    <img 
                      src={inst.photoUrl} 
                      alt={name} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <FahadsLogo size="sm" theme="dark" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">{title}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{accreditation}</p>
                </div>
              </div>

              {/* Bio text */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {bio}
              </p>

              {/* Verified badges list (Dynamic certificates & license numbers) */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                {certsList.map((certItem, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-slate-200 font-medium font-sans">{certItem}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <button
                onClick={onOpenBooking}
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                {t.instCtaTalk}
              </button>
            </div>
          </div>

          {/* Specialties & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{t.pillar1Title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.pillar1Desc}
                </p>
              </div>

              <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{t.pillar2Title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.pillar2Desc}
                </p>
              </div>

              <div className={`rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{t.pillar3Title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.pillar3Desc}
                </p>
              </div>
            </div>

            {/* Teaching Specialties List (Dynamic from admin!) */}
            <div className={`rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Award className="w-5 h-5 text-blue-400" />
                <span>{t.instSpecialtiesHeading}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                {specialties.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote banner */}
            <div className={`p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-sky-950/30 border border-blue-500/30 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-2 text-xs font-semibold text-blue-400">
                — {name}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
