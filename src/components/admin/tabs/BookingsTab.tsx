import React, { useState } from 'react';
import { Inbox, MessageCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { Booking } from '../../../types/admin';

interface BookingsTabProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: any) => void;
  onDeleteBooking: (id: string) => void;
  showToast: (msg?: string) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [bookingFilter, setBookingFilter] = useState<'all' | 'new' | 'paid' | 'contacted' | 'confirmed'>('all');

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    if (bookingFilter === 'paid') return b.status === 'paid' || b.paymentMethod === 'paymob';
    return b.status === bookingFilter;
  });

  const newBookingsCount = bookings.filter(b => b.status === 'new').length;
  const paidBookingsCount = bookings.filter(b => b.status === 'paid' || b.paymentMethod === 'paymob').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-400" />
            {isRtl ? 'صندوق طلبات الحجز والاستشارات الواردة' : 'Incoming Bookings & Consultation Inbox'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRtl 
              ? 'متابعة المتدربين المسجلين عبر الموقع والتواصل المباشر معهم عبر الواتساب.'
              : 'Review registered students and message them directly on WhatsApp.'}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setBookingFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              bookingFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? `الكل (${bookings.length})` : `All (${bookings.length})`}
          </button>
          <button
            onClick={() => setBookingFilter('new')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              bookingFilter === 'new' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? `جديد (${newBookingsCount})` : `New (${newBookingsCount})`}
          </button>
          <button
            onClick={() => setBookingFilter('paid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              bookingFilter === 'paid' ? 'gold-gradient-btn text-slate-950 font-bold' : 'text-[#E0BA84] hover:text-white'
            }`}
          >
            <span>💳 {isRtl ? `مدفوع (${paidBookingsCount})` : `Paid (${paidBookingsCount})`}</span>
          </button>
          <button
            onClick={() => setBookingFilter('contacted')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              bookingFilter === 'contacted' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'تم التواصل' : 'Contacted'}
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800/80">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <span className="text-sm font-semibold text-slate-300 block">
            {isRtl ? 'لا توجد طلبات في هذا القسم حالياً' : 'No bookings in this filter'}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {isRtl ? 'تصل هنا كافة الحجوزات المقدمة من خلال نافذة الحجز بالموقع.' : 'Incoming web bookings will appear here.'}
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const cleanPhone = b.phone.replace(/[^0-9]/g, '');
            const waLink = `https://wa.me/966${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
              isRtl 
                ? `أهلاً بك يا ${b.name}، معك كابتن فهد من مركز رواء الفن للغوص بخصوص طلبك المسجل (${b.interest}) رقم ${b.id}. يسعدني ترتيب مواعيد التدريب معك.`
                : `Hello ${b.name}, this is Capt. Fahad from Riwa Alfan Dive Center regarding your inquiry (${b.interest}) ref ${b.id}.`
            )}`;

            return (
              <div 
                key={b.id} 
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900/60">
                      {b.id}
                    </span>
                    <span className="font-bold text-white text-sm">{b.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({b.phone})</span>
                    
                    {/* Status badge */}
                    <select
                      value={b.status}
                      onChange={(e) => onUpdateStatus(b.id, e.target.value as any)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${
                        b.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                          : b.status === 'pending_payment'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : b.status === 'new' 
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : b.status === 'contacted'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          : b.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="new" className="bg-slate-900 text-white">{isRtl ? 'طلب جديد' : 'New'}</option>
                      <option value="pending_payment" className="bg-slate-900 text-amber-300">⏳ {isRtl ? 'بانتظار الدفع (Paymob)' : 'Pending Paymob'}</option>
                      <option value="paid" className="bg-slate-900 text-emerald-400">💳 {isRtl ? 'مدفوع مؤكد (Paymob)' : 'Paid (Paymob)'}</option>
                      <option value="contacted" className="bg-slate-900 text-white">{isRtl ? 'تم التواصل' : 'Contacted'}</option>
                      <option value="confirmed" className="bg-slate-900 text-white">{isRtl ? 'تم التأكيد' : 'Confirmed'}</option>
                      <option value="completed" className="bg-slate-900 text-white">{isRtl ? 'مكتمل' : 'Completed'}</option>
                    </select>

                    {b.paymentMethod === 'paymob' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#C59B5F]/15 text-[#E0BA84] border border-[#C59B5F]/30">
                        Paymob 💳
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                    <span><strong className="text-slate-400">{isRtl ? 'البرنامج:' : 'Interest:'}</strong> {b.interest}</span>
                    <span><strong className="text-slate-400">{isRtl ? 'الخبرة:' : 'Experience:'}</strong> {b.experience}</span>
                    <span><strong className="text-slate-400">{isRtl ? 'الوقت:' : 'Timing:'}</strong> {b.timing}</span>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                      💬 {b.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'مراسلة واتساب' : 'WhatsApp'}</span>
                  </a>

                  <button
                    onClick={() => {
                      if (window.confirm(isRtl ? 'حذف هذا الحجز؟' : 'Delete this booking?')) {
                        onDeleteBooking(b.id);
                        showToast();
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
