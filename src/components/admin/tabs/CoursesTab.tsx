import React, { useState, useEffect } from 'react';
import { Award, RotateCcw, Plus, Database, Edit3, X, Save, Trash2, AlertTriangle, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Course } from '../../../data/divingData';
import { DesignContentConfig } from '../../../types/admin';
import { DEFAULT_DESIGN_CONTENT } from '../../../data/defaultConfig';

interface CoursesTabProps {
  courses: Course[];
  initialDesign?: DesignContentConfig;
  onUpdateCourse: (id: string, updates: Partial<Course>) => void;
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onRestorePrices: () => boolean;
  onUpdateDesign?: (design: Partial<DesignContentConfig>) => void;
  showToast: (msg?: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  initialDesign = DEFAULT_DESIGN_CONTENT,
  onUpdateCourse,
  onAddCourse,
  onDeleteCourse,
  onRestorePrices,
  onUpdateDesign,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [designForm, setDesignForm] = useState<DesignContentConfig>(initialDesign);
  const [showHeaderEditor, setShowHeaderEditor] = useState(false);

  useEffect(() => {
    if (initialDesign) setDesignForm(initialDesign);
  }, [initialDesign]);

  const handleSaveCourseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    onUpdateCourse(editingCourse.id, editingCourse);
    setEditingCourse(null);
    showToast();
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDesign?.(designForm);
    showToast(isRtl ? 'تم تحديث عنوان ومقدمة قسم الدورات بنجاح!' : 'Courses header updated!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            {isRtl ? 'إدارة الدورات التدريبية والأسعار PADI' : 'PADI Courses & Pricing Management'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'تعديل أسعار الدورات، المدة، العمق، التفاصيل، أو إضافة دورة تدريبية جديدة بجدة.'
              : 'Edit course prices, durations, curriculum details, or add new courses.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const ok = onRestorePrices();
              if (ok) {
                showToast(isRtl ? 'تم استرجاع أسعارك وتعديلاتك السابقة بنجاح!' : 'Previous prices restored successfully!');
              } else {
                showToast(isRtl ? 'الأسعار الحالية هي أحدث نسخة محفوظة' : 'Current prices are up to date');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title={isRtl ? 'استرجاع تعديلات الأسعار من الذاكرة المحلية السابقة' : 'Restore previous prices from memory'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استرجاع أسعاري السابقة' : 'Restore Previous Prices'}</span>
          </button>

          <button
            onClick={() => {
              const newId = `course-${Date.now()}`;
              const freshCourse: Course = {
                id: newId,
                category: 'specialty',
                certAgency: 'PADI',
                seaDives: 2,
                poolSessions: 1,
                title: { ar: 'دورة تدريبية جديدة', en: 'New Diving Course' },
                price: { ar: '1,500 ر.س', en: '1,500 SAR' },
                duration: { ar: 'يومين', en: '2 Days' },
                depth: { ar: 'حتى 20 متر', en: 'Up to 20m' },
                summary: { ar: 'وصف وموجز الدورة...', en: 'Course overview...' },
                prerequisites: { ar: 'غواص مياه مفتوحة مرخص', en: 'Open Water Diver' },
                highlights: { ar: ['تدريب عملي بجدة', 'شهادة PADI رقمية'], en: ['Practical training in Jeddah', 'PADI digital eCard'] },
                curriculum: { ar: ['الجانب النظري', 'الغوص في البحر'], en: ['Theory session', 'Open water dives'] }
              };
              onAddCourse(freshCourse);
              setEditingCourse(freshCourse);
              showToast();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30 shrink-0 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة دورة جديدة' : 'Add New Course'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHeaderEditor(!showHeaderEditor)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>{isRtl ? 'تعديل عنوان ومقدمة القسم' : 'Edit Section Header'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHeaderEditor ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsible Section Header Editor */}
      {showHeaderEditor && (
        <form onSubmit={handleSaveHeader} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              <span>{isRtl ? 'تعديل عنوان ونصوص مقدمة قسم الدورات التدريبية' : 'Courses Section Header Texts'}</span>
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isRtl ? 'حفظ النصوص' : 'Save Header'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالعربية):' : 'Kicker (Arabic):'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={designForm.coursesKickerAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, coursesKickerAr: e.target.value }))}
                placeholder="دورات معتمدة دولياً · PADI"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الشارة العلوية (بالإنجليزية):' : 'Kicker (English):'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={designForm.coursesKickerEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, coursesKickerEn: e.target.value }))}
                placeholder="Internationally Certified Courses · PADI"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العنوان الرئيسي (بالعربية):' : 'Title (Arabic):'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={designForm.coursesTitleAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, coursesTitleAr: e.target.value }))}
                placeholder="اختر مسار تدريبك وانطلق في الأعماق"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'العنوان الرئيسي (بالإنجليزية):' : 'Title (English):'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={designForm.coursesTitleEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, coursesTitleEn: e.target.value }))}
                placeholder="Choose Your Path & Dive Deeper"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الوصف التوضيحي (بالعربية):' : 'Description (Arabic):'}
              </label>
              <textarea
                dir="rtl"
                rows={2}
                value={designForm.coursesDescAr || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, coursesDescAr: e.target.value }))}
                placeholder="من دورات المبتدئين حتى الاحتراف والقيادة. جميع الدورات شاملة المواد والمعدات والشهادات الدولية."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'الوصف التوضيحي (بالإنجليزية):' : 'Description (English):'}
              </label>
              <textarea
                dir="ltr"
                rows={2}
                value={designForm.coursesDescEn || ''}
                onChange={(e) => setDesignForm(prev => ({ ...prev, coursesDescEn: e.target.value }))}
                placeholder="From beginner discovery to professional mastery. All courses include gear, materials, and international certification."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>
          </div>
        </form>
      )}

      {/* Cloud Sync & Quick Price Matrix */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'تعديل أسعار الدورات السريع (مباشر وسحابي):' : 'Fast Live Price Matrix:'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              {isRtl ? 'سحابي ومحفوظ دائماً' : 'Cloud Saved'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isRtl ? 'اكتب السعر واضغط حفظ للتطبيق المباشر' : 'Edit price & save live'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">
                  {course.title.ar}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {course.title.en} · {course.duration.ar}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <input 
                  type="text"
                  value={course.price.ar}
                  onChange={(e) => {
                    const newPriceAr = e.target.value;
                    const newPriceEn = newPriceAr.replace(/ر\.س/g, 'SAR');
                    onUpdateCourse(course.id, {
                      price: {
                        ar: newPriceAr,
                        en: newPriceEn
                      }
                    });
                  }}
                  className="w-24 px-2 py-1.5 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-xs text-white font-mono font-bold text-center outline-none"
                  placeholder="1,850 ر.س"
                />
                <button
                  type="button"
                  onClick={() => setEditingCourse(course)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={isRtl ? 'تعديل باقي تفاصيل الدورة' : 'Edit full details'}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Edit Modal / Panel */}
      {editingCourse && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              {isRtl ? `تعديل الدورة: ${editingCourse.title.ar}` : `Edit Course: ${editingCourse.title.en}`}
            </span>
            <button
              onClick={() => setEditingCourse(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCourseEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'عنوان الدورة (عربي):' : 'Course Title (Arabic):'}
                </label>
                <input 
                  type="text"
                  value={editingCourse.title.ar}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    title: { ...editingCourse.title, ar: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'عنوان الدورة (إنجليزي):' : 'Course Title (English):'}
                </label>
                <input 
                  type="text"
                  value={editingCourse.title.en}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    title: { ...editingCourse.title, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'السعر (عربي):' : 'Price (Arabic):'}
                </label>
                <input 
                  type="text"
                  value={editingCourse.price.ar}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    price: { ...editingCourse.price, ar: e.target.value }
                  })}
                  placeholder="مثال: 1,850 ر.س"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'السعر (إنجليزي):' : 'Price (English):'}
                </label>
                <input 
                  type="text"
                  value={editingCourse.price.en}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    price: { ...editingCourse.price, en: e.target.value }
                  })}
                  placeholder="e.g. 1,850 SAR"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isRtl ? 'المدة:' : 'Duration:'}
                </label>
                <input 
                  type="text"
                  value={editingCourse.duration.ar}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse,
                    duration: { ...editingCourse.duration, ar: e.target.value, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isRtl ? 'موجز الدورة (عربي):' : 'Summary (Arabic):'}
              </label>
              <textarea 
                rows={2}
                value={editingCourse.summary.ar}
                onChange={(e) => setEditingCourse({
                  ...editingCourse,
                  summary: { ...editingCourse.summary, ar: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E0BA84] mb-1 flex items-center gap-1.5">
                <span>💳 {isRtl ? 'رابط دفع Paymob الخاص بهذه الدورة (اختياري):' : 'Paymob Payment Link for this Course (Optional):'}</span>
              </label>
              <input 
                type="url"
                placeholder="https://accept.paymob.com/..."
                value={editingCourse.paymobUrl || ''}
                onChange={(e) => setEditingCourse({
                  ...editingCourse,
                  paymobUrl: e.target.value
                })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-[#C59B5F] outline-none font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'حفظ التعديلات على الدورة' : 'Save Course Edits'}</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => setCourseToDelete(editingCourse)}
                  className="ms-auto px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حذف هذه الدورة' : 'Delete Course'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Course List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div 
            key={course.id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900/50">
                    {course.certAgency} · {course.category.toUpperCase()}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">
                    {course.title.ar}
                  </h4>
                  <span className="text-xs text-slate-400 font-sans block">
                    {course.title.en}
                  </span>
                </div>
                
                <div className="text-end">
                  <span className="text-sm font-extrabold text-blue-400 font-mono block">
                    {course.price.ar}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {course.duration.ar}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                {course.summary.ar}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-850">
              <span className="text-[11px] text-slate-500 font-mono">
                {course.depth.ar}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCourse(course)}
                  className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                  title={isRtl ? 'تعديل السعر والتفاصيل' : 'Edit course'}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                </button>
                
                {courses.length > 1 && (
                  <button
                    onClick={() => setCourseToDelete(course)}
                    className="p-1.5 px-2.5 rounded-lg bg-red-950/40 hover:bg-red-600 border border-red-900/50 text-red-400 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1"
                    title={isRtl ? 'حذف هذه الدورة' : 'Delete course'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Course Deletion */}
      {courseToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">
                {isRtl ? 'تأكيد حذف الدورة التدريبية' : 'Confirm Course Deletion'}
              </h4>
              <div className="text-sm text-yellow-300 font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {courseToDelete.title.ar} ({courseToDelete.title.en})
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl 
                  ? 'هل أنت متأكد من رغبتك في حذف هذه الدورة نهائياً من الموقع؟ لن تظهر الدورة مجدداً في الصفحة الرئيسية أو قائمة الحجوزات.'
                  : 'Are you sure you want to permanently delete this course? It will be removed from the catalog and booking options.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onDeleteCourse(courseToDelete.id);
                  if (editingCourse?.id === courseToDelete.id) {
                    setEditingCourse(null);
                  }
                  setCourseToDelete(null);
                  showToast(isRtl ? 'تم حذف الدورة بنجاح!' : 'Course deleted successfully!');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isRtl ? 'نعم، حذف الدورة الآن' : 'Yes, Delete Course'}</span>
              </button>
              <button
                onClick={() => setCourseToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
