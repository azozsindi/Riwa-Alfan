import React, { useState, useEffect } from 'react';
import { X, Check, Send, PhoneCall, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCourseId?: string;
  preSelectedTripSite?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedCourseId,
  preSelectedTripSite
}) => {
  const { language, isRtl } = useLanguage();
  const { config, addBooking } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [preferredDays, setPreferredDays] = useState('weekend');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const courses = config.courses || [];

  useEffect(() => {
    if (preSelectedCourseId) {
      const course = courses.find(c => c.id === preSelectedCourseId);
      if (course) {
        setSelectedInterest(course.title[language]);
      }
    } else if (preSelectedTripSite) {
      setSelectedInterest(`${isRtl ? 'رحلة غوص:' : 'Expedition:'} ${preSelectedTripSite}`);
    } else if (courses.length > 0) {
      setSelectedInterest(courses[0].title[language]);
    }
  }, [preSelectedCourseId, preSelectedTripSite, isOpen, language, isRtl, courses]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.name = t.errName;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errs.phone = t.errPhone;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ref = addBooking({
      name: fullName,
      phone,
      interest: selectedInterest,
      experience: experienceLevel === 'beginner' 
        ? t.expBeginner 
        : experienceLevel === 'open_water' 
        ? t.expOpenWater 
        : t.expAdvanced,
      timing: preferredDays === 'weekend' 
        ? t.timeWeekend 
        : preferredDays === 'weekday' 
        ? t.timeWeekday 
        : t.timeFlexible,
      notes
    });

    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    const message = isRtl
      ? `السلام عليكم كابتن فهد الهويملي،
أود الاستفسار والتسجيل بخصوص: ${selectedInterest}
الاسم: ${fullName}
مستوى الخبرة: ${experienceLevel === 'beginner' ? 'مبتدئ جديد' : 'غواص مرخص'}
الأوقات المفضلة: ${preferredDays === 'weekend' ? 'عطلة نهاية الأسبوع' : 'أيام الأسبوع'}
${notes ? `ملاحظات: ${notes}` : ''}`
      : `Hello Captain Fahad Al-Huwaimli,
I would like to inquire/enroll for: ${selectedInterest}
Name: ${fullName}
Experience Level: ${experienceLevel}
Preferred Schedule: ${preferredDays}
${notes ? `Notes: ${notes}` : ''}`;

    const url = `https://wa.me/${config.brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 ${
        isRtl ? 'text-right' : 'text-left'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          {isRtl ? (
            <>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <div className="text-xs font-semibold text-blue-400">{t.modalKicker}</div>
                <h3 className="text-xl font-bold text-white">{t.modalTitle}</h3>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-xs font-semibold text-blue-400">{t.modalKicker}</div>
                <h3 className="text-xl font-bold text-white">{t.modalTitle}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">{t.modalSuccessTitle}</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {t.modalSuccessDesc(fullName)}
              </p>
              <div className="font-mono text-xl font-bold text-blue-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 inline-block">
                {bookingRef}
              </div>
              <p className="text-xs text-slate-400">
                {t.modalSuccessNote}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t.modalWhatsAppBtn}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                {t.modalClose}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Interest */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.formInterest}
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.title[language]}>
                    {c.title[language]} ({c.price[language]})
                  </option>
                ))}
                <option value={isRtl ? 'رحلة غوص: حطام أبو طير - جدة' : 'Expedition: Abu Tair Wreck - Jeddah'}>
                  {isRtl ? 'رحلة غوص: حطام أبو طير - جدة' : 'Expedition: Abu Tair Wreck - Jeddah'}
                </option>
                <option value={isRtl ? 'رحلة غوص: شِعاب المسماري - جدة' : 'Expedition: Al-Mismari Reefs - Jeddah'}>
                  {isRtl ? 'رحلة غوص: شِعاب المسماري - جدة' : 'Expedition: Al-Mismari Reefs - Jeddah'}
                </option>
                <option value={isRtl ? 'رحلة غوص: حطام البويلر - جدة' : 'Expedition: Boiler Wreck - Jeddah'}>
                  {isRtl ? 'رحلة غوص: حطام البويلر وشِعاب أبو فراميش - جدة' : 'Expedition: Boiler Wreck & Abu Faramish - Jeddah'}
                </option>
                <option value={isRtl ? 'رحلة غوص: ميدان شرم أبحر - جدة' : 'Expedition: Sharm Obhur - Jeddah'}>
                  {isRtl ? 'رحلة غوص: ميدان شرم أبحر المرجاني - جدة' : 'Expedition: Sharm Obhur Reefs - Jeddah'}
                </option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.formFullName} <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder={isRtl ? 'مثال: محمد الغامدي' : 'e.g. John Smith'}
                className={`w-full bg-slate-950 border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.formPhone} <span className="text-blue-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                placeholder="05xxxxxxxx"
                className={`w-full bg-slate-950 border rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-slate-800'
                }`}
                dir="ltr"
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>

            {/* Experience level & Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {t.formExp}
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="beginner">{t.expBeginner}</option>
                  <option value="open-water">{t.expOpenWater}</option>
                  <option value="advanced">{t.expAdvanced}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {t.formTiming}
                </label>
                <select
                  value={preferredDays}
                  onChange={(e) => setPreferredDays(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="weekend">{t.timeWeekend}</option>
                  <option value="weekday-evening">{t.timeWeekday}</option>
                  <option value="flexible">{t.timeFlexible}</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.formNotes}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.formNotesPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit with Logo Blue Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.formSubmit}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{t.formDisclaimer}</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
