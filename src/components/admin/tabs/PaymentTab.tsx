import React, { useState } from 'react';
import { 
  CreditCard, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle, 
  Save, 
  CheckCircle2, 
  Smartphone, 
  DollarSign, 
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { PaymobPaymentConfig } from '../../../types/admin';
import { Course } from '../../../data/divingData';

interface PaymentTabProps {
  initialPayment?: PaymobPaymentConfig;
  courses: Course[];
  onUpdatePayment: (partial: Partial<PaymobPaymentConfig>) => void;
  onUpdateCourse: (courseId: string, updated: Partial<Course>) => void;
  showToast: (msg: string) => void;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({
  initialPayment,
  courses,
  onUpdatePayment,
  onUpdateCourse,
  showToast
}) => {
  const { isRtl, language } = useLanguage();

  const [paymentForm, setPaymentForm] = useState<PaymobPaymentConfig>({
    enabled: initialPayment?.enabled ?? true,
    paymentUrl: initialPayment?.paymentUrl || '',
    depositAmount: initialPayment?.depositAmount ?? 500,
    requirePaymentBeforeBooking: initialPayment?.requirePaymentBeforeBooking ?? false,
    paymentInstructionsAr: initialPayment?.paymentInstructionsAr || 'يمكنك تأكيد حجزك بدفع الرسوم أو العربون إلكترونياً وبأمان عبر منصة Paymob الرسمية بواسطة بطاقات مدى، Apple Pay، أو فيزا وماستركارد.',
    paymentInstructionsEn: initialPayment?.paymentInstructionsEn || 'You can secure your booking by paying fees or deposit online via Paymob using Mada, Apple Pay, Visa, or Mastercard.',
    supportMada: initialPayment?.supportMada ?? true,
    supportApplePay: initialPayment?.supportApplePay ?? true,
    supportCards: initialPayment?.supportCards ?? true
  });

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [coursePaymobUrl, setCoursePaymobUrl] = useState<string>('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePayment(paymentForm);
    showToast(isRtl ? 'تم حفظ إعدادات دفع Paymob بنجاح! 💳' : 'Paymob settings saved successfully! 💳');
  };

  const handleSaveCoursePayment = (courseId: string) => {
    onUpdateCourse(courseId, { paymobUrl: coursePaymobUrl.trim() });
    showToast(isRtl ? 'تم تحديث رابط الدفع للدورة!' : 'Course payment link updated!');
    setActiveCourseId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#162E52]/40 to-slate-900 border border-[#C59B5F]/35 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#C59B5F]/15 border border-[#C59B5F]/30 text-[#E0BA84] font-bold text-xs flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#C59B5F]" />
              <span>PAYMOB PAYMENT GATEWAY</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
              {isRtl ? 'مدعوم في السعودية' : 'Saudi Arabia Supported'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
            {isRtl ? 'إعدادات بوابات وروابط الدفع الإلكتروني (Paymob)' : 'Paymob Online Payment Integration'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'اربط موقع رواء الفن بروابط دفع Paymob المباشرة لتحصيل العربون أو رسوم الدورات عبر بطاقات مدى و Apple Pay وفيزا وماستركارد بكل أمان وموثوقية.' 
              : 'Connect Riwa Alfan with Paymob payment links to collect deposits and course fees via Mada, Apple Pay, Visa, and Mastercard.'}
          </p>
        </div>

        {/* Accepted Payment Brands */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5">
            <span className="text-emerald-400 font-black">مدى</span>
            <span className="text-[10px] text-slate-300">mada</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-white" />
            <span>Apple Pay</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-xs">
            <span>VISA / MC</span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveGeneral} className="space-y-6">
        
        {/* Toggle Enable Payment */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {isRtl ? 'تفعيل الدفع الإلكتروني عبر Paymob في الموقع' : 'Enable Paymob Online Payments'}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                paymentForm.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {paymentForm.enabled ? (isRtl ? 'مُفعّل' : 'Active') : (isRtl ? 'معطّل' : 'Disabled')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'عند التفعيل، سيظهر للمتدربين خيار الدفع الإلكتروني المباشر في نافذة الحجز بعد إدخال بياناتهم.' 
                : 'When enabled, trainees will see an instant online payment option during booking.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPaymentForm(p => ({ ...p, enabled: !p.enabled }))}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
              paymentForm.enabled ? 'bg-blue-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                paymentForm.enabled ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')
              }`}
            />
          </button>
        </div>

        {/* General Paymob Payment Link */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C59B5F]" />
              <span>{isRtl ? 'رابط الدفع العام للمركز (Paymob Payment Link):' : 'General Paymob Payment URL:'}</span>
            </label>
            {paymentForm.paymentUrl && (
              <a 
                href={paymentForm.paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E0BA84] hover:underline flex items-center gap-1"
              >
                <span>{isRtl ? 'تجربة الرابط ↗' : 'Test Link ↗'}</span>
              </a>
            )}
          </div>

          <div className="relative">
            <input 
              type="url"
              placeholder="https://accept.paymob.com/standalone?ref=... أو رابط فاتورة Paymob"
              value={paymentForm.paymentUrl}
              onChange={(e) => setPaymentForm(p => ({ ...p, paymentUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:border-[#C59B5F] outline-none font-mono"
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'ألصق هنا رابط الدفع المباشر الذي أنشأته من حسابك في Paymob. سيتم تحويل العميل إليه عند اختيار الدفع الإلكتروني.' 
              : 'Paste here your Paymob payment link. Trainees choosing online payment will be redirected to this secure page.'}
          </p>
        </div>

        {/* Deposit & Booking Behavior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deposit Amount */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'مبلغ العربون الافتراضي للحجز (ر.س):' : 'Default Deposit Amount (SAR):'}</span>
            </label>
            <input 
              type="number"
              min="0"
              step="50"
              value={paymentForm.depositAmount ?? 500}
              onChange={(e) => setPaymentForm(p => ({ ...p, depositAmount: Number(e.target.value) }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono font-bold"
            />
            <span className="text-[11px] text-slate-400 block">
              {isRtl ? 'يظهر للعميل في تفاصيل الحجز (مثال: 500 ر.س عربون تأكيد المقعد).' : 'Displayed to the client in booking summary.'}
            </span>
          </div>

          {/* Payment Requirement Toggle */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                {isRtl ? 'اشتراط الدفع لإتمام الحجز:' : 'Require Payment for Booking:'}
              </label>
              <button
                type="button"
                onClick={() => setPaymentForm(p => ({ ...p, requirePaymentBeforeBooking: !p.requirePaymentBeforeBooking }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  paymentForm.requirePaymentBeforeBooking ? 'bg-amber-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    paymentForm.requirePaymentBeforeBooking ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {paymentForm.requirePaymentBeforeBooking 
                ? (isRtl ? '⚠️ إلزامي: لن يتم تسجيل الحجز إلا بعد إتمام الدفع الإلكتروني عبر الرابط.' : 'Mandatory: booking requires instant payment.')
                : (isRtl ? '✅ مرن (موصى به): يمكن للمتدرب الدفع إلكترونياً أو طلب التنسيق عبر واتساب أولاً.' : 'Flexible (Recommended): trainee can pay or consult via WhatsApp.')}
            </p>
          </div>
        </div>

        {/* Payment Instructions displayed to Trainee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">
              {isRtl ? 'رسالة وتعليمات الدفع للعميل (بالعربية):' : 'Payment Instructions (Arabic):'}
            </label>
            <textarea 
              rows={3}
              value={paymentForm.paymentInstructionsAr}
              onChange={(e) => setPaymentForm(p => ({ ...p, paymentInstructionsAr: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">
              {isRtl ? 'رسالة وتعليمات الدفع للعميل (بالإنجليزية):' : 'Payment Instructions (English):'}
            </label>
            <textarea 
              rows={3}
              value={paymentForm.paymentInstructionsEn}
              onChange={(e) => setPaymentForm(p => ({ ...p, paymentInstructionsEn: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="gold-gradient-btn px-7 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'حفظ إعدادات Paymob' : 'Save Paymob Settings'}</span>
          </button>
        </div>

      </form>

      {/* Step-by-Step Guide: How to Get Paymob Link */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-blue-500/30 space-y-4">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
          <HelpCircle className="w-5 h-5" />
          <span>{isRtl ? 'كيف تستخرج رابط الدفع من منصة Paymob الخاصة بك؟' : 'How to get your Paymob Payment Link:'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center">1</div>
            <h4 className="font-bold text-white">{isRtl ? 'سجل دخولك إلى Paymob' : 'Log in to Paymob'}</h4>
            <p className="text-slate-400 leading-relaxed">
              {isRtl ? 'ادخل على لوحة تحكم Paymob السعودية عبر المتصفح باستخدام بريدك وكلمة المرور.' : 'Open Paymob Dashboard with your merchant account.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-[#C59B5F]/20 text-[#E0BA84] font-bold flex items-center justify-center">2</div>
            <h4 className="font-bold text-white">{isRtl ? 'أنشئ رابط دفع (Payment Link)' : 'Create a Payment Link'}</h4>
            <p className="text-slate-400 leading-relaxed">
              {isRtl ? 'من القائمة الجانبية اختر "Payment Links" ثم "Create Link"، وحدد المبلغ المطلوب (مثلاً 500 ر.س عربون أو سعر دورة كامل).' : 'Go to Payment Links > Create Link, specify the SAR amount.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">3</div>
            <h4 className="font-bold text-white">{isRtl ? 'انسخ الرابط والصقه هنا' : 'Copy and Paste Here'}</h4>
            <p className="text-slate-400 leading-relaxed">
              {isRtl ? 'انسخ الرابط الناتج وضعه في خانة "رابط الدفع العام" أعلاه واضغط حفظ. سيبدأ الموقع في استقبال الدفع فوراً!' : 'Copy the generated URL, paste it into the field above, and click Save.'}
            </p>
          </div>
        </div>
      </div>

      {/* Per-Course Dedicated Payment Links */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C59B5F]" />
            <h3 className="text-base font-bold text-white">
              {isRtl ? 'روابط دفع مخصصة لكل دورة تدريبية (اختياري)' : 'Dedicated Payment Links per Course (Optional)'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {isRtl 
              ? 'إذا أنشأت رابط دفع منفصل لكل دورة في Paymob بمبلغها الكامل (مثلاً: دورة المياه المفتوحة 1,800 ر.س)، يمكنك وضعه هنا لكل دورة على حدة:' 
              : 'If you created specific Paymob links for each course with its exact price, assign them here:'}
          </p>
        </div>

        <div className="divide-y divide-slate-800/80">
          {courses.map((course) => (
            <div key={course.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {course.title[language]}
                  </span>
                  <span className="text-[11px] font-mono text-[#C59B5F] font-bold">
                    {course.price[language]}
                  </span>
                </div>
                {course.paymobUrl ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{course.paymobUrl}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    {isRtl ? 'يستخدم الرابط العام للمركز تلقائياً' : 'Uses general center payment link by default'}
                  </span>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0 flex items-center gap-2">
                {activeCourseId === course.id ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                      type="url"
                      placeholder="https://accept.paymob.com/..."
                      value={coursePaymobUrl}
                      onChange={(e) => setCoursePaymobUrl(e.target.value)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-[#C59B5F] outline-none font-mono min-w-[220px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveCoursePayment(course.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                    >
                      {isRtl ? 'حفظ' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCourseId(null)}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setCoursePaymobUrl(course.paymobUrl || '');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {course.paymobUrl ? (isRtl ? 'تعديل الرابط' : 'Edit Link') : (isRtl ? 'إضافة رابط مخصص 🔗' : 'Add Link 🔗')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
