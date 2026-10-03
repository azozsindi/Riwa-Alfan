import React from 'react';
import { TESTIMONIALS } from '../data/divingData';
import { Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

export const TestimonialsSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { config } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const testimonialsList = config.testimonials && config.testimonials.length > 0 ? config.testimonials : TESTIMONIALS;

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-12 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="text-xs font-semibold text-blue-400 tracking-wider">
            {t.testiKicker}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.testiTitle}
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            {t.testiDesc}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialsList.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-colors flex flex-col justify-between space-y-6 ${
                isRtl ? 'text-right' : 'text-left'
              }`}
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-blue-500/40" />
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  &ldquo;{testimonial.quote[language]}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{testimonial.name[language]}</div>
                  <div className="text-slate-400">
                    {testimonial.role[language]} · <span className="text-blue-400 font-medium">{testimonial.course[language]}</span>
                  </div>
                </div>
                <div className="text-slate-500 font-mono">
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
