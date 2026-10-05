import React, { useState } from 'react';
import { MessageSquare, Plus, Edit3, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Testimonial } from '../../../data/divingData';

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  showToast: (msg?: string) => void;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  testimonials,
  onUpdateTestimonials,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            {isRtl ? 'إدارة آراء وتجارب المتدربين والخرجين' : 'Student Testimonials & Reviews'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'إضافة وتعديل تجارب الغواصين والخريجين الحقيقية مع كابتن فهد.'
              : 'Manage verified student experiences and feedback quotes.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const current = testimonials || [];
            const newT: Testimonial = {
              id: `t-${Date.now()}`,
              name: { ar: 'متدرب جديد', en: 'New Graduate' },
              role: { ar: 'غواص مياه مفتوحة مرخص', en: 'Certified Diver' },
              course: { ar: 'دورة غواص المياه المفتوحة', en: 'Open Water Diver' },
              quote: { ar: 'تجربة تدريب استثنائية مع كابتن فهد تميزت بالصبر العالي والأمان.', en: 'Great diving experience!' },
              date: { ar: '2026', en: '2026' },
              avatarSeed: 'diver'
            };
            const updated = [...current, newT];
            onUpdateTestimonials(updated);
            setEditingTestimonialIndex(updated.length - 1);
            showToast(isRtl ? 'تمت إضافة رأي جديد، يمكنك تعديله بالأسفل' : 'New testimonial added');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة رأي متدرب جديد' : 'Add Review'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(testimonials || []).map((testi, idx) => (
          <div key={testi.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            {editingTestimonialIndex === idx ? (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    {isRtl ? 'اسم المتدرب:' : 'Student Name:'}
                  </label>
                  <input
                    type="text"
                    value={testi.name.ar}
                    onChange={(e) => {
                      const updated = [...(testimonials || [])];
                      updated[idx] = {
                        ...updated[idx],
                        name: { ...updated[idx].name, ar: e.target.value, en: e.target.value }
                      };
                      onUpdateTestimonials(updated);
                    }}
                    className="w-full px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    {isRtl ? 'الدورة التدريبية التي تخرج منها:' : 'Graduated Course:'}
                  </label>
                  <input
                    type="text"
                    value={testi.course.ar}
                    onChange={(e) => {
                      const updated = [...(testimonials || [])];
                      updated[idx] = {
                        ...updated[idx],
                        course: { ...updated[idx].course, ar: e.target.value, en: e.target.value }
                      };
                      onUpdateTestimonials(updated);
                    }}
                    className="w-full px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300">
                    {isRtl ? 'نص التجربة أو الرأي:' : 'Quote / Review:'}
                  </label>
                  <textarea
                    rows={2}
                    value={testi.quote.ar}
                    onChange={(e) => {
                      const updated = [...(testimonials || [])];
                      updated[idx] = {
                        ...updated[idx],
                        quote: { ...updated[idx].quote, ar: e.target.value, en: e.target.value }
                      };
                      onUpdateTestimonials(updated);
                    }}
                    className="w-full px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonialIndex(null);
                    showToast();
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  {isRtl ? 'حفظ' : 'Done'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  &ldquo;{testi.quote.ar}&rdquo;
                </p>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between mt-3 text-xs">
                  <div>
                    <div className="font-bold text-white text-xs">{testi.name.ar}</div>
                    <div className="text-[10px] text-blue-400 font-medium">{testi.course.ar}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingTestimonialIndex(idx)}
                      className="p-1 rounded-md bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white"
                      title={isRtl ? 'تعديل' : 'Edit'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {(testimonials || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (testimonials || []).filter((_, i) => i !== idx);
                          onUpdateTestimonials(updated);
                          showToast(isRtl ? 'تم حذف الرأي' : 'Testimonial removed');
                        }}
                        className="p-1 rounded-md bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white"
                        title={isRtl ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
