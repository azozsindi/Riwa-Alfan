import React, { useState, useEffect } from 'react';
import { X, Check, Send, PhoneCall, AlertCircle, ShieldCheck, ChevronDown, ChevronUp, Ship, GraduationCap, AlertTriangle, CreditCard, ExternalLink, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { POLICIES_DATA } from '../data/policiesData';

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
  const [selectedCaptain, setSelectedCaptain] = useState('');
  const [paymentChoice, setPaymentChoice] = useState<'paymob' | 'whatsapp'>('whatsapp');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showPolicies, setShowPolicies] = useState(false);

  const courses = config.courses || [];

  const matchedCourse = courses.find(c => 
    c.title.ar === selectedInterest || 
    c.title.en === selectedInterest ||
    c.id === preSelectedCourseId
  );

  const activePaymobUrl = matchedCourse?.paymobUrl || config.payment?.paymentUrl || '';
  const isPaymobEnabled = Boolean(config.payment?.enabled && activePaymobUrl);

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
      notes: [
        notes,
        selectedCaptain ? (isRtl ? `الكابتن المفضل: ${selectedCaptain}` : `Preferred Instructor: ${selectedCaptain}`) : '',
        paymentChoice === 'paymob' ? (isRtl ? 'طريقة الدفع: دفع إلكتروني عبر Paymob' : 'Payment Method: Paymob Online') : ''
      ].filter(Boolean).join(' · '),
      paymentMethod: paymentChoice === 'paymob' ? 'paymob' : 'whatsapp',
      paymentAmount: matchedCourse ? matchedCourse.price[language] : (config.payment?.depositAmount ? `${config.payment.depositAmount} SAR` : undefined),
      status: paymentChoice === 'paymob' ? 'pending_payment' : 'new'
    });

    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const whatsAppMessage = isRtl
    ? `السلام عليكم كابتن فهد الهويملي وإدارة رواء الفن،
أود الاستفسار والتسجيل بخصوص: ${selectedInterest}
الاسم: ${fullName}
${selectedCaptain ? `الكابتن المفضل للتدريب: ${selectedCaptain}\n` : ''}مستوى الخبرة: ${experienceLevel === 'beginner' ? 'مبتدئ جديد' : 'غواص مرخص'}
الأوقات المفضلة: ${preferredDays === 'weekend' ? 'عطلة نهاية الأسبوع' : 'أيام الأسبوع'}
${paymentChoice === 'paymob' ? 'طريقة الدفع: أرغب بالسداد إلكترونياً عبر Paymob\n' : ''}${notes ? `ملاحظات: ${notes}` : ''}`
    : `Hello Captain Fahad Al-Huwaimli & Riwa Alfan Team,
I would like to inquire/enroll for: ${selectedInterest}
Name: ${fullName}
${selectedCaptain ? `Preferred Instructor: ${selectedCaptain}\n` : ''}Experience Level: ${experienceLevel}
Preferred Schedule: ${preferredDays}
${paymentChoice === 'paymob' ? 'Payment Method: Paymob Online Payment\n' : ''}${notes ? `Notes: ${notes}` : ''}`;

  const whatsAppUrl = `https://wa.me/${config.brand.whatsappNumber}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6 ${
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
                <div className="text-xs font-semibold text-[#C59B5F]">{t.modalKicker}</div>
                <h3 className="text-lg sm:text-xl font-black text-white font-brand-arabic">{t.modalTitle}</h3>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-xs font-semibold text-[#C59B5F]">{t.modalKicker}</div>
                <h3 className="text-lg sm:text-xl font-black text-white font-brand-arabic">{t.modalTitle}</h3>
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
              <h4 className="text-xl sm:text-2xl font-bold text-white font-brand-arabic">{t.modalSuccessTitle}</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {t.modalSuccessDesc(fullName)}
              </p>
              <div className="font-mono text-lg sm:text-xl font-bold text-blue-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 inline-block">
                {bookingRef}
              </div>
              <p className="text-xs text-slate-400">
                {t.modalSuccessNote}
              </p>
            </div>

            {/* Paymob Payment Card if URL is configured */}
            {isPaymobEnabled && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#162E52]/40 to-slate-950 border border-[#C59B5F]/40 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#C59B5F]/15 border border-[#C59B5F]/30 text-[#E0BA84] font-bold text-xs flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#C59B5F]" />
                    <span>PAYMOB GATEWAY</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                    {isRtl ? 'دفع إلكتروني آمن' : 'Secure Online Payment'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-base font-black text-white">
                    {isRtl ? 'تأكيد الحجز بالدفع الإلكتروني المباشر' : 'Secure Your Spot with Online Payment'}
                  </h5>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {language === 'ar' ? config.payment?.paymentInstructionsAr : config.payment?.paymentInstructionsEn}
                  </p>
                </div>

                {/* Badges: Mada, Apple Pay, Cards */}
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-bold text-[10px]">مدى mada</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-bold text-[10px]">Apple Pay</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-bold text-[10px]">VISA / MC</span>
                </div>

                {/* Action Link to Paymob */}
                <div className="pt-1">
                  <a
                    href={activePaymobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-gradient-btn w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C59B5F]/20 active:scale-95 transition-all text-slate-950"
                  >
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>{isRtl ? 'الانتقال إلى صفحة سداد Paymob ↗' : 'Proceed to Paymob Checkout ↗'}</span>
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t.modalWhatsAppBtn}</span>
              </a>

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

            {/* Preferred Captain (Optional) */}
            {config.captains && config.captains.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>{isRtl ? 'الكابتن المفضل للتدريب (اختياري):' : 'Preferred Captain / Instructor (Optional):'}</span>
                  <span className="text-[10px] text-[#C59B5F] font-bold">{isRtl ? 'حسب التوفر' : 'Subject to availability'}</span>
                </label>
                <select
                  value={selectedCaptain}
                  onChange={(e) => setSelectedCaptain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                >
                  <option value="">{isRtl ? '— أي كابتن متاح لدى رواء الفن —' : '— Any Available Instructor —'}</option>
                  {config.captains.map(cap => (
                    <option key={cap.id} value={isRtl ? cap.nameAr : (cap.nameEn || cap.nameAr)}>
                      {isRtl ? cap.nameAr : (cap.nameEn || cap.nameAr)} {isRtl ? (cap.roleAr ? `(${cap.roleAr})` : '') : (cap.roleEn ? `(${cap.roleEn})` : '')}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            {/* Terms, Refund & Safety Policy Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <button
                type="button"
                onClick={() => setShowPolicies(!showPolicies)}
                className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>{isRtl ? 'سياسة الاسترداد، إلغاء الرحلات، والسلامة (اضغط للاطلاع):' : 'Refund, Cancellation & Safety Policy (Click to view):'}</span>
                </span>
                {showPolicies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPolicies && (
                <div className="pt-2 border-t border-slate-800 space-y-3 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {POLICIES_DATA.map((policy) => (
                    <div key={policy.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {policy.iconType === 'ship' && <Ship className="w-3.5 h-3.5 text-blue-400" />}
                        {policy.iconType === 'graduation' && <GraduationCap className="w-3.5 h-3.5 text-blue-400" />}
                        {policy.iconType === 'shield' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{policy.title[language]}:</span>
                      </span>
                      <ul className="space-y-1 text-slate-300 pr-2 pl-2">
                        {policy.rules.map((rule) => (
                          <li key={rule.id}>
                            • <strong className="text-slate-200">{rule.label[language]}</strong> {rule.description[language]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <span className="text-[11px] sm:text-xs text-slate-300 select-none">
                  {isRtl 
                    ? 'أوافق على سياسة الاسترداد وإلغاء الرحلات وتعليمات السلامة المعتمدة لدى رواء الفن' 
                    : 'I agree to the refund policy, expedition rescheduling rules & safety standards of Riwa Alfan'}
                  <span className="text-blue-400 font-bold ml-1 mr-1">*</span>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}
            </div>

            {/* Payment Method Preference */}
            {isPaymobEnabled && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isRtl ? 'طريقة تأكيد الحجز والدفع:' : 'Booking Confirmation & Payment Method:'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('paymob')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-2.5 ${
                      paymentChoice === 'paymob'
                        ? 'bg-[#162E52]/40 border-[#C59B5F] ring-1 ring-[#C59B5F]/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 border-[#C59B5F]">
                      {paymentChoice === 'paymob' && <div className="w-2 h-2 rounded-full bg-[#C59B5F]" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#C59B5F]" />
                        <span>{isRtl ? 'دفع إلكتروني (Paymob)' : 'Paymob Online'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isRtl ? 'مدى، Apple Pay، فيزا (سداد فوري)' : 'Mada, Apple Pay, Cards (Instant)'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('whatsapp')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-2.5 ${
                      paymentChoice === 'whatsapp'
                        ? 'bg-emerald-950/20 border-emerald-500 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 border-emerald-500">
                      {paymentChoice === 'whatsapp' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRtl ? 'تنسيق عبر واتساب' : 'WhatsApp Consultation'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isRtl ? 'حجز واستشارة الكابتن بدون دفع مسبق' : 'No pre-payment required'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Submit with Brand Gold Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={!agreedToTerms}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  agreedToTerms 
                    ? 'gold-gradient-btn cursor-pointer active:scale-95' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {paymentChoice === 'paymob' ? (
                  <CreditCard className="w-4 h-4 text-slate-950" />
                ) : (
                  <Send className="w-4 h-4 text-slate-950" />
                )}
                <span>
                  {paymentChoice === 'paymob' 
                    ? (isRtl ? 'تأكيد الحجز والانتقال للدفع (Paymob)' : 'Confirm & Proceed to Payment') 
                    : t.formSubmit}
                </span>
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
