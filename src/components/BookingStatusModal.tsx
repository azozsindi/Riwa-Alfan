import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  MessageCircle,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { BookingStatusPublic } from '../types/admin';
import { fetchBookingStatusFromFirestore } from '../services/firestoreSync';
import { getEligibilityStatusLabel } from '../utils/eligibilityEngine';

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBookingId?: string;
}

export const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  isOpen,
  onClose,
  initialBookingId,
}) => {
  const { language, isRtl } = useLanguage();
  const { bookings, config } = useSiteConfig();

  const [bookingIdInput, setBookingIdInput] = useState(initialBookingId || '');
  const [phoneLast4Input, setPhoneLast4Input] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusResult, setStatusResult] = useState<BookingStatusPublic | null>(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'transfer' | 'mada' | 'cash'>('transfer');

  useEffect(() => {
    if (isOpen && initialBookingId) {
      setBookingIdInput(initialBookingId);
      setErrorMsg('');
      const localMatch = bookings.find(
        (b) => b.id.toUpperCase() === initialBookingId.trim().toUpperCase()
      );
      if (localMatch) {
        setStatusResult({
          id: localMatch.id,
          phoneSuffix: localMatch.phoneSuffix || localMatch.phone.replace(/\D/g, '').slice(-4),
          interest: localMatch.interest,
          eligibilityStatus: localMatch.eligibilityStatus || 'pending_instructor_review',
          preliminaryEligibility: localMatch.preliminaryEligibility,
          paymentAllowed: Boolean(
            localMatch.paymentAllowed && localMatch.eligibilityStatus === 'approved'
          ),
          instructorActionType: localMatch.instructorActionType,
          instructorReviewNote: localMatch.instructorReviewNote,
          paymentAmount: localMatch.paymentAmount,
          status: localMatch.status,
          updatedAt: localMatch.reviewedAt || localMatch.createdAt,
        });
      }
    }
  }, [isOpen, initialBookingId, bookings]);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const normalizedId = bookingIdInput.trim().toUpperCase();
    const digits = phoneLast4Input.replace(/\D/g, '').slice(-4);

    if (!normalizedId || normalizedId.length < 4) {
      setErrorMsg(isRtl ? 'يرجى إدخال رقم الطلب المرجعي (مثل BK-1234)' : 'Please enter your Booking Ref (e.g. BK-1234)');
      return;
    }
    if (digits.length !== 4) {
      setErrorMsg(isRtl ? 'يرجى إدخال آخر 4 أرقام من رقم الجوال المسجل' : 'Please enter the last 4 digits of your registered phone');
      return;
    }

    setLoading(true);
    try {
      // Check local device cache first (covers immediate offline/same-device bookings)
      const localMatch = bookings.find((b) => b.id.toUpperCase() === normalizedId);
      let remoteMatch: BookingStatusPublic | null = null;
      try {
        remoteMatch = await fetchBookingStatusFromFirestore(normalizedId);
      } catch {
        remoteMatch = null;
      }

      const chosen: BookingStatusPublic | null =
        remoteMatch ||
        (localMatch
          ? {
              id: localMatch.id,
              phoneSuffix: localMatch.phoneSuffix || localMatch.phone.replace(/\D/g, '').slice(-4),
              interest: localMatch.interest,
              eligibilityStatus: localMatch.eligibilityStatus || 'pending_instructor_review',
              preliminaryEligibility: localMatch.preliminaryEligibility,
              paymentAllowed: Boolean(
                localMatch.paymentAllowed && localMatch.eligibilityStatus === 'approved'
              ),
              instructorActionType: localMatch.instructorActionType,
              instructorReviewNote: localMatch.instructorReviewNote,
              paymentAmount: localMatch.paymentAmount,
              status: localMatch.status,
              updatedAt: localMatch.reviewedAt || localMatch.createdAt,
            }
          : null);

      if (!chosen) {
        setStatusResult(null);
        setErrorMsg(
          isRtl
            ? 'لم يتم العثور على طلب بهذا الرقم المرجعي.'
            : 'No booking found with this reference number.'
        );
        return;
      }

      if (chosen.phoneSuffix && chosen.phoneSuffix !== digits) {
        setStatusResult(null);
        setErrorMsg(
          isRtl
            ? 'آخر 4 أرقام من الجوال لا تطابق الطلب المسجل.'
            : 'The last 4 phone digits do not match this booking.'
        );
        return;
      }

      setStatusResult(chosen);
    } finally {
      setLoading(false);
    }
  };

  const canPay =
    statusResult !== null &&
    statusResult.eligibilityStatus === 'approved' &&
    statusResult.paymentAllowed === true &&
    statusResult.status !== 'paid';

  const isPaid = statusResult?.status === 'paid';

  const whatsappNumber = config.brand.whatsappNumber || '966530549675';
  const payMethodLabel =
    selectedPayMethod === 'transfer'
      ? isRtl
        ? 'تحويل بنكي'
        : 'Bank Transfer'
      : selectedPayMethod === 'mada'
      ? isRtl
        ? 'مدى / Apple Pay'
        : 'Mada / Apple Pay'
      : isRtl
      ? 'الدفع عند الحضور بالمركز'
      : 'Pay at Center';

  const paymentWhatsAppUrl = statusResult
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        isRtl
          ? `السلام عليكم كابتن فهد،\nتمت الموافقة على طلبي رقم ${statusResult.id} (${statusResult.interest}).\nأرغب في إتمام الدفع (${statusResult.paymentAmount || 'حسب الاتفاق'}) عبر: ${payMethodLabel}\nيرجى تزويدي ببيانات السداد أو تأكيد الحجز النهائي.`
          : `Hello Capt. Fahad,\nMy booking ${statusResult.id} (${statusResult.interest}) has been approved.\nI would like to complete payment (${statusResult.paymentAmount || 'as agreed'}) via: ${payMethodLabel}.`
      )}`
    : '#';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-[#C59B5F] block">
              {isRtl ? 'بوابة التحقق والدفع الآمن' : 'Approval & Payment Portal'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-brand-arabic">
              {isRtl ? 'متابعة حالة الطلب والدفع' : 'Track Request & Payment'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label={isRtl ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleLookup} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isRtl ? 'رقم الطلب المرجعي' : 'Booking Reference'}
              </label>
              <input
                type="text"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                placeholder="BK-1234"
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-[#C59B5F]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isRtl ? 'آخر 4 أرقام من جوالك' : 'Last 4 digits of phone'}
              </label>
              <input
                type="text"
                maxLength={4}
                inputMode="numeric"
                value={phoneLast4Input}
                onChange={(e) => setPhoneLast4Input(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="9675"
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-[#C59B5F]"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span>
              {loading
                ? isRtl
                  ? 'جاري التحقق...'
                  : 'Checking...'
                : isRtl
                ? 'تحقق من حالة الطلب'
                : 'Check Request Status'}
            </span>
          </button>
        </form>

        {/* Status Result Card */}
        {statusResult && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400 block">{statusResult.id}</span>
                <span className="text-sm font-bold text-white block mt-0.5">{statusResult.interest}</span>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                  isPaid
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : statusResult.eligibilityStatus === 'approved'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : statusResult.eligibilityStatus === 'rejected'
                    ? 'bg-red-500/15 text-red-300 border-red-500/40'
                    : statusResult.eligibilityStatus === 'missing_requirements'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                }`}
              >
                {isPaid ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : statusResult.eligibilityStatus === 'approved' ? (
                  <Unlock className="w-3.5 h-3.5" />
                ) : statusResult.eligibilityStatus === 'rejected' ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : statusResult.eligibilityStatus === 'missing_requirements' ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                <span>
                  {isPaid
                    ? isRtl
                      ? 'تم تأكيد الدفع والحجز'
                      : 'Paid & Confirmed'
                    : getEligibilityStatusLabel(statusResult.eligibilityStatus, language)}
                </span>
              </span>
            </div>

            {statusResult.instructorReviewNote && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-[#C59B5F] block">
                  {isRtl ? 'ملاحظة الكابتن فهد:' : 'Captain Note:'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {statusResult.instructorReviewNote}
                </p>
              </div>
            )}

            {/* Payment Gate Enforcement */}
            {isPaid ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  {isRtl
                    ? 'تم اعتماد أهليتك وتأكيد الدفع وحجزك بنجاح. نتطلع لرؤيتك في مياه جدة!'
                    : 'Your eligibility and payment are confirmed. See you in Jeddah waters!'}
                </div>
              </div>
            ) : canPay ? (
              <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Unlock className="w-4 h-4" />
                    <span>
                      {isRtl
                        ? 'تمت موافقة الكابتن — الدفع متاح الآن'
                        : 'Captain Approved — Payment Unlocked'}
                    </span>
                  </div>
                  {statusResult.paymentAmount && (
                    <span className="font-mono text-sm font-black text-[#E0BA84]">
                      {statusResult.paymentAmount}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['transfer', 'mada', 'cash'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedPayMethod(method)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer min-h-[40px] ${
                        selectedPayMethod === method
                          ? 'bg-[#C59B5F]/20 border-[#C59B5F] text-[#E0BA84]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {method === 'transfer'
                        ? isRtl
                          ? 'تحويل بنكي'
                          : 'Transfer'
                        : method === 'mada'
                        ? isRtl
                          ? 'مدى / Apple'
                          : 'Mada / Apple'
                        : isRtl
                        ? 'نقداً بالمركز'
                        : 'At Center'}
                    </button>
                  ))}
                </div>

                <a
                  href={paymentWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-gradient-btn w-full py-3 px-4 rounded-xl text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[44px]"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>
                    {isRtl ? 'متابعة الدفع وتأكيد الحجز عبر واتساب' : 'Complete Payment via WhatsApp'}
                  </span>
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    {statusResult.eligibilityStatus === 'rejected'
                      ? isRtl
                        ? 'الدفع مغلق — الطلب غير معتمد'
                        : 'Payment Locked — Request Declined'
                      : isRtl
                      ? 'الدفع مقفول حتى مراجعة وموافقة الكابتن'
                      : 'Payment Locked Pending Captain Approval'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {statusResult.eligibilityStatus === 'missing_requirements'
                    ? isRtl
                      ? 'يرجى استكمال المتطلب أو التواصل مع الكابتن لترتيب المسار التأهيلي أولاً قبل فتح الدفع.'
                      : 'Please complete the missing requirement or coordinate with the Captain before payment opens.'
                    : statusResult.eligibilityStatus === 'rejected'
                    ? isRtl
                      ? 'لا يمكن إتمام الدفع لهذا الطلب. يمكنك التواصل مع الكابتن لمزيد من التوضيح.'
                      : 'Payment cannot proceed for this request. Contact the Captain for details.'
                    : isRtl
                    ? 'يتم مراجعة إجاباتك ومؤهلاتك من قِبل كابتن فهد أولاً، وفور الموافقة النهائية سيُفتح لك خيار الدفع هنا.'
                    : 'Captain Fahad is reviewing your eligibility answers first. Once approved, payment unlocks automatically.'}
                </p>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    isRtl
                      ? `السلام عليكم كابتن فهد، أستفسر عن حالة طلبي رقم ${statusResult.id}.`
                      : `Hello Capt. Fahad, checking on my booking status ${statusResult.id}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'التواصل مع الكابتن عبر واتساب' : 'Message Captain on WhatsApp'}</span>
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C59B5F]" />
          <span>
            {isRtl
              ? 'نظام رواء الفن يمنع أي دفع قبل التحقق من الأهلية وموافقة الكابتن'
              : 'Riwa Alfan blocks payment until eligibility verification & Captain approval'}
          </span>
        </div>
      </div>
    </div>
  );
};
