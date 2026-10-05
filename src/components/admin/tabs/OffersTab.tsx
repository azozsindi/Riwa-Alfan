import React, { useState } from 'react';
import { Tag, Sparkles, Save } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { AnnouncementConfig } from '../../../types/admin';

interface OffersTabProps {
  initialConfig: AnnouncementConfig;
  onUpdate: (config: AnnouncementConfig) => void;
  showToast: (msg?: string) => void;
}

export const OffersTab: React.FC<OffersTabProps> = ({ initialConfig, onUpdate, showToast }) => {
  const { isRtl } = useLanguage();
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementConfig>(initialConfig);

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

        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={announcementForm.enabled} 
            onChange={(e) => {
              const val = e.target.checked;
              const next = { ...announcementForm, enabled: val };
              setAnnouncementForm(next);
              onUpdate(next);
              showToast();
            }}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-2.5 text-xs font-semibold text-slate-300">
            {announcementForm.enabled ? (isRtl ? 'العرض مفعّل' : 'Active') : (isRtl ? 'العرض معطّل' : 'Disabled')}
          </span>
        </label>
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
    </div>
  );
};
