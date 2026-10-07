import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Award, BarChart2, ShieldCheck, Users, CalendarCheck, 
  Eye, EyeOff, Save, CheckCircle2, MessageSquare, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { HeroConfig } from '../../../types/admin';

interface HeroTabProps {
  initialHero: HeroConfig;
  onUpdateHero: (hero: HeroConfig | Partial<HeroConfig>) => void;
  showToast: (msg?: string) => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({
  initialHero,
  onUpdateHero,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [heroForm, setHeroForm] = useState<HeroConfig>(initialHero);

  useEffect(() => {
    setHeroForm(initialHero);
  }, [initialHero]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHero(heroForm);
    showToast(isRtl ? 'تم حفظ وتحديث نصوص وإحصائيات الواجهة الرئيسية بنجاح! 🚀' : 'Hero section & statistics updated successfully!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C59B5F]" />
            <span>{isRtl ? 'نصوص الواجهة الرئيسية، الإحصائيات، وبطاقات PADI' : 'Hero Section Headlines, Stats & PADI Showcase'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'تحكم كامل بكل كلمة ورقم في أعلى الصفحة الرئيسية: العنوان العريض، النبذة، أزرار الحجز، الأرقام والإحصائيات، وبطاقة الاعتمادات.' 
              : 'Full control over every word, headline, CTA button, stats numbers, and PADI accreditation card.'}
          </p>
        </div>

        <button
          type="submit"
          className="gold-gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-[#C59B5F]/20 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'حفظ نصوص الواجهة 💾' : 'Save Hero Texts 💾'}</span>
        </button>
      </div>

      {/* 1. Header Kicker & Location */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
          {isRtl ? '1. الشارة العلوية وموقع التدريب (Top Kicker & Location)' : '1. Top Kicker Badge & Location'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الشارة العلوية (بالعربية):' : 'Top Kicker Badge (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.badgeAr || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, badgeAr: e.target.value }))}
              placeholder="رواء الفن بجدة · PADI Open Water Scuba Instructor (OWSI)"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الشارة العلوية (بالإنجليزية):' : 'Top Kicker Badge (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.badgeEn || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, badgeEn: e.target.value }))}
              placeholder="Riwa Alfan in Jeddah · PADI Open Water Scuba Instructor (OWSI)"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص الموقع بجانب الشارة (بالعربية):' : 'Location Label beside Kicker (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.locationKickerAr || 'جدة · البحر الأحمر'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, locationKickerAr: e.target.value }))}
              placeholder="جدة · البحر الأحمر"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص الموقع بجانب الشارة (بالإنجليزية):' : 'Location Label beside Kicker (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.locationKickerEn || 'Jeddah · Red Sea'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, locationKickerEn: e.target.value }))}
              placeholder="Jeddah · Red Sea"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Headlines & Value Proposition */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
          {isRtl ? '2. العنوان العريض والكلمة الذهبية المميزة' : '2. Main Headline & Golden Highlight'}
        </span>

        {/* Arabic Headline */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'العنوان الرئيسي (بالعربية):' : 'Main Headline (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.headlineAr || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, headlineAr: e.target.value }))}
              placeholder="اكتشف أسرار عالم الغوص في "
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-[#E0BA84] mb-1.5">
              {isRtl ? 'الكلمة الذهبية الملونة:' : 'Golden Highlight (AR):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.headlineHighlightAr || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, headlineHighlightAr: e.target.value }))}
              placeholder="البحر الأحمر"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-[#C59B5F]/40 rounded-xl text-xs text-[#E0BA84] focus:border-[#C59B5F] outline-none font-black"
            />
          </div>
        </div>

        {/* English Headline */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'العنوان الرئيسي (بالإنجليزية):' : 'Main Headline (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.headlineEn || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, headlineEn: e.target.value }))}
              placeholder="Discover the Secrets of Diving in the "
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-[#E0BA84] mb-1.5">
              {isRtl ? 'الكلمة الذهبية (EN):' : 'Golden Highlight (EN):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.headlineHighlightEn || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, headlineHighlightEn: e.target.value }))}
              placeholder="Red Sea"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-[#C59B5F]/40 rounded-xl text-xs text-[#E0BA84] focus:border-[#C59B5F] outline-none font-black"
            />
          </div>
        </div>

        {/* Subhead / Value Proposition */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النبذة الترحيبية والوصف أسفل العنوان (بالعربية):' : 'Subhead / Description (Arabic):'}
            </label>
            <textarea
              dir="rtl"
              rows={3}
              value={heroForm.subheadAr || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, subheadAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النبذة الترحيبية والوصف أسفل العنوان (بالإنجليزية):' : 'Subhead / Description (English):'}
            </label>
            <textarea
              dir="ltr"
              rows={3}
              value={heroForm.subheadEn || ''}
              onChange={(e) => setHeroForm(prev => ({ ...prev, subheadEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الحجز الرئيسي (بالعربية):' : 'Book CTA Button (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.ctaBookAr || 'احجز مغامرتك الآن'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, ctaBookAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الحجز الرئيسي (بالإنجليزية):' : 'Book CTA Button (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.ctaBookEn || 'Book Your Dive'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, ctaBookEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر استكشاف الدورات (بالعربية):' : 'Explore Courses Button (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.ctaCoursesAr || 'استكشف كافة الدورات'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, ctaCoursesAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر استكشاف الدورات (بالإنجليزية):' : 'Explore Courses Button (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.ctaCoursesEn || 'Explore Courses'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, ctaCoursesEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. The 3 Key Stats: 1,450+ Dives, 520+ Students, 100% Safety */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
              {isRtl ? '3. أرقام وإحصائيات الواجهة (1,450+ غوصة · 520+ خريج · 100% أمان)' : '3. Key Stats (1,450+ Dives · 520+ Divers · 100% Safety)'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isRtl ? 'الأرقام الثلاثة البارزة أسفل أزرار الحجز مع عناوينها بالعربية والإنجليزية.' : 'The three high-impact figures below the CTAs with bilingual labels.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              heroForm.showStats !== false 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {heroForm.showStats !== false 
                ? (isRtl ? 'معروضة في الموقع 🟢' : 'Visible on Site 🟢') 
                : (isRtl ? 'مخفية من الموقع ⚪' : 'Hidden from Site ⚪')}
            </span>

            <button
              type="button"
              onClick={() => {
                const next = heroForm.showStats === false;
                setHeroForm(prev => ({ ...prev, showStats: next }));
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                heroForm.showStats !== false ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  heroForm.showStats !== false ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stat 1: Logged Dives */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🤿</span>
                <span>{isRtl ? 'الإحصائية 1: الغوصات' : 'Stat 1: Dives'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{heroForm.divesStat || '1,450+'}</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'الرقم / القيمة:' : 'Number Value:'}
              </label>
              <input 
                type="text"
                value={heroForm.divesStat || '1,450+'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, divesStat: e.target.value }))}
                placeholder="1,450+"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'العنوان (بالعربية):' : 'Label (Arabic):'}
              </label>
              <input 
                type="text"
                dir="rtl"
                value={heroForm.divesLabelAr || 'عدد الغوصات الموثقة'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, divesLabelAr: e.target.value }))}
                placeholder="عدد الغوصات الموثقة"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'العنوان (بالإنجليزية):' : 'Label (English):'}
              </label>
              <input 
                type="text"
                dir="ltr"
                value={heroForm.divesLabelEn || 'Logged Dives'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, divesLabelEn: e.target.value }))}
                placeholder="Logged Dives"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Stat 2: Certified Students */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🎓</span>
                <span>{isRtl ? 'الإحصائية 2: الخريجون' : 'Stat 2: Students'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#E0BA84]">{heroForm.studentsStat || '520+'}</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'الرقم / القيمة:' : 'Number Value:'}
              </label>
              <input 
                type="text"
                value={heroForm.studentsStat || '520+'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, studentsStat: e.target.value }))}
                placeholder="520+"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-[#E0BA84] focus:border-[#C59B5F] outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'العنوان (بالعربية):' : 'Label (Arabic):'}
              </label>
              <input 
                type="text"
                dir="rtl"
                value={heroForm.studentsLabelAr || 'عدد الغواصين الخريجين'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, studentsLabelAr: e.target.value }))}
                placeholder="عدد الغواصين الخريجين"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'العنوان (بالإنجليزية):' : 'Label (English):'}
              </label>
              <input 
                type="text"
                dir="ltr"
                value={heroForm.studentsLabelEn || 'Certified Students'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, studentsLabelEn: e.target.value }))}
                placeholder="Certified Students"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>
          </div>

          {/* Stat 3: Safety Record */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🛡️</span>
                <span>{isRtl ? 'الإحصائية 3: الأمان' : 'Stat 3: Safety'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{heroForm.safetyStat || '100%'}</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'الرقم / القيمة:' : 'Number Value:'}
              </label>
              <input 
                type="text"
                value={heroForm.safetyStat || '100%'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, safetyStat: e.target.value }))}
                placeholder="100%"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-emerald-400 focus:border-emerald-400 outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'العنوان (بالعربية):' : 'Label (Arabic):'}
              </label>
              <input 
                type="text"
                dir="rtl"
                value={heroForm.safetyLabelAr || 'سجل الأمان والسلامة'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, safetyLabelAr: e.target.value }))}
                placeholder="سجل الأمان والسلامة"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {isRtl ? 'العنوان (بالإنجليزية):' : 'Label (English):'}
              </label>
              <input 
                type="text"
                dir="ltr"
                value={heroForm.safetyLabelEn || 'Safety Record'}
                onChange={(e) => setHeroForm(prev => ({ ...prev, safetyLabelEn: e.target.value }))}
                placeholder="Safety Record"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. The Visual PADI Showcase Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-[#E0BA84] uppercase tracking-wider block">
          {isRtl ? '4. بطاقة الاعتمادات ونقاط التميز (PADI Accreditation Card)' : '4. PADI Accreditation Showcase Card'}
        </span>
        <p className="text-[11px] text-slate-400">
          {isRtl ? 'البطاقة الظاهرة في يسار الواجهة مع النقاط الثلاثة وزر محادثة الواتساب المباشرة.' : 'The showcase card on the right/left of hero with 3 highlight bullets and instant WhatsApp button.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'عنوان النقاط (بالعربية):' : 'Points Heading (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.whyTitleAr || 'لماذا تختار التدريب معنا؟'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, whyTitleAr: e.target.value }))}
              placeholder="لماذا تختار التدريب معنا؟"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'عنوان النقاط (بالإنجليزية):' : 'Points Heading (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.whyTitleEn || 'Why Train With Us?'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, whyTitleEn: e.target.value }))}
              placeholder="Why Train With Us?"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النقطة الأولى (بالعربية):' : 'Point 1 (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.why1Ar || 'أعلى معايير السلامة المهنية ومعدات حديثة'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, why1Ar: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النقطة الأولى (بالإنجليزية):' : 'Point 1 (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.why1En || 'Highest safety standards & modern equipment'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, why1En: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النقطة الثانية (بالعربية):' : 'Point 2 (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.why2Ar || 'شهادات PADI دولية معتمدة حول العالم'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, why2Ar: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النقطة الثانية (بالإنجليزية):' : 'Point 2 (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.why2En || 'Internationally recognized PADI certifications'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, why2En: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النقطة الثالثة (بالعربية):' : 'Point 3 (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.why3Ar || 'تدريب شخصي صبور ومجموعات صغيرة'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, why3Ar: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'النقطة الثالثة (بالإنجليزية):' : 'Point 3 (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.why3En || 'Patient personalized coaching in small groups'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, why3En: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الواتساب بالبطاقة (بالعربية):' : 'WhatsApp Button Text (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={heroForm.whatsappBtnAr || 'محادثة واتساب فورية مع الكابتن'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, whatsappBtnAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الواتساب بالبطاقة (بالإنجليزية):' : 'WhatsApp Button Text (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={heroForm.whatsappBtnEn || 'Instant WhatsApp with Captain'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, whatsappBtnEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
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
          <span>{isRtl ? 'تثبيت وحفظ نصوص الواجهة سحابياً 💾' : 'Save Hero Texts to Cloud 💾'}</span>
        </button>
      </div>
    </form>
  );
};
