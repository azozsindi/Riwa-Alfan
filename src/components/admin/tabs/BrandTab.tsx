import React, { useState } from 'react';
import { Building2, Type, Check, Trash2, Upload, Save } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { BrandConfig, HeroConfig } from '../../../types/admin';
import { FahadsLogo as CustomFahadsLogo } from '../../FahadsLogo';
import { optimizeImageFile } from '../../../utils/imageUtils';

interface BrandTabProps {
  initialBrand: BrandConfig;
  initialHero: HeroConfig;
  onUpdateBrand: (brand: BrandConfig | Partial<BrandConfig>) => void;
  onUpdateHero: (hero: HeroConfig | Partial<HeroConfig>) => void;
  showToast: (msg?: string) => void;
}

export const BrandTab: React.FC<BrandTabProps> = ({
  initialBrand,
  initialHero,
  onUpdateBrand,
  onUpdateHero,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [brandForm, setBrandForm] = useState<BrandConfig>(initialBrand);
  const [heroForm, setHeroForm] = useState<HeroConfig>(initialHero);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await optimizeImageFile(file);
        setBrandForm((prev: BrandConfig) => ({ ...prev, logoType: 'custom-image', customLogoUrl: base64 }));
        onUpdateBrand({ logoType: 'custom-image', customLogoUrl: base64 });
        showToast(isRtl ? 'تم رفع صورة الشعار وتطبيقها بنجاح!' : 'Logo uploaded and applied!');
      } catch (err) {
        console.error('Error optimizing image:', err);
      }
    }
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrand(brandForm);
    onUpdateHero(heroForm);
    showToast();
  };

  return (
    <form onSubmit={handleSaveBrand} className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          {isRtl ? 'هوية مركز الغوص، الشعار، ومعلومات الاتصال' : 'Center Identity, Logo & Contacts'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isRtl 
            ? 'تعديل اسم المركز، الشعار (نصي أو صورة)، أرقام الواتساب والتواصل، ومقر جدة.'
            : 'Configure center name, logo graphic/text, WhatsApp & Jeddah location.'}
        </p>
      </div>

      {/* Typography & Font Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isRtl ? 'نوع خط رواء الفن وعناوين الموقع (Typography):' : 'Site & Brand Typography:'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isRtl ? 'اختر خط الهوية المناسب، وسيتم تطبيقه فوراً على كافة صفحات ومحتويات الموقع.' : 'Select typography applied live across all website headers and content.'}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
            {isRtl ? 'تطبيق مباشر وفوري' : 'Live Applied'}
          </span>
        </div>

        {/* Font Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { 
              id: 'alexandria', 
              nameAr: 'خط الإسكندرية (Alexandria)', 
              nameEn: 'Alexandria Geometric',
              desc: isRtl ? 'فخم، هندسي، عصري وراقي جداً (الافتراضي)' : 'Luxury modern geometric (Recommended)',
              sample: 'رواء الفن',
              cssClass: 'font-alexandria'
            },
            { 
              id: 'cairo', 
              nameAr: 'خط كايرو (Cairo)', 
              nameEn: 'Cairo Bold',
              desc: isRtl ? 'عريض، قوي، وحاد الحضور' : 'Bold, prominent & punchy',
              sample: 'رواء الفن',
              cssClass: 'font-cairo'
            },
            { 
              id: 'readex', 
              nameAr: 'خط ريدكس برو (Readex Pro)', 
              nameEn: 'Readex Pro',
              desc: isRtl ? 'عصري، انسيابي، ومريح للعين' : 'Ultra-clean, modern & smooth',
              sample: 'رواء الفن',
              cssClass: 'font-readex'
            },
            { 
              id: 'almarai', 
              nameAr: 'خط المراعي (Almarai)', 
              nameEn: 'Almarai Corporate',
              desc: isRtl ? 'متزن، احترافي، ومتقن الرسم' : 'Balanced, sharp & professional',
              sample: 'رواء الفن',
              cssClass: 'font-almarai'
            },
            { 
              id: 'tajawal', 
              nameAr: 'خط تجوال (Tajawal)', 
              nameEn: 'Tajawal Soft',
              desc: isRtl ? 'الخط السابق الكلاسيكي الدائري' : 'Classic soft geometric',
              sample: 'رواء الفن',
              cssClass: 'font-tajawal'
            }
          ].map((font) => {
            const isSelected = (brandForm.fontFamily || 'alexandria') === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => {
                  const updated = { 
                    ...brandForm, 
                    fontFamily: font.id as 'alexandria' | 'cairo' | 'readex' | 'almarai' | 'tajawal' 
                  };
                  setBrandForm(updated);
                  onUpdateBrand(updated);
                  showToast(isRtl ? `تم تفعيل ${font.nameAr} بنجاح!` : `Activated ${font.nameEn}!`);
                }}
                className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer group ${
                  isSelected 
                    ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-600/10' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {isRtl ? font.nameAr : font.nameEn}
                  </span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-700 group-hover:border-slate-500 shrink-0" />
                  )}
                </div>

                <div className={`py-2 px-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-center ${font.cssClass}`}>
                  <span className="text-lg font-black text-white tracking-tight">
                    {font.sample}
                  </span>
                </div>

                <span className="text-[10px] text-slate-400 leading-tight">
                  {font.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Typography Preview Bar */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {isRtl ? 'معاينة حية للنص بهذا الخط:' : 'Live Font Preview:'}
            </span>
            <span className="text-sm sm:text-base font-black text-blue-400 font-brand-arabic tracking-tight">
              رواء الفن · غوص البحر الأحمر بجدة
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onUpdateBrand(brandForm);
              showToast(isRtl ? 'تم حفظ وتثبيت الخط سحابياً!' : 'Font saved to cloud!');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
          >
            {isRtl ? 'حفظ وتثبيت' : 'Save Font'}
          </button>
        </div>
      </div>

      {/* Logo Customizer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white block">
            {isRtl ? 'تخصيص الشعار الرسمي (Logo):' : 'Logo Customization:'}
          </span>
          <span className="text-[11px] text-blue-400 font-medium">
            {brandForm.logoType === 'custom-image' && brandForm.customLogoUrl 
              ? (isRtl ? 'يتم استخدام صورة شعارك المخصصة' : 'Using custom image logo')
              : (isRtl ? 'يتم استخدام شعار المتجه الافتراضي' : 'Using default vector emblem')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Live Preview Box */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3">
            <span className="text-[11px] text-slate-400 font-mono">
              {isRtl ? 'معاينة الشعار في الموقع' : 'Live Logo Preview'}
            </span>
            <div className="w-full py-4 px-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center min-h-[90px]">
              {brandForm.logoType === 'custom-image' && brandForm.customLogoUrl ? (
                <img 
                  src={brandForm.customLogoUrl} 
                  alt="Custom Logo" 
                  className="max-h-16 max-w-[200px] object-contain"
                />
              ) : (
                <CustomFahadsLogo size="md" theme="dark" />
              )}
            </div>
            {brandForm.logoType === 'custom-image' && brandForm.customLogoUrl && (
              <button
                type="button"
                onClick={() => {
                  const updated = { ...brandForm, logoType: 'vector' as const, customLogoUrl: '' };
                  setBrandForm(updated);
                  onUpdateBrand(updated);
                  showToast(isRtl ? 'تمت العودة لشعار المتجه الأصلي' : 'Reverted to default emblem');
                }}
                className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إزالة الصورة والعودة للشعار الأصلي' : 'Remove image & use vector'}</span>
              </button>
            )}
          </div>

          {/* Logo Upload & URL Options */}
          <div className="md:col-span-7 space-y-4">
            {/* Option 1: File Upload */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-200 block">
                {isRtl ? '1. رفع ملف صورة من جهازك:' : '1. Upload image from your device:'}
              </span>
              <label className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border-2 border-dashed border-blue-500/40 text-xs font-bold text-blue-300 hover:text-blue-200 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'اضغط لاختيار صورة الشعار (PNG / JPG / WebP / SVG)' : 'Choose Logo Image File'}</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option 2: Image URL */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-200 block">
                {isRtl ? '2. أو إدخال رابط صورة الشعار مباشرة (URL):' : '2. Or paste image URL directly:'}
              </span>
              <div className="flex gap-2">
                <input 
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={brandForm.customLogoUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBrandForm((prev: BrandConfig) => ({ 
                      ...prev, 
                      customLogoUrl: val,
                      logoType: val.trim() ? 'custom-image' : 'vector'
                    }));
                  }}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (brandForm.customLogoUrl?.trim()) {
                      onUpdateBrand({ logoType: 'custom-image', customLogoUrl: brandForm.customLogoUrl.trim() });
                      showToast(isRtl ? 'تم تطبيق رابط الشعار بنجاح!' : 'Logo URL applied!');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
                >
                  {isRtl ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'اسم المركز (بالعربية):' : 'Center Name (Arabic):'}
          </label>
          <input 
            type="text"
            value={brandForm.centerNameAr}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, centerNameAr: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'اسم المركز (بالإنجليزية):' : 'Center Name (English):'}
          </label>
          <input 
            type="text"
            value={brandForm.centerNameEn}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, centerNameEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
          />
        </div>
      </div>

      {/* Subtitles (Bilingual Small Text under Logo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'الوصف الصغير تحت الشعار (بالعربية):' : 'Subtitle under Logo (Arabic):'}
          </label>
          <input 
            type="text"
            placeholder="مركز تدريب غوص معتمد · جدة PADI"
            value={brandForm.subtitleAr || ''}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, subtitleAr: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'الوصف الصغير تحت الشعار (بالإنجليزية):' : 'Subtitle under Logo (English):'}
          </label>
          <input 
            type="text"
            placeholder="Certified PADI Dive Center · Jeddah"
            value={brandForm.subtitleEn || ''}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, subtitleEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
          />
        </div>
      </div>

      {/* Contacts & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'رقم الواتساب المباشر:' : 'WhatsApp Number:'}
          </label>
          <input 
            type="text"
            value={brandForm.whatsappNumber}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, whatsappNumber: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'رقم الجوال للاتصال:' : 'Phone Call Number:'}
          </label>
          <input 
            type="text"
            value={brandForm.phone}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}
          </label>
          <input 
            type="email"
            value={brandForm.email}
            onChange={(e) => setBrandForm((prev: BrandConfig) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Stats & Counters with Visibility Toggle */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
          <div>
            <span className="text-xs font-bold text-white block">
              {isRtl ? 'إحصائيات الواجهة الرئيسية (Hero Stats):' : 'Hero Section Statistics:'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isRtl ? 'الأرقام الظاهرة في أسفل قسم البطل بالصفحة الرئيسية مع إمكانية إخفائها أو تعديلها.' : 'Key figures displayed below the hero headline, with visibility toggle.'}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              heroForm.showStats !== false 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {heroForm.showStats !== false 
                ? (isRtl ? 'معروضة في الموقع' : 'Visible on Site') 
                : (isRtl ? 'مخفية من الموقع' : 'Hidden from Site')}
            </span>

            <button
              type="button"
              onClick={() => {
                const nextState = heroForm.showStats === false ? true : false;
                setHeroForm(prev => ({ ...prev, showStats: nextState }));
                onUpdateHero({ showStats: nextState });
                showToast(nextState 
                  ? (isRtl ? 'تم إظهار الإحصائيات في الصفحة الرئيسية!' : 'Stats are now visible!') 
                  : (isRtl ? 'تم إخفاء الإحصائيات من الصفحة الرئيسية!' : 'Stats are now hidden!'));
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
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-300">
              {isRtl ? 'عنوان الإحصائية 1:' : 'Stat 1 Label:'}
            </label>
            <input 
              type="text"
              value={heroForm.divesLabelAr || 'عدد الغوصات الموثقة'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, divesLabelAr: e.target.value }))}
              placeholder="عدد الغوصات الموثقة"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none"
            />
            <label className="block text-[11px] font-semibold text-slate-300 pt-1">
              {isRtl ? 'الرقم / القيمة:' : 'Number / Value:'}
            </label>
            <input 
              type="text"
              value={heroForm.divesStat}
              onChange={(e) => setHeroForm(prev => ({ ...prev, divesStat: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
            />
          </div>

          {/* Stat 2: Certified Graduates */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-300">
              {isRtl ? 'عنوان الإحصائية 2:' : 'Stat 2 Label:'}
            </label>
            <input 
              type="text"
              value={heroForm.studentsLabelAr || 'عدد الغواصين الخريجين'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, studentsLabelAr: e.target.value }))}
              placeholder="عدد الغواصين الخريجين"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none"
            />
            <label className="block text-[11px] font-semibold text-slate-300 pt-1">
              {isRtl ? 'الرقم / القيمة:' : 'Number / Value:'}
            </label>
            <input 
              type="text"
              value={heroForm.studentsStat}
              onChange={(e) => setHeroForm(prev => ({ ...prev, studentsStat: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
            />
          </div>

          {/* Stat 3: Safety Record */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-300">
              {isRtl ? 'عنوان الإحصائية 3:' : 'Stat 3 Label:'}
            </label>
            <input 
              type="text"
              value={heroForm.safetyLabelAr || 'سجل الأمان والسلامة'}
              onChange={(e) => setHeroForm(prev => ({ ...prev, safetyLabelAr: e.target.value }))}
              placeholder="سجل الأمان والسلامة"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none"
            />
            <label className="block text-[11px] font-semibold text-slate-300 pt-1">
              {isRtl ? 'الرقم / القيمة:' : 'Number / Value:'}
            </label>
            <input 
              type="text"
              value={heroForm.safetyStat}
              onChange={(e) => setHeroForm(prev => ({ ...prev, safetyStat: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'حفظ وتحديث هوية المركز' : 'Save Brand Settings'}</span>
        </button>
      </div>
    </form>
  );
};
