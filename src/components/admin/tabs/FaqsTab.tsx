import React, { useState } from 'react';
import { HelpCircle, Plus, Edit3, Trash2, Check } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { FAQItem } from '../../../data/divingData';

interface FaqsTabProps {
  faqs: FAQItem[];
  onUpdateFaqs: (faqs: FAQItem[]) => void;
  showToast: (msg?: string) => void;
}

export const FaqsTab: React.FC<FaqsTabProps> = ({ faqs, onUpdateFaqs, showToast }) => {
  const { isRtl } = useLanguage();
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
        </button>
      </div>

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
