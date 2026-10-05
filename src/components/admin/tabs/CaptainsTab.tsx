import React, { useState } from 'react';
import { 
  Users, UserPlus, Award, Phone, Check, Trash2, Edit2, 
  X, Upload, User, ShieldCheck, Sparkles, MessageCircle, Star 
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Captain } from '../../../types/admin';
import { FahadsLogo } from '../../FahadsLogo';
import { optimizeImageFile } from '../../../utils/imageUtils';

interface CaptainsTabProps {
  captains: Captain[];
  onAddCaptain: (captain: Omit<Captain, 'id'>) => void;
  onUpdateCaptain: (id: string, updated: Partial<Captain>) => void;
  onDeleteCaptain: (id: string) => void;
  showToast: (msg?: string) => void;
}

const PRESET_SPECIALTIES = [
  { ar: 'غوص الأعماق (Deep Diver)', en: 'Deep Diver Specialist' },
  { ar: 'غوص الهواء المخصب النيتروكس (Enriched Air Nitrox)', en: 'Enriched Air Nitrox (EANx)' },
  { ar: 'غوص حطام وسفن البحر الأحمر (Wreck Diver)', en: 'Red Sea Wreck Diving' },
  { ar: 'الإسعافات الأولية وتأهيل الطوارئ (EFR)', en: 'Emergency First Response (EFR)' },
  { ar: 'الغوص الليلي واستكشاف الأعماق (Night Diver)', en: 'Night Diver Specialist' },
  { ar: 'إتقان الطفو المثالي (Peak Performance Buoyancy)', en: 'Peak Performance Buoyancy' },
  { ar: 'تصوير احترافي تحت الماء (Underwater Photography)', en: 'Underwater Photography' },
  { ar: 'غوص السايدماونت (Sidemount Diver)', en: 'Sidemount Diving Specialist' },
  { ar: 'مرشد غوص رحلات بحرية (Divemaster Expeditions)', en: 'Divemaster Expeditions' },
  { ar: 'الغوص الحر التناغمي (Freediving Instructor)', en: 'Freediving Specialist' }
];

export const CaptainsTab: React.FC<CaptainsTabProps> = ({
  captains,
  onAddCaptain,
  onUpdateCaptain,
  onDeleteCaptain,
  showToast
}) => {
  const { isRtl } = useLanguage();
  
  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaptainId, setEditingCaptainId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Captain, 'id'>>({
    nameAr: '',
    nameEn: '',
    titleAr: 'PADI Open Water Scuba Instructor (OWSI)',
    titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
    roleAr: 'مدرب غوص معتمد',
    roleEn: 'Certified Diving Instructor',
    padiNumber: '',
    experienceYears: '5+ سنوات خبرة',
    bioAr: '',
    bioEn: '',
    photoUrl: '',
    phone: '',
    whatsappNumber: '',
    specialtiesAr: [],
    specialtiesEn: [],
    isLead: false
  });

  const [customSpecialtyAr, setCustomSpecialtyAr] = useState('');
  const [customSpecialtyEn, setCustomSpecialtyEn] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingCaptainId(null);
    setFormData({
      nameAr: '',
      nameEn: '',
      titleAr: 'PADI Open Water Scuba Instructor (OWSI)',
      titleEn: 'PADI Open Water Scuba Instructor (OWSI)',
      roleAr: 'مدرب غوص معتمد',
      roleEn: 'Certified Diving Instructor',
      padiNumber: 'PADI #',
      experienceYears: '5+ سنوات خبرة',
      bioAr: '',
      bioEn: '',
      photoUrl: '',
      phone: '',
      whatsappNumber: '',
      specialtiesAr: [
        'غوص الأعماق (Deep Diver)',
        'غوص الهواء المخصب النيتروكس (Enriched Air Nitrox)',
        'الإسعافات الأولية وتأهيل الطوارئ (EFR)'
      ],
      specialtiesEn: [
        'Deep Diver Specialist',
        'Enriched Air Nitrox (EANx)',
        'Emergency First Response (EFR)'
      ],
      isLead: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cap: Captain) => {
    setEditingCaptainId(cap.id);
    setFormData({
      nameAr: cap.nameAr || '',
      nameEn: cap.nameEn || '',
      titleAr: cap.titleAr || 'PADI Open Water Scuba Instructor (OWSI)',
      titleEn: cap.titleEn || 'PADI Open Water Scuba Instructor (OWSI)',
      roleAr: cap.roleAr || 'مدرب غوص معتمد',
      roleEn: cap.roleEn || 'Certified Diving Instructor',
      padiNumber: cap.padiNumber || '',
      experienceYears: cap.experienceYears || '',
      bioAr: cap.bioAr || '',
      bioEn: cap.bioEn || '',
      photoUrl: cap.photoUrl || '',
      phone: cap.phone || '',
      whatsappNumber: cap.whatsappNumber || '',
      specialtiesAr: cap.specialtiesAr || [],
      specialtiesEn: cap.specialtiesEn || [],
      isLead: !!cap.isLead
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await optimizeImageFile(file);
        setFormData(prev => ({ ...prev, photoUrl: base64 }));
        showToast(isRtl ? 'تم تحميل صورة الكابتن بنجاح!' : 'Captain photo uploaded successfully!');
      } catch (err) {
        console.error('Error optimizing photo:', err);
      }
    }
  };

  const handleToggleSpecialty = (ar: string, en: string) => {
    const exists = formData.specialtiesAr.includes(ar);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        specialtiesAr: prev.specialtiesAr.filter(s => s !== ar),
        specialtiesEn: prev.specialtiesEn.filter(s => s !== en)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialtiesAr: [...prev.specialtiesAr, ar],
        specialtiesEn: [...prev.specialtiesEn, en]
      }));
    }
  };

  const handleAddCustomSpecialty = () => {
    if (!customSpecialtyAr.trim()) return;
    const ar = customSpecialtyAr.trim();
    const en = customSpecialtyEn.trim() || ar;
    if (!formData.specialtiesAr.includes(ar)) {
      setFormData(prev => ({
        ...prev,
        specialtiesAr: [...prev.specialtiesAr, ar],
        specialtiesEn: [...prev.specialtiesEn, en]
      }));
    }
    setCustomSpecialtyAr('');
    setCustomSpecialtyEn('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) {
      showToast(isRtl ? 'يرجى إدخال اسم الكابتن' : 'Please enter captain name');
      return;
    }

    if (editingCaptainId) {
      onUpdateCaptain(editingCaptainId, formData);
      showToast(isRtl ? 'تم تحديث بيانات الكابتن بنجاح!' : 'Captain updated successfully!');
    } else {
      onAddCaptain(formData);
      showToast(isRtl ? 'تمت إضافة الكابتن الجديد بنجاح!' : 'New captain added successfully!');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onDeleteCaptain(id);
    setDeleteConfirmId(null);
    showToast(isRtl ? 'تم حذف الكابتن من القائمة' : 'Captain removed');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header & Add Button */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C59B5F]" />
            <span>{isRtl ? 'كباتن ومدربو رواء الفن المعتمدون' : 'Certified Captains & Instructors'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'إضافة وتعديل بيانات كباتن ومدربي المركز، رخص PADI، التخصصات، وأرقام التواصل المباشرة.'
              : 'Add and manage center captains, PADI license numbers, specialties, and contact info.'}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="gold-gradient-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-md shadow-[#C59B5F]/20"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>{isRtl ? 'إضافة كابتن جديد' : 'Add New Captain'}</span>
        </button>
      </div>

      {/* Captains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {captains.map((captain) => (
          <div 
            key={captain.id}
            className={`rounded-2xl bg-slate-950/80 border p-5 flex flex-col justify-between space-y-4 transition-all relative overflow-hidden group ${
              captain.isLead 
                ? 'border-[#C59B5F]/50 shadow-lg shadow-[#C59B5F]/10' 
                : 'border-slate-800 hover:border-[#C59B5F]/40'
            }`}
          >
            {/* Top Info Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-[#C59B5F]/40 overflow-hidden flex items-center justify-center shrink-0">
                    {captain.photoUrl ? (
                      <img 
                        src={captain.photoUrl} 
                        alt={captain.nameAr} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <FahadsLogo size="sm" theme="dark" showWordmark={false} />
                    )}
                  </div>
                  {captain.isLead && (
                    <span 
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-[#C59B5F] text-slate-950 shadow-md"
                      title={isRtl ? 'كبير المدربين ومؤسس المركز' : 'Lead Instructor'}
                    >
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(captain)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                    title={isRtl ? 'تعديل بيانات الكابتن' : 'Edit Captain'}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#E0BA84]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(captain.id)}
                    className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 transition-colors cursor-pointer"
                    title={isRtl ? 'حذف الكابتن' : 'Delete Captain'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Name */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-extrabold text-white">
                    {isRtl ? captain.nameAr : (captain.nameEn || captain.nameAr)}
                  </h4>
                  {captain.roleAr && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C59B5F]/15 text-[#E0BA84] border border-[#C59B5F]/30">
                      {isRtl ? captain.roleAr : (captain.roleEn || captain.roleAr)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#C59B5F] font-semibold mt-0.5">
                  {isRtl ? captain.titleAr : (captain.titleEn || captain.titleAr)}
                </p>

                {captain.padiNumber && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C59B5F]" />
                    <span>{captain.padiNumber}</span>
                    {captain.experienceYears && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span>{captain.experienceYears}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Bio snippet */}
              {captain.bioAr && (
                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {isRtl ? captain.bioAr : (captain.bioEn || captain.bioAr)}
                </p>
              )}

              {/* Specialties tags */}
              {captain.specialtiesAr && captain.specialtiesAr.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  {captain.specialtiesAr.slice(0, 3).map((spec, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {spec}
                    </span>
                  ))}
                  {captain.specialtiesAr.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5">
                      +{captain.specialtiesAr.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Direct Contact Button */}
            {captain.whatsappNumber && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${captain.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'محادثة الكابتن واتساب' : 'WhatsApp Contact'}</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isRtl ? 'تأكيد حذف الكابتن؟' : 'Confirm Delete Captain?'}
            </h4>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'هل أنت متأكد من رغبتك بحذف هذا الكابتن؟ لن يظهر في قائمة مدربي الموقع بعد الحذف.' 
                : 'Are you sure you want to remove this captain from the website team?'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-red-600/30"
              >
                {isRtl ? 'نعم، حذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Captain Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`bg-slate-900 border border-[#C59B5F]/30 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 ${
            isRtl ? 'text-right' : 'text-left'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#C59B5F]/15 border border-[#C59B5F]/30 text-[#C59B5F] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {editingCaptainId 
                      ? (isRtl ? 'تعديل بيانات الكابتن' : 'Edit Captain Profile') 
                      : (isRtl ? 'إضافة كابتن مدرب جديد' : 'Add New Dive Captain')}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isRtl ? 'أدخل تفاصيل المدرب واعتماداته وتخصصاته' : 'Enter instructor credentials and specialties'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Photo Upload Area */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  {isRtl ? 'الصورة الشخصية للكابتن:' : 'Captain Photo:'}
                </span>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-900 border-2 border-[#C59B5F]/40 overflow-hidden flex items-center justify-center shrink-0">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer border border-slate-700 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C59B5F]" />
                      <span>{isRtl ? 'رفع صورة الكابتن' : 'Upload Photo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                        className="block text-[11px] text-red-400 hover:underline cursor-pointer"
                      >
                        {isRtl ? 'إزالة الصورة الحالية' : 'Remove Photo'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'اسم الكابتن (بالعربية): *' : 'Captain Name (Arabic): *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كابتن خالد السلمي"
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'اسم الكابتن (بالإنجليزية):' : 'Captain Name (English):'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Capt. Khaled Al-Sulami"
                    value={formData.nameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>
              </div>

              {/* Title & Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'الرتبة والاعتماد (بالعربية):' : 'Title / Rank (Arabic):'}
                  </label>
                  <input
                    type="text"
                    placeholder="PADI Open Water Scuba Instructor (OWSI)"
                    value={formData.titleAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'الرتبة والاعتماد (بالإنجليزية):' : 'Title / Rank (English):'}
                  </label>
                  <input
                    type="text"
                    placeholder="PADI Open Water Scuba Instructor (OWSI)"
                    value={formData.titleEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>
              </div>

              {/* PADI Number & Experience & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'رقم عضوية PADI:' : 'PADI Member #:'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #498210"
                    value={formData.padiNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, padiNumber: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'سنوات الخبرة:' : 'Experience Years:'}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 6+ سنوات خبرة"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isRtl ? 'رقم الواتساب المباشر:' : 'WhatsApp Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="9665xxxxxxxx"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>
              </div>

              {/* Lead Captain Checkbox */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isRtl ? 'تمييز ككبير المدربين / مؤسس رواء الفن' : 'Mark as Lead Instructor / Founder'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isRtl ? 'سيظهر مع شارة ذهبية خاصة ونجم التميز في الواجهة' : 'Displays with gold founder badge on homepage'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isLead}
                  onChange={(e) => setFormData(prev => ({ ...prev, isLead: e.target.checked }))}
                  className="w-5 h-5 rounded text-[#C59B5F] bg-slate-900 border-slate-700 focus:ring-[#C59B5F] cursor-pointer"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isRtl ? 'نبذة شخصية عن الكابتن (بالعربية):' : 'Captain Bio (Arabic):'}
                </label>
                <textarea
                  rows={2}
                  placeholder="نبذة مختصرة عن أسلوب التدريب، حب البحر، والخبرات..."
                  value={formData.bioAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, bioAr: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                />
              </div>

              {/* Specialties Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isRtl ? 'تخصصات الكابتن التدريبية المعتمدة:' : 'Teaching Specialties:'}
                </label>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {PRESET_SPECIALTIES.map((preset, idx) => {
                    const isSelected = formData.specialtiesAr.includes(preset.ar);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleSpecialty(preset.ar, preset.en)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#C59B5F]/20 border-[#C59B5F] text-[#E0BA84] font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#C59B5F]" />}
                        <span>{preset.ar}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Specialty input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={isRtl ? 'إضافة تخصص إضافي يدوي...' : 'Add custom specialty...'}
                    value={customSpecialtyAr}
                    onChange={(e) => setCustomSpecialtyAr(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSpecialty}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isRtl ? 'إضافة' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg shadow-[#C59B5F]/25 active:scale-95"
                >
                  {editingCaptainId 
                    ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') 
                    : (isRtl ? 'إضافة الكابتن' : 'Add Captain')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
