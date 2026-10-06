import React, { useState } from 'react';
import { 
  Share2, MapPin, ShieldCheck, Shield, Instagram, Video, ExternalLink, Save, Globe, 
  Award, Plus, Trash2, Upload, CheckCircle2, FileCheck2, Building2, Link2 
} from 'lucide-react';
import { SocialLinksConfig, LocationConfig, TrustBadgesConfig, PadiCertificateItem, PartnerLogoItem } from '../../../types/admin';
import { DEFAULT_SOCIAL_LINKS, DEFAULT_LOCATION_CONFIG, DEFAULT_TRUST_BADGES } from '../../../data/defaultConfig';
import { useLanguage } from '../../../context/LanguageContext';
import { optimizeImageFile } from '../../../utils/imageUtils';

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

  // New Certificate state
  const [newCertTitleAr, setNewCertTitleAr] = useState('');
  const [newCertTitleEn, setNewCertTitleEn] = useState('');
  const [newCertNumber, setNewCertNumber] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('منظمة PADI الدولية');

  // New Partner Logo state
  const [newPartnerNameAr, setNewPartnerNameAr] = useState('');
  const [newPartnerNameEn, setNewPartnerNameEn] = useState('');
  const [newPartnerLink, setNewPartnerLink] = useState('');
  const [newPartnerLogoUrl, setNewPartnerLogoUrl] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSocial(social);
    onUpdateLocation(location);
    onUpdateTrust(trust);
    showToast(isRtl ? 'تم حفظ روابط التواصل والموقع والشهادات والاعتمادات بنجاح! 🚀' : 'Social & Trust Details Saved!');
  };

  // Add Certificate handler
  const handleAddCertificate = () => {
    if (!newCertTitleAr.trim()) return;
    const newCert: PadiCertificateItem = {
      id: `cert-${Date.now()}`,
      titleAr: newCertTitleAr.trim(),
      titleEn: newCertTitleEn.trim() || newCertTitleAr.trim(),
      codeOrNumber: newCertNumber.trim() || undefined,
      issuer: newCertIssuer.trim() || 'PADI',
      active: true
    };
    const updatedCerts = [...(trust.certificates || []), newCert];
    const updatedTrust = { ...trust, certificates: updatedCerts };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
    setNewCertTitleAr('');
    setNewCertTitleEn('');
    setNewCertNumber('');
    showToast(isRtl ? 'تمت إضافة الشهادة بنجاح للقائمة!' : 'Certificate added successfully!');
  };

  const handleDeleteCertificate = (id: string) => {
    const updatedCerts = (trust.certificates || []).filter(c => c.id !== id);
    const updatedTrust = { ...trust, certificates: updatedCerts };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
    showToast(isRtl ? 'تم حذف الشهادة.' : 'Certificate deleted.');
  };

  // Add Partner Logo handler
  const handleAddPartnerLogo = () => {
    if (!newPartnerNameAr.trim()) return;
    const newPartner: PartnerLogoItem = {
      id: `partner-${Date.now()}`,
      nameAr: newPartnerNameAr.trim(),
      nameEn: newPartnerNameEn.trim() || newPartnerNameAr.trim(),
      logoUrl: newPartnerLogoUrl.trim() || undefined,
      linkUrl: newPartnerLink.trim() || undefined,
      active: true
    };
    const updatedPartners = [...(trust.partnerLogos || []), newPartner];
    const updatedTrust = { ...trust, partnerLogos: updatedPartners };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
    setNewPartnerNameAr('');
    setNewPartnerNameEn('');
    setNewPartnerLink('');
    setNewPartnerLogoUrl('');
    showToast(isRtl ? 'تمت إضافة شعار الشريك/الاعتماد للفوتر!' : 'Partner logo added to footer!');
  };

  const handleDeletePartnerLogo = (id: string) => {
    const updatedPartners = (trust.partnerLogos || []).filter(p => p.id !== id);
    const updatedTrust = { ...trust, partnerLogos: updatedPartners };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
    showToast(isRtl ? 'تم حذف شعار الجهة.' : 'Partner logo removed.');
  };

  const handlePartnerLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await optimizeImageFile(file);
        setNewPartnerLogoUrl(base64);
        showToast(isRtl ? 'تم اختيار صورة الشعار بنجاح!' : 'Logo image loaded!');
      } catch (err) {
        console.error('Error optimizing image:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Share2 className="w-4 h-4" />
          <span>{isRtl ? 'التواصل الاجتماعي والتوثيق والشهادات' : 'Social Media, Location & Trust'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
          {isRtl ? 'شهادات PADI، وثيقة العمل الحر، وشعارات الاعتمادات' : 'PADI Certificates, Freelance License & Badges'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl 
            ? 'إدارة رقم وثيقة العمل الحر، رخصة PADI OWSI، قائمة شهادات واعتمادات الغوص، وشعارات منصات التوثيق كمنصة الأعمال والاتحاد السعودي في الفوتر.'
            : 'Configure your official licenses, PADI certification catalog, and footer accreditation badges (Business Platform, Saudi Federation).'}
        </p>
      </div>

      {/* Section 1: Official Licenses & IDs */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-[#C59B5F]/40 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C59B5F]" />
            <span>{isRtl ? '1. التراخيص وأرقام الوثائق الرسمية' : '1. Official Licenses & IDs'}</span>
          </h4>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            {isRtl ? 'تظهر في الفوتر والواجهة' : 'Visible in Footer & Web'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Freelance License */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'رقم وثيقة العمل الحر:' : 'Freelance Document #:'}</span>
            </label>
            <input
              type="text"
              value={trust.freelanceDocNumber || 'FL-2918401'}
              onChange={(e) => setTrust({ ...trust, freelanceDocNumber: e.target.value })}
              placeholder="FL-2918401"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">مثال: FL-2918401</span>
          </div>

          {/* PADI OWSI License */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRtl ? 'رقم رخصة PADI OWSI:' : 'PADI OWSI License #:'}</span>
            </label>
            <input
              type="text"
              value={trust.owsiNumber || 'PADI OWSI #482910'}
              onChange={(e) => setTrust({ ...trust, owsiNumber: e.target.value })}
              placeholder="PADI OWSI #482910"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">مثال: PADI OWSI #482910</span>
          </div>

          {/* PADI MSDT Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'رتبة PADI MSDT:' : 'PADI MSDT Rating:'}</span>
            </label>
            <input
              type="text"
              value={trust.msdtNumber || 'PADI MSDT #482910'}
              onChange={(e) => setTrust({ ...trust, msdtNumber: e.target.value })}
              placeholder="PADI MSDT #482910"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-amber-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">مثال: PADI MSDT #482910</span>
          </div>
        </div>
      </div>

      {/* Section 2: PADI Certified & Accreditations List */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? '2. قائمة شهادات واعتمادات PADI (PADI Certified)' : '2. PADI Certifications Catalog'}</span>
          </h4>
          <span className="text-[11px] font-mono text-blue-400">
            {isRtl ? `${trust.certificates?.length || 0} شهادة مسجلة` : `${trust.certificates?.length || 0} Listed`}
          </span>
        </div>

        {/* List of existing certificates */}
        <div className="space-y-2.5">
          {(trust.certificates || []).map((cert) => (
            <div 
              key={cert.id}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {cert.titleAr}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    {cert.codeOrNumber && (
                      <span className="text-blue-300 font-bold">{cert.codeOrNumber}</span>
                    )}
                    {cert.issuer && (
                      <span>· {cert.issuer}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCertificate(cert.id)}
                className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title={isRtl ? 'حذف الشهادة' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Certificate Sub-form */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-blue-300 block">
            {isRtl ? '+ إضافة شهادة أو رخصة غوص جديدة للقائمة:' : '+ Add New PADI Certification:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <input
              type="text"
              value={newCertTitleAr}
              onChange={(e) => setNewCertTitleAr(e.target.value)}
              placeholder={isRtl ? 'اسم الشهادة بالعربية (مثال: مدرب نيتروكس)' : 'Title (Arabic)'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={newCertTitleEn}
              onChange={(e) => setNewCertTitleEn(e.target.value)}
              placeholder={isRtl ? 'اسم الشهادة بالإنجليزية (اختياري)' : 'Title (English)'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={newCertNumber}
              onChange={(e) => setNewCertNumber(e.target.value)}
              placeholder={isRtl ? 'رقم أو رمز الشهادة (مثال: #482910)' : 'Number / Code'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddCertificate}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة الشهادة' : 'Add Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Partner & Accreditation Logos in Footer */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? '3. شعارات ولوجوهات الاعتمادات في الفوتر (منصة الأعمال، الاتحاد السعودي، إلخ)' : '3. Footer Partner & Accreditation Logos'}</span>
          </h4>
          <span className="text-[11px] font-mono text-emerald-400">
            {isRtl ? `${trust.partnerLogos?.length || 0} جهات مضافة` : `${trust.partnerLogos?.length || 0} Logos`}
          </span>
        </div>

        {/* List of current partner logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(trust.partnerLogos || []).map((partner) => (
            <div 
              key={partner.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {partner.logoUrl ? (
                  <img src={partner.logoUrl} alt={partner.nameAr} className="w-8 h-8 object-contain rounded shrink-0 bg-slate-950 p-1" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{partner.nameAr}</span>
                  {partner.linkUrl && (
                    <span className="text-[10px] text-cyan-400 font-mono block truncate">{partner.linkUrl}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeletePartnerLogo(partner.id)}
                className="w-7 h-7 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 cursor-pointer"
                title={isRtl ? 'حذف الشعار' : 'Delete'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Partner Logo Sub-form */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-emerald-300 block">
            {isRtl ? '+ إضافة جهة اعتماد أو منصة جديدة إلى الفوتر:' : '+ Add New Accreditation Logo to Footer:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={newPartnerNameAr}
              onChange={(e) => setNewPartnerNameAr(e.target.value)}
              placeholder={isRtl ? 'اسم الجهة (مثال: منصة الأعمال السعودية)' : 'Organization Name (Arabic)'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={newPartnerLink}
              onChange={(e) => setNewPartnerLink(e.target.value)}
              placeholder={isRtl ? 'رابط الموقع أو التحقق (اختياري)' : 'URL Link (Optional)'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2">
              <label className="flex-1 px-3 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{newPartnerLogoUrl ? (isRtl ? 'تم اختيار صورة' : 'Image Selected') : (isRtl ? 'رفع صورة اللوجو' : 'Upload Logo')}</span>
                <input type="file" accept="image/*" onChange={handlePartnerLogoUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={handleAddPartnerLogo}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'إضافة' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Social Media Links */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Share2 className="w-4 h-4 text-pink-400" />
          <span>{isRtl ? '4. حسابات التواصل الاجتماعي الرسمية' : '4. Official Social Media Channels'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* Section 5: Location & Google Maps */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{isRtl ? '5. موقع المرسى وخرائط جوجل بجدة' : '5. Jeddah Marina & Google Maps'}</span>
        </h4>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{isRtl ? 'رابط خرائط جوجل للمرسى بجدة (Google Maps Pin):' : 'Google Maps URL:'}</span>
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? 'اسم المرسى / العنوان (عربي):' : 'Marina Name (Arabic):'}
              </label>
              <input
                type="text"
                value={location.marinaNameAr || 'مرسى أبحر الشمالية - جدة'}
                onChange={(e) => setLocation({ ...location, marinaNameAr: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? 'اسم المرسى / العنوان (إنجليزي):' : 'Marina Name (English):'}
              </label>
              <input
                type="text"
                value={location.marinaNameEn || 'North Obhur Marina - Jeddah'}
                onChange={(e) => setLocation({ ...location, marinaNameEn: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="gold-gradient-btn px-8 py-3.5 rounded-2xl text-slate-950 font-bold text-sm shadow-xl shadow-[#C59B5F]/20 flex items-center gap-2 active:scale-95 transition-transform cursor-pointer"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'حفظ كافة بيانات التوثيق والشهادات' : 'Save All Changes'}</span>
        </button>
      </div>

    </form>
  );
};
