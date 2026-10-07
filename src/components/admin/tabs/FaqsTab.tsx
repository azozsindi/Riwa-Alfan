import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit3, Trash2, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FAQItem } from '../../../data/divingData';
import { DesignContentConfig } from '../../../types/admin';
import { DEFAULT_DESIGN_CONTENT } from '../../../data/defaultConfig';

interface FaqsTabProps {
  faqs: FAQItem[];
  initialDesign?: DesignContentConfig;
  onUpdateFaqs: (faqs: FAQItem[]) => void;
  onUpdateDesign?: (design: Partial<DesignContentConfig>) => void;
  showToast: (msg?: string) => void;
}

export const FaqsTab: React.FC<FaqsTabProps> = ({ 
  faqs, 
  initialDesign = DEFAULT_DESIGN_CONTENT,
  onUpdateFaqs, 
  onUpdateDesign,
  showToast 
}) => {
  const { isRtl } = useLanguage();
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [designForm, setDesignForm] = useState<DesignContentConfig>(initialDesign);
  const [showHeaderEditor, setShowHeaderEditor] = useState(false);

  useEffect(() => {
    if (initialDesign) setDesignForm(initialDesign);
  }, [initialDesign]);

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDesign?.(designForm);
    showToast(isRtl ? 'تم حفظ عنوان ومقدمة قسم الأسئلة الشائعة!' : 'FAQ header updated!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            {isRtl ? 'إدارة الأسئلة الشائعة وإجاباتها' : 'FAQ Management'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'إضافة وتعديل وحذف أي سؤال وإجابة تظهر للزوار في قسم الأسئلة الشائعة.'
              : 'Add, update or delete frequently asked questions and answers displayed to visitors.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowHeaderEditor(!showHeaderEditor)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>{isRtl ? 'تعديل عنوان ومقدمة القسم' : 'Edit Section Header'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHeaderEditor ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              const currentFaqs = faqs && faqs.length > 0 ? faqs : [];
              const updated = [
                ...currentFaqs,
                {
                  question: { ar: 'سؤال جديد يهم المتدربين؟', en: 'New Frequently Asked Question?' },
                  answer: { ar: 'إجابة مفصلة وواضحة من كابتن فهد هنا.', en: 'Detailed clear answer from Captain Fahad.' }
                }
              ];
              onUpdateFaqs(updated);
              setEditingFaqIndex(updated.length - 1);
              showToast(isRtl ? 'تمت إضافة سؤال جديد، يمكنك تعديله بالأسفل' : 'New FAQ added');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Section Header Editor */}
      {showHeaderEditor && (
        <form onSubmit={handleSaveHeader} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              <span>{isRtl ? 'تعديل عنوان ونصوص مقدمة قسم الأسئلة الشائعة' : 'FAQ Section Header Texts'}</span>
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isRtl ? 'حفظ النصوص' : 'Save Header'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالعربية):' : 'Kicker (Arabic):'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={designForm.faqKickerAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, faqKickerAr: e.target.value }))}
                placeholder="إجابات ومعلومات وافية · كل ما تود معرفته"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالإنجليزية):' : 'Kicker (English):'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={designForm.faqKickerEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, faqKickerEn: e.target.value }))}
                placeholder="Everything You Need to Know · FAQs"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العنوان الرئيسي (بالعربية):' : 'Title (Arabic):'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={designForm.faqTitleAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, faqTitleAr: e.target.value }))}
                placeholder="الأسئلة الشائعة حول دورات ورحلات الغوص"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العنوان الرئيسي (بالإنجليزية):' : 'Title (English):'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={designForm.faqTitleEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, faqTitleEn: e.target.value }))}
                placeholder="Frequently Asked Questions"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الوصف التوضيحي (بالعربية):' : 'Description (Arabic):'}
              </label>
              <textarea
                dir="rtl"
                rows={2}
                value={designForm.faqDescAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, faqDescAr: e.target.value }))}
                placeholder="إجابات مباشرة ومفصلة من كابتن فهد على أكثر الاستفسارات تكراراً لدى المتدربين والمهتمين بعالم الغوص."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الوصف التوضيحي (بالإنجليزية):' : 'Description (English):'}
              </label>
              <textarea
                dir="ltr"
                rows={2}
                value={designForm.faqDescEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, faqDescEn: e.target.value }))}
                placeholder="Direct and comprehensive answers from Captain Fahad covering the most common inquiries about diving training in Jeddah."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>
          </div>
        </form>
      )}

      {/* FAQ List */}
      <div className="space-y-3">
        {(faqs || []).map((faq, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            {editingFaqIndex === idx ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isRtl ? 'نص السؤال:' : 'Question:'}
                  </label>
                  <input
                    type="text"
                    value={faq.question.ar}
                    onChange={(e) => {
                      const updated = [...(faqs || [])];
                      updated[idx] = {
                        ...updated[idx],
                        question: { ...updated[idx].question, ar: e.target.value, en: e.target.value }
                      };
                      onUpdateFaqs(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isRtl ? 'نص الإجابة:' : 'Answer:'}
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer.ar}
                    onChange={(e) => {
                      const updated = [...(faqs || [])];
                      updated[idx] = {
                        ...updated[idx],
                        answer: { ...updated[idx].answer, ar: e.target.value, en: e.target.value }
                      };
                      onUpdateFaqs(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaqIndex(null);
                      showToast();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تم الحفظ' : 'Done'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-xs">#{idx + 1}</span>
                    <span>{faq.question.ar}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed ps-5">
                    {faq.answer.ar}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingFaqIndex(idx)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isRtl ? 'تعديل السؤال' : 'Edit'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {(faqs || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (faqs || []).filter((_, i) => i !== idx);
                        onUpdateFaqs(updated);
                        showToast(isRtl ? 'تم حذف السؤال' : 'FAQ removed');
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                      title={isRtl ? 'حذف السؤال' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
