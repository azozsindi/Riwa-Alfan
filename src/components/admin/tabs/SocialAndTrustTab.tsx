import React, { useState } from 'react';
import { Share2, MapPin, ShieldCheck, Instagram, Video, MessageCircle, ExternalLink, Save, Globe } from 'lucide-react';
import { SocialLinksConfig, LocationConfig, TrustBadgesConfig } from '../../../types/admin';
import { DEFAULT_SOCIAL_LINKS, DEFAULT_LOCATION_CONFIG, DEFAULT_TRUST_BADGES } from '../../../data/defaultConfig';
import { useLanguage } from '../../../context/LanguageContext';

interface SocialAndTrustTabProps {
  initialSocial?: SocialLinksConfig;
  initialLocation?: LocationConfig;
  initialTrust?: TrustBadgesConfig;
  onUpdateSocial: (partial: Partial<SocialLinksConfig>) => void;
  onUpdateLocation: (partial: Partial<LocationConfig>) => void;
  onUpdateTrust: (partial: Partial<TrustBadgesConfig>) => void;
  showToast: (msg?: string) => void;
}

export const SocialAndTrustTab: React.FC<SocialAndTrustTabProps> = ({
  initialSocial = DEFAULT_SOCIAL_LINKS,
  initialLocation = DEFAULT_LOCATION_CONFIG,
  initialTrust = DEFAULT_TRUST_BADGES,
  onUpdateSocial,
  onUpdateLocation,
  onUpdateTrust,
  showToast
}) => {
  const { isRtl } = useLanguage();

  const [social, setSocial] = useState<SocialLinksConfig>(initialSocial);
  const [location, setLocation] = useState<LocationConfig>(initialLocation);
  const [trust, setTrust] = useState<TrustBadgesConfig>(initialTrust);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSocial(social);
    onUpdateLocation(location);
    onUpdateTrust(trust);
    showToast(isRtl ? 'تم حفظ روابط التواصل والموقع وبيانات التوثيق بنجاح! 🚀' : 'Social & Trust Details Saved!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Share2 className="w-4 h-4" />
          <span>{isRtl ? 'التواصل الاجتماعي والتوثيق والموقع' : 'Social Media, Location & Trust'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
          {isRtl ? 'حسابات التواصل، موقع المارينا، وتوثيق المركز' : 'Social Channels, Location & Verification'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl 
            ? 'اربط حسابات إنستغرام وتيك توك وسناب شات، موقع المرسى بجدة على خرائط جوجل، ورقم وثيقة العمل الحر لتعزيز ثقة المتدربين.'
            : 'Configure your official social links, Jeddah marina GPS pin, and commercial verification badges.'}
        </p>
      </div>

      {/* Section 1: Social Media Links */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Share2 className="w-4 h-4 text-pink-400" />
          <span>{isRtl ? '1. حسابات التواصل الاجتماعي الرسمية' : '1. Official Social Media Channels'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Instagram */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>{isRtl ? 'حساب إنستغرام (Instagram)' : 'Instagram URL'}</span>
            </label>
            <input
              type="text"
              value={social.instagram || ''}
              onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
              placeholder="https://instagram.com/riwaalfan"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* TikTok */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? 'حساب تيك توك (TikTok)' : 'TikTok URL'}</span>
            </label>
            <input
              type="text"
              value={social.tiktok || ''}
              onChange={(e) => setSocial({ ...social, tiktok: e.target.value })}
              placeholder="https://tiktok.com/@riwaalfan"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Snapchat */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="text-base">👻</span>
              <span>{isRtl ? 'حساب سناب شات (Snapchat)' : 'Snapchat URL'}</span>
            </label>
            <input
              type="text"
              value={social.snapchat || ''}
              onChange={(e) => setSocial({ ...social, snapchat: e.target.value })}
              placeholder="https://snapchat.com/add/riwaalfan"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Twitter / X */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="text-base font-black">𝕏</span>
              <span>{isRtl ? 'منصة إكس (Twitter / X)' : 'Twitter / X URL'}</span>
            </label>
            <input
              type="text"
              value={social.twitter || ''}
              onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
              placeholder="https://x.com/riwaalfan"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={social.showInHeader}
              onChange={(e) => setSocial({ ...social, showInHeader: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{isRtl ? 'إظهار أيقونات التواصل في رأس الصفحة (Header)' : 'Show in Header'}</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={social.showInFooter}
              onChange={(e) => setSocial({ ...social, showInFooter: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{isRtl ? 'إظهار أيقونات التواصل في تذييل الصفحة (Footer)' : 'Show in Footer'}</span>
          </label>
        </div>
      </div>

      {/* Section 2: Location & Google Maps */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? '2. موقع المرسى وخرائط جوجل بجدة' : '2. Jeddah Marina & Google Maps'}</span>
        </h4>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{isRtl ? 'رابط خرائط جوجل للمرسى أو المركز (Google Maps Pin):' : 'Google Maps URL:'}</span>
              {location.googleMapsUrl && (
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>{isRtl ? 'معاينة الموقع ↗' : 'Preview Pin ↗'}</span>
                </a>
              )}
            </label>
            <input
              type="text"
              value={location.googleMapsUrl}
              onChange={(e) => setLocation({ ...location, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? 'اسم المرسى / العنوان (عربي):' : 'Marina Name (Arabic):'}
              </label>
              <input
                type="text"
                value={location.marinaNameAr}
                onChange={(e) => setLocation({ ...location, marinaNameAr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? 'اسم المرسى / العنوان (إنجليزي):' : 'Marina Name (English):'}
              </label>
              <input
                type="text"
                value={location.marinaNameEn}
                onChange={(e) => setLocation({ ...location, marinaNameEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Trust Badges & Verification */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <ShieldCheck className="w-4 h-4 text-[#C59B5F]" />
          <span>{isRtl ? '3. التوثيق الرسمي والسجل (Trust & Legal Badges)' : '3. Legal Badges & Verification'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'رقم وثيقة العمل الحر:' : 'Freelance Document #:'}
            </label>
            <input
              type="text"
              value={trust.freelanceDocNumber || ''}
              onChange={(e) => setTrust({ ...trust, freelanceDocNumber: e.target.value })}
              placeholder="FL-2918401"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-[#C59B5F] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'رقم السجل التجاري (إن وجد):' : 'Commercial Reg #:'}
            </label>
            <input
              type="text"
              value={trust.crNumber || ''}
              onChange={(e) => setTrust({ ...trust, crNumber: e.target.value })}
              placeholder="4030000000"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-[#C59B5F] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'الرقم الضريبي (اختياري):' : 'VAT Number (Optional):'}
            </label>
            <input
              type="text"
              value={trust.vatNumber || ''}
              onChange={(e) => setTrust({ ...trust, vatNumber: e.target.value })}
              placeholder="300000000000003"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-[#C59B5F] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trust.padiFiveStar ?? true}
              onChange={(e) => setTrust({ ...trust, padiFiveStar: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{isRtl ? 'تفعيل شارة الاعتماد الدولي PADI Certified Professional' : 'Enable PADI Certified Professional Badge'}</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="gold-gradient-btn px-8 py-3.5 rounded-2xl text-slate-950 font-bold text-sm shadow-xl shadow-[#C59B5F]/20 flex items-center gap-2 active:scale-95 transition-transform cursor-pointer"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'حفظ كافة بيانات التواصل والتوثيق' : 'Save All Changes'}</span>
        </button>
      </div>

    </form>
  );
};
