import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ShieldCheck,
  Users,
  CalendarCheck,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import redSeaHeroImg from '../assets/images/red_sea_hero_dive_1794667110251.jpg';

interface HeroProps {
  onOpenBooking: (courseId?: string) => void;
  onExploreCourses: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreCourses }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const heroHeadline = language === 'ar' ? config.hero.headlineAr : config.hero.headlineEn;
  const heroHighlight = language === 'ar' ? config.hero.headlineHighlightAr : config.hero.headlineHighlightEn;
  const heroSubhead = language === 'ar' ? config.hero.subheadAr : config.hero.subheadEn;
  const locationLabel =
    language === 'ar'
      ? (config.brand.locationAr || 'أبحر الشمالية - جدة')
      : (config.brand.locationEn || 'North Obhur - Jeddah');
  const heroCtaBook =
    language === 'ar'
      ? (config.hero.ctaBookAr || t.heroCtaBook)
      : (config.hero.ctaBookEn || t.heroCtaBook);
  const heroCtaCourses =
    language === 'ar'
      ? (config.hero.ctaCoursesAr || t.heroCtaCourses)
      : (config.hero.ctaCoursesEn || t.heroCtaCourses);
  const heroWhyTitle =
    language === 'ar'
      ? (config.hero.whyTitleAr || t.heroWhyTitle)
      : (config.hero.whyTitleEn || t.heroWhyTitle);
  const heroWhy1 =
    language === 'ar'
      ? (config.hero.why1Ar || t.heroWhy1)
      : (config.hero.why1En || t.heroWhy1);
  const heroWhy2 =
    language === 'ar'
      ? (config.hero.why2Ar || t.heroWhy2)
      : (config.hero.why2En || t.heroWhy2);
  const heroWhy3 =
    language === 'ar'
      ? (config.hero.why3Ar || t.heroWhy3)
      : (config.hero.why3En || t.heroWhy3);

  return (
    <section
      id="home"
      className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-8 sm:pt-14 pb-14 sm:pb-20"
    >
      {/* Atmospheric Underwater Backdrop with High-Contrast Directional Scrim */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={redSeaHeroImg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950" />
        <div
          className={`absolute inset-0 ${
            isRtl
              ? 'bg-gradient-to-l from-slate-950 via-slate-950/85 to-slate-950/55'
              : 'bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/55'
          }`}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-[#C59B5F]/10 blur-[140px] rounded-full" />
        <div className="caustics-pattern absolute inset-0 opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Main Content Column */}
          <div className={`lg:col-span-7 space-y-5 sm:space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
            {/* Clean Architectural Location Micro-Kicker (Zero Pill Clutter) */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E0BA84] tracking-wide">
              <MapPin className="w-4 h-4 text-[#C59B5F] shrink-0" />
              <span>{locationLabel}</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-300 text-xs">
                {config.brand.padiNumber || 'PADI #499845'}
              </span>
            </div>

            {/* High-impact headline in brand gold & white with generous Arabic line-height */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-normal leading-[1.35] sm:leading-[1.38] lg:leading-[1.4] font-brand-arabic">
              <span className="block mb-1.5 sm:mb-2.5">{heroHeadline}</span>
              <span className="inline-block bg-gradient-to-r from-[#F0D2A2] via-[#C59B5F] to-[#A4783B] bg-clip-text text-transparent pb-1">
                {heroHighlight}
              </span>
            </h1>

            {/* Concrete value proposition */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 leading-relaxed max-w-2xl">
              {heroSubhead}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="gold-gradient-btn inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-[0.98] min-h-[48px]"
              >
                <CalendarCheck className="w-5 h-5 text-slate-950 shrink-0" />
                <span>{heroCtaBook}</span>
              </button>

              <button
                type="button"
                onClick={onExploreCourses}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-100 bg-slate-900/80 hover:bg-slate-800/90 border border-[#C59B5F]/35 hover:border-[#C59B5F] rounded-xl transition-all whitespace-nowrap cursor-pointer group min-h-[48px]"
              >
                <span>{heroCtaCourses}</span>
                <ArrowIcon
                  className={`w-4 h-4 text-[#C59B5F] transition-transform ${
                    isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Quantitative Proof adjacent to claims */}
            {config.hero.showStats !== false && (
              <div
                className={`pt-5 sm:pt-7 border-t border-slate-800/80 grid grid-cols-3 gap-2.5 sm:gap-6 ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
              >
                <div className="p-2.5 sm:p-0 rounded-xl bg-slate-900/50 sm:bg-transparent border border-slate-800/60 sm:border-0 text-center sm:text-start">
                  <div className="text-xl xs:text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                    {config.hero.divesStat || '1,450+'}
                  </div>
                  <div className="text-[11px] sm:text-xs lg:text-sm text-slate-400 mt-1 leading-relaxed">
                    {language === 'ar'
                      ? (config.hero.divesLabelAr || 'عدد الغوصات الموثقة')
                      : (config.hero.divesLabelEn || 'Logged Dives')}
                  </div>
                </div>

                <div className="p-2.5 sm:p-0 rounded-xl bg-slate-900/50 sm:bg-transparent border border-slate-800/60 sm:border-0 text-center sm:text-start">
                  <div className="text-xl xs:text-2xl sm:text-3xl font-black text-[#E0BA84] font-mono tabular-nums">
                    {config.hero.studentsStat || '520+'}
                  </div>
                  <div className="text-[11px] sm:text-xs lg:text-sm text-slate-400 mt-1 leading-relaxed">
                    {language === 'ar'
                      ? (config.hero.studentsLabelAr || 'عدد الغواصين الخريجين')
                      : (config.hero.studentsLabelEn || 'Certified Students')}
                  </div>
                </div>

                <div className="p-2.5 sm:p-0 rounded-xl bg-slate-900/50 sm:bg-transparent border border-slate-800/60 sm:border-0 text-center sm:text-start">
                  <div className="text-xl xs:text-2xl sm:text-3xl font-black text-cyan-400 font-mono tabular-nums">
                    {config.hero.safetyStat || '100%'}
                  </div>
                  <div className="text-[11px] sm:text-xs lg:text-sm text-slate-400 mt-1 leading-relaxed">
                    {language === 'ar'
                      ? (config.hero.safetyLabelAr || 'سجل الأمان والسلامة')
                      : (config.hero.safetyLabelEn || 'Safety Record')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Showcase Column (Red Sea Photography + PADI Credentials) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-b from-[#E0BA84]/55 via-[#C59B5F]/20 to-slate-800/60 shadow-2xl shadow-black/60">
              <div className="relative rounded-[15px] sm:rounded-[23px] overflow-hidden bg-slate-900/95">
                {/* 16:9 Framed Red Sea Underwater Focal Visual */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={redSeaHeroImg}
                    alt={
                      isRtl
                        ? 'تجربة الغوص واستكشاف الشعاب المرجانية في البحر الأحمر بجدة - رواء الفن'
                        : 'Scuba diving coral reefs in the Red Sea off Jeddah - Riwa Alfan'
                    }
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  <div
                    className={`absolute bottom-3 inset-x-4 flex items-center justify-between gap-2 text-xs ${
                      isRtl ? 'flex-row' : 'flex-row'
                    }`}
                  >
                    <span className="font-bold text-white/95 drop-shadow">
                      {isRtl ? 'مياه أبحر والبحر الأحمر · جدة' : 'Obhur & Red Sea Waters · Jeddah'}
                    </span>
                    <span className="font-mono text-[11px] text-[#E0BA84] font-bold tracking-wider">
                      PADI CERTIFIED
                    </span>
                  </div>
                </div>

                {/* Accreditation Header & 3 Why-Choose Highlights */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div
                    className={`flex items-center gap-3.5 pb-4 border-b border-slate-800/90 ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#C59B5F]/15 border border-[#C59B5F]/35 text-[#E0BA84] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#C59B5F] uppercase tracking-wider block">
                        {isRtl ? 'اعتمادات PADI الدولية المعتمدة' : 'Official PADI Accreditations'}
                      </span>
                      <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                        {(language === 'ar'
                          ? (config.instructor.titleAr || 'PADI Open Water Scuba Instructor')
                          : (config.instructor.titleEn || 'PADI Open Water Scuba Instructor')
                        )
                          .replace(/\s*\(OWSI\)/gi, '')
                          .trim()}
                      </h2>
                    </div>
                  </div>

                  <div className={`space-y-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {heroWhyTitle}
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/75 border border-slate-800/80">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{heroWhy1}</span>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/75 border border-slate-800/80">
                        <Award className="w-4 h-4 text-[#E0BA84] shrink-0 mt-0.5" />
                        <span className="leading-snug">{heroWhy2}</span>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/75 border border-slate-800/80">
                        <Users className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{heroWhy3}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
