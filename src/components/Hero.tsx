import React from 'react';
import { ArrowLeft, ArrowRight, Award, ShieldCheck, Users, CalendarCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

interface HeroProps {
  onOpenBooking: (courseId?: string) => void;
  onExploreCourses: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreCourses }) => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const whatsAppText = isRtl
    ? `السلام عليكم كابتن فهد، أود الاستفسار عن تفاصيل دورات الغوص والرحلات القادمة بجدة`
    : `Hello Captain Fahad, I would like to inquire about certified scuba courses and upcoming boat expeditions in Jeddah.`;

  const heroBadge = language === 'ar' ? config.hero.badgeAr : config.hero.badgeEn;
  const heroHeadline = language === 'ar' ? config.hero.headlineAr : config.hero.headlineEn;
  const heroHighlight = language === 'ar' ? config.hero.headlineHighlightAr : config.hero.headlineHighlightEn;
  const heroSubhead = language === 'ar' ? config.hero.subheadAr : config.hero.subheadEn;

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden ocean-gradient-hero caustics-pattern pt-12 pb-20">
      {/* Background ambient deep sea light beams themed with logo blue */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-sky-500/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-blue-700/15 blur-[130px] rounded-full" />
        
        {/* Subtle decorative bathymetric contours SVG */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-10 stroke-blue-400/40 pointer-events-none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-200,100 C300,300 700,50 1400,200 C1800,300 2200,100 2500,250" strokeWidth="1.5" />
          <path d="M-200,300 C400,150 800,450 1500,300 C1900,200 2200,400 2500,320" strokeWidth="1.2" />
          <path d="M-200,550 C200,700 800,500 1300,650 C1800,750 2100,550 2500,600" strokeWidth="1.5" />
          <path d="M-200,750 C300,600 700,850 1400,700 C1900,600 2200,800 2500,750" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Content Column */}
          <div className={`lg:col-span-7 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
            
            {/* Clean unboxed editorial metadata kicker */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 tracking-wide">
              <Award className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{heroBadge}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{t.heroLocation}</span>
            </div>

            {/* High-impact headline in logo blue & white */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] text-balance">
              {heroHeadline}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                {heroHighlight}
              </span>
            </h1>

            {/* Concrete value proposition */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {heroSubhead}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] rounded-xl transition-all shadow-xl shadow-blue-600/30 whitespace-nowrap cursor-pointer"
              >
                <CalendarCheck className="w-5 h-5 text-white" />
                <span>{t.heroCtaBook}</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-xl transition-all whitespace-nowrap cursor-pointer group"
              >
                <span>{t.heroCtaCourses}</span>
                <ArrowIcon className={`w-4 h-4 text-blue-400 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>

            {/* Quantitative Proof adjacent to claims (Optionally toggleable) */}
            {config.hero.showStats !== false && (
              <div className={`pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 sm:gap-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {config.hero.divesStat || '1,450+'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {language === 'ar' ? (config.hero.divesLabelAr || 'عدد الغوصات الموثقة') : (config.hero.divesLabelEn || 'Logged Dives')}
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
                    {config.hero.studentsStat || '520+'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {language === 'ar' ? (config.hero.studentsLabelAr || 'عدد الغواصين الخريجين') : (config.hero.studentsLabelEn || 'Certified Students')}
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tabular-nums">
                    {config.hero.safetyStat || '100%'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {language === 'ar' ? (config.hero.safetyLabelAr || 'سجل الأمان والسلامة') : (config.hero.safetyLabelEn || 'Safety Record')}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Visual Showcase Column (Featuring the official logo & ocean depth monitor) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/40 via-slate-800/40 to-slate-900/60 shadow-2xl shadow-blue-950/50">
              
              <div className="relative rounded-[22px] overflow-hidden bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
                
                {/* Official Accreditation Header */}
                <div className={`flex items-center gap-3.5 pb-5 border-b border-slate-800 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                      {isRtl ? 'اعتمادات PADI الدولية المعتمدة' : 'Official PADI Accreditations'}
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {config.instructor.titleAr || 'PADI Open Water Scuba Instructor (OWSI)'}
                    </h3>
                  </div>
                </div>

                {/* Instructor Highlights list */}
                <div className={`space-y-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {t.heroWhyTitle}
                  </div>

                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{t.heroWhy1}</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{t.heroWhy2}</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <Users className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{t.heroWhy3}</span>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Quick Link */}
                <a
                  href={`https://wa.me/${config.brand.whatsappNumber}?text=${encodeURIComponent(whatsAppText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium text-sm transition-colors cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>{t.heroChatWhatsApp}</span>
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
