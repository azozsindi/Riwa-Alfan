import React, { useState } from 'react';
import { 
  Share2, MapPin, ShieldCheck, Shield, Instagram, Video, ExternalLink, Save, Globe, 
  Award, Plus, Trash2, Upload, CheckCircle2, FileCheck2, Building2, Link2, Eye, EyeOff, Edit3 
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
  const [newPartnerBadgeAr, setNewPartnerBadgeAr] = useState('معتمد رسمي');
  const [newPartnerLink, setNewPartnerLink] = useState('');
  const [newPartnerLogoUrl, setNewPartnerLogoUrl] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSocial(social);
    onUpdateLocation(location);
    onUpdateTrust(trust);
    showToast(isRtl ? 'تم حفظ وتطبيق كافة بيانات التوثيق والاعتمادات بنجاح! 🚀' : 'Social & Trust Details Saved!');
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
      nameEn: newPartnerNameAr.trim(),
      badgeTextAr: newPartnerBadgeAr.trim() || 'معتمد رسمي',
      badgeTextEn: 'Verified',
      logoUrl: newPartnerLogoUrl.trim() || undefined,
      linkUrl: newPartnerLink.trim() || undefined,
      active: true
    };
    const updatedPartners = [...(trust.partnerLogos || []), newPartner];
    const updatedTrust = { ...trust, partnerLogos: updatedPartners };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
    setNewPartnerNameAr('');
    setNewPartnerBadgeAr('معتمد رسمي');
    setNewPartnerLink('');
    setNewPartnerLogoUrl('');
    showToast(isRtl ? 'تمت إضافة بطاقة الاعتماد إلى الفوتر!' : 'Partner logo added to footer!');
  };

  const handleUpdatePartnerItem = (id: string, updates: Partial<PartnerLogoItem>) => {
    const updatedPartners = (trust.partnerLogos || []).map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    const updatedTrust = { ...trust, partnerLogos: updatedPartners };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
  };

  const handleDeletePartnerLogo = (id: string) => {
    const updatedPartners = (trust.partnerLogos || []).filter(p => p.id !== id);
    const updatedTrust = { ...trust, partnerLogos: updatedPartners };
    setTrust(updatedTrust);
    onUpdateTrust(updatedTrust);
    showToast(isRtl ? 'تم حذف بطاقة الاعتماد.' : 'Partner logo removed.');
  };

  const handlePartnerLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, partnerId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await optimizeImageFile(file);
        if (partnerId) {
          handleUpdatePartnerItem(partnerId, { logoUrl: base64 });
          showToast(isRtl ? 'تم تحديث لوجو الجهة بنجاح!' : 'Partner logo updated!');
        } else {
          setNewPartnerLogoUrl(base64);
          showToast(isRtl ? 'تم تحميل لوجو الجهة الجديدة!' : 'Logo image loaded!');
        }
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
          <Building2 className="w-4 h-4" />
          <span>{isRtl ? 'الاعتمادات الرسمية، التوثيق، والتذييل' : 'Official Accreditations & Trust'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
          {isRtl ? 'التحكم في منصات التوثيق، أرقام الرخص، والفوتر' : 'Accreditations, License IDs & Footer'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl 
            ? 'تعديل أسماء وشعارات منصات التوثيق الشريكة (منصة الأعمال، الاتحاد السعودي، منصة العمل الحر، PADI)، نصوص التذييل، ورقم وثيقة العمل الحر.'
            : 'Customize partner platform badges, verification labels, license numbers, and footer copyright text.'}
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
            {isRtl ? 'تظهر مباشرة في الفوتر' : 'Visible in Footer'}
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

      {/* Section 2: Partner & Accreditation Logos in Footer */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? '2. تعديل بطاقات ومنصات التوثيق الشريكة بالفوتر' : '2. Footer Partner Platforms & Badges'}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl ? 'يمكنك هنا تعديل أسماء المنصات، نصوص التوثيق (مثل: معتمد رسمي)، الروابط، وإضافة جهات جديدة.' : 'Edit platform names, badges, links, and icons.'}
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shrink-0">
            {trust.partnerLogos?.length || 0} {isRtl ? 'منصات' : 'Platforms'}
          </span>
        </div>

        {/* Section Header Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'عنوان قسم التوثيق في الفوتر:' : 'Section Title:'}
            </label>
            <input
              type="text"
              value={trust.sectionTitleAr || 'الاعتمادات الرسمية ومنصات التوثيق الشريكة'}
              onChange={(e) => setTrust({ ...trust, sectionTitleAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'النص التوضيحي للقسم:' : 'Section Subtitle:'}
            </label>
            <input
              type="text"
              value={trust.sectionSubtitleAr || 'توثيق رسمي ومعتمد بالمملكة العربية السعودية'}
              onChange={(e) => setTrust({ ...trust, sectionSubtitleAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Existing Partner Cards List (Full Inline Editor) */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-200 block">
            {isRtl ? 'البطاقات المعروضة حالياً في الفوتر (يمكنك تعديل أي منها فوراً):' : 'Active Partner Cards in Footer:'}
          </span>

          <div className="grid grid-cols-1 gap-3">
            {(trust.partnerLogos || []).map((partner, idx) => (
              <div 
                key={partner.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.nameAr} 
                        className="w-9 h-9 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#C59B5F]" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-white">
                      {partner.nameAr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Upload / Replace Logo Button */}
                    <label className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>{isRtl ? 'تغيير اللوجو' : 'Change Logo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handlePartnerLogoUpload(e, partner.id)} 
                        className="hidden" 
                      />
                    </label>

                    {/* Toggle Active Button */}
                    <button
                      type="button"
                      onClick={() => handleUpdatePartnerItem(partner.id, { active: partner.active === false ? true : false })}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        partner.active !== false
                          ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title={isRtl ? 'إظهار / إخفاء من الفوتر' : 'Toggle Visible'}
                    >
                      {partner.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{partner.active !== false ? (isRtl ? 'ظاهر' : 'Visible') : (isRtl ? 'مخفي' : 'Hidden')}</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePartnerLogo(partner.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 cursor-pointer"
                      title={isRtl ? 'حذف البطاقة' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Editing Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">
                      {isRtl ? 'اسم المنصة / الجهة:' : 'Name:'}
                    </label>
                    <input
                      type="text"
                      value={partner.nameAr}
                      onChange={(e) => handleUpdatePartnerItem(partner.id, { nameAr: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">
                      {isRtl ? 'نص الشارة الفرعية (مثال: معتمد رسمي):' : 'Badge Subtitle:'}
                    </label>
                    <input
                      type="text"
                      value={partner.badgeTextAr || 'معتمد رسمي'}
                      onChange={(e) => handleUpdatePartnerItem(partner.id, { badgeTextAr: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">
                      {isRtl ? 'رابط الموقع أو التحقق (اختياري):' : 'Link URL (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={partner.linkUrl || ''}
                      onChange={(e) => handleUpdatePartnerItem(partner.id, { linkUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-cyan-300 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Partner Logo Sub-form */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-emerald-300 block">
            {isRtl ? '+ إضافة منصة توثيق أو جهة اعتماد جديدة:' : '+ Add New Accreditation Card:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <input
              type="text"
              value={newPartnerNameAr}
              onChange={(e) => setNewPartnerNameAr(e.target.value)}
              placeholder={isRtl ? 'اسم الجهة (مثال: منصة الأعمال)' : 'Platform Name'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={newPartnerBadgeAr}
              onChange={(e) => setNewPartnerBadgeAr(e.target.value)}
              placeholder={isRtl ? 'نص الشارة (مثال: معتمد رسمي)' : 'Badge (e.g. Verified)'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <input
              type="text"
              value={newPartnerLink}
              onChange={(e) => setNewPartnerLink(e.target.value)}
              placeholder={isRtl ? 'رابط التحقق (اختياري)' : 'Link URL'}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2">
              <label className="flex-1 px-3 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{newPartnerLogoUrl ? (isRtl ? 'تم اختيار لوجو' : 'Selected') : (isRtl ? 'رفع لوجو' : 'Logo')}</span>
                <input type="file" accept="image/*" onChange={(e) => handlePartnerLogoUpload(e)} className="hidden" />
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

      {/* Section 3: PADI Certifications Catalog */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? '3. قائمة شهادات واعتمادات PADI (PADI Certified)' : '3. PADI Certifications Catalog'}</span>
          </h4>
          <span className="text-[11px] font-mono text-blue-400">
            {trust.certificates?.length || 0} {isRtl ? 'شهادات مسجلة' : 'Certificates'}
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
                  <Award className="w-4 h-4 text-[#C59B5F]" />
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

      {/* Section 4: Footer Copyright & Legal Text Customizer */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span>{isRtl ? '4. تعديل نصوص حقوق النشر وتذييل الفوتر' : '4. Footer Copyright & Country Text'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'سطر حقوق النشر في الفوتر:' : 'Copyright Text:'}
            </label>
            <input
              type="text"
              value={trust.copyrightTextAr || 'جميع الحقوق محفوظة © 2026 رواء الفن للغوص (Riwa Alfan) · كابتن فهد الهويملي PADI'}
              onChange={(e) => setTrust({ ...trust, copyrightTextAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'اسم الدولة / النطاق في الفوتر:' : 'Country / Region Label:'}
            </label>
            <input
              type="text"
              value={trust.countryTextAr || 'المملكة العربية السعودية'}
              onChange={(e) => setTrust({ ...trust, countryTextAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Social Media Links */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Share2 className="w-4 h-4 text-pink-400" />
          <span>{isRtl ? '5. حسابات التواصل الاجتماعي الرسمية' : '5. Official Social Media Channels'}</span>
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

      {/* Section 6: Location & Google Maps */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{isRtl ? '6. موقع المرسى وخرائط جوجل بجدة' : '6. Jeddah Marina & Google Maps'}</span>
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
          <span>{isRtl ? 'حفظ كافة بيانات التوثيق والاعتمادات' : 'Save All Changes'}</span>
        </button>
      </div>

    </form>
  );
};
