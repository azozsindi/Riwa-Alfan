import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AnnouncementConfig, UnderConstructionConfig } from '../../../types/admin';
import { DEFAULT_UNDER_CONSTRUCTION } from '../../../data/defaultConfig';

interface OffersTabProps {
  initialConfig: AnnouncementConfig;
  initialUnderConstruction?: UnderConstructionConfig;
  onUpdate: (config: AnnouncementConfig) => void;
  onUpdateUnderConstruction?: (uc: Partial<UnderConstructionConfig>) => void;
  showToast: (msg?: string) => void;
}

export const OffersTab: React.FC<OffersTabProps> = ({ 
  initialConfig, 
  initialUnderConstruction,
  onUpdate, 
  onUpdateUnderConstruction,
  showToast 
}) => {
  const { isRtl } = useLanguage();
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementConfig>(initialConfig);
  const [ucForm, setUcForm] = useState<UnderConstructionConfig>(initialUnderConstruction || DEFAULT_UNDER_CONSTRUCTION);

  // Sync state whenever initialConfig updates
  useEffect(() => {
    setAnnouncementForm(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    if (initialUnderConstruction) setUcForm(initialUnderConstruction);
  }, [initialUnderConstruction]);

  const handleToggle = (enabled: boolean) => {
    const next = { ...announcementForm, enabled };
    setAnnouncementForm(next);
    onUpdate(next);
    showToast(
      enabled 
        ? (isRtl ? 'تم تفعيل العرض ونشره لزوار الموقع!' : 'Offer Enabled & Published!') 
        : (isRtl ? 'تم إيقاف العرض تماماً وحجبه نهائياً!' : 'Offer Completely Disabled & Hidden!')
    );
  };

  const handleApplyOfferPreset = (type: 'openwater' | 'summer' | 'national' | 'weekend') => {
    let updated: AnnouncementConfig;
    if (type === 'openwater') {
      updated = {
        enabled: true,
        badgeAr: 'عرض خاص للمبتدئين',
        badgeEn: 'Special Beginner Promo',
        textAr: 'احصل على خصم 20% على دورة غواص المياه المفتوحة PADI بجدة مع كامل المعدات والشهادة الدولية!',
        textEn: 'Get 20% OFF PADI Open Water Diver course in Jeddah with all gear and international certification!',
        ctaTextAr: 'احجز بخصم 20%',
        ctaTextEn: 'Claim 20% Offer',
        discountPercentage: 20,
        highlightCourseId: 'padi-open-water'
      };
    } else if (type === 'summer') {
      updated = {
        enabled: true,
        badgeAr: 'باقة تدريب الصيف',
        badgeEn: 'Summer Dive Package',
        textAr: 'سجّل في دورتين معاً (المياه المفتوحة + المتقدم) واحصل على خصم 25% مع غوصة استكشافية مجاناً!',
        textEn: 'Enroll in Open Water + Advanced combo package and receive 25% OFF plus a free adventure dive!',
        ctaTextAr: 'احجز باقة الصيف',
        ctaTextEn: 'Claim Summer Combo',
        discountPercentage: 25,
        highlightCourseId: 'padi-advanced'
      };
    } else if (type === 'national') {
      updated = {
        enabled: true,
        badgeAr: 'عرض اليوم الوطني 🇸🇦',
        badgeEn: 'National Day Special 🇸🇦',
        textAr: 'عرض وطني استثنائي: خصم 30% على كافة دورات PADI المعتمدة في جدة لفترة محدودة!',
        textEn: 'Exceptional celebration offer: 30% OFF all certified PADI courses in Jeddah!',
        ctaTextAr: 'احجز بالعرض الوطني',
        ctaTextEn: 'Claim 30% Offer',
        discountPercentage: 30,
        highlightCourseId: 'padi-advanced'
      };
    } else {
      updated = {
        enabled: true,
        badgeAr: 'رحلة نهاية الأسبوع بجدة',
        badgeEn: 'Jeddah Weekend Trip',
        textAr: 'رحلة بحرية خاصة لحطام أبو طير والبويلر الجمعة القادمة. مقاعد محدودة جداً!',
        textEn: 'Special wreck expedition to Abu Tair & Boiler this Friday. Limited spots!',
        ctaTextAr: 'احجز مقعدك بالبوت',
        ctaTextEn: 'Reserve Boat Spot',
        discountPercentage: 15,
        highlightCourseId: 'padi-wreck'
      };
    }
    setAnnouncementForm(updated);
    onUpdate(updated);
    showToast();
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(announcementForm);
    showToast();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-400" />
            {isRtl ? 'إدارة العروض الترويجية والشريط العلوي' : 'Promotional Offers & Top Announcement Bar'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'تفعيل أو إيقاف شريط العروض وتعديل نسبة الخصم والرسالة الترويجية التي تظهر لجميع زوار الموقع.'
              : 'Enable or disable top promo bar, discount percentages, and call to action.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={announcementForm.enabled} 
              onChange={(e) => handleToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>

          <button
            type="button"
            onClick={() => handleToggle(!announcementForm.enabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              announcementForm.enabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {announcementForm.enabled 
              ? (isRtl ? '🟢 العرض مفعّل (اضغط للإيقاف)' : '🟢 Active (Click to Disable)')
              : (isRtl ? '🔴 العرض متوقف تماماً (اضغط للتفعيل)' : '🔴 Disabled (Click to Enable)')}
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
        <span className="text-xs font-bold text-slate-300 block mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          {isRtl ? 'قوالب عروض جاهزة بنقرة واحدة:' : '1-Click Offer Presets:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleApplyOfferPreset('openwater')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
          >
            <span className="font-bold text-blue-400 block group-hover:text-blue-300">
              {isRtl ? 'خصم 20% أوبن واتر' : '20% OFF Open Water'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isRtl ? 'للمبتدئين الجدد بجدة' : 'For new beginners in Jeddah'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyOfferPreset('summer')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
          >
            <span className="font-bold text-emerald-400 block group-hover:text-emerald-300">
              {isRtl ? 'خصم 25% باقة الصيف' : '25% OFF Summer Promo'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isRtl ? 'باقات التدريب المتقدم' : 'Advanced dive packages'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyOfferPreset('national')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
          >
            <span className="font-bold text-green-400 block group-hover:text-green-300">
              {isRtl ? 'خصم 30% اليوم الوطني' : '30% OFF National Day'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isRtl ? 'عرض احتفالي لفترة محدودة' : 'Special limited celebration'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyOfferPreset('weekend')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-start text-xs transition-all cursor-pointer group"
          >
            <span className="font-bold text-purple-400 block group-hover:text-purple-300">
              {isRtl ? 'رحلة البوت الأسبوعية' : 'Weekend Boat Trip'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isRtl ? 'حطام أبو طير والبويلر' : 'Abu Tair & Boiler wrecks'}
            </span>
          </button>
        </div>
      </div>

      {/* Form fields */}
      <form onSubmit={handleSaveAnnouncement} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'وسام أو شارة العرض (عربي):' : 'Offer Badge (Arabic):'}
            </label>
            <input 
              type="text"
              value={announcementForm.badgeAr}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, badgeAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'وسام أو شارة العرض (إنجليزي):' : 'Offer Badge (English):'}
            </label>
            <input 
              type="text"
              value={announcementForm.badgeEn}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, badgeEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'نص الإعلان والخصم (عربي):' : 'Announcement Text (Arabic):'}
          </label>
          <textarea 
            rows={2}
            value={announcementForm.textAr}
            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, textAr: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isRtl ? 'نص الإعلان والخصم (إنجليزي):' : 'Announcement Text (English):'}
          </label>
          <textarea 
            rows={2}
            value={announcementForm.textEn}
            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, textEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نسبة الخصم (%):' : 'Discount Percentage (%):'}
            </label>
            <input 
              type="number"
              min="0"
              max="90"
              value={announcementForm.discountPercentage || 0}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الطلب (عربي):' : 'CTA Button (Arabic):'}
            </label>
            <input 
              type="text"
              value={announcementForm.ctaTextAr}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, ctaTextAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الطلب (إنجليزي):' : 'CTA Button (English):'}
            </label>
            <input 
              type="text"
              value={announcementForm.ctaTextEn}
              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, ctaTextEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'حفظ ونشر العرض فوراً' : 'Save & Publish Offer'}</span>
          </button>
        </div>
      </form>

      {/* Under Construction / Beta Launch Banner Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'شريط الموقع قيد التطوير / الإطلاق التجريبي (Under Construction)' : 'Under Construction / Beta Banner'}</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isRtl 
                ? 'شريط تنبيهي عائم يظهر في أعلى الموقع لتوضيح أن المنصة قيد التدشين والتطوير مع زر واتساب مباشر.' 
                : 'Floating top notice banner informing visitors that the platform is in active development.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              ucForm.enabled 
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {ucForm.enabled 
                ? (isRtl ? 'الشريط مفعّل ومعروض 🟢' : 'Banner Active 🟢') 
                : (isRtl ? 'الشريط معطّل ومخفي ⚪' : 'Banner Inactive ⚪')}
            </span>

            <button
              type="button"
              onClick={() => {
                const nextState = !ucForm.enabled;
                const updated = { ...ucForm, enabled: nextState };
                setUcForm(updated);
                onUpdateUnderConstruction?.(updated);
                showToast(nextState 
                  ? (isRtl ? 'تم تفعيل شريط قيد الإنشاء أعلى الموقع 🚧' : 'Under construction banner activated!') 
                  : (isRtl ? 'تم إخفاء شريط قيد الإنشاء من الموقع' : 'Under construction banner hidden!'));
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                ucForm.enabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ucForm.enabled ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'شارة الشريط (بالعربية):' : 'Badge Text (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={ucForm.badgeTextAr || ''}
              onChange={(e) => setUcForm(prev => ({ ...prev, badgeTextAr: e.target.value }))}
              placeholder="الموقع قيد التطوير والتحديث المستمر"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'شارة الشريط (بالإنجليزية):' : 'Badge Text (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={ucForm.badgeTextEn || ''}
              onChange={(e) => setUcForm(prev => ({ ...prev, badgeTextEn: e.target.value }))}
              placeholder="Under Continuous Active Development"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الرسالة التوضيحية (بالعربية):' : 'Notice Message (Arabic):'}
            </label>
            <textarea 
              dir="rtl"
              rows={2}
              value={ucForm.messageAr || ''}
              onChange={(e) => setUcForm(prev => ({ ...prev, messageAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'الرسالة التوضيحية (بالإنجليزية):' : 'Notice Message (English):'}
            </label>
            <textarea 
              dir="ltr"
              rows={2}
              value={ucForm.messageEn || ''}
              onChange={(e) => setUcForm(prev => ({ ...prev, messageEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الواتساب بالشريط (بالعربية):' : 'WhatsApp Button Text (Arabic):'}
            </label>
            <input 
              type="text"
              dir="rtl"
              value={ucForm.whatsappBtnTextAr || ''}
              onChange={(e) => setUcForm(prev => ({ ...prev, whatsappBtnTextAr: e.target.value }))}
              placeholder="تواصل مع الكابتن للطلبات والحجوزات العاجلة"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? 'نص زر الواتساب بالشريط (بالإنجليزية):' : 'WhatsApp Button Text (English):'}
            </label>
            <input 
              type="text"
              dir="ltr"
              value={ucForm.whatsappBtnTextEn || ''}
              onChange={(e) => setUcForm(prev => ({ ...prev, whatsappBtnTextEn: e.target.value }))}
              placeholder="Contact Captain directly via WhatsApp"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onUpdateUnderConstruction?.(ucForm);
              showToast(isRtl ? 'تم حفظ إعدادات شريط قيد الإنشاء بنجاح! 💾' : 'Under construction banner saved!');
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-colors"
          >
            {isRtl ? 'حفظ إعدادات شريط قيد الإنشاء 💾' : 'Save Banner Settings 💾'}
          </button>
        </div>
      </div>
    </div>
  );
};
