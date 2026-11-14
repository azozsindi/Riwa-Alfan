import React, { useState } from 'react';
import { 
  X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ArrowRight,
  PhoneCall, CheckCircle2, User, Phone, Calendar, MessageSquare,
  ShieldCheck, AlertCircle, Sparkles, Ship, Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    totalCount, 
    totalPrice, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const { language, isRtl } = useLanguage();
  const { config, addBooking } = useSiteConfig();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState<'weekend' | 'weekday' | 'flexible'>('weekend');
  const [notes, setNotes] = useState('');
  const [preferredInstructor, setPreferredInstructor] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastRef, setLastRef] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!isCartOpen) return null;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const whatsappNumber = config.brand.whatsappNumber || '966530549675';

  const validate = () => {
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

  const handleCheckoutWhatsApp = () => {
    if (!validate()) return;

    // 1. Generate Order / Booking Reference
    const scheduleLabel = preferredSchedule === 'weekend' 
      ? (isRtl ? 'عطلة نهاية الأسبوع' : 'Weekend')
      : preferredSchedule === 'weekday'
      ? (isRtl ? 'أيام الأسبوع' : 'Weekdays')
      : (isRtl ? 'مواعيد مرنة' : 'Flexible');

    const itemsSummary = items
      .map((item, idx) => {
        const itemTitle = item.title[language] || item.title.ar;
        const subtotal = item.price * item.quantity;
        return `${idx + 1}. *${itemTitle}*\n   • العدد / المقاعد: ${item.quantity}\n   • السعر الإفرادي: ${item.price.toLocaleString('ar-SA')} ر.س\n   • المجموع: ${subtotal.toLocaleString('ar-SA')} ر.س`;
      })
      .join('\n\n');

    const formattedTotalPrice = `${totalPrice.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${language === 'ar' ? 'ر.س' : 'SAR'}`;

    // 2. Register Booking in Admin System & Firestore
    const refCode = addBooking({
      name: fullName,
      phone: phoneNumber,
      interest: items.map(i => `${i.title[language]} (×${i.quantity})`).join(' + '),
      experience: isRtl ? 'طلب سلة متعدد' : 'Multi-item Cart Order',
      timing: scheduleLabel,
      notes: [
        notes,
        preferredInstructor ? (isRtl ? `الكابتن المفضل: ${preferredInstructor}` : `Preferred Instructor: ${preferredInstructor}`) : '',
        `تفاصيل السلة:\n${itemsSummary}`,
        `الإجمالي: ${formattedTotalPrice}`
      ].filter(Boolean).join(' · '),
      paymentMethod: 'whatsapp',
      paymentAmount: formattedTotalPrice,
      status: 'new'
    });

    setLastRef(refCode);

    // 3. Compose WhatsApp Message
    const whatsAppMessage = isRtl
      ? `🤿 *طلب حجز وتدريب جديد من سلة الموقع - رواء الفن للغوص*
━━━━━━━━━━━━━━━━━━━
👤 *بيانات العميل:*
• الاسم: ${fullName}
• رقم الجوال: ${phoneNumber}
• الموعد المفضل: ${scheduleLabel}
${preferredInstructor ? `• الكابتن المفضل: ${preferredInstructor}\n` : ''}${notes ? `• ملاحظات إضافية: ${notes}\n` : ''}
🛒 *تفاصيل سلة الطلبات (${totalCount} عناصر):*
${itemsSummary}

💰 *الإجمالي الكلي:* *${formattedTotalPrice}*
━━━━━━━━━━━━━━━━━━━
🔖 *رقم الطلب المرجعي:* \`${refCode}\`
📍 *مركز رواء الفن للغوص - جدة*`
      : `🤿 *New Booking Order from Website Cart - Riwa Alfan Diving*
━━━━━━━━━━━━━━━━━━━
👤 *Customer Details:*
• Name: ${fullName}
• Phone: ${phoneNumber}
• Preferred Schedule: ${scheduleLabel}
${preferredInstructor ? `• Preferred Instructor: ${preferredInstructor}\n` : ''}${notes ? `• Notes: ${notes}\n` : ''}
🛒 *Order Items (${totalCount} items):*
${itemsSummary}

💰 *Grand Total:* *${formattedTotalPrice}*
━━━━━━━━━━━━━━━━━━━
🔖 *Reference Code:* \`${refCode}\`
📍 *Riwa Alfan Diving Center - Jeddah*`;

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsAppMessage)}`;

    // 4. Open WhatsApp
    window.open(waUrl, '_blank');

    // 5. Set success state & clear cart
    setIsSuccess(true);
    clearCart();
  };

  const handleResetAfterSuccess = () => {
    setIsSuccess(false);
    setLastRef('');
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex pl-0 sm:pl-10`}>
        <div className="w-screen max-w-md sm:max-w-lg bg-slate-950 border-s border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100 z-10 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#C59B5F]/15 border border-[#C59B5F]/30 text-[#E0BA84] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#C59B5F]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-white font-brand-arabic truncate">
                  {isRtl ? 'سلة الطلبات والحجوزات' : 'Booking & Order Cart'}
                </h2>
                <span className="text-[11px] text-[#C59B5F] font-semibold">
                  {totalCount > 0 
                    ? (isRtl ? `${totalCount} دورات / مقاعد مضافة` : `${totalCount} item(s) selected`)
                    : (isRtl ? 'السلة فارغة' : 'Cart is empty')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {items.length > 0 && !isSuccess && (
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
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                aria-label="إغلاق السلة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* SUCCESS STATE */}
            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white font-brand-arabic">
                    {isRtl ? 'تم إرسال الطلب بنجاح إلى الواتساب!' : 'Order Sent via WhatsApp Successfully!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {isRtl 
                      ? 'تم تحويلك إلى محادثة واتساب الرسمية لكابتن فهد الهويملي مصحوبة بتفاصيل السلة بالكامل، وتم تسجيل حجزك في النظام برقم مرجعي.'
                      : 'You were redirected to Captain Fahad on WhatsApp with your complete cart details.'}
                  </p>
                </div>

                {lastRef && (
                  <div className="inline-block p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
                    <span className="text-[11px] text-slate-400 block">{isRtl ? 'رقم الحجز المرجعي:' : 'Booking Ref:'}</span>
                    <span className="text-lg font-bold text-[#E0BA84]">{lastRef}</span>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleResetAfterSuccess}
                    className="gold-gradient-btn w-full py-3 px-6 rounded-xl text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-[#C59B5F]/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {isRtl ? 'العودة لتصفح الموقع' : 'Back to Website'}
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              /* EMPTY CART STATE */
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
                      ? 'تصفح باقات ودورات الغوص أو رحلات استكشاف حطام السفن بجدة وأضفها إلى السلة بضغطة واحدة.'
                      : 'Browse our scuba courses or Jeddah reef expeditions and add them with one click.'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      const el = document.getElementById('courses');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="gold-gradient-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-950 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <span>{isRtl ? 'استعراض الدورات التدريبية' : 'Explore Courses'}</span>
                    <ArrowIcon className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>
            ) : (
              /* CART WITH ITEMS */
              <div className="space-y-5">
                
                {/* Items List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isRtl ? 'العناصر المضافة بالسلة:' : 'Selected Items:'}
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item) => {
                      const itemTitle = item.title[language] || item.title.ar;
                      const subtotal = item.price * item.quantity;

                      return (
                        <div
                          key={item.id}
                          className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#C59B5F]/40 transition-colors space-y-3 shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-1.5 text-[10px] text-[#C59B5F] font-bold">
                                {item.type === 'course' ? (
                                  <Award className="w-3.5 h-3.5" />
                                ) : (
                                  <Ship className="w-3.5 h-3.5" />
                                )}
                                <span>{item.category || (item.type === 'course' ? 'دورة تدريب PADI' : 'رحلة غوص بحرية')}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-snug">
                                {itemTitle}
                              </h4>
                              {item.subtitle && (
                                <p className="text-[11px] text-slate-400">
                                  {item.subtitle[language] || item.subtitle.ar}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                              title={isRtl ? 'حذف العنصر' : 'Remove item'}
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price and Quantity Adjuster Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                                title={isRtl ? 'تقليل المقاعد' : 'Decrease'}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              
                              <span className="font-mono font-bold text-xs text-white px-2 min-w-[20px] text-center">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                                title={isRtl ? 'زيادة المقاعد' : 'Increase'}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-end">
                              <span className="text-[10px] text-slate-400 block">{isRtl ? 'المجموع' : 'Subtotal'}</span>
                              <span className="font-mono font-extrabold text-[#E0BA84] text-sm">
                                {subtotal > 0 ? `${subtotal.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${language === 'ar' ? 'ر.س' : 'SAR'}` : (item.priceFormatted[language] || item.priceFormatted.ar)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Checkout Form */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2.5">
                    <User className="w-4 h-4 text-[#C59B5F]" />
                    <span>{isRtl ? 'بيانات العميل لإرسال الطلب:' : 'Customer Information:'}</span>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>{isRtl ? 'الاسم الكريم *' : 'Full Name *'}</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      placeholder={isRtl ? 'مثال: عبد العزيز الغامدي' : 'e.g. Alex Smith'}
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px] ${
                        errors.name ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>{isRtl ? 'رقم الجوال (واتساب) *' : 'WhatsApp Phone *'}</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className={`w-full bg-slate-950 border rounded-xl p-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#C59B5F] min-h-[44px] ${
                        errors.phone ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
                  </div>

                  {/* Preferred Timing */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {isRtl ? 'الموعد المفضل للتدريب أو الرحلة:' : 'Preferred Schedule:'}
                    </label>
                    <select
                      value={preferredSchedule}
                      onChange={(e) => setPreferredSchedule(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px]"
                    >
                      <option value="weekend">{isRtl ? 'عطلة نهاية الأسبوع (الجمعة / السبت)' : 'Weekend (Fri/Sat)'}</option>
                      <option value="weekday">{isRtl ? 'أيام الأسبوع (مسائي)' : 'Weekdays (Evenings)'}</option>
                      <option value="flexible">{isRtl ? 'مرن حسب التنسيق مع الكابتن' : 'Flexible'}</option>
                    </select>
                  </div>

                  {/* Preferred Instructor (optional) */}
                  {config.captains && config.captains.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isRtl ? 'الكابتن المفضل (اختياري):' : 'Preferred Instructor (Optional):'}
                      </label>
                      <select
                        value={preferredInstructor}
                        onChange={(e) => setPreferredInstructor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F] min-h-[44px]"
                      >
                        <option value="">{isRtl ? '— أي كابتن متاح في المركز —' : '— Any Available Instructor —'}</option>
                        {config.captains.map(cap => (
                          <option key={cap.id} value={isRtl ? cap.nameAr : (cap.nameEn || cap.nameAr)}>
                            {isRtl ? cap.nameAr : (cap.nameEn || cap.nameAr)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {isRtl ? 'ملاحظات أو استفسارات إضافية:' : 'Additional Notes:'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isRtl ? 'مثال: عدد الأشخاص، مستوى الخبرة، أو متطلبات خاصة...' : 'Any preferences or inquiries...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#C59B5F]"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer with Grand Total & WhatsApp Checkout Button */}
          {items.length > 0 && !isSuccess && (
            <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-slate-900/80 backdrop-blur-md space-y-3">
              {/* Grand Total Row */}
              <div className="flex items-center justify-between text-slate-300">
                <div>
                  <span className="text-xs text-slate-400 block">{isRtl ? 'الإجمالي التقديري:' : 'Grand Total:'}</span>
                  <span className="text-[11px] text-slate-500">
                    {isRtl ? `شامل لـ ${totalCount} عناصر ومقاعد` : `For ${totalCount} item(s)`}
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-xl sm:text-2xl font-black text-[#E0BA84] font-mono">
                    {totalPrice > 0 
                      ? `${totalPrice.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${language === 'ar' ? 'ر.س' : 'SAR'}` 
                      : (isRtl ? 'تحدد مع الكابتن' : 'Contact')}
                  </span>
                </div>
              </div>

              {/* Primary WhatsApp Action Button */}
              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer min-h-[48px]"
              >
                <PhoneCall className="w-5 h-5 text-slate-950 shrink-0" />
                <span>{isRtl ? 'إرسال الطلب بالكامل عبر واتساب 💬' : 'Send Order via WhatsApp 💬'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59B5F] shrink-0" />
                <span>{isRtl ? 'حجز مباشر وموثق بدون خصم فوري · يتم التنسيق وتأكيد المواعيد عبر واتساب' : 'Direct booking with no upfront deduction'}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
