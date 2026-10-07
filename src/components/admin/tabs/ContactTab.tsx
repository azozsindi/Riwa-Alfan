import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, MessageSquare, Mail, MapPin, ShieldCheck, Calendar, 
  Sparkles, Save, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { DesignContentConfig, CenterBrandConfig } from '../../../types/admin';
import { DEFAULT_DESIGN_CONTENT } from '../../../data/defaultConfig';

interface ContactTabProps {
  initialDesign?: DesignContentConfig;
  initialBrand: CenterBrandConfig;
  onUpdateDesign: (partial: Partial<DesignContentConfig>) => void;
  onUpdateBrand: (partial: Partial<CenterBrandConfig>) => void;
  showToast: (msg?: string) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  initialDesign,
  initialBrand,
  onUpdateDesign,
  onUpdateBrand,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [designForm, setDesignForm] = useState<DesignContentConfig>(initialDesign || DEFAULT_DESIGN_CONTENT);
  const [brandForm, setBrandForm] = useState<CenterBrandConfig>(initialBrand);

  useEffect(() => {
    if (initialDesign) setDesignForm(initialDesign);
  }, [initialDesign]);

  useEffect(() => {
    setBrandForm(initialBrand);
  }, [initialBrand]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDesign(designForm);
    onUpdateBrand(brandForm);
    showToast(isRtl ? 'تم حفظ نصوص قسم التواصل وبطاقة الحجز بنجاح! 🚀' : 'Contact & CTA Card saved successfully!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#C59B5F]" />
            <span>{isRtl ? 'قسم التواصل المباشر وبطاقة الحجز السريع' : 'Direct Contact & Booking Action Card'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'تعديل كافة نصوص قسم التواصل، أرقام الهاتف والواتساب، وبطاقة الحجز المباشر بالواجهة.' 
              : 'Configure contact section copy, direct phone & WhatsApp numbers, and booking action card.'}
          </p>
        </div>

        <button
          type="submit"
          className="gold-gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-[#C59B5F]/20 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'حفظ نصوص التواصل 💾' : 'Save Contact Texts 💾'}</span>
        </button>
      </div>

      {/* 1. Direct Phone, WhatsApp & Email */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
          {isRtl ? '1. أرقام الاتصال وقنوات التواصل الرسمية' : '1. Official Contact Numbers & Channels'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRtl ? 'رقم الاتصال المباشر:' : 'Direct Phone Number:'}</span>
            </label>
            <input 
              type="text"
              value={brandForm.phone || ''}
              onChange={(e) => setBrandForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+966530549675"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'رقم الواتساب (بدون + وبدون أصفار):' : 'WhatsApp Number (no +):'}</span>
            </label>
            <input 
              type="text"
              value={brandForm.whatsappNumber || ''}
              onChange={(e) => setBrandForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="966530549675"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{isRtl ? 'البريد الإلكتروني الرسمي:' : 'Official Email:'}</span>
            </label>
            <input 
              type="email"
              value={brandForm.email || ''}
              onChange={(e) => setBrandForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Riwaalfan@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact Section Copy */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
          {isRtl ? '2. نصوص وعناوين قسم التواصل' : '2. Contact Section Copy & Headlines'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الشارة العلوية (بالعربية):' : 'Section Kicker (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.contactKickerAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactKickerAr: e.target.value }))}
              placeholder="تواصل مباشر واستشارة مجانية"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الشارة العلوية (بالإنجليزية):' : 'Section Kicker (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.contactKickerEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactKickerEn: e.target.value }))}
              placeholder="Direct Contact & Free Consultation"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'عنوان القسم الرئيسي (بالعربية):' : 'Section Title (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.contactTitleAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactTitleAr: e.target.value }))}
              placeholder="هل أنت جاهز لخوض أول غطسة واستكشاف الأعماق؟"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'عنوان القسم الرئيسي (بالإنجليزية):' : 'Section Title (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.contactTitleEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactTitleEn: e.target.value }))}
              placeholder="Ready for Your First Dive & Red Sea Exploration?"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الوصف التوضيحي (بالعربية):' : 'Description (Arabic):'}
            </label>
            <textarea 
              dir="rtl"
              rows={2}
              value={designForm.contactDescAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactDescAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none leading-relaxed"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الوصف التوضيحي (بالإنجليزية):' : 'Description (English):'}
            </label>
            <textarea 
              dir="ltr"
              rows={2}
              value={designForm.contactDescEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactDescEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص نطاق التغطية والتدريب (بالعربية):' : 'Regions Served (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.regionsTextAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, regionsTextAr: e.target.value }))}
              placeholder="جدة فقط (شرم أبحر وشواطئ جدة البحرية)"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص نطاق التغطية والتدريب (بالإنجليزية):' : 'Regions Served (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.regionsTextEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, regionsTextEn: e.target.value }))}
              placeholder="Jeddah only (Sharm Obhur & Marine Coastal Sites)"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص جهة الاعتماد (بالعربية):' : 'Certification Agency Label (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.certAgencyTextAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, certAgencyTextAr: e.target.value }))}
              placeholder="شهادات PADI معتمدة دولياً"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص جهة الاعتماد (بالإنجليزية):' : 'Certification Agency Label (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.certAgencyTextEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, certAgencyTextEn: e.target.value }))}
              placeholder="Internationally Accredited PADI Licenses"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Booking CTA Action Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
          {isRtl ? '3. بطاقة الحجز السريع المجاورة لقسم التواصل' : '3. Booking CTA Action Card'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'عنوان البطاقة (بالعربية):' : 'Card Title (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.contactCardTitleAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactCardTitleAr: e.target.value }))}
              placeholder="ابدأ رحلتك اليوم بجدة"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'عنوان البطاقة (بالإنجليزية):' : 'Card Title (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.contactCardTitleEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactCardTitleEn: e.target.value }))}
              placeholder="Begin Your Journey Today in Jeddah"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'وصف البطاقة (بالعربية):' : 'Card Description (Arabic):'}
            </label>
            <textarea 
              dir="rtl"
              rows={2}
              value={designForm.contactCardDescAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactCardDescAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none leading-relaxed"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'وصف البطاقة (بالإنجليزية):' : 'Card Description (English):'}
            </label>
            <textarea 
              dir="ltr"
              rows={2}
              value={designForm.contactCardDescEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactCardDescEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الحجز (بالعربية):' : 'Button Text (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.contactCardBtnAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactCardBtnAr: e.target.value }))}
              placeholder="احجز موعد أو استشر الكابتن مجاناً"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الحجز (بالإنجليزية):' : 'Button Text (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.contactCardBtnEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, contactCardBtnEn: e.target.value }))}
              placeholder="Book Appointment or Consult Free"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'شارة التواجد اليومي (بالعربية):' : 'Availability Badge (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={designForm.availableDailyAr || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, availableDailyAr: e.target.value }))}
              placeholder="متاح يومياً للرد على استفسارات الغواصين بجدة"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'شارة التواجد اليومي (بالإنجليزية):' : 'Availability Badge (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={designForm.availableDailyEn || ''}
              onChange={(e) => setDesignForm(prev => ({ ...prev, availableDailyEn: e.target.value }))}
              placeholder="Available daily to support divers in Jeddah"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="gold-gradient-btn px-7 py-3 rounded-xl font-bold text-sm text-slate-950 flex items-center gap-2 shadow-xl shadow-[#C59B5F]/20 cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'حفظ وتثبيت نصوص التواصل والحجز 💾' : 'Save Contact Settings 💾'}</span>
        </button>
      </div>
    </form>
  );
};
