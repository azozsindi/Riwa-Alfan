import React, { useState } from 'react';
import { Course } from '../data/divingData';
import { ArrowLeft, ArrowRight, Clock, Check, X, ShieldAlert, BookOpen, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

interface CoursesSectionProps {
  onSelectCourseForBooking: (courseId: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onSelectCourseForBooking }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const coursesList = config.courses || [];
  const filteredCourses = activeCategory === 'all' 
    ? coursesList 
    : coursesList.filter(c => c.category === activeCategory);

  const displayedCourses = (activeCategory === 'all' && !showAllCourses)
    ? filteredCourses.slice(0, 3)
    : filteredCourses;

  const d = config.designContent;
  const coursesKicker = language === 'ar' ? (d?.coursesKickerAr || t.coursesKicker) : (d?.coursesKickerEn || t.coursesKicker);
  const coursesTitle = language === 'ar' ? (d?.coursesTitleAr || t.coursesTitle) : (d?.coursesTitleEn || t.coursesTitle);
  const coursesDesc = language === 'ar' ? (d?.coursesDescAr || t.coursesDesc) : (d?.coursesDescEn || t.coursesDesc);

  return (
    <section id="courses" className="py-16 sm:py-24 bg-slate-900/50 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-10 sm:mb-12 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-blue-400 tracking-wider">
            {coursesKicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand-arabic">
            {coursesTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {coursesDesc}
          </p>
        </div>

        {/* Filter Tabs / Segmented Controls with Brand Gold Active State */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl w-fit mb-10 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catAll} ({coursesList.length})
          </button>
          <button
            onClick={() => setActiveCategory('beginner')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'beginner'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catBeginner}
          </button>
          <button
            onClick={() => setActiveCategory('advanced')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'advanced'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catAdvanced}
          </button>
          <button
            onClick={() => setActiveCategory('specialty')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'specialty'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catSpecialty}
          </button>
          <button
            onClick={() => setActiveCategory('professional')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'professional'
                ? 'gold-gradient-btn'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catProfessional}
          </button>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className={`rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-[#C59B5F]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/20 ${
                isRtl ? 'text-right' : 'text-left'
              }`}
            >
              {/* Card Header & Details */}
              <div className="p-6 sm:p-7 space-y-5">
                
                {/* Meta header without pills */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[#C59B5F] font-semibold">{course.certAgency}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{course.duration[language]}</span>
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#DDB67E] transition-colors">
                    {course.title[language]}
                  </h3>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[42px]">
                  {course.summary[language]}
                </p>

                {/* Specs metadata */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500 block">{t.maxDepthLabel}</span>
                    <span className="font-semibold text-white font-mono">{course.depth[language]}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.seaDivesLabel}</span>
                    <span className="font-semibold text-white font-mono">{course.seaDives}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.poolSessionsLabel}</span>
                    <span className="font-semibold text-white font-mono">
                      {course.poolSessions > 0 ? course.poolSessions : t.poolNotRequired}
                    </span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2 pt-2">
                  {course.highlights[language].slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#C59B5F] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Card Footer: Price & Actions */}
              <div className="p-6 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">{t.priceLabel}</span>
                  <span className="text-lg font-extrabold text-[#E0BA84] font-mono">
                    {course.price[language]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourseDetail(course)}
                    className="p-2.5 rounded-xl border border-slate-700/80 hover:border-[#C59B5F]/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={t.viewDetails}
                    aria-label={t.viewDetails}
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectCourseForBooking(course.id)}
                    className="gold-gradient-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer active:scale-95"
                  >
                    <span>{t.bookCourse}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Expand / Collapse toggle for courses when in 'all' view */}
        {activeCategory === 'all' && filteredCourses.length > 3 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-6 py-3 rounded-2xl border border-[#C59B5F]/40 bg-slate-950/80 hover:bg-slate-900 text-[#E0BA84] hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg inline-flex items-center gap-2 group"
            >
              <span>
                {showAllCourses 
                  ? (isRtl ? 'عرض أهم 3 دورات فقط ▲' : 'Show Top 3 Only ▲') 
                  : (isRtl ? `عرض باقي التخصصات والمسارات الدولية (+${filteredCourses.length - 3} دورات) ▼` : `Explore All Certified Specialties (+${filteredCourses.length - 3}) ▼`)}
              </span>
            </button>
          </div>
        )}

      </div>

      {/* Course Detail Modal */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 ${
            isRtl ? 'text-right' : 'text-left'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              {isRtl ? (
                <>
                  <button
                    onClick={() => setSelectedCourseDetail(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div>
                    <span className="text-xs text-blue-400 font-semibold">{selectedCourseDetail.certAgency}</span>
                    <h3 className="text-xl font-bold text-white">{selectedCourseDetail.title[language]}</h3>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-blue-400 font-semibold">{selectedCourseDetail.certAgency}</span>
                    <h3 className="text-xl font-bold text-white">{selectedCourseDetail.title[language]}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCourseDetail(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">{t.viewDetails}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedCourseDetail.summary[language]}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <ShieldAlert className="w-4 h-4" />
                <span>{t.prereqTitle}</span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedCourseDetail.prerequisites[language]}
              </p>
            </div>

            {/* Curriculum Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">{t.skillsTitle}</h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                {selectedCourseDetail.curriculum[language].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="font-mono text-blue-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package inclusions */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">{t.includedTitle}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {selectedCourseDetail.highlights[language].map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">{t.priceLabel}</span>
                <span className="text-xl font-bold text-[#E0BA84] font-mono">{selectedCourseDetail.price[language]}</span>
              </div>
              <button
                onClick={() => {
                  const id = selectedCourseDetail.id;
                  setSelectedCourseDetail(null);
                  onSelectCourseForBooking(id);
                }}
                className="gold-gradient-btn px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer active:scale-95"
              >
                {t.confirmBookingCourse}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
