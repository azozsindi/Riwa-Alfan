import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Send,
  PhoneCall,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Ship,
  GraduationCap,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Lock,
  CheckCircle2,
  Edit3,
  Award,
  Search,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { UI_TRANSLATIONS } from '../data/translations';
import { POLICIES_DATA } from '../data/policiesData';
import {
  BookingQAAnswers,
  CourseEligibilityEvaluation,
  HighestCertification,
  IssuingAgency,
} from '../types/admin';
import {
  getAdaptiveQuestions,
  evaluateAllSelectedCourses,
  getHighestCertLabel,
  getIssuingAgencyLabel,
  parseCoursePriceSar,
} from '../utils/eligibilityEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCourseId?: string;
  preSelectedTripSite?: string;
  onOpenStatusTracker?: (bookingRef?: string) => void;
}

type WizardPhase = 'select_courses' | 'qa' | 'summary_contact' | 'submitted';

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedCourseId,
  preSelectedTripSite,
  onOpenStatusTracker,
}) => {
  const { language, isRtl } = useLanguage();
  const { config, addBooking } = useSiteConfig();
  const t = UI_TRANSLATIONS[language];

  const courses = config.courses || [];

  // Mode: courses (Q&A flow) or expedition (dive trip)
  const [bookingMode, setBookingMode] = useState<'courses' | 'expedition'>('courses');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedTripName, setSelectedTripName] = useState<string>('');

  // Wizard step state
  const [phase, setPhase] = useState<WizardPhase>('select_courses');
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  // Q&A Answers
  const [answers, setAnswers] = useState<Partial<BookingQAAnswers>>({});

  // Contact & schedule fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDays, setPreferredDays] = useState<'weekend' | 'weekday' | 'flexible'>('weekend');
  const [selectedCaptain, setSelectedCaptain] = useState('');
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showPolicies, setShowPolicies] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Submitted state
  const [bookingRef, setBookingRef] = useState('');
  const [submittedEvaluations, setSubmittedEvaluations] = useState<CourseEligibilityEvaluation[]>([]);

  // Initialize state cleanly whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setBookingRef('');
    setSubmittedEvaluations([]);

    if (preSelectedTripSite) {
      setBookingMode('expedition');
      setSelectedTripName(preSelectedTripSite);
      setSelectedCourseIds([]);
      setAnswers({});
      setPhase('summary_contact');
      setQuestionIndex(0);
    } else if (preSelectedCourseId) {
      setBookingMode('courses');
      setSelectedCourseIds([preSelectedCourseId]);
      setSelectedTripName('');
      setAnswers({});
      // Allow picking additional courses or jumping right in; start on select_courses with pre-checked card so multi-course is obvious
      setPhase('select_courses');
      setQuestionIndex(0);
    } else {
      setBookingMode('courses');
      setSelectedCourseIds(courses[0]?.id ? [courses[0].id] : []);
      setSelectedTripName('');
      setAnswers({});
      setPhase('select_courses');
      setQuestionIndex(0);
    }
  }, [isOpen, preSelectedCourseId, preSelectedTripSite]);

  const selectedCourses = useMemo(
    () => courses.filter((c) => selectedCourseIds.includes(c.id)),
    [courses, selectedCourseIds]
  );

  const adaptiveQuestions = useMemo(
    () => (bookingMode === 'courses' ? getAdaptiveQuestions(selectedCourses, answers) : []),
    [bookingMode, selectedCourses, answers]
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

  const evaluationBundle = useMemo(() => {
    if (bookingMode !== 'courses' || selectedCourses.length === 0) {
      return {
        evaluations: [],
        eligibleCount: 0,
        missingCount: 0,
        anyEquivalencyRequired: false,
        overallPreliminaryStatus: 'eligible' as const,
      };
    }
    return evaluateAllSelectedCourses(selectedCourses, completedAnswers);
  }, [bookingMode, selectedCourses, completedAnswers]);

  if (!isOpen) return null;

  const totalSteps =
    bookingMode === 'expedition'
      ? 1
      : 1 + Math.max(1, adaptiveQuestions.length) + 1;

  const currentStepNumber =
    bookingMode === 'expedition'
      ? 1
      : phase === 'select_courses'
      ? 1
      : phase === 'qa'
      ? 2 + questionIndex
      : totalSteps;

  const progressPct = Math.min(100, Math.round((currentStepNumber / totalSteps) * 100));

  const toggleCourseSelection = (courseId: string) => {
    setErrors((prev) => ({ ...prev, courses: '' }));
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleStartQA = () => {
    if (bookingMode === 'courses' && selectedCourseIds.length === 0) {
      setErrors({
        courses: isRtl ? 'يرجى اختيار دورة واحدة على الأقل للمتابعة' : 'Please select at least one course',
      });
      return;
    }
    setErrors({});
    if (bookingMode === 'expedition') {
      setPhase('summary_contact');
      return;
    }
    setQuestionIndex(0);
    setPhase('qa');
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    setErrors({});
    const updated: Partial<BookingQAAnswers> = { ...answers, [qId]: value };

    // Reset downstream dependent answers if highestCert changed
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

    if (qId === 'issuingAgency' && value !== 'other') {
      updated.otherAgencyName = undefined;
    }

    setAnswers(updated);

    // Recompute adaptive question list with the updated answer
    const nextQuestions = getAdaptiveQuestions(selectedCourses, updated);
    const requiresOptionalText = value === 'other' && (qId === 'highestCert' || qId === 'issuingAgency');

    if (!requiresOptionalText) {
      if (questionIndex + 1 < nextQuestions.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setPhase('summary_contact');
      }
    }
  };

  const handleQuestionNext = () => {
    const currentQ = adaptiveQuestions[questionIndex];
    if (!currentQ) {
      setPhase('summary_contact');
      return;
    }
    const currentVal = answers[currentQ.id as keyof BookingQAAnswers];
    if (!currentVal) {
      setErrors({
        qa: isRtl ? 'يرجى اختيار أحد الخيارات للمتابعة' : 'Please choose an option to continue',
      });
      return;
    }
    setErrors({});
    if (questionIndex + 1 < adaptiveQuestions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setPhase('summary_contact');
    }
  };

  const handleBack = () => {
    setErrors({});
    if (phase === 'summary_contact') {
      if (bookingMode === 'expedition') {
        setBookingMode('courses');
        setPhase('select_courses');
        return;
      }
      if (adaptiveQuestions.length > 0) {
        setQuestionIndex(adaptiveQuestions.length - 1);
        setPhase('qa');
      } else {
        setPhase('select_courses');
      }
      return;
    }

    if (phase === 'qa') {
      if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1);
      } else {
        setPhase('select_courses');
      }
    }
  };

  const totalCoursesPrice = selectedCourses.reduce(
    (sum, c) => sum + parseCoursePriceSar(c.price.ar || c.price.en),
    0
  );
  const formattedTotalPrice =
    totalCoursesPrice > 0
      ? `${totalCoursesPrice.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${
          language === 'ar' ? 'ر.س' : 'SAR'
        }`
      : undefined;

  const validateContact = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.name = t.errName;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errs.phone = t.errPhone;
    }
    if (!agreedToTerms) {
      errs.terms = isRtl ? 'يرجى الموافقة على السياسات للمتابعة' : 'Please agree to the policies';
    }
    if (bookingMode === 'courses' && selectedCourses.length === 0) {
      errs.courses = isRtl ? 'يرجى اختيار دورة واحدة على الأقل' : 'Select at least one course';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact()) return;

    const timingLabel =
      preferredDays === 'weekend'
        ? t.timeWeekend
        : preferredDays === 'weekday'
        ? t.timeWeekday
        : t.timeFlexible;

    if (bookingMode === 'expedition') {
      const tripLabel = `${isRtl ? 'رحلة غوص:' : 'Expedition:'} ${
        selectedTripName || (isRtl ? 'رحلة غوص بجدة' : 'Jeddah Dive Expedition')
      }`;
      const ref = addBooking({
        name: fullName,
        phone,
        interest: tripLabel,
        experience: isRtl ? 'حجز رحلة غوص بحرية' : 'Dive Expedition Request',
        timing: timingLabel,
        notes: [
          notes,
          selectedCaptain ? (isRtl ? `الكابتن المفضل: ${selectedCaptain}` : `Preferred Instructor: ${selectedCaptain}`) : '',
        ]
          .filter(Boolean)
          .join(' · '),
        paymentMethod: 'whatsapp',
        status: 'new',
        bookingType: 'expedition',
        eligibilityStatus: 'pending_instructor_review',
        paymentAllowed: false,
      });
      setBookingRef(ref);
      setSubmittedEvaluations([]);
      setPhase('submitted');
      return;
    }

    const interestSummary = selectedCourses.map((c) => c.title[language]).join(' + ');
    const certSummary = `${getHighestCertLabel(
      completedAnswers.highestCert,
      language,
      completedAnswers.otherCertName
    )}${
      completedAnswers.highestCert !== 'none'
        ? ` · ${getIssuingAgencyLabel(
            completedAnswers.issuingAgency,
            language,
            completedAnswers.otherAgencyName
          )}`
        : ''
    }`;

    const ref = addBooking({
      name: fullName,
      phone,
      interest: interestSummary,
      experience: certSummary,
      timing: timingLabel,
      notes: [
        notes,
        selectedCaptain ? (isRtl ? `الكابتن المفضل: ${selectedCaptain}` : `Preferred Instructor: ${selectedCaptain}`) : '',
      ]
        .filter(Boolean)
        .join(' · '),
      paymentMethod: 'whatsapp',
      paymentAmount: formattedTotalPrice,
      status: 'new',
      bookingType: 'courses',
      selectedCourses: evaluationBundle.evaluations,
      highestCert: completedAnswers.highestCert,
      issuingAgency: completedAnswers.issuingAgency,
      qaAnswers: completedAnswers,
      preliminaryEligibility: evaluationBundle.overallPreliminaryStatus,
      eligibilityStatus: 'pending_instructor_review',
      equivalencyRequired: evaluationBundle.anyEquivalencyRequired,
      paymentAllowed: false,
    });

    setBookingRef(ref);
    setSubmittedEvaluations(evaluationBundle.evaluations);
    setPhase('submitted');
  };

  const whatsAppSummaryText = (() => {
    if (bookingMode === 'expedition') {
      return isRtl
        ? `السلام عليكم كابتن فهد،\nأود حجز رحلة غوص: ${selectedTripName}\nالرقم المرجعي: ${bookingRef}\nالاسم: ${fullName}\nالموعد المفضل: ${preferredDays}\n${notes ? `ملاحظات: ${notes}` : ''}`
        : `Hello Capt. Fahad,\nI would like to book expedition: ${selectedTripName}\nRef: ${bookingRef}\nName: ${fullName}`;
    }

    const coursesLines = submittedEvaluations
      .map((ev) => {
        const badge = ev.status === 'eligible' ? (isRtl ? 'مؤهل مبدئياً' : 'Eligible') : (isRtl ? 'متطلبات ناقصة' : 'Missing Req');
        const eq = ev.needsEquivalency ? (isRtl ? ' (يحتاج تحقق معادلة شهادة)' : ' (Needs equivalency check)') : '';
        return `• ${isRtl ? ev.titleAr : ev.titleEn} — [${badge}]${eq}`;
      })
      .join('\n');

    return isRtl
      ? `🤿 *طلب تسجيل دورات (بانتظار مراجعة الكابتن) — رواء الفن*
━━━━━━━━━━━━━━━━━━
🔖 الرقم المرجعي: ${bookingRef}
👤 الاسم: ${fullName}
📱 الجوال: ${phone}
🎓 أعلى شهادة: ${getHighestCertLabel(completedAnswers.highestCert, 'ar', completedAnswers.otherCertName)}
🏛️ المنظمة المصدرة: ${getIssuingAgencyLabel(completedAnswers.issuingAgency, 'ar', completedAnswers.otherAgencyName)}
📚 الدورات المختارة وتقييمها المبدئي:
${coursesLines}
${selectedCaptain ? `👨‍✈️ الكابتن المفضل: ${selectedCaptain}\n` : ''}${notes ? `💬 ملاحظات: ${notes}\n` : ''}⏳ الحالة: بانتظار مراجعة الكابتن (الدفع مقفول حتى الموافقة)`
      : `🤿 *Course Enrollment Request (Pending Captain Review) — Riwa Alfan*
━━━━━━━━━━━━━━━━━━
🔖 Ref: ${bookingRef}
👤 Name: ${fullName}
📱 Phone: ${phone}
🎓 Highest Cert: ${getHighestCertLabel(completedAnswers.highestCert, 'en', completedAnswers.otherCertName)}
🏛️ Agency: ${getIssuingAgencyLabel(completedAnswers.issuingAgency, 'en', completedAnswers.otherAgencyName)}
📚 Selected Courses:
${coursesLines}
⏳ Status: Pending Captain Review (Payment locked until approval)`;
  })();

  const whatsAppUrl = `https://wa.me/${config.brand.whatsappNumber}?text=${encodeURIComponent(
    whatsAppSummaryText
  )}`;

  const currentQuestion = phase === 'qa' ? adaptiveQuestions[questionIndex] : undefined;
  const currentQValue = currentQuestion
    ? (answers[currentQuestion.id as keyof BookingQAAnswers] as string | undefined)
    : undefined;

  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Top Header + Progress Indicator */}
        <div className="px-4 sm:px-7 pt-4 sm:pt-5 pb-3.5 border-b border-slate-800 bg-slate-950/60 shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#C59B5F]">
                {bookingMode === 'expedition'
                  ? isRtl
                    ? 'حجز رحلة غوص بحرية'
                    : 'Dive Expedition Booking'
                  : isRtl
                  ? 'تقييم الأهلية الذكي والتسجيل السريع'
                  : 'Smart Eligibility & Course Booking'}
              </div>
              <h3 className="text-base sm:text-xl font-black text-white font-brand-arabic">
                {phase === 'submitted'
                  ? isRtl
                    ? 'تم إرسال الطلب لمراجعة الكابتن'
                    : 'Request Sent for Captain Review'
                  : isRtl
                  ? 'احجز دورتك في رواء الفن'
                  : 'Book Your Training at Riwa Alfan'}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
              aria-label={isRtl ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {phase !== 'submitted' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>
                  {isRtl
                    ? `الخطوة ${currentStepNumber} من ${totalSteps}`
                    : `Step ${currentStepNumber} of ${totalSteps}`}
                </span>
                <span className="font-mono text-[#E0BA84]">{progressPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C59B5F] to-blue-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-5">
          {/* PHASE 1: SELECT COURSES (MULTI-SELECT) OR EXPEDITION */}
          {phase === 'select_courses' && (
            <div className="space-y-4">
              {/* Switch between Courses Q&A and Dive Trip */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setBookingMode('courses')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                    bookingMode === 'courses'
                      ? 'gold-gradient-btn text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'دورات الغوص (اختيار متعدد)' : 'Courses (Multi-Select)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingMode('expedition');
                    if (!selectedTripName && config.diveSites?.[0]) {
                      setSelectedTripName(config.diveSites[0].name[language]);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                    bookingMode === 'expedition'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isRtl ? 'رحلة غوص بحرية' : 'Boat Expedition'}
                </button>
              </div>

              {bookingMode === 'courses' ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {isRtl
                        ? 'ما الدورات التي ترغب في التسجيل بها؟'
                        : 'Which course(s) would you like to apply for?'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRtl
                        ? 'يمكنك اختيار دورة واحدة أو عدة دورات في طلب واحد، وسيتم تقييم أهلية كل دورة بشكل مستقل.'
                        : 'Select one or multiple courses in a single request. Each course will be evaluated independently.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {courses.map((course) => {
                      const isChecked = selectedCourseIds.includes(course.id);
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => toggleCourseSelection(course.id)}
                          className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-start justify-between gap-3 min-h-[64px] ${
                            isChecked
                              ? 'bg-[#C59B5F]/15 border-[#C59B5F] shadow-md shadow-[#C59B5F]/10'
                              : 'bg-slate-950/90 border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-white block leading-snug">
                              {course.title[language]}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-[#E0BA84] block">
                              {course.price[language]} · {course.duration[language]}
                            </span>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                              isChecked
                                ? 'bg-[#C59B5F] border-[#C59B5F] text-slate-950'
                                : 'bg-slate-900 border-slate-700 text-transparent'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {errors.courses && (
                    <p className="text-xs text-red-400 font-semibold">{errors.courses}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isRtl ? 'اختر موقع رحلة الغوص بجدة:' : 'Select Jeddah Dive Expedition Site:'}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(config.diveSites || []).map((site) => {
                      const name = site.name[language];
                      const active = selectedTripName === name;
                      return (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => setSelectedTripName(name)}
                          className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[48px] ${
                            active
                              ? 'bg-blue-600/20 border-blue-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-bold block">{name}</span>
                            <span className="text-[11px] text-slate-400">
                              {site.depth[language]} · {site.level[language]}
                            </span>
                          </div>
                          {active && <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleStartQA}
                  className="gold-gradient-btn w-full sm:w-auto px-7 py-3.5 rounded-xl text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[46px]"
                >
                  <span>
                    {bookingMode === 'expedition'
                      ? isRtl
                        ? 'متابعة لبيانات الحجز'
                        : 'Continue to Details'
                      : isRtl
                      ? `بدء أسئلة الأهلية (${selectedCourseIds.length})`
                      : `Start Quick Check (${selectedCourseIds.length})`}
                  </span>
                  <NextArrowIcon className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: ADAPTIVE Q&A (ONE QUESTION PER STEP) */}
          {phase === 'qa' && currentQuestion && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-black text-white font-brand-arabic leading-snug">
                  {isRtl ? currentQuestion.titleAr : currentQuestion.titleEn}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl ? currentQuestion.subtitleAr : currentQuestion.subtitleEn}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((opt) => {
                  const selected = currentQValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, opt.value)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] ${
                        selected
                          ? 'bg-[#C59B5F]/15 border-[#C59B5F] text-white shadow-md shadow-[#C59B5F]/10'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold block">
                          {isRtl ? opt.labelAr : opt.labelEn}
                        </span>
                        {(opt.hintAr || opt.hintEn) && (
                          <span className="text-[11px] text-slate-400 block">
                            {isRtl ? opt.hintAr : opt.hintEn}
                          </span>
                        )}
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          selected
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

              {/* Optional brief text field ONLY when user selects "Other" */}
              {currentQuestion.allowOtherInput && currentQValue === 'other' && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={String(answers[currentQuestion.allowOtherInput] || '')}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.allowOtherInput!]: e.target.value,
                      }))
                    }
                    placeholder={
                      isRtl
                        ? currentQuestion.otherPlaceholderAr
                        : currentQuestion.otherPlaceholderEn
                    }
                    className="w-full bg-slate-950 border border-[#C59B5F]/50 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                  />
                </div>
              )}

              {errors.qa && <p className="text-xs text-red-400 font-semibold">{errors.qa}</p>}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <BackArrowIcon className="w-4 h-4" />
                  <span>{isRtl ? 'السابق' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuestionNext}
                  className="gold-gradient-btn px-6 py-3 rounded-xl text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>{isRtl ? 'التالي' : 'Next'}</span>
                  <NextArrowIcon className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 3: PRE-SUBMIT SUMMARY, PER-COURSE ELIGIBILITY & CONTACT FORM */}
          {phase === 'summary_contact' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Q&A Summary + Edit button (only for course bookings) */}
              {bookingMode === 'courses' && (
                <>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs font-bold text-[#C59B5F]">
                        {isRtl ? 'ملخص إجاباتك' : 'Your Answers Summary'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuestionIndex(0);
                          setPhase('qa');
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تعديل الإجابات' : 'Edit Answers'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                        <span className="text-[11px] text-slate-400 block">
                          {isRtl ? 'أعلى شهادة:' : 'Highest Cert:'}
                        </span>
                        <span className="font-bold text-white">
                          {getHighestCertLabel(
                            completedAnswers.highestCert,
                            language,
                            completedAnswers.otherCertName
                          )}
                        </span>
                      </div>

                      {completedAnswers.highestCert !== 'none' && (
                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                          <span className="text-[11px] text-slate-400 block">
                            {isRtl ? 'المنظمة المصدرة:' : 'Issuing Agency:'}
                          </span>
                          <span className="font-bold text-white">
                            {getIssuingAgencyLabel(
                              completedAnswers.issuingAgency,
                              language,
                              completedAnswers.otherAgencyName
                            )}
                          </span>
                        </div>
                      )}

                      {completedAnswers.hasAdventureAndNav && (
                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                          <span className="text-[11px] text-slate-400 block">
                            {isRtl ? 'Adventure Diver + الملاحة:' : 'Adventure + Navigation:'}
                          </span>
                          <span className="font-bold text-white">
                            {completedAnswers.hasAdventureAndNav === 'yes'
                              ? isRtl
                                ? 'نعم'
                                : 'Yes'
                              : completedAnswers.hasAdventureAndNav === 'no'
                              ? isRtl
                                ? 'لا'
                                : 'No'
                              : isRtl
                              ? 'غير متأكد'
                              : 'Unsure'}
                          </span>
                        </div>
                      )}

                      {completedAnswers.hasValidEfrCpr && (
                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                          <span className="text-[11px] text-slate-400 block">
                            {isRtl ? 'إسعافات وإنعاش سارية (EFR):' : 'Valid CPR & First Aid:'}
                          </span>
                          <span className="font-bold text-white">
                            {completedAnswers.hasValidEfrCpr === 'yes'
                              ? isRtl
                                ? 'نعم، سارية'
                                : 'Yes, valid'
                              : completedAnswers.hasValidEfrCpr === 'no'
                              ? isRtl
                                ? 'غير متوفرة'
                                : 'Not available'
                              : isRtl
                              ? 'غير متأكد'
                              : 'Unsure'}
                          </span>
                        </div>
                      )}

                      {completedAnswers.loggedDivesRange && (
                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                          <span className="text-[11px] text-slate-400 block">
                            {isRtl ? 'الغطسات المسجلة:' : 'Logged Dives:'}
                          </span>
                          <span className="font-bold text-white font-mono">
                            {completedAnswers.loggedDivesRange}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Independent Per-Course Preliminary Eligibility Results */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {isRtl
                          ? 'التقييم المبدئي لكل دورة مختارة:'
                          : 'Preliminary Eligibility per Course:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPhase('select_courses')}
                        className="text-[11px] font-bold text-[#C59B5F] hover:text-[#E0BA84] cursor-pointer"
                      >
                        {isRtl ? 'تعديل الدورات' : 'Edit Courses'}
                      </button>
                    </div>

                    {evaluationBundle.evaluations.map((ev) => {
                      const isOk = ev.status === 'eligible';
                      return (
                        <div
                          key={ev.courseId}
                          className={`p-3.5 sm:p-4 rounded-2xl border space-y-2 ${
                            isOk
                              ? 'bg-emerald-950/20 border-emerald-500/40'
                              : 'bg-amber-950/25 border-amber-500/40'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-sm font-bold text-white block">
                                {isRtl ? ev.titleAr : ev.titleEn}
                              </span>
                              <span className="text-[11px] font-mono text-[#E0BA84]">
                                {isRtl ? ev.priceAr : ev.priceEn}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                  isOk
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {isOk ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {isOk
                                    ? isRtl
                                      ? 'مؤهل مبدئياً'
                                      : 'Preliminarily Eligible'
                                    : isRtl
                                    ? 'توجد متطلبات ناقصة'
                                    : 'Missing Requirements'}
                                </span>
                              </span>

                              {selectedCourseIds.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => toggleCourseSelection(ev.courseId)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-red-300 bg-slate-900 border border-slate-700 cursor-pointer"
                                >
                                  {isRtl ? 'إزالة' : 'Remove'}
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                            {isRtl ? ev.guidanceMessageAr : ev.guidanceMessageEn}
                          </p>

                          {ev.needsEquivalency && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 pt-1">
                              <Award className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {isRtl
                                  ? 'إحالة تلقائية للكابتن للتحقق من معادلة الشهادة الخارجية'
                                  : 'Flagged for Captain equivalency verification'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Compact Customer Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold text-white block">
                  {isRtl ? 'بيانات التواصل لتأكيد الطلب:' : 'Contact Details:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t.formFullName} <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder={isRtl ? 'مثال: محمد الغامدي' : 'e.g. John Smith'}
                      className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[44px] ${
                        errors.name ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t.formPhone} <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="05xxxxxxxx"
                      className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500 min-h-[44px] ${
                        errors.phone ? 'border-red-500' : 'border-slate-800'
                      }`}
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t.formTiming}
                    </label>
                    <select
                      value={preferredDays}
                      onChange={(e) => setPreferredDays(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                    >
                      <option value="weekend">{t.timeWeekend}</option>
                      <option value="weekday">{t.timeWeekday}</option>
                      <option value="flexible">{t.timeFlexible}</option>
                    </select>
                  </div>

                  {config.captains && config.captains.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isRtl ? 'الكابتن المفضل (اختياري)' : 'Preferred Captain (Optional)'}
                      </label>
                      <select
                        value={selectedCaptain}
                        onChange={(e) => setSelectedCaptain(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px]"
                      >
                        <option value="">
                          {isRtl ? '— أي كابتن متاح —' : '— Any Available —'}
                        </option>
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
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.formNotes}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.formNotesPlaceholder}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Terms, Refund & Safety Policy Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowPolicies(!showPolicies)}
                  className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>
                      {isRtl
                        ? 'سياسة الاسترداد، إلغاء الرحلات، والسلامة (اضغط للاطلاع):'
                        : 'Refund, Cancellation & Safety Policy (Click to view):'}
                    </span>
                  </span>
                  {showPolicies ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showPolicies && (
                  <div className="pt-2 border-t border-slate-800 space-y-2.5 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    {POLICIES_DATA.map((policy) => (
                      <div
                        key={policy.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1"
                      >
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {policy.iconType === 'ship' && (
                            <Ship className="w-3.5 h-3.5 text-blue-400" />
                          )}
                          {policy.iconType === 'graduation' && (
                            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                          )}
                          {policy.iconType === 'shield' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>{policy.title[language]}:</span>
                        </span>
                        <ul className="space-y-1 text-slate-300 px-2">
                          {policy.rules.map((rule) => (
                            <li key={rule.id}>
                              • <strong className="text-slate-200">{rule.label[language]}</strong>{' '}
                              {rule.description[language]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

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
                    <span className="text-blue-400 font-bold mx-1">*</span>
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}
              </div>

              {/* Payment Lock Reminder + Back / Submit */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-300">
                <Lock className="w-4 h-4 text-[#C59B5F] shrink-0" />
                <span>
                  {isRtl
                    ? 'يُمنع الدفع قبل مراجعة الكابتن: سيصل الطلب للكابتن فهد أولاً وعند الموافقة النهائية سيصبح الدفع متاحاً.'
                    : 'No payment before Captain approval: your request goes to Captain Fahad first, and payment unlocks once approved.'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer min-h-[46px]"
                >
                  <BackArrowIcon className="w-4 h-4" />
                  <span>{isRtl ? 'رجوع' : 'Back'}</span>
                </button>

                <button
                  type="submit"
                  className="gold-gradient-btn flex-1 py-3.5 px-5 rounded-xl text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[46px]"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>
                    {isRtl ? 'إرسال الطلب لمراجعة الكابتن' : 'Submit for Captain Review'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* PHASE 4: SUBMITTED CONFIRMATION (PAYMENT LOCKED UNTIL CAPTAIN APPROVAL) */}
          {phase === 'submitted' && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-bold text-white font-brand-arabic">
                  {t.modalSuccessTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  {t.modalSuccessDesc(fullName)}
                </p>
                <div className="font-mono text-lg sm:text-xl font-bold text-blue-400 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 inline-block">
                  {bookingRef}
                </div>
              </div>

              {/* Payment Locked Status Notice */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-start space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    {isRtl
                      ? 'الحالة الحالية: بانتظار مراجعة الكابتن (الدفع مقفول حالياً)'
                      : 'Current Status: Pending Captain Review (Payment Locked)'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'تم حفظ إجاباتك ونتائج التقييم المبدئي وإرسالها للكابتن فهد. بعد مراجعة الطلب والموافقة النهائية من الكابتن، سيُفتح لك الدفع لتأكيد الحجز.'
                    : 'Your Q&A answers and per-course evaluation have been sent to Captain Fahad. Once approved, payment will unlock for booking confirmation.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.modalWhatsAppBtn}</span>
                </a>

                {onOpenStatusTracker && (
                  <button
                    type="button"
                    onClick={() => {
                      const ref = bookingRef;
                      onClose();
                      onOpenStatusTracker(ref);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isRtl ? 'متابعة حالة الطلب والدفع' : 'Track Status & Payment'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
                >
                  {t.modalClose}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
