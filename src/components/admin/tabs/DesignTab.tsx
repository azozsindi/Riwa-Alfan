import React, { useState } from 'react';
import { 
  Palette, Quote, Shield, HeartHandshake, Sparkles, MessageSquare, PhoneCall, 
  Mail, MapPin, ShieldCheck, Calendar, FileText, Check, Save, RefreshCw,
  Building2, Award, FileCheck2, Eye, EyeOff, Globe, Tag,
  BarChart2, Percent, AlertTriangle, Type, Layers, Languages
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  DesignContentConfig, 
  CenterBrandConfig, 
  HeroConfig,
  AnnouncementConfig,
  UnderConstructionConfig,
  LocationConfig, 
  TrustBadgesConfig,
  SocialLinksConfig,
  PartnerLogoItem
} from '../../../types/admin';
import { 
  DEFAULT_DESIGN_CONTENT, 
  DEFAULT_TRUST_BADGES, 
  DEFAULT_CONFIG, 
  DEFAULT_LOCATION_CONFIG,
  DEFAULT_SOCIAL_LINKS
} from '../../../data/defaultConfig';
import { FahadsLogo } from '../../FahadsLogo';

interface DesignTabProps {
  initialDesign?: DesignContentConfig;
  initialBrand: CenterBrandConfig;
  initialHero?: HeroConfig;
  initialAnnouncement?: AnnouncementConfig;
  initialUnderConstruction?: UnderConstructionConfig;
  initialLocation: LocationConfig;
  initialTrust: TrustBadgesConfig;
  initialSocial?: SocialLinksConfig;
  onUpdateDesign: (partial: Partial<DesignContentConfig>) => void;
  onUpdateBrand: (partial: Partial<CenterBrandConfig>) => void;
  onUpdateHero?: (partial: Partial<HeroConfig>) => void;
  onUpdateAnnouncement?: (partial: Partial<AnnouncementConfig>) => void;
  onUpdateUnderConstruction?: (partial: Partial<UnderConstructionConfig>) => void;
  onUpdateLocation: (partial: Partial<LocationConfig>) => void;
  onUpdateTrust: (partial: Partial<TrustBadgesConfig>) => void;
  onUpdateSocial?: (partial: Partial<SocialLinksConfig>) => void;
  showToast: (msg?: string) => void;
}

// Reusable Bilingual Field Helpers
const BilingualInput: React.FC<{
  label: string;
  icon?: React.ReactNode;
  valueAr: string;
  valueEn: string;
  onChangeAr: (val: string) => void;
  onChangeEn: (val: string) => void;
  showAr: boolean;
  showEn: boolean;
  placeholderAr?: string;
  placeholderEn?: string;
  isMono?: boolean;
  isGold?: boolean;
}> = ({
  label, icon, valueAr, valueEn, onChangeAr, onChangeEn, showAr, showEn,
  placeholderAr, placeholderEn, isMono, isGold
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
      {icon}
      <span>{label}</span>
    </label>
    <div className={`grid gap-2 ${showAr && showEn ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
      {showAr && (
        <div className="relative">
          <input
            type="text"
            dir="rtl"
            value={valueAr || ''}
            onChange={(e) => onChangeAr(e.target.value)}
            placeholder={placeholderAr}
            className={`w-full px-3.5 py-2.5 pe-12 rounded-xl bg-slate-900 border border-slate-700 text-xs focus:outline-none transition-colors ${
              isGold ? 'text-[#E0BA84] font-bold focus:border-[#C59B5F]' : 'text-white focus:border-blue-500'
            } ${isMono ? 'font-mono' : ''}`}
          />
          <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded pointer-events-none">
            🇸🇦 AR
          </span>
        </div>
      )}
      {showEn && (
        <div className="relative">
          <input
            type="text"
            dir="ltr"
            value={valueEn || ''}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder={placeholderEn}
            className={`w-full px-3.5 py-2.5 pe-12 rounded-xl bg-slate-900 border border-slate-700 text-xs focus:outline-none transition-colors ${
              isGold ? 'text-[#E0BA84] font-bold focus:border-[#C59B5F]' : 'text-white focus:border-blue-500'
            } ${isMono ? 'font-mono' : ''}`}
          />
          <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-1.5 py-0.5 rounded pointer-events-none">
            🇬🇧 EN
          </span>
        </div>
      )}
    </div>
  </div>
);

const BilingualTextarea: React.FC<{
  label: string;
  icon?: React.ReactNode;
  valueAr: string;
  valueEn: string;
  onChangeAr: (val: string) => void;
  onChangeEn: (val: string) => void;
  showAr: boolean;
  showEn: boolean;
  rows?: number;
}> = ({ label, icon, valueAr, valueEn, onChangeAr, onChangeEn, showAr, showEn, rows = 2 }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
      {icon}
      <span>{label}</span>
    </label>
    <div className={`grid gap-2 ${showAr && showEn ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
      {showAr && (
        <div className="relative">
          <textarea
            dir="rtl"
            rows={rows}
            value={valueAr || ''}
            onChange={(e) => onChangeAr(e.target.value)}
            className="w-full px-3.5 py-2.5 pb-6 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
          />
          <span className="absolute end-2.5 bottom-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded pointer-events-none">
            🇸🇦 AR
          </span>
        </div>
      )}
      {showEn && (
        <div className="relative">
          <textarea
            dir="ltr"
            rows={rows}
            value={valueEn || ''}
            onChange={(e) => onChangeEn(e.target.value)}
            className="w-full px-3.5 py-2.5 pb-6 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none leading-relaxed"
          />
          <span className="absolute end-2.5 bottom-2 text-[10px] font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-1.5 py-0.5 rounded pointer-events-none">
            🇬🇧 EN
          </span>
        </div>
      )}
    </div>
  </div>
);

export const DesignTab: React.FC<DesignTabProps> = ({
  initialDesign = DEFAULT_DESIGN_CONTENT,
  initialBrand,
  initialHero = DEFAULT_CONFIG.hero,
  initialAnnouncement = DEFAULT_CONFIG.announcement,
  initialUnderConstruction = DEFAULT_CONFIG.underConstruction || {
    enabled: true,
    badgeAr: 'الموقع قيد الإطلاق التجريبي',
    badgeEn: 'Beta Launch',
    textAr: 'رواء الفن للغوص بجدة · الحجوزات والاستشارات متاحة مباشرة مع كابتن فهد عبر الواتساب',
    textEn: 'Riwa Alfan Diving Jeddah · Inquiries and bookings are open directly with Captain Fahad via WhatsApp',
    showWhatsAppButton: true
  },
  initialLocation,
  initialTrust,
  initialSocial,
  onUpdateDesign,
  onUpdateBrand,
  onUpdateHero,
  onUpdateAnnouncement,
  onUpdateUnderConstruction,
  onUpdateLocation,
  onUpdateTrust,
  onUpdateSocial,
  showToast,
}) => {
  const { isRtl } = useLanguage();

  // Language Edit Filter: Both, Arabic only, or English only
  const [editLang, setEditLang] = useState<'both' | 'ar' | 'en'>('both');
  const showAr = editLang === 'both' || editLang === 'ar';
  const showEn = editLang === 'both' || editLang === 'en';

  // Forms State
  const [designForm, setDesignForm] = useState<DesignContentConfig>({
    ...DEFAULT_DESIGN_CONTENT,
    ...(initialDesign || {})
  });
  const [brandForm, setBrandForm] = useState<CenterBrandConfig>({ ...initialBrand });
  const [heroForm, setHeroForm] = useState<HeroConfig>({ ...initialHero });
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementConfig>({ ...initialAnnouncement });
  const [underConstructionForm, setUnderConstructionForm] = useState<UnderConstructionConfig>({ ...initialUnderConstruction });
  const [locationForm, setLocationForm] = useState<LocationConfig>({ ...initialLocation });
  const [trustForm, setTrustForm] = useState<TrustBadgesConfig>({ ...DEFAULT_TRUST_BADGES, ...(initialTrust || {}) });
  const [socialForm, setSocialForm] = useState<SocialLinksConfig>({
    snapchat: initialSocial?.snapchat || 'https://www.snapchat.com/add/fahad_huwaimli',
    instagram: initialSocial?.instagram || 'https://instagram.com/riwa_alfan',
    tiktok: initialSocial?.tiktok || '',
    twitter: initialSocial?.twitter || '',
    youtube: initialSocial?.youtube || '',
    showInHeader: initialSocial?.showInHeader !== false,
    showInFooter: initialSocial?.showInFooter !== false,
  });

  const [activeSubSection, setActiveSubSection] = useState<string>('all');

  const partnerLogos: PartnerLogoItem[] = trustForm.partnerLogos && trustForm.partnerLogos.length > 0
    ? trustForm.partnerLogos
    : DEFAULT_TRUST_BADGES.partnerLogos || [];

  const handleUpdatePartner = (id: string, updates: Partial<PartnerLogoItem>) => {
    const updated = partnerLogos.map(item => item.id === id ? { ...item, ...updates } : item);
    setTrustForm(prev => ({ ...prev, partnerLogos: updated }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateDesign(designForm);
    onUpdateBrand(brandForm);
    if (onUpdateHero) onUpdateHero(heroForm);
    if (onUpdateAnnouncement) onUpdateAnnouncement(announcementForm);
    if (onUpdateUnderConstruction) onUpdateUnderConstruction(underConstructionForm);
    onUpdateLocation(locationForm);
    onUpdateTrust(trustForm);
    if (onUpdateSocial) onUpdateSocial(socialForm);
    showToast(isRtl ? 'تم حفظ وتطبيق كافة تصميمات ونصوص الموقع (عربي وإنجليزي) بنجاح! 🚀' : 'Design & Bilingual Content Saved Successfully!');
  };

  const handleResetSection = () => {
    setDesignForm(DEFAULT_DESIGN_CONTENT);
    setBrandForm(DEFAULT_CONFIG.brand);
    setHeroForm(DEFAULT_CONFIG.hero);
    setAnnouncementForm(DEFAULT_CONFIG.announcement);
    setTrustForm(DEFAULT_TRUST_BADGES);
    setLocationForm(DEFAULT_LOCATION_CONFIG);
    setSocialForm(DEFAULT_SOCIAL_LINKS);
    showToast(isRtl ? 'تمت استعادة كافة الإعدادات والنصوص الافتراضية.' : 'Restored all defaults.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Studio Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#C59B5F] text-xs font-bold uppercase tracking-wider">
            <Palette className="w-4 h-4" />
            <span>{isRtl ? 'استوديو التصميم ثنائي اللغة (عربي / إنجليزي)' : 'Bilingual Design Studio (AR / EN)'}</span>
          </div>
          
          {/* Language Edit Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setEditLang('both')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                editLang === 'both' 
                  ? 'gold-gradient-btn text-slate-950 shadow-md shadow-[#C59B5F]/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isRtl ? 'اللغتان معاً 🇸🇦 🇬🇧' : 'Dual (AR & EN)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditLang('ar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editLang === 'ar' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇸🇦 {isRtl ? 'عربي فقط' : 'Arabic Only'}
            </button>
            <button
              type="button"
              onClick={() => setEditLang('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 {isRtl ? 'إنجليزي فقط' : 'English Only'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {isRtl ? 'التصميم والنصوص (عربي / English)' : 'Design & Content (Bilingual)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl mt-1">
              {isRtl 
                ? 'تحكم كامل ثنائي اللغة (العربية والإنجليزية) في كافة نصوص وتصميمات وهوية رواء الفن مع حفظ سحابي فوري في Firebase.' 
                : 'Comprehensive bilingual control over Arabic & English content, branding, and layouts across the entire application.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetSection}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استعادة الافتراضيات' : 'Reset Defaults'}</span>
          </button>
        </div>

        {/* Quick Sub-Navigation */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: isRtl ? 'عرض الكل' : 'All' },
            { id: 'branding', label: isRtl ? '🎨 الخطوط وهوية الشعار' : 'Logo & Fonts' },
            { id: 'hero', label: isRtl ? '🌊 الهيرو والإحصائيات' : 'Hero & Stats' },
            { id: 'offers', label: isRtl ? '🏷️ العروض والخصومات' : 'Offers Banner' },
            { id: 'quote', label: isRtl ? '📜 مقولة وفلسفة المدرب' : 'Quote' },
            { id: 'pillars', label: isRtl ? '🛡️ ركائز السلامة الثلاث' : '3 Pillars' },
            { id: 'contact', label: isRtl ? '💬 التواصل والاستشارة' : 'Contact & Consultation' },
            { id: 'booking', label: isRtl ? '📅 بطاقة الحجز الفوري' : 'Booking Card' },
            { id: 'footer', label: isRtl ? '🏛️ هوية وتراخيص الفوتر' : 'Footer & Licenses' },
            { id: 'disclaimer', label: isRtl ? '⚖️ إخلاء المسؤولية واللائحة' : 'Disclaimer & Policies' },
            { id: 'partners', label: isRtl ? '🤝 منصات التوثيق الشريكة' : 'Partner Platforms' },
            { id: 'copyright', label: isRtl ? '🇸🇦 حقوق الملكية والتوثيق' : 'Copyright & Saudi' },
            { id: 'construction', label: isRtl ? '🚧 شريط قيد الإنشاء' : 'Construction Banner' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubSection(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                activeSubSection === tab.id
                  ? 'gold-gradient-btn text-slate-950 shadow-md shadow-[#C59B5F]/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Typography & Logo Visual Styling */}
      {(activeSubSection === 'all' || activeSubSection === 'branding') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-[#C59B5F]" />
                <span>{isRtl ? '1. الخطوط العربية، الشعار، وخلفية اللوجو' : '1. Typography, Logo & Brand Colors'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'خلفية الشعار (أبيض ناصع مناسب للوجو الغامق) والخط العربي المعتمد' : 'Logo container background (white for dark logos) and site font'}
              </p>
            </div>
            <span className="text-[10px] text-[#C59B5F] font-mono bg-[#C59B5F]/10 border border-[#C59B5F]/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'الهوية البصرية' : 'Brand Theme'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Logo Background */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block">
                {isRtl ? 'خلفية حاوية الشعار (Logo Background):' : 'Logo Container Background:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBrandForm({ ...brandForm, logoBg: 'white' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    brandForm.logoBg === 'white' || !brandForm.logoBg
                      ? 'bg-white text-slate-950 border-[#C59B5F] ring-2 ring-[#C59B5F]/40 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm" />
                  <span>{isRtl ? 'أبيض ناصع (للشعار الغامق)' : 'Pure White'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBrandForm({ ...brandForm, logoBg: 'dark' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    brandForm.logoBg === 'dark'
                      ? 'bg-slate-900 text-white border-[#C59B5F] ring-2 ring-[#C59B5F]/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 shadow-sm" />
                  <span>{isRtl ? 'داكن فخم' : 'Dark'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBrandForm({ ...brandForm, logoBg: 'transparent' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    brandForm.logoBg === 'transparent'
                      ? 'bg-slate-900 text-cyan-300 border-[#C59B5F] ring-2 ring-[#C59B5F]/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-dashed border-slate-500" />
                  <span>{isRtl ? 'شفاف' : 'Transparent'}</span>
                </button>
              </div>

              {/* Logo Preview */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-[11px] text-slate-400">{isRtl ? 'معاينة الشعار:' : 'Preview:'}</span>
                <div className={`p-2 rounded-xl border transition-all ${
                  brandForm.logoBg === 'dark' ? 'bg-slate-900 border-[#C59B5F]/30' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <FahadsLogo 
                    size="sm" 
                    theme={brandForm.logoBg === 'dark' ? 'dark' : 'light'} 
                    customImageUrl={brandForm.logoType === 'custom-image' ? brandForm.customLogoUrl : undefined}
                    customTitle={brandForm.logoText}
                    customSubtext={brandForm.logoSubtext}
                  />
                </div>
              </div>
            </div>

            {/* Arabic Font Selector */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block">
                {isRtl ? 'الخط العربي الرسمي لكامل الموقع:' : 'Primary Arabic Typography:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'alexandria', nameAr: 'خط الإسكندرية (Alexandria)', desc: 'عصري ورياضي' },
                  { id: 'cairo', nameAr: 'خط القاهرة (Cairo)', desc: 'هندسي وواضح' },
                  { id: 'tajawal', nameAr: 'خط تجوال (Tajawal)', desc: 'انسيابي ومريح' },
                  { id: 'almarai', nameAr: 'خط المراعي (Almarai)', desc: 'رسمي وفخم' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setBrandForm({ ...brandForm, fontFamily: f.id as any })}
                    className={`p-2.5 rounded-xl border text-start cursor-pointer transition-all ${
                      (brandForm.fontFamily || 'alexandria') === f.id
                        ? 'bg-[#C59B5F]/15 border-[#C59B5F] text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#E0BA84]">{f.nameAr}</div>
                    <div className="text-[10px] text-slate-400">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bilingual Logo Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BilingualInput
              label={isRtl ? 'نص الشعار (عربي وإنجليزي):' : 'Logo Text (AR & EN):'}
              valueAr={brandForm.logoSubtext || 'رواء الفن'}
              valueEn={brandForm.logoText || 'RIWA ALFAN'}
              onChangeAr={(val) => setBrandForm({ ...brandForm, logoSubtext: val })}
              onChangeEn={(val) => setBrandForm({ ...brandForm, logoText: val })}
              showAr={showAr}
              showEn={showEn}
              isMono={true}
              isGold={true}
            />
          </div>
        </div>
      )}

      {/* 2. Hero Section & Stats */}
      {(activeSubSection === 'all' || activeSubSection === 'hero') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? '2. الواجهة الرئيسية (الهيرو) والإحصائيات' : '2. Hero Section & Stats'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'تعديل الشارة، العنوان الرئيسي، الكلمة الذهبية، الوصف، والإحصائيات باللغتين' : 'Customize hero banner, headline, highlight word, and dive statistics in AR & EN'}
              </p>
            </div>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'الهيرو' : 'Hero Studio'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'شارة الهيرو العلوية (Hero Badge):' : 'Hero Top Badge:'}
              valueAr={heroForm.badgeAr || ''}
              valueEn={heroForm.badgeEn || ''}
              onChangeAr={(val) => setHeroForm({ ...heroForm, badgeAr: val })}
              onChangeEn={(val) => setHeroForm({ ...heroForm, badgeEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'العنوان الرئيسي الأول (Headline Part 1):' : 'Main Headline:'}
              valueAr={heroForm.headlineAr || ''}
              valueEn={heroForm.headlineEn || ''}
              onChangeAr={(val) => setHeroForm({ ...heroForm, headlineAr: val })}
              onChangeEn={(val) => setHeroForm({ ...heroForm, headlineEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'الكلمة الذهبية المضاءة (Highlight Word):' : 'Golden Highlight Word:'}
              valueAr={heroForm.headlineHighlightAr || ''}
              valueEn={heroForm.headlineHighlightEn || ''}
              onChangeAr={(val) => setHeroForm({ ...heroForm, headlineHighlightAr: val })}
              onChangeEn={(val) => setHeroForm({ ...heroForm, headlineHighlightEn: val })}
              showAr={showAr}
              showEn={showEn}
              isGold={true}
            />

            <BilingualTextarea
              label={isRtl ? 'النص التعريفي العريض (Subhead Description):' : 'Subhead Description:'}
              rows={3}
              valueAr={heroForm.subheadAr || ''}
              valueEn={heroForm.subheadEn || ''}
              onChangeAr={(val) => setHeroForm({ ...heroForm, subheadAr: val })}
              onChangeEn={(val) => setHeroForm({ ...heroForm, subheadEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            {/* Dive Statistics */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? 'إحصائيات الغوص الموثقة في الهيرو:' : 'Logged Dives & Statistics:'}</span>
                </span>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={heroForm.showStats !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, showStats: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C59B5F]"
                  />
                  <span>{isRtl ? 'إظهار شريط الإحصائيات' : 'Show Stats Bar'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'عدد الغوصات:' : 'Dives Stat:'}</label>
                  <input
                    type="text"
                    value={heroForm.divesStat || '1,450+'}
                    onChange={(e) => setHeroForm({ ...heroForm, divesStat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'عدد الخريجين:' : 'Certified Students:'}</label>
                  <input
                    type="text"
                    value={heroForm.studentsStat || '520+'}
                    onChange={(e) => setHeroForm({ ...heroForm, studentsStat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-mono font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">{isRtl ? 'نسبة الأمان والسلامة:' : 'Safety Record:'}</label>
                  <input
                    type="text"
                    value={heroForm.safetyStat || '100%'}
                    onChange={(e) => setHeroForm({ ...heroForm, safetyStat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Offers & Announcement Banner */}
      {(activeSubSection === 'all' || activeSubSection === 'offers') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? '3. الشريط الإعلاني والعروض الترويجية' : '3. Announcement & Special Offers'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'الشريط العلوي البارز لعرض الخصومات بالعربية والإنجليزية' : 'Top promotional banner for discounts in Arabic and English'}
              </p>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              <input
                type="checkbox"
                checked={announcementForm.enabled !== false}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <span>{announcementForm.enabled !== false ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Disabled')}</span>
            </label>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'شارة العرض (Offer Badge):' : 'Offer Badge:'}
              valueAr={announcementForm.badgeAr || 'عرض خاص بجدة'}
              valueEn={announcementForm.badgeEn || 'Jeddah Special Offer'}
              onChangeAr={(val) => setAnnouncementForm({ ...announcementForm, badgeAr: val })}
              onChangeEn={(val) => setAnnouncementForm({ ...announcementForm, badgeEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'نص العرض الترويجي (Offer Message):' : 'Offer Message:'}
              valueAr={announcementForm.textAr || ''}
              valueEn={announcementForm.textEn || ''}
              onChangeAr={(val) => setAnnouncementForm({ ...announcementForm, textAr: val })}
              onChangeEn={(val) => setAnnouncementForm({ ...announcementForm, textEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput
                label={isRtl ? 'نص زر العرض (CTA Button):' : 'CTA Button:'}
                valueAr={announcementForm.ctaTextAr || 'احجز العرض الآن'}
                valueEn={announcementForm.ctaTextEn || 'Claim Offer Now'}
                onChangeAr={(val) => setAnnouncementForm({ ...announcementForm, ctaTextAr: val })}
                onChangeEn={(val) => setAnnouncementForm({ ...announcementForm, ctaTextEn: val })}
                showAr={showAr}
                showEn={showEn}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRtl ? 'نسبة الخصم المئوية (%):' : 'Discount Percentage:'}</span>
                </label>
                <input
                  type="number"
                  value={announcementForm.discountPercentage || 20}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, discountPercentage: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Captain Fahad Quote & Philosophy */}
      {(activeSubSection === 'all' || activeSubSection === 'quote') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-[#C59B5F]/40 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#C59B5F]" />
              <span>{isRtl ? '4. مقولة وفلسفة كابتن فهد الهويملي' : '4. Captain Fahad Quote & Philosophy'}</span>
            </h4>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'شريط الاقتباس' : 'Quote Banner'}
            </span>
          </div>

          {/* Bilingual Live Preview */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#162E52]/40 via-slate-900 to-[#0C172B] border border-[#C59B5F]/35 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isRtl ? 'معاينة شريط الاقتباس (عربي وإنجليزي):' : 'Quote Live Preview (AR & EN):'}
            </span>
            {showAr && (
              <p className="text-sm text-slate-200 italic leading-relaxed" dir="rtl">
                &ldquo;{designForm.quoteTextAr || DEFAULT_DESIGN_CONTENT.quoteTextAr}&rdquo;
                <span className="text-xs font-bold text-[#E0BA84] font-brand-arabic block mt-1">
                  — {designForm.quoteAuthorAr || DEFAULT_DESIGN_CONTENT.quoteAuthorAr}
                </span>
              </p>
            )}
            {showEn && (
              <p className="text-xs text-slate-300 italic leading-relaxed pt-1" dir="ltr">
                &ldquo;{designForm.quoteTextEn || DEFAULT_DESIGN_CONTENT.quoteTextEn}&rdquo;
                <span className="text-xs font-bold text-[#E0BA84] block mt-1 font-sans">
                  — {designForm.quoteAuthorEn || DEFAULT_DESIGN_CONTENT.quoteAuthorEn}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <BilingualTextarea
              label={isRtl ? 'نص المقولة (Quote Text):' : 'Quote Text:'}
              rows={3}
              valueAr={designForm.quoteTextAr || ''}
              valueEn={designForm.quoteTextEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, quoteTextAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, quoteTextEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'اسم القائل / المدرب (Author):' : 'Author Signature:'}
              valueAr={designForm.quoteAuthorAr || ''}
              valueEn={designForm.quoteAuthorEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, quoteAuthorAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, quoteAuthorEn: val })}
              showAr={showAr}
              showEn={showEn}
              isGold={true}
            />
          </div>
        </div>
      )}

      {/* 5. The 3 Safety & Training Pillars */}
      {(activeSubSection === 'all' || activeSubSection === 'pillars') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? '5. ركائز التدريب وقيم السلامة الثلاث' : '5. The 3 Core Training Pillars'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'العناوين والأوصاف التفصيلية للركائز الثلاث باللغتين' : 'Titles and descriptions for the 3 pillars in AR and EN'}
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              3 {isRtl ? 'ركائز' : 'Pillars'}
            </span>
          </div>

          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-[#C59B5F] flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>{isRtl ? 'الركيزة 1 (الأمان أولاً وبلا مساومة / Safety First)' : 'Pillar 1: Safety First'}</span>
            </span>
            <BilingualInput
              label={isRtl ? 'عنوان الركيزة 1:' : 'Pillar 1 Title:'}
              valueAr={designForm.pillar1TitleAr || ''}
              valueEn={designForm.pillar1TitleEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, pillar1TitleAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, pillar1TitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
            <BilingualInput
              label={isRtl ? 'وصف الركيزة 1:' : 'Pillar 1 Description:'}
              valueAr={designForm.pillar1DescAr || ''}
              valueEn={designForm.pillar1DescEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, pillar1DescAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, pillar1DescEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>{isRtl ? 'الركيزة 2 (الصبر والراحة النفسية / Patience & Comfort)' : 'Pillar 2: Patience & Comfort'}</span>
            </span>
            <BilingualInput
              label={isRtl ? 'عنوان الركيزة 2:' : 'Pillar 2 Title:'}
              valueAr={designForm.pillar2TitleAr || ''}
              valueEn={designForm.pillar2TitleEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, pillar2TitleAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, pillar2TitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
            <BilingualInput
              label={isRtl ? 'وصف الركيزة 2:' : 'Pillar 2 Description:'}
              valueAr={designForm.pillar2DescAr || ''}
              valueEn={designForm.pillar2DescEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, pillar2DescAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, pillar2DescEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'الركيزة 3 (إتقان الطفو وحماية البيئة / Peak Buoyancy)' : 'Pillar 3: Buoyancy & Conservation'}</span>
            </span>
            <BilingualInput
              label={isRtl ? 'عنوان الركيزة 3:' : 'Pillar 3 Title:'}
              valueAr={designForm.pillar3TitleAr || ''}
              valueEn={designForm.pillar3TitleEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, pillar3TitleAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, pillar3TitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
            <BilingualInput
              label={isRtl ? 'وصف الركيزة 3:' : 'Pillar 3 Description:'}
              valueAr={designForm.pillar3DescAr || ''}
              valueEn={designForm.pillar3DescEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, pillar3DescAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, pillar3DescEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
          </div>
        </div>
      )}

      {/* 6. Direct Contact & Consultation */}
      {(activeSubSection === 'all' || activeSubSection === 'contact') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? '6. قسم التواصل المباشر والاستشارة المجانية' : '6. Direct Contact & Free Consultation'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'نصوص الاستشارة وقنوات الاتصال بجدة باللغتين' : 'Inquiry and direct phone channels in AR and EN'}
              </p>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'التواصل' : 'Contact Box'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'شارة القسم الصغيرة (Kicker):' : 'Section Kicker:'}
              valueAr={designForm.contactKickerAr || ''}
              valueEn={designForm.contactKickerEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, contactKickerAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, contactKickerEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'عنوان القسم الرئيسي (Section Title):' : 'Section Title:'}
              valueAr={designForm.contactTitleAr || ''}
              valueEn={designForm.contactTitleEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, contactTitleAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, contactTitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualTextarea
              label={isRtl ? 'نص الاستشارة والترحيب (Consultation Description):' : 'Consultation Description:'}
              rows={2}
              valueAr={designForm.contactDescAr || ''}
              valueEn={designForm.contactDescEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, contactDescAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, contactDescEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            {/* Direct Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRtl ? 'واتساب مباشر:' : 'WhatsApp #:'}</span>
                </label>
                <input
                  type="text"
                  value={brandForm.whatsappNumber || ''}
                  onChange={(e) => setBrandForm({ ...brandForm, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? 'اتصال مباشر:' : 'Phone #:'}</span>
                </label>
                <input
                  type="text"
                  value={brandForm.phone || ''}
                  onChange={(e) => setBrandForm({ ...brandForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                </label>
                <input
                  type="email"
                  value={brandForm.email || 'Riwaalfan@gmail.com'}
                  onChange={(e) => setBrandForm({ ...brandForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <BilingualInput
              label={isRtl ? 'مقر التدريب والرحلات (Training Sites):' : 'Training Locations:'}
              icon={<MapPin className="w-3.5 h-3.5 text-sky-400" />}
              valueAr={designForm.regionsTextAr || ''}
              valueEn={designForm.regionsTextEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, regionsTextAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, regionsTextEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'نص بطاقة الاعتماد الدولي (Accreditation Agency):' : 'Accreditation Agency:'}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
              valueAr={designForm.certAgencyTextAr || ''}
              valueEn={designForm.certAgencyTextEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, certAgencyTextAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, certAgencyTextEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
          </div>
        </div>
      )}

      {/* 7. Booking Action Card */}
      {(activeSubSection === 'all' || activeSubSection === 'booking') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? '7. بطاقة ودعوة الحجز الفوري (Booking Card)' : '7. Booking Action Card & CTA'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'نصوص بطاقة الحجز وزر الاتصال بالعربية والإنجليزية' : 'Booking appointment CTA card texts in AR and EN'}
              </p>
            </div>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'بطاقة الحجز' : 'Booking CTA'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'عنوان البطاقة (Card Title):' : 'Card Title:'}
              valueAr={designForm.contactCardTitleAr || ''}
              valueEn={designForm.contactCardTitleEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, contactCardTitleAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, contactCardTitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'نص زر الحجز (Button Text):' : 'Button Text:'}
              valueAr={designForm.contactCardBtnAr || ''}
              valueEn={designForm.contactCardBtnEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, contactCardBtnAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, contactCardBtnEn: val })}
              showAr={showAr}
              showEn={showEn}
              isGold={true}
            />

            <BilingualTextarea
              label={isRtl ? 'وصف بطاقة الحجز (Card Description):' : 'Card Description:'}
              rows={2}
              valueAr={designForm.contactCardDescAr || ''}
              valueEn={designForm.contactCardDescEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, contactCardDescAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, contactCardDescEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'شارة التوفر اليومي (Daily Availability):' : 'Daily Availability Note:'}
              valueAr={designForm.availableDailyAr || ''}
              valueEn={designForm.availableDailyEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, availableDailyAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, availableDailyEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
          </div>
        </div>
      )}

      {/* 8. Footer Brand, Bio & Licenses */}
      {(activeSubSection === 'all' || activeSubSection === 'footer') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C59B5F]" />
                <span>{isRtl ? '8. هوية رواء الفن، نبذة المركز، والمقر والتراخيص بالفوتر' : '8. Footer Brand Identity, Bio & Licenses'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'اسم وهوية المركز والنبذة باللغتين ورقم ترخيص PADI ووثيقة العمل الحر' : 'Brand name, subtitle, bio in AR and EN, PADI OWSI # and Freelance doc #'}
              </p>
            </div>
            <span className="text-[10px] text-[#C59B5F] font-mono bg-[#C59B5F]/10 border border-[#C59B5F]/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'الفوتر الرئيسي' : 'Footer Brand'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'اسم وهوية المركز (Center Name):' : 'Center Name:'}
              valueAr={brandForm.centerNameAr || 'رواء الفن'}
              valueEn={brandForm.centerNameEn || 'Riwa Alfan'}
              onChangeAr={(val) => setBrandForm({ ...brandForm, centerNameAr: val })}
              onChangeEn={(val) => setBrandForm({ ...brandForm, centerNameEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'السطر التعريفي أسفل الشعار (Subtitle):' : 'Subtitle:'}
              valueAr={brandForm.subtitleAr || ''}
              valueEn={brandForm.subtitleEn || ''}
              onChangeAr={(val) => setBrandForm({ ...brandForm, subtitleAr: val })}
              onChangeEn={(val) => setBrandForm({ ...brandForm, subtitleEn: val })}
              showAr={showAr}
              showEn={showEn}
              isGold={true}
            />

            <BilingualTextarea
              label={isRtl ? 'نبذة المركز في الفوتر (Center Bio):' : 'Center Bio:'}
              rows={3}
              valueAr={brandForm.bioAr || ''}
              valueEn={brandForm.bioEn || ''}
              onChangeAr={(val) => setBrandForm({ ...brandForm, bioAr: val })}
              onChangeEn={(val) => setBrandForm({ ...brandForm, bioEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'مقر ومرسى التدريب بجدة (Marina Location):' : 'Marina Location Label:'}
              icon={<MapPin className="w-3.5 h-3.5 text-cyan-400" />}
              valueAr={locationForm.marinaNameAr || 'مرسى أبحر الشمالية - جدة'}
              valueEn={locationForm.marinaNameEn || 'North Obhur Marina - Jeddah'}
              onChangeAr={(val) => setLocationForm({ ...locationForm, marinaNameAr: val })}
              onChangeEn={(val) => setLocationForm({ ...locationForm, marinaNameEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            {/* Google Maps & Licenses */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isRtl ? 'رابط خرائط جوجل للمرسى:' : 'Google Maps GPS:'}</span>
                </label>
                <input
                  type="text"
                  value={locationForm.googleMapsUrl || ''}
                  onChange={(e) => setLocationForm({ ...locationForm, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? 'رقم رخصة PADI OWSI:' : 'PADI OWSI #:'}</span>
                </label>
                <input
                  type="text"
                  value={brandForm.owsiNumber || 'PADI OWSI #482910'}
                  onChange={(e) => setBrandForm({ ...brandForm, owsiNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRtl ? 'وثيقة العمل الحر:' : 'Freelance Doc #:'}</span>
                </label>
                <input
                  type="text"
                  value={brandForm.freelanceDocNumber || 'FL-2918401'}
                  onChange={(e) => setBrandForm({ ...brandForm, freelanceDocNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>👻</span>
                  <span>{isRtl ? 'رابط حساب سناب شات (Snapchat):' : 'Snapchat Profile URL:'}</span>
                </label>
                <input
                  type="text"
                  value={socialForm.snapchat || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, snapchat: e.target.value })}
                  placeholder="https://www.snapchat.com/add/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-yellow-300 text-xs font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>📸</span>
                  <span>{isRtl ? 'رابط حساب انستغرام (Instagram):' : 'Instagram Profile URL:'}</span>
                </label>
                <input
                  type="text"
                  value={socialForm.instagram || ''}
                  onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-pink-300 text-xs font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Safety Disclaimer & Policies Modal */}
      {(activeSubSection === 'all' || activeSubSection === 'disclaimer') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? '9. إخلاء مسؤولية ومعايير السلامة واللائحة الرسمية' : '9. Safety Disclaimer & Official Policies'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'نصوص إخلاء المسؤولية لسلامة رياضة الغوص وزر اللائحة باللغتين' : 'Safety disclaimer body and official policy button text in AR & EN'}
              </p>
            </div>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'السلامة واللوائح' : 'Safety Box'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'عنوان إخلاء المسؤولية (Disclaimer Title):' : 'Disclaimer Title:'}
              valueAr={designForm.footerDisclaimerTitleAr || 'إخلاء مسؤولية ومعايير السلامة'}
              valueEn={designForm.footerDisclaimerTitleEn || 'Safety Regulations & Liability Disclaimer'}
              onChangeAr={(val) => setDesignForm({ ...designForm, footerDisclaimerTitleAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, footerDisclaimerTitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'نص زر عرض اللائحة الرسمية (Policy Button):' : 'Policy Button Text:'}
              valueAr={designForm.footerPolicyBtnAr || 'عرض اللائحة الرسمية للاسترداد والتدريب والسلامة ❯'}
              valueEn={designForm.footerPolicyBtnEn || 'View Official Refund & Safety Regulations ❯'}
              onChangeAr={(val) => setDesignForm({ ...designForm, footerPolicyBtnAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, footerPolicyBtnEn: val })}
              showAr={showAr}
              showEn={showEn}
              isGold={true}
            />

            <BilingualTextarea
              label={isRtl ? 'نص إخلاء المسؤولية ومعايير السلامة بالكامل:' : 'Safety Disclaimer Body Text:'}
              rows={3}
              valueAr={designForm.footerDisclaimerTextAr || ''}
              valueEn={designForm.footerDisclaimerTextEn || ''}
              onChangeAr={(val) => setDesignForm({ ...designForm, footerDisclaimerTextAr: val })}
              onChangeEn={(val) => setDesignForm({ ...designForm, footerDisclaimerTextEn: val })}
              showAr={showAr}
              showEn={showEn}
            />
          </div>
        </div>
      )}

      {/* 10. Partner Accreditations & Platform Cards */}
      {(activeSubSection === 'all' || activeSubSection === 'partners') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? '10. الاعتمادات الرسمية ومنصات التوثيق الشريكة بالمملكة' : '10. Official Accreditations & Partner Platforms'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'المنصات الأربعة المعتمدة: منصة الأعمال، الاتحاد السعودي، منصة العمل الحر، ومنظمة PADI' : 'The 4 officially accredited partner platforms in AR & EN'}
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              4 {isRtl ? 'منصات' : 'Partners'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'عنوان قسم الاعتمادات في الفوتر (Section Title):' : 'Section Title:'}
              valueAr={trustForm.sectionTitleAr || 'الاعتمادات الرسمية ومنصات التوثيق الشريكة'}
              valueEn={trustForm.sectionTitleEn || 'Official Accreditations & Partner Platforms'}
              onChangeAr={(val) => setTrustForm({ ...trustForm, sectionTitleAr: val })}
              onChangeEn={(val) => setTrustForm({ ...trustForm, sectionTitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'السطر التوضيحي للتوثيق (Section Subtitle):' : 'Section Subtitle:'}
              valueAr={trustForm.sectionSubtitleAr || 'توثيق رسمي ومعتمد بالمملكة العربية السعودية'}
              valueEn={trustForm.sectionSubtitleEn || 'Officially Verified & Registered in Saudi Arabia'}
              onChangeAr={(val) => setTrustForm({ ...trustForm, sectionSubtitleAr: val })}
              onChangeEn={(val) => setTrustForm({ ...trustForm, sectionSubtitleEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            {/* The 4 Partner Cards */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-300 block">
                {isRtl ? 'بطاقات المنصات الشريكة الأربعة (عربي وإنجليزي):' : 'The 4 Partner Cards (AR & EN):'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {partnerLogos.map((partner, idx) => (
                  <div 
                    key={partner.id || idx}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#C59B5F]" />
                        <span>{isRtl ? partner.nameAr : (partner.nameEn || partner.nameAr)}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleUpdatePartner(partner.id, { active: partner.active === false ? true : false })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          partner.active !== false
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {partner.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{partner.active !== false ? (isRtl ? 'ظاهر' : 'Active') : (isRtl ? 'مخفي' : 'Hidden')}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <BilingualInput
                        label={isRtl ? 'اسم المنصة:' : 'Platform Name:'}
                        valueAr={partner.nameAr || ''}
                        valueEn={partner.nameEn || ''}
                        onChangeAr={(val) => handleUpdatePartner(partner.id, { nameAr: val })}
                        onChangeEn={(val) => handleUpdatePartner(partner.id, { nameEn: val })}
                        showAr={showAr}
                        showEn={showEn}
                      />

                      <BilingualInput
                        label={isRtl ? 'نص الشارة الفرعية:' : 'Badge Subtitle:'}
                        valueAr={partner.badgeTextAr || 'معتمد رسمي'}
                        valueEn={partner.badgeTextEn || 'Verified'}
                        onChangeAr={(val) => handleUpdatePartner(partner.id, { badgeTextAr: val })}
                        onChangeEn={(val) => handleUpdatePartner(partner.id, { badgeTextEn: val })}
                        showAr={showAr}
                        showEn={showEn}
                        isMono={true}
                      />

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">{isRtl ? 'رابط التحقق (اختياري):' : 'Link URL:'}</label>
                        <input
                          type="text"
                          value={partner.linkUrl || ''}
                          onChange={(e) => handleUpdatePartner(partner.id, { linkUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. Footer Copyright & Legal Verification */}
      {(activeSubSection === 'all' || activeSubSection === 'copyright') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? '11. شريط حقوق الملكية وتوثيق المملكة بالكامل' : '11. Footer Copyright & Country Bar'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'السطر النهائي في أسفل الموقع مع الدولة وشارة PADI Certified باللغتين' : 'Bottom copyright line and legal credentials in AR and EN'}
              </p>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              {isRtl ? 'الشريط السفلي' : 'Bottom Bar'}
            </span>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'نص حقوق الملكية الكامل (Copyright Text):' : 'Copyright Text:'}
              valueAr={trustForm.copyrightTextAr || 'جميع الحقوق محفوظة © 2026 رواء الفن للغوص (Riwa Alfan) · كابتن فهد الهويملي PADI'}
              valueEn={trustForm.copyrightTextEn || 'All rights reserved © 2026 Riwa Alfan Diving · Capt. Fahad Al-Huwaimli PADI'}
              onChangeAr={(val) => setTrustForm({ ...trustForm, copyrightTextAr: val })}
              onChangeEn={(val) => setTrustForm({ ...trustForm, copyrightTextEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'اسم الدولة (Country Name):' : 'Country Name:'}
              valueAr={trustForm.countryTextAr || 'المملكة العربية السعودية'}
              valueEn={trustForm.countryTextEn || 'Kingdom of Saudi Arabia'}
              onChangeAr={(val) => setTrustForm({ ...trustForm, countryTextAr: val })}
              onChangeEn={(val) => setTrustForm({ ...trustForm, countryTextEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            {/* Live Bilingual Preview */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">{isRtl ? 'معاينة الشريط السفلي:' : 'Bottom Bar Preview:'}</span>
              {showAr && (
                <div className="flex flex-wrap items-center justify-between gap-2" dir="rtl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{trustForm.copyrightTextAr}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400">وثيقة العمل الحر: {brandForm.freelanceDocNumber || 'FL-2918401'}</span>
                    <span>·</span>
                    <span className="font-mono text-blue-400">{brandForm.owsiNumber || 'PADI OWSI #482910'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{trustForm.countryTextAr}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-bold">PADI Certified</span>
                  </div>
                </div>
              )}
              {showEn && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60" dir="ltr">
                  <div className="flex flex-wrap items-center gap-2 text-slate-400">
                    <span>{trustForm.copyrightTextEn}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400">Freelance: {brandForm.freelanceDocNumber || 'FL-2918401'}</span>
                    <span>·</span>
                    <span className="font-mono text-blue-400">{brandForm.owsiNumber || 'PADI OWSI #482910'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{trustForm.countryTextEn}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-400 text-[10px] font-bold">PADI Certified</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. Under Construction Bar Controls */}
      {(activeSubSection === 'all' || activeSubSection === 'construction') && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? '12. شريط الموقع قيد الإطلاق التجريبي / قيد الإنشاء' : '12. Under Construction & Beta Notice'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'الشريط التنبيهي أعلى الموقع لتوضيح أن الموقع في مرحلة التدشين باللغتين' : 'Top alert banner notifying visitors that site is in early launch'}
              </p>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <input
                type="checkbox"
                checked={underConstructionForm.enabled !== false}
                onChange={(e) => setUnderConstructionForm({ ...underConstructionForm, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500"
              />
              <span>{underConstructionForm.enabled !== false ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Hidden')}</span>
            </label>
          </div>

          <div className="space-y-4">
            <BilingualInput
              label={isRtl ? 'شارة التنبيه (Notice Badge):' : 'Notice Badge:'}
              valueAr={underConstructionForm.badgeAr || 'الموقع قيد الإطلاق التجريبي'}
              valueEn={underConstructionForm.badgeEn || 'Beta Launch'}
              onChangeAr={(val) => setUnderConstructionForm({ ...underConstructionForm, badgeAr: val })}
              onChangeEn={(val) => setUnderConstructionForm({ ...underConstructionForm, badgeEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <BilingualInput
              label={isRtl ? 'نص رسالة التنبيه (Notice Text):' : 'Notice Text:'}
              valueAr={underConstructionForm.textAr || ''}
              valueEn={underConstructionForm.textEn || ''}
              onChangeAr={(val) => setUnderConstructionForm({ ...underConstructionForm, textAr: val })}
              onChangeEn={(val) => setUnderConstructionForm({ ...underConstructionForm, textEn: val })}
              showAr={showAr}
              showEn={showEn}
            />

            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={underConstructionForm.showWhatsAppButton !== false}
                  onChange={(e) => setUnderConstructionForm({ ...underConstructionForm, showWhatsAppButton: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span>{isRtl ? 'إظهار زر الواتساب السريع داخل شريط التنبيه' : 'Show quick WhatsApp button in notice'}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900/95 border border-[#C59B5F]/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'كافة تعديلات التصميم والمحتوى العربي والإنجليزي تُحفظ وتُطبق سحابياً.' : 'Bilingual changes sync live across all pages.'}</span>
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DDB67E] via-[#C59B5F] to-[#A4783B] hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#C59B5F]/20 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'حفظ وتثبيت كافة التعديلات 💾' : 'Save All Bilingual Changes 💾'}</span>
        </button>
      </div>

    </form>
  );
};
