import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  User,
  ShieldCheck,
  Ship,
  Award,
  AlertTriangle,
  Lock,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { BookingQAAnswers, HighestCertification } from '../types/admin';
import {
  getAdaptiveQuestions,
  evaluateAllSelectedCourses,
  getHighestCertLabel,
  getIssuingAgencyLabel,
} from '../utils/eligibilityEngine';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalCount,
    totalPrice,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { language, isRtl } = useLanguage();
  const { config, addBooking } = useSiteConfig();

  const [step, setStep] = useState<'cart' | 'qa' | 'success'>('cart');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<BookingQAAnswers>>({});

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState<'weekend' | 'weekday' | 'flexible'>('weekend');
  const [notes, setNotes] = useState('');
  const [preferredInstructor, setPreferredInstructor] = useState('');
  const [lastRef, setLastRef] = useState('');
  const [lastWaUrl, setLastWaUrl] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; qa?: string }>({});

  const cartCourses = useMemo(() => {
    const courseItems = items.filter((i) => i.type === 'course');
    return courseItems
      .map((ci) => (config.courses || []).find((c) => c.id === ci.id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [items, config.courses]);

  const hasCoursesInCart = cartCourses.length > 0;

  const adaptiveQuestions = useMemo(
    () => (hasCoursesInCart ? getAdaptiveQuestions(cartCourses, answers) : []),
    [hasCoursesInCart, cartCourses, answers]
  );

  const completedAnswers: BookingQAAnswers = useMemo(
    () => ({
      highestCert: answers.highestCert || 'none',
      otherCertName: answers.otherCertName,
      issuingAgency:
        answers.highestCert === 'none' ? 'none' : answers.issuingAgency || 'PADI',
      otherAgencyName: answers.otherAgencyName,
      hasAdventureAndNav: answers.hasAdventureAndNav,
      hasValidEfrCpr: answers.hasValidEfrCpr,
      loggedDivesRange: answers.loggedDivesRange,
      lastDiveRecency: answers.lastDiveRecency,
    }),
    [answers]
  );

  const evaluationBundle = useMemo(
    () =>
      hasCoursesInCart
        ? evaluateAllSelectedCourses(cartCourses, completedAnswers)
        : {
            evaluations: [],
            eligibleCount: 0,
            missingCount: 0,
            anyEquivalencyRequired: false,
            overallPreliminaryStatus: 'eligible' as const,
          },
    [hasCoursesInCart, cartCourses, completedAnswers]
  );

  if (!isCartOpen) return null;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const whatsappNumber = config.brand.whatsappNumber || '966530549675';

  const validateCustomerInfo = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.name = isRtl ? 'يرجى إدخال الاسم الكريم' : 'Please enter your name';
    }
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 8) {
      newErrors.phone = isRtl ? 'يرجى إدخال رقم جوال صحيح' : 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedFromCart = () => {
    if (!validateCustomerInfo()) return;
    if (hasCoursesInCart) {
      setQuestionIndex(0);
      setStep('qa');
    } else {
      finalizeOrder();
    }
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    setErrors((prev) => ({ ...prev, qa: undefined }));
    const updated: Partial<BookingQAAnswers> = { ...answers, [qId]: value };
    if (qId === 'highestCert') {
      const certVal = value as HighestCertification;
      if (certVal === 'none') {
        updated.issuingAgency = 'none';
        updated.otherCertName = undefined;
        updated.otherAgencyName = undefined;
        updated.hasAdventureAndNav = undefined;
        updated.hasValidEfrCpr = undefined;
        updated.loggedDivesRange = undefined;
        updated.lastDiveRecency = undefined;
      } else {
        if (updated.issuingAgency === 'none') updated.issuingAgency = undefined;
        if (certVal !== 'other') updated.otherCertName = undefined;
        if (certVal === 'advanced_open_water' || certVal === 'rescue_diver' || certVal === 'divemaster') {
          updated.hasAdventureAndNav = 'yes';
        }
      }
    }
    setAnswers(updated);

    const nextQuestions = getAdaptiveQuestions(cartCourses, updated);
    const waitText = value === 'other' && (qId === 'highestCert' || qId === 'issuingAgency');
    if (!waitText && questionIndex + 1 < nextQuestions.length) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const finalizeOrder = () => {
    const scheduleLabel =
      preferredSchedule === 'weekend'
        ? isRtl
          ? 'عطلة نهاية الأسبوع'
          : 'Weekend'
        : preferredSchedule === 'weekday'
        ? isRtl
          ? 'أيام الأسبوع'
          : 'Weekdays'
        : isRtl
        ? 'مواعيد مرنة'
        : 'Flexible';

    const itemsSummary = items
      .map((item, idx) => {
        const itemTitle = item.title[language] || item.title.ar;
        const subtotal = item.price * item.quantity;
        return `${idx + 1}. ${itemTitle} (×${item.quantity}) — ${subtotal.toLocaleString(
          isRtl ? 'ar-SA' : 'en-US'
        )} ${isRtl ? 'ر.س' : 'SAR'}`;
      })
      .join('\n');

    const formattedTotalPrice = `${totalPrice.toLocaleString(
      language === 'ar' ? 'ar-SA' : 'en-US'
    )} ${language === 'ar' ? 'ر.س' : 'SAR'}`;

    const refCode = addBooking({
      name: fullName,
      phone: phoneNumber,
      interest: items.map((i) => `${i.title[language]} (×${i.quantity})`).join(' + '),
      experience: hasCoursesInCart
        ? `${getHighestCertLabel(
            completedAnswers.highestCert,
            language,
            completedAnswers.otherCertName
          )} · ${getIssuingAgencyLabel(
            completedAnswers.issuingAgency,
            language,
            completedAnswers.otherAgencyName
          )}`
        : isRtl
        ? 'طلب سلة رحلات'
        : 'Expedition Cart Order',
      timing: scheduleLabel,
      notes: [
        notes,
        preferredInstructor
          ? isRtl
            ? `الكابتن المفضل: ${preferredInstructor}`
            : `Preferred Instructor: ${preferredInstructor}`
          : '',
        itemsSummary,
      ]
        .filter(Boolean)
        .join(' · '),
      paymentMethod: 'whatsapp',
      paymentAmount: formattedTotalPrice,
      status: 'new',
      bookingType: hasCoursesInCart
        ? items.some((i) => i.type !== 'course')
          ? 'mixed'
          : 'courses'
        : 'expedition',
      selectedCourses: hasCoursesInCart ? evaluationBundle.evaluations : undefined,
      highestCert: hasCoursesInCart ? completedAnswers.highestCert : undefined,
      issuingAgency: hasCoursesInCart ? completedAnswers.issuingAgency : undefined,
      qaAnswers: hasCoursesInCart ? completedAnswers : undefined,
      preliminaryEligibility: hasCoursesInCart
        ? evaluationBundle.overallPreliminaryStatus
        : undefined,
      eligibilityStatus: 'pending_instructor_review',
      equivalencyRequired: hasCoursesInCart ? evaluationBundle.anyEquivalencyRequired : false,
      paymentAllowed: false,
    });

    const evalSummary = evaluationBundle.evaluations
      .map(
        (ev) =>
          `• ${isRtl ? ev.titleAr : ev.titleEn}: ${
            ev.status === 'eligible'
              ? isRtl
                ? 'مؤهل مبدئياً'
                : 'Eligible'
              : isRtl
              ? 'متطلبات ناقصة'
              : 'Missing Req'
          }`
      )
      .join('\n');

    const whatsAppMessage = isRtl
      ? `🤿 *طلب حجز جديد (بانتظار مراجعة الكابتن) — رواء الفن*
━━━━━━━━━━━━━━━━━━━
🔖 *الرقم المرجعي:* ${refCode}
👤 *الاسم:* ${fullName}
📱 *الجوال:* ${phoneNumber}
📅 *الموعد المفضل:* ${scheduleLabel}
${hasCoursesInCart ? `🎓 *أعلى شهادة:* ${getHighestCertLabel(completedAnswers.highestCert, 'ar', completedAnswers.otherCertName)}\n🏛️ *المنظمة:* ${getIssuingAgencyLabel(completedAnswers.issuingAgency, 'ar', completedAnswers.otherAgencyName)}\n` : ''}${evalSummary ? `📊 *التقييم المبدئي للدورات:*\n${evalSummary}\n` : ''}🛒 *عناصر السلة (${totalCount}):*
${itemsSummary}
💰 *الإجمالي التقديري:* ${formattedTotalPrice}
⏳ *الحالة:* بانتظار موافقة الكابتن قبل الدفع`
      : `🤿 *New Booking Request (Pending Captain Review) — Riwa Alfan*
━━━━━━━━━━━━━━━━━━━
🔖 Ref: ${refCode}
👤 Name: ${fullName}
📱 Phone: ${phoneNumber}
🛒 Items (${totalCount}):
${itemsSummary}
💰 Total: ${formattedTotalPrice}
⏳ Status: Pending Captain approval before payment`;

    setLastWaUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsAppMessage)}`);
    setLastRef(refCode);
    setStep('success');
    clearCart();
  };

  const handleResetAfterSuccess = () => {
    setStep('cart');
    setLastRef('');
    setAnswers({});
    setQuestionIndex(0);
    closeCart();
  };

  const currentQ = step === 'qa' ? adaptiveQuestions[questionIndex] : undefined;
  const isLastQ = step === 'qa' && questionIndex >= adaptiveQuestions.length - 1;
  const currentQVal = currentQ
    ? (answers[currentQ.id as keyof BookingQAAnswers] as string | undefined)
    : undefined;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md sm:max-w-lg bg-slate-950 border-s border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100 z-10">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#C59B5F]/15 border border-[#C59B5F]/30 text-[#E0BA84] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#C59B5F]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-white font-brand-arabic truncate">
                  {step === 'qa'
                    ? isRtl
                      ? 'التحقق السريع من الأهلية'
                      : 'Quick Eligibility Check'
                    : isRtl
                    ? 'سلة الطلبات والحجوزات'
                    : 'Booking & Order Cart'}
                </h2>
                <span className="text-[11px] text-[#C59B5F] font-semibold">
                  {step === 'qa'
                    ? isRtl
                      ? `سؤال ${questionIndex + 1} من ${adaptiveQuestions.length}`
                      : `Question ${questionIndex + 1} of ${adaptiveQuestions.length}`
                    : totalCount > 0
                    ? isRtl
                      ? `${totalCount} عناصر مضافة`
                      : `${totalCount} item(s) selected`
                    : isRtl
                    ? 'السلة فارغة'
                    : 'Cart is empty'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {items.length > 0 && step === 'cart' && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 text-xs transition-colors cursor-pointer"
                  title={isRtl ? 'إفراغ السلة' : 'Clear Cart'}
                  aria-label="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label={isRtl ? 'إغلاق السلة' : 'Close Cart'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {step === 'success' ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white font-brand-arabic">
                    {isRtl
                      ? 'تم تسجيل طلبك لمراجعة الكابتن!'
                      : 'Request Logged for Captain Review!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {isRtl
                      ? 'حالتك الآن: بانتظار مراجعة وموافقة الكابتن فهد. لن يتم الدفع إلا بعد موافقته النهائية.'
                      : 'Status: Pending Captain Fahad review. Payment remains locked until final approval.'}
                  </p>
                </div>

                {lastRef && (
                  <div className="inline-block p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
                    <span className="text-[11px] text-slate-400 block">
                      {isRtl ? 'رقم الطلب المرجعي:' : 'Booking Ref:'}
                    </span>
                    <span className="text-lg font-bold text-[#E0BA84]">{lastRef}</span>
                  </div>
                )}

                <div className="space-y-2.5 pt-2">
                  <a
                    href={lastWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{isRtl ? 'إرسال الملخص عبر واتساب' : 'Send Summary via WhatsApp'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetAfterSuccess}
                    className="w-full py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm cursor-pointer min-h-[44px]"
                  >
                    {isRtl ? 'العودة لتصفح الموقع' : 'Back to Website'}
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-900/90 border border-slate-800 text-slate-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-10 h-10 text-slate-500" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white font-brand-arabic">
                    {isRtl ? 'سلة الطلبات فارغة حالياً' : 'Your cart is empty'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    {isRtl
                      ? 'تصفح باقات ودورات الغوص أو رحلات استكشاف حطام السفن بجدة وأضفها إلى السلة.'
                      : 'Browse our scuba courses or Jeddah reef expeditions and add them.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    const el = document.getElementById('courses');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="gold-gradient-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-950 font-bold text-xs cursor-pointer"
                >
                  <span>{isRtl ? 'استعراض الدورات التدريبية' : 'Explore Courses'}</span>
                  <ArrowIcon className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            ) : step === 'qa' && currentQ ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white font-brand-arabic leading-snug">
                    {isRtl ? currentQ.titleAr : currentQ.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRtl ? currentQ.subtitleAr : currentQ.subtitleEn}
                  </p>
                </div>

                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    const active = currentQVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQ.id, opt.value)}
                        className={`w-full p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[48px] ${
                          active
                            ? 'bg-[#C59B5F]/15 border-[#C59B5F] text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">
                          {isRtl ? opt.labelAr : opt.labelEn}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            active
                              ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950'
                              : 'border-slate-600 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {currentQ.allowOtherInput && currentQVal === 'other' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={(answers[currentQ.allowOtherInput] as string) || ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQ.allowOtherInput!]: e.target.value,
                        }))
                      }
                      placeholder={
                        isRtl ? currentQ.otherPlaceholderAr : currentQ.otherPlaceholderEn
                      }
                      className="w-full bg-slate-900 border border-[#C59B5F]/50 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                    />
                  </div>
                )}

                {isLastQ && currentQVal && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold text-[#E0BA84] block">
                      {isRtl
                        ? 'نتيجة الأهلية المبدئية للدورات بالسلة:'
                        : 'Preliminary Eligibility in Cart:'}
                    </span>
                    {evaluationBundle.evaluations.map((ev) => (
                      <div
                        key={ev.courseId}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          ev.status === 'eligible'
                            ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
                            : 'bg-amber-950/25 border-amber-500/40 text-amber-200'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{isRtl ? ev.titleAr : ev.titleEn}</span>
                          <span>
                            {ev.status === 'eligible'
                              ? isRtl
                                ? '✓ مؤهل مبدئياً'
                                : '✓ Eligible'
                              : isRtl
                              ? '⚠ متطلبات ناقصة'
                              : '⚠ Missing Req'}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90 whitespace-pre-line">
                          {isRtl ? ev.guidanceMessageAr : ev.guidanceMessageEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {errors.qa && <p className="text-xs text-red-400">{errors.qa}</p>}
              </div>
            ) : (
              /* CART ITEMS + CUSTOMER DETAILS */
              <div className="space-y-5">
                <div className="space-y-2.5">
                  {items.map((item) => {
                    const itemTitle = item.title[language] || item.title.ar;
                    const subtotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 text-[10px] text-[#C59B5F] font-bold">
                              {item.type === 'course' ? (
                                <Award className="w-3.5 h-3.5" />
                              ) : (
                                <Ship className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {item.category ||
                                  (item.type === 'course' ? 'دورة تدريب PADI' : 'رحلة غوص بحرية')}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white leading-snug">
                              {itemTitle}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 cursor-pointer shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono font-bold text-xs text-white px-2">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-mono font-extrabold text-[#E0BA84] text-sm">
                            {subtotal > 0
                              ? `${subtotal.toLocaleString(
                                  language === 'ar' ? 'ar-SA' : 'en-US'
                                )} ${language === 'ar' ? 'ر.س' : 'SAR'}`
                              : item.priceFormatted[language] || item.priceFormatted.ar}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2">
                    <User className="w-4 h-4 text-[#C59B5F]" />
                    <span>{isRtl ? 'بيانات العميل:' : 'Customer Info:'}</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {isRtl ? 'الاسم الكريم *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder={isRtl ? 'مثال: عبد العزيز الغامدي' : 'e.g. Alex Smith'}
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px] ${
                        errors.name ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {isRtl ? 'رقم الجوال (واتساب) *' : 'WhatsApp Phone *'}
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#C59B5F] min-h-[44px] ${
                        errors.phone ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {isRtl ? 'الموعد المفضل:' : 'Preferred Schedule:'}
                    </label>
                    <select
                      value={preferredSchedule}
                      onChange={(e) => setPreferredSchedule(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px]"
                    >
                      <option value="weekend">
                        {isRtl ? 'عطلة نهاية الأسبوع (الجمعة / السبت)' : 'Weekend'}
                      </option>
                      <option value="weekday">{isRtl ? 'أيام الأسبوع (مسائي)' : 'Weekdays'}</option>
                      <option value="flexible">{isRtl ? 'مرن حسب التنسيق' : 'Flexible'}</option>
                    </select>
                  </div>

                  {config.captains && config.captains.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isRtl ? 'الكابتن المفضل (اختياري):' : 'Preferred Instructor:'}
                      </label>
                      <select
                        value={preferredInstructor}
                        onChange={(e) => setPreferredInstructor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px]"
                      >
                        <option value="">{isRtl ? '— أي كابتن متاح —' : '— Any Available —'}</option>
                        {config.captains.map((cap) => (
                          <option
                            key={cap.id}
                            value={isRtl ? cap.nameAr : cap.nameEn || cap.nameAr}
                          >
                            {isRtl ? cap.nameAr : cap.nameEn || cap.nameAr}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {isRtl ? 'ملاحظات إضافية:' : 'Additional Notes:'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        isRtl ? 'أي تفضيلات أو استفسارات...' : 'Any preferences or inquiries...'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && step === 'cart' && (
            <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-slate-900/80 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-slate-300">
                <div>
                  <span className="text-xs text-slate-400 block">
                    {isRtl ? 'الإجمالي التقديري:' : 'Grand Total:'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isRtl ? `شامل ${totalCount} عناصر` : `${totalCount} item(s)`}
                  </span>
                </div>
                <span className="text-xl font-black text-[#E0BA84] font-mono">
                  {totalPrice > 0
                    ? `${totalPrice.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${
                        language === 'ar' ? 'ر.س' : 'SAR'
                      }`
                    : isRtl
                    ? 'حسب التنسيق'
                    : 'Contact'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedFromCart}
                className="gold-gradient-btn w-full py-3.5 px-5 rounded-2xl text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>
                  {hasCoursesInCart
                    ? isRtl
                      ? 'أسئلة الأهلية وإرسال الطلب للمراجعة'
                      : 'Eligibility Check & Submit Request'
                    : isRtl
                    ? 'إرسال الطلب لمراجعة الكابتن'
                    : 'Submit Request for Review'}
                </span>
                <ArrowIcon className="w-4 h-4 text-slate-950" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-[#C59B5F] shrink-0" />
                <span>
                  {isRtl
                    ? 'لا يُتاح الدفع قبل مراجعة وموافقة الكابتن'
                    : 'Payment opens only after Captain approval'}
                </span>
              </div>
            </div>
          )}

          {step === 'qa' && currentQ && (
            <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-slate-900/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
                  else setStep('cart');
                }}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <BackIcon className="w-4 h-4" />
                <span>{isRtl ? 'السابق' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!currentQVal) {
                    setErrors((p) => ({
                      ...p,
                      qa: isRtl ? 'يرجى اختيار إجابة' : 'Please choose an option',
                    }));
                    return;
                  }
                  if (isLastQ) finalizeOrder();
                  else setQuestionIndex(questionIndex + 1);
                }}
                className="gold-gradient-btn flex-1 py-3 px-4 rounded-xl text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>
                  {isLastQ
                    ? isRtl
                      ? 'إرسال الطلب لمراجعة الكابتن'
                      : 'Submit for Captain Review'
                    : isRtl
                    ? 'التالي'
                    : 'Next'}
                </span>
                <ArrowIcon className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
