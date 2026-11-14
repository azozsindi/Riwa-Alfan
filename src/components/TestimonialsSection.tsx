import React from 'react';
import { TESTIMONIALS } from '../data/divingData';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

export const TestimonialsSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const testimonialsList = config.testimonials && config.testimonials.length > 0 ? config.testimonials : TESTIMONIALS;

  const d = config.designContent;
  const testiKicker = language === 'ar' ? (d?.testiKickerAr || t.testiKicker) : (d?.testiKickerEn || t.testiKicker);
  const testiTitle = language === 'ar' ? (d?.testiTitleAr || t.testiTitle) : (d?.testiTitleEn || t.testiTitle);
  const testiDesc = language === 'ar' ? (d?.testiDescAr || t.testiDesc) : (d?.testiDescEn || t.testiDesc);

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-10 sm:mb-12 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-bold text-[#C59B5F] tracking-wider">
            {testiKicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-normal leading-snug font-brand-arabic">
            {testiTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {testiDesc}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialsList.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/70 border border-slate-800 hover:border-[#C59B5F]/45 transition-colors flex flex-col justify-between space-y-6 shadow-lg shadow-black/25 ${
                isRtl ? 'text-right' : 'text-left'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Quote className="w-7 h-7 text-[#C59B5F]/50" />
                  <div className="flex items-center gap-0.5" aria-label="5 stars rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className="w-3.5 h-3.5 fill-[#C59B5F] text-[#C59B5F]" />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  &ldquo;{testimonial.quote[language]}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs gap-3">
                <div>
                  <div className="font-bold text-white text-sm">{testimonial.name[language]}</div>
                  <div className="text-slate-400 mt-0.5">
                    {testimonial.role[language]} · <span className="text-[#E0BA84] font-medium">{testimonial.course[language]}</span>
                  </div>
                </div>
                <div className="text-slate-500 font-mono shrink-0">
                  {testimonial.date[language]}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
