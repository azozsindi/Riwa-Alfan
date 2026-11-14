import React, { useState } from 'react';
import {
  Inbox,
  MessageCircle,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Lock,
  Unlock,
  Award,
  FileWarning,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Booking, EligibilityStatus, InstructorActionType } from '../../../types/admin';
import {
  getHighestCertLabel,
  getIssuingAgencyLabel,
  getEligibilityStatusLabel,
} from '../../../utils/eligibilityEngine';

interface BookingsTabProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onUpdateReview?: (
    id: string,
    review: {
      eligibilityStatus: EligibilityStatus;
      instructorActionType: InstructorActionType;
      instructorReviewNote?: string;
      paymentAllowed: boolean;
      status?: Booking['status'];
    }
  ) => void;
  onDeleteBooking: (id: string) => void;
  showToast: (msg?: string) => void;
}

type FilterKey =
  | 'all'
  | 'pending_instructor_review'
  | 'approved'
  | 'missing_requirements'
  | 'rejected'
  | 'paid';

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  onUpdateStatus,
  onUpdateReview,
  onDeleteBooking,
  showToast,
}) => {
  const { language, isRtl } = useLanguage();
  const [bookingFilter, setBookingFilter] = useState<FilterKey>('all');
  const [reviewNotesDraft, setReviewNotesDraft] = useState<Record<string, string>>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getEffectiveEligibility = (b: Booking): EligibilityStatus => {
    if (b.eligibilityStatus) return b.eligibilityStatus;
    if (b.status === 'cancelled') return 'rejected';
    if (b.status === 'paid' || b.status === 'pending_payment' || b.status === 'confirmed') {
      return 'approved';
    }
    return 'pending_instructor_review';
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    if (bookingFilter === 'paid') return b.status === 'paid';
    return getEffectiveEligibility(b) === bookingFilter;
  });

  const pendingCount = bookings.filter(
    (b) => getEffectiveEligibility(b) === 'pending_instructor_review' && b.status !== 'paid'
  ).length;
  const approvedCount = bookings.filter(
    (b) => getEffectiveEligibility(b) === 'approved' && b.status !== 'paid'
  ).length;
  const missingCount = bookings.filter(
    (b) => getEffectiveEligibility(b) === 'missing_requirements'
  ).length;
  const rejectedCount = bookings.filter(
    (b) => getEffectiveEligibility(b) === 'rejected'
  ).length;
  const paidCount = bookings.filter((b) => b.status === 'paid').length;

  const handleCaptainAction = (
    b: Booking,
    action: InstructorActionType
  ) => {
    const draftNote = (reviewNotesDraft[b.id] ?? b.instructorReviewNote ?? '').trim();

    if (action === 'rejected' && !draftNote) {
      setActionErrors((prev) => ({
        ...prev,
        [b.id]: isRtl
          ? 'يرجى كتابة سبب الرفض ليظهر للعميل في ملخص الحالة.'
          : 'Please enter a rejection reason.',
      }));
      return;
    }

    if ((action === 'request_info' || action === 'request_requirement') && !draftNote) {
      setActionErrors((prev) => ({
        ...prev,
        [b.id]: isRtl
          ? 'يرجى كتابة التفاصيل المطلوبة من العميل في خانة الملاحظة.'
          : 'Please specify what info or requirement is needed.',
      }));
      return;
    }

    setActionErrors((prev) => ({ ...prev, [b.id]: '' }));

    if (!onUpdateReview) return;

    if (action === 'approved') {
      onUpdateReview(b.id, {
        eligibilityStatus: 'approved',
        instructorActionType: 'approved',
        instructorReviewNote:
          draftNote ||
          (isRtl
            ? 'تمت مراجعة مؤهلاتك واعتماد أهليتك للدورة. الدفع متاح الآن لتأكيد مقعدك.'
            : 'Your qualifications have been approved. Payment is now open to confirm your spot.'),
        paymentAllowed: true,
        status: b.status === 'paid' ? 'paid' : 'pending_payment',
      });
      showToast(isRtl ? 'تمت الموافقة وتفعيل الدفع للعميل ✓' : 'Approved & payment unlocked ✓');
    } else if (action === 'request_info') {
      onUpdateReview(b.id, {
        eligibilityStatus: 'pending_instructor_review',
        instructorActionType: 'request_info',
        instructorReviewNote: draftNote,
        paymentAllowed: false,
        status: 'contacted',
      });
      showToast(isRtl ? 'تم تسجيل طلب معلومات إضافية' : 'Requested additional info');
    } else if (action === 'request_requirement') {
      onUpdateReview(b.id, {
        eligibilityStatus: 'missing_requirements',
        instructorActionType: 'request_requirement',
        instructorReviewNote: draftNote,
        paymentAllowed: false,
        status: 'contacted',
      });
      showToast(isRtl ? 'تم طلب استكمال شهادة / متطلب' : 'Requested missing requirement');
    } else {
      onUpdateReview(b.id, {
        eligibilityStatus: 'rejected',
        instructorActionType: 'rejected',
        instructorReviewNote: draftNote,
        paymentAllowed: false,
        status: 'cancelled',
      });
      showToast(isRtl ? 'تم رفض الطلب وتوثيق السبب' : 'Request rejected with reason');
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-400 shrink-0" />
            <span>{isRtl
              ? 'صندوق مراجعة الكابتن والحجوزات'
              : 'Captain Review & Bookings Inbox'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl
              ? 'راجع إجابات الأهلية والشهادات الخارجية، واعتمد الطلب لفتح الدفع للعميل أو اطلب استكمال المتطلبات.'
              : 'Review eligibility answers & external equivalency, approve to unlock payment, or request requirements.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar max-w-full shrink-0">
          {(
            [
              { key: 'all', label: isRtl ? `الكل (${bookings.length})` : `All (${bookings.length})` },
              {
                key: 'pending_instructor_review',
                label: isRtl ? `بانتظار المراجعة (${pendingCount})` : `Pending (${pendingCount})`,
              },
              {
                key: 'approved',
                label: isRtl ? `معتمد للدفع (${approvedCount})` : `Approved (${approvedCount})`,
              },
              {
                key: 'missing_requirements',
                label: isRtl ? `متطلبات ناقصة (${missingCount})` : `Missing Req (${missingCount})`,
              },
              {
                key: 'rejected',
                label: isRtl ? `مرفوض (${rejectedCount})` : `Rejected (${rejectedCount})`,
              },
              {
                key: 'paid',
                label: isRtl ? `مدفوع (${paidCount})` : `Paid (${paidCount})`,
              },
            ] as { key: FilterKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setBookingFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                bookingFilter === tab.key
                  ? 'gold-gradient-btn text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800/80">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <span className="text-sm font-semibold text-slate-300 block">
            {isRtl ? 'لا توجد طلبات في هذا القسم حالياً' : 'No bookings in this filter'}
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const effectiveElig = getEffectiveEligibility(b);
            const paymentUnlocked = Boolean(
              b.paymentAllowed && effectiveElig === 'approved'
            );
            const isPaid = b.status === 'paid';
            const cleanPhone = b.phone.replace(/[^0-9]/g, '');

            const currentNoteDraft =
              reviewNotesDraft[b.id] !== undefined
                ? reviewNotesDraft[b.id]
                : b.instructorReviewNote || '';

            const waMessage = isRtl
              ? `أهلاً بك يا ${b.name}، معك كابتن فهد الهويملي من رواء الفن للغوص بخصوص طلبك رقم ${b.id} (${b.interest}).\nالحالة: ${getEligibilityStatusLabel(effectiveElig, 'ar')}${
                  currentNoteDraft ? `\nملاحظة الكابتن: ${currentNoteDraft}` : ''
                }`
              : `Hello ${b.name}, Capt. Fahad from Riwa Alfan Diving regarding booking ${b.id} (${b.interest}). Status: ${getEligibilityStatusLabel(
                  effectiveElig,
                  'en'
                )}${currentNoteDraft ? `\nNote: ${currentNoteDraft}` : ''}`;

            const waLink = `https://wa.me/966${
              cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone
            }?text=${encodeURIComponent(waMessage)}`;

            return (
              <div
                key={b.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Top Summary Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900/60">
                        {b.id}
                      </span>
                      <span className="font-bold text-white text-sm sm:text-base">{b.name}</span>
                      <span className="text-xs text-slate-400 font-mono" dir="ltr">
                        ({b.phone})
                      </span>

                      {/* Eligibility Status Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                          effectiveElig === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : effectiveElig === 'rejected'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : effectiveElig === 'missing_requirements'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        {getEligibilityStatusLabel(effectiveElig, language)}
                      </span>

                      {/* Payment Lock Indicator */}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                          isPaid
                            ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50'
                            : paymentUnlocked
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isRtl ? 'مدفوع مؤكد' : 'Paid'}</span>
                          </>
                        ) : paymentUnlocked ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>{isRtl ? 'الدفع متاح للعميل' : 'Payment Unlocked'}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>{isRtl ? 'الدفع مقفول' : 'Payment Locked'}</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                      <span>
                        <strong className="text-slate-400">
                          {isRtl ? 'البرنامج:' : 'Interest:'}
                        </strong>{' '}
                        {b.interest}
                      </span>
                      {b.paymentAmount && (
                        <span>
                          <strong className="text-slate-400">
                            {isRtl ? 'المبلغ:' : 'Amount:'}
                          </strong>{' '}
                          <span className="font-mono text-[#E0BA84] font-bold">
                            {b.paymentAmount}
                          </span>
                        </span>
                      )}
                      <span>
                        <strong className="text-slate-400">
                          {isRtl ? 'الوقت:' : 'Timing:'}
                        </strong>{' '}
                        {b.timing}
                      </span>
                    </div>
                  </div>

                  {/* Quick Legacy Status Select & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={b.status}
                      onChange={(e) => onUpdateStatus(b.id, e.target.value as Booking['status'])}
                      className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="new">{isRtl ? 'طلب جديد' : 'New'}</option>
                      <option value="pending_payment">
                        {isRtl ? 'بانتظار الدفع' : 'Pending Payment'}
                      </option>
                      <option value="paid">{isRtl ? 'مدفوع مؤكد' : 'Paid'}</option>
                      <option value="contacted">{isRtl ? 'تم التواصل' : 'Contacted'}</option>
                      <option value="confirmed">{isRtl ? 'تم التأكيد' : 'Confirmed'}</option>
                      <option value="completed">{isRtl ? 'مكتمل' : 'Completed'}</option>
                      <option value="cancelled">{isRtl ? 'ملغي / مرفوض' : 'Cancelled'}</option>
                    </select>

                    {confirmDeleteId === b.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteBooking(b.id);
                            setConfirmDeleteId(null);
                            showToast(isRtl ? 'تم حذف الطلب' : 'Deleted');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-red-600 text-white text-[11px] font-bold cursor-pointer"
                        >
                          {isRtl ? 'تأكيد' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(b.id)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isRtl ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CAPTAIN Q&A SUMMARY & PER-COURSE ELIGIBILITY PANEL */}
                {(b.highestCert || (b.selectedCourses && b.selectedCourses.length > 0)) && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-bold text-[#E0BA84]">
                        {isRtl ? 'ملخص أهلية العميل للكابتن' : 'Captain Eligibility Summary'}
                      </span>
                      {b.equivalencyRequired && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                          <Award className="w-3.5 h-3.5" />
                          <span>
                            {isRtl
                              ? 'تحتاج تحقق من معادلة الشهادة'
                              : 'External Equivalency Verification Needed'}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Customer Credentials & Q&A Answers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/70">
                        <span className="text-[10px] text-slate-400 block">
                          {isRtl ? 'أعلى شهادة:' : 'Highest Cert:'}
                        </span>
                        <span className="font-bold text-white">
                          {getHighestCertLabel(
                            b.highestCert,
                            language,
                            b.qaAnswers?.otherCertName
                          )}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/70">
                        <span className="text-[10px] text-slate-400 block">
                          {isRtl ? 'المنظمة المصدرة:' : 'Issuing Agency:'}
                        </span>
                        <span className="font-bold text-white">
                          {getIssuingAgencyLabel(
                            b.issuingAgency,
                            language,
                            b.qaAnswers?.otherAgencyName
                          )}
                        </span>
                      </div>

                      {b.qaAnswers?.hasAdventureAndNav && (
                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/70">
                          <span className="text-[10px] text-slate-400 block">
                            {isRtl ? 'Adventure + ملاحة:' : 'Adventure + Nav:'}
                          </span>
                          <span className="font-bold text-white">
                            {b.qaAnswers.hasAdventureAndNav}
                          </span>
                        </div>
                      )}

                      {b.qaAnswers?.hasValidEfrCpr && (
                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/70">
                          <span className="text-[10px] text-slate-400 block">
                            {isRtl ? 'EFR / CPR سارية:' : 'Valid EFR/CPR:'}
                          </span>
                          <span className="font-bold text-white">
                            {b.qaAnswers.hasValidEfrCpr}
                          </span>
                        </div>
                      )}

                      {b.qaAnswers?.loggedDivesRange && (
                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/70">
                          <span className="text-[10px] text-slate-400 block">
                            {isRtl ? 'عدد الغطسات:' : 'Logged Dives:'}
                          </span>
                          <span className="font-bold text-white font-mono">
                            {b.qaAnswers.loggedDivesRange}
                          </span>
                        </div>
                      )}

                      {b.qaAnswers?.lastDiveRecency && (
                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/70">
                          <span className="text-[10px] text-slate-400 block">
                            {isRtl ? 'آخر غطسة:' : 'Last Dive:'}
                          </span>
                          <span className="font-bold text-white">
                            {b.qaAnswers.lastDiveRecency}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Per-Course Preliminary Breakdown */}
                    {b.selectedCourses && b.selectedCourses.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-300 block">
                          {isRtl
                            ? 'نتيجة الأهلية المبدئية لكل دورة:'
                            : 'Independent Preliminary Course Results:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {b.selectedCourses.map((cEval) => (
                            <div
                              key={cEval.courseId}
                              className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                                cEval.status === 'eligible'
                                  ? 'bg-emerald-950/20 border-emerald-500/30'
                                  : 'bg-amber-950/25 border-amber-500/30'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-white">
                                  {isRtl ? cEval.titleAr : cEval.titleEn}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    cEval.status === 'eligible'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {cEval.status === 'eligible'
                                    ? isRtl
                                      ? 'مؤهل مبدئياً'
                                      : 'Eligible'
                                    : isRtl
                                    ? 'متطلبات ناقصة'
                                    : 'Missing Req'}
                                </span>
                              </div>

                              {cEval.missingRequirementsAr.length > 0 && (
                                <ul className="text-[11px] text-amber-200/90 space-y-0.5">
                                  {(isRtl
                                    ? cEval.missingRequirementsAr
                                    : cEval.missingRequirementsEn
                                  ).map((m, idx) => (
                                    <li key={idx}>• {m}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {b.notes && (
                  <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 whitespace-pre-line">
                    {b.notes}
                  </p>
                )}

                {/* CAPTAIN DECISION BAR */}
                {onUpdateReview && (
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">
                        {isRtl
                          ? 'ملاحظة الكابتن للعميل (تظهر للعميل عند الموافقة / طلب استكمال / سبب الرفض):'
                          : 'Captain Review Note (visible to customer on status check):'}
                      </label>
                      <input
                        type="text"
                        value={currentNoteDraft}
                        onChange={(e) => {
                          setReviewNotesDraft((prev) => ({ ...prev, [b.id]: e.target.value }));
                          if (actionErrors[b.id]) {
                            setActionErrors((prev) => ({ ...prev, [b.id]: '' }));
                          }
                        }}
                        placeholder={
                          isRtl
                            ? 'مثال: يرجى إرسال صورة رخصة الـ SSI عبر الواتساب، أو سبب الرفض...'
                            : 'e.g. Please share SSI card photo via WhatsApp, or rejection reason...'
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C59B5F]"
                      />
                      {actionErrors[b.id] && (
                        <p className="text-[11px] text-red-400 font-semibold">
                          {actionErrors[b.id]}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCaptainAction(b, 'approved')}
                          className="min-h-[38px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isRtl ? 'موافقة وتفعيل الدفع' : 'Approve & Unlock Payment'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCaptainAction(b, 'request_info')}
                          className="min-h-[38px] px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{isRtl ? 'طلب معلومات إضافية' : 'Request Info'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCaptainAction(b, 'request_requirement')}
                          className="min-h-[38px] px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <FileWarning className="w-3.5 h-3.5 shrink-0" />
                          <span>{isRtl ? 'طلب استكمال متطلب' : 'Request Requirement'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCaptainAction(b, 'rejected')}
                          className="min-h-[38px] px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{isRtl ? 'رفض مع السبب' : 'Reject'}</span>
                        </button>
                      </div>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[38px] px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{isRtl ? 'مراسلة واتساب' : 'WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
