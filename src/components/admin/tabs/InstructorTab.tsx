import React, { useState } from 'react';
import { UserCheck, User, Upload, Check, Trash2, Plus, Award, Save, Sparkles, Lock, PhoneCall, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { InstructorConfig, FemaleInstructorConfig } from '../../../types/admin';
import { DEFAULT_FEMALE_INSTRUCTOR } from '../../../data/defaultConfig';

interface InstructorTabProps {
  initialInstructor: InstructorConfig;
  initialFemaleInstructor?: FemaleInstructorConfig;
  onUpdateInstructor: (instructor: InstructorConfig | Partial<InstructorConfig>) => void;
  onUpdateFemaleInstructor?: (femaleInst: Partial<FemaleInstructorConfig>) => void;
  showToast: (msg?: string) => void;
}

export const InstructorTab: React.FC<InstructorTabProps> = ({
  initialInstructor,
  initialFemaleInstructor,
  onUpdateInstructor,
  onUpdateFemaleInstructor,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  
  // Sub-tabs: Lead Instructor (Capt. Fahad) vs. Female Training Division
  const [activeSubTab, setActiveSubTab] = useState<'lead' | 'female'>('lead');

  // Lead Instructor Form
  const [instructorForm, setInstructorForm] = useState<InstructorConfig>(initialInstructor);
  const [newSpecialtyAr, setNewSpecialtyAr] = useState('');
  const [newSpecialtyEn, setNewSpecialtyEn] = useState('');
  const [newCertTextAr, setNewCertTextAr] = useState('');

  // Female Training Division Form
  const [femaleForm, setFemaleForm] = useState<FemaleInstructorConfig>(initialFemaleInstructor || DEFAULT_FEMALE_INSTRUCTOR);
  const [newFeatureAr, setNewFeatureAr] = useState('');
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFemaleSpecAr, setNewFemaleSpecAr] = useState('');
  const [newFemaleSpecEn, setNewFemaleSpecEn] = useState('');

  // Handlers for Lead Instructor
  const handleInstructorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setInstructorForm(prev => ({ ...prev, photoUrl: base64 }));
        onUpdateInstructor({ photoUrl: base64 });
        showToast();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = () => {
    if (!newSpecialtyAr.trim()) return;
    const updatedAr = [...(instructorForm.specialtiesAr || []), newSpecialtyAr.trim()];
    const updatedEn = [...(instructorForm.specialtiesEn || []), newSpecialtyEn.trim() || newSpecialtyAr.trim()];
    setInstructorForm(prev => ({ ...prev, specialtiesAr: updatedAr, specialtiesEn: updatedEn }));
    onUpdateInstructor({ specialtiesAr: updatedAr, specialtiesEn: updatedEn });
    setNewSpecialtyAr('');
    setNewSpecialtyEn('');
    showToast();
  };

  const handleRemoveSpecialty = (index: number) => {
    const updatedAr = instructorForm.specialtiesAr.filter((_, i) => i !== index);
    const updatedEn = instructorForm.specialtiesEn.filter((_, i) => i !== index);
    setInstructorForm(prev => ({ ...prev, specialtiesAr: updatedAr, specialtiesEn: updatedEn }));
    onUpdateInstructor({ specialtiesAr: updatedAr, specialtiesEn: updatedEn });
    showToast();
  };

  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstructor(instructorForm);
    showToast(isRtl ? 'تم حفظ بيانات كابتن فهد بنجاح!' : 'Captain Fahad profile saved!');
  };

  // Handlers for Female Training Division
  const handleFemalePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFemaleForm(prev => ({ ...prev, photoUrl: base64 }));
        onUpdateFemaleInstructor?.({ photoUrl: base64 });
        showToast(isRtl ? 'تم رفع صورة المدربة!' : 'Instructor photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureAr.trim()) return;
    const updatedAr = [...(femaleForm.featuresListAr || []), newFeatureAr.trim()];
    const updatedEn = [...(femaleForm.featuresListEn || []), newFeatureEn.trim() || newFeatureAr.trim()];
    setFemaleForm(prev => ({ ...prev, featuresListAr: updatedAr, featuresListEn: updatedEn }));
    setNewFeatureAr('');
    setNewFeatureEn('');
  };

  const handleRemoveFeature = (idx: number) => {
    const updatedAr = femaleForm.featuresListAr.filter((_, i) => i !== idx);
    const updatedEn = femaleForm.featuresListEn.filter((_, i) => i !== idx);
    setFemaleForm(prev => ({ ...prev, featuresListAr: updatedAr, featuresListEn: updatedEn }));
  };

  const handleAddFemaleSpec = () => {
    if (!newFemaleSpecAr.trim()) return;
    const updatedAr = [...(femaleForm.specialtiesAr || []), newFemaleSpecAr.trim()];
    const updatedEn = [...(femaleForm.specialtiesEn || []), newFemaleSpecEn.trim() || newFemaleSpecAr.trim()];
    setFemaleForm(prev => ({ ...prev, specialtiesAr: updatedAr, specialtiesEn: updatedEn }));
    setNewFemaleSpecAr('');
    setNewFemaleSpecEn('');
  };

  const handleRemoveFemaleSpec = (idx: number) => {
    const updatedAr = femaleForm.specialtiesAr.filter((_, i) => i !== idx);
    const updatedEn = femaleForm.specialtiesEn.filter((_, i) => i !== idx);
    setFemaleForm(prev => ({ ...prev, specialtiesAr: updatedAr, specialtiesEn: updatedEn }));
  };

  const handleSaveFemaleInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFemaleInstructor?.(femaleForm);
    showToast(isRtl ? 'تم حفظ بيانات قسم التدريب النسائي بنجاح! 🧕' : 'Female training division saved! 🧕');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      
      {/* Sub-Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubTab('lead')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'lead'
              ? 'gold-gradient-btn text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>👑</span>
          <span>{isRtl ? 'كابتن فهد الهويملي (كبير المدربين)' : 'Capt. Fahad (Lead Instructor)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('female')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'female'
              ? 'gold-gradient-btn text-slate-950 shadow-md'
              : 'text-[#E0BA84] hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>🧕</span>
          <span>{isRtl ? 'قسم التدريب النسائي (المدربة النسائية)' : 'Women\'s Training Division'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
        </button>
      </div>

      {/* TAB 1: Captain Fahad Al-Huwaimli */}
      {activeSubTab === 'lead' && (
        <form onSubmit={handleSaveInstructor} className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              {isRtl ? 'بيانات كابتن فهد الهويملي، الرخص والشهادات الدولية' : 'Captain Fahad Profile & International Certifications'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl 
                ? 'التحكم بالاسم، الصورة الشخصية، أرقام رخص PADI وDAN وEFR، السيرة الذاتية، والتخصصات التدريبية.'
                : 'Control name, profile photo, license numbers, bio, and specialties.'}
            </p>
          </div>

          {/* Personal Photo & Avatar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white block">
              {isRtl ? 'الصورة الشخصية للمدرب كابتن فهد:' : 'Instructor Personal Photo:'}
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-blue-500/50 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                {instructorForm.photoUrl ? (
                  <img 
                    src={instructorForm.photoUrl} 
                    alt="Captain Fahad" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <User className="w-10 h-10 text-slate-600 mb-1" />
                    <span className="text-[10px] text-slate-500">{isRtl ? 'لا توجد صورة' : 'No photo'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1 w-full text-center sm:text-start">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl 
                    ? 'ارفع صورتك الشخصية بالبدلة أو معدات الغوص لتظهر في البطاقة التعريفية بصفحة المدرب.' 
                    : 'Upload personal photo to display on instructor bio card.'}
                </p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'رفع صورة جديدة' : 'Upload Photo'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleInstructorPhotoUpload}
                    />
                  </label>
                  {instructorForm.photoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setInstructorForm(prev => ({ ...prev, photoUrl: '' }));
                        onUpdateInstructor({ photoUrl: '' });
                        showToast();
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isRtl ? 'إزالة الصورة (العودة للشعار)' : 'Remove photo'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Names & Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'اسم المدرب (بالعربية):' : 'Instructor Name (Arabic):'}
              </label>
              <input 
                type="text"
                value={instructorForm.nameAr}
                onChange={(e) => setInstructorForm(prev => ({ ...prev, nameAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'اسم المدرب (بالإنجليزية):' : 'Instructor Name (English):'}
              </label>
              <input 
                type="text"
                value={instructorForm.nameEn}
                onChange={(e) => setInstructorForm(prev => ({ ...prev, nameEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الرتبة والاعتماد (بالعربية):' : 'Rank / Title (Arabic):'}
              </label>
              <input 
                type="text"
                value={instructorForm.titleAr}
                onChange={(e) => setInstructorForm(prev => ({ ...prev, titleAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الرتبة والاعتماد (بالإنجليزية):' : 'Rank / Title (English):'}
              </label>
              <input 
                type="text"
                value={instructorForm.titleEn}
                onChange={(e) => setInstructorForm(prev => ({ ...prev, titleEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Official License Numbers */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              <span>{isRtl ? 'أرقام العضويات والتراخيص الدولية المعتمدة:' : 'Official PADI & DAN License Numbers:'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  PADI Member Number (رقم العضوية):
                </label>
                <input 
                  type="text"
                  value={instructorForm.padiMemberNumber}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, padiMemberNumber: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  PADI OWSI License (رخصة مدرب):
                </label>
                <input 
                  type="text"
                  value={instructorForm.owsiNumber}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, owsiNumber: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  DAN Membership (عضوية شبكة أمان الغواصين):
                </label>
                <input 
                  type="text"
                  value={instructorForm.danNumber}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, danNumber: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  EFR Instructor (رخصة مدرب الإسعافات):
                </label>
                <input 
                  type="text"
                  value={instructorForm.efrNumber}
                  onChange={(e) => setInstructorForm(prev => ({ ...prev, efrNumber: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'السيرة الذاتية (بالعربية):' : 'Bio (Arabic):'}
              </label>
              <textarea 
                rows={3}
                value={instructorForm.bioAr}
                onChange={(e) => setInstructorForm(prev => ({ ...prev, bioAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'السيرة الذاتية (بالإنجليزية):' : 'Bio (English):'}
              </label>
              <textarea 
                rows={3}
                value={instructorForm.bioEn}
                onChange={(e) => setInstructorForm(prev => ({ ...prev, bioEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Teaching Specialties List */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              <span>{isRtl ? 'تخصصات التدريب ورتب الماستر (Specialties):' : 'Instructor Specialties:'}</span>
            </span>

            <div className="space-y-2">
              {(instructorForm.specialtiesAr || []).map((specAr, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-bold">{specAr}</span>
                    {instructorForm.specialtiesEn?.[index] && (
                      <span className="text-slate-400 font-mono text-[11px]">({instructorForm.specialtiesEn[index]})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(index)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                placeholder={isRtl ? 'اسم التخصص بالعربية (مثال: مدرب غوص الحطام)' : 'Specialty title (Arabic)'}
                value={newSpecialtyAr}
                onChange={(e) => setNewSpecialtyAr(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
              <input 
                type="text"
                placeholder={isRtl ? 'اسم التخصص بالإنجليزية' : 'Specialty title (English)'}
                value={newSpecialtyEn}
                onChange={(e) => setNewSpecialtyEn(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة تخصص' : 'Add Specialty'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all text-slate-950"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ وتحديث بيانات كابتن فهد' : 'Save Captain Fahad Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Female Training Division (المدربة النسائية وقسم التدريب النسائي) */}
      {activeSubTab === 'female' && (
        <form onSubmit={handleSaveFemaleInstructor} className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C59B5F]" />
              <span>{isRtl ? 'بيانات قسم التدريب النسائي والمدربة النسائية المعتمدة 🧕' : 'Women\'s Diving Division & Female Instructor'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl 
                ? 'إدارة البطاقة التي تظهر بجانب الكابتن فهد في واجهة الموقع، لتعريف المتدربات بالمدربة النسائية، المسابح الخاصة، ومميزات الخصوصية.' 
                : 'Manage the female training card showcased directly next to Captain Fahad.'}
            </p>
          </div>

          {/* Female Instructor Photo Upload */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white block">
              {isRtl ? 'صورة المدربة النسائية أو أيقونة التدريب النسائي:' : 'Female Instructor Photo or Monogram:'}
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-[#C59B5F]/50 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                {femaleForm.photoUrl ? (
                  <img 
                    src={femaleForm.photoUrl} 
                    alt="Female Instructor" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#C59B5F]">
                    <span className="text-2xl">🤿</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-bold">PADI PRO</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1 w-full text-center sm:text-start">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl 
                    ? 'ارفع صورة المدربة أو شعار مخصص للقسم النسائي ليظهر بجانب الكابتن فهد.' 
                    : 'Upload female instructor photo or monogram to showcase on site.'}
                </p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer px-4 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'رفع صورة المدربة' : 'Upload Photo'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFemalePhotoUpload}
                    />
                  </label>
                  {femaleForm.photoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFemaleForm(prev => ({ ...prev, photoUrl: '' }));
                        onUpdateFemaleInstructor?.({ photoUrl: '' });
                        showToast();
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isRtl ? 'إزالة الصورة (العودة للأيقونة)' : 'Remove photo'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name & Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'اسم المدربة / القسم (بالعربية):' : 'Trainer Name / Title (Arabic):'}
              </label>
              <input 
                type="text"
                placeholder="مثال: كابتن ريم السالم (قسم التدريب النسائي)"
                value={femaleForm.nameAr}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, nameAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'اسم المدربة / القسم (بالإنجليزية):' : 'Trainer Name / Title (English):'}
              </label>
              <input 
                type="text"
                placeholder="e.g. Capt. Reem (Ladies Division)"
                value={femaleForm.nameEn}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, nameEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الرتبة والاعتماد (بالعربية):' : 'Rank / Certification (Arabic):'}
              </label>
              <input 
                type="text"
                placeholder="مثال: PADI Open Water Scuba Instructor (OWSI)"
                value={femaleForm.titleAr}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, titleAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الرتبة والاعتماد (بالإنجليزية):' : 'Rank / Certification (English):'}
              </label>
              <input 
                type="text"
                value={femaleForm.titleEn}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, titleEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (Badge):' : 'Top Badge (Arabic):'}
              </label>
              <input 
                type="text"
                placeholder="قسم التدريب النسائي الخاص 🧕"
                value={femaleForm.badgeAr}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, badgeAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالإنجليزية):' : 'Top Badge (English):'}
              </label>
              <input 
                type="text"
                value={femaleForm.badgeEn}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, badgeEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>
          </div>

          {/* Contacts & PADI license */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'رقم ترخيص PADI:' : 'PADI Number:'}
              </label>
              <input 
                type="text"
                placeholder="#514209"
                value={femaleForm.padiNumber || ''}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, padiNumber: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'سنوات الخبرة:' : 'Experience Years:'}
              </label>
              <input 
                type="text"
                placeholder="5+ سنوات خبرة"
                value={femaleForm.experienceYears || ''}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'واتساب التواصل للقسم النسائي:' : 'Women Division WhatsApp:'}
              </label>
              <input 
                type="text"
                placeholder="966530549675"
                value={femaleForm.whatsappNumber || ''}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-mono"
              />
            </div>
          </div>

          {/* Bio text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'نبذة عن التدريب النسائي (بالعربية):' : 'Women\'s Bio (Arabic):'}
              </label>
              <textarea 
                rows={3}
                value={femaleForm.bioAr}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, bioAr: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none resize-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'نبذة عن التدريب النسائي (بالإنجليزية):' : 'Women\'s Bio (English):'}
              </label>
              <textarea 
                rows={3}
                value={femaleForm.bioEn}
                onChange={(e) => setFemaleForm(prev => ({ ...prev, bioEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Key Features of Women's Division */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'مميزات وخصوصية التدريب النسائي (Features):' : 'Key Privacy & Facility Features:'}</span>
            </span>

            <div className="space-y-2">
              {(femaleForm.featuresListAr || []).map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{feat}</span>
                    {femaleForm.featuresListEn?.[idx] && (
                      <span className="text-slate-400 font-mono text-[11px]">({femaleForm.featuresListEn[idx]})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                placeholder={isRtl ? 'ميزة جديدة (مثال: مسابح مغلقة ومحمية بجدة)' : 'New feature (Arabic)'}
                value={newFeatureAr}
                onChange={(e) => setNewFeatureAr(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
              <input 
                type="text"
                placeholder={isRtl ? 'الميزة بالإنجليزية' : 'New feature (English)'}
                value={newFeatureEn}
                onChange={(e) => setNewFeatureEn(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة ميزة' : 'Add Feature'}</span>
              </button>
            </div>
          </div>

          {/* Specialties / Programs */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C59B5F]" />
              <span>{isRtl ? 'الدورات والبرامج النسائية المتاحة (Programs):' : 'Available Programs:'}</span>
            </span>

            <div className="space-y-2">
              {(femaleForm.specialtiesAr || []).map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C59B5F]" />
                    <span>{spec}</span>
                    {femaleForm.specialtiesEn?.[idx] && (
                      <span className="text-slate-400 font-mono text-[11px]">({femaleForm.specialtiesEn[idx]})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFemaleSpec(idx)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                placeholder={isRtl ? 'اسم الدورة بالعربية (مثال: دورة غواص مياه مفتوحة)' : 'Program (Arabic)'}
                value={newFemaleSpecAr}
                onChange={(e) => setNewFemaleSpecAr(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
              <input 
                type="text"
                placeholder={isRtl ? 'اسم الدورة بالإنجليزية' : 'Program (English)'}
                value={newFemaleSpecEn}
                onChange={(e) => setNewFemaleSpecEn(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none"
              />
              <button
                type="button"
                onClick={handleAddFemaleSpec}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-[#C59B5F] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة دورة' : 'Add Program'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all text-slate-950"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ وتحديث بيانات قسم التدريب النسائي 🧕' : 'Save Women\'s Division Details'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
