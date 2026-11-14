import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, Check, Copy, X, MonitorSmartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  isRtl: boolean;
  variant?: 'header' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  isRtl,
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (isInstalled) {
    return null;
  }

  const adminUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/admin`
      : 'https://riwaalfan.com/admin';

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setShowGuideModal(true);
  };

  const handleCopyAdminUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(adminUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          type="button"
          onClick={handleAction}
          className="min-h-[40px] sm:min-h-[36px] flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
          title={
            isRtl
              ? 'تحميل وتثبيت لوحة التحكم على الشاشة الرئيسية'
              : 'Install Admin Dashboard on Home Screen'
          }
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">
            {isInstallable
              ? isRtl
                ? 'تثبيت التطبيق'
                : 'Install App'
              : isRtl
              ? 'إضافة للشاشة'
              : 'Add to Home'}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAction}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>
            {isRtl
              ? 'تحميل لوحة التحكم كتطبيق على الشاشة الرئيسية'
              : 'Install Dashboard App on Home Screen'}
          </span>
        </button>
      )}

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full sm:max-w-lg bg-slate-950 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-[#C59B5F]/40 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/pwa-192x192.png"
                    alt="Riwa Admin"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {isRtl
                      ? 'تثبيت لوحة التحكم على الشاشة الرئيسية'
                      : 'Install Dashboard on Home Screen'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isRtl
                      ? 'تفتح مباشرة في لوحة التحكم مع دعم الإشعارات الفورية'
                      : 'Launches directly into /admin with instant alerts'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="min-h-[36px] min-w-[36px] p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInstallable && (
              <button
                type="button"
                onClick={async () => {
                  const ok = await install();
                  if (ok) setShowGuideModal(false);
                }}
                className="w-full min-h-[46px] py-3 px-4 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C59B5F]/20"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isRtl ? 'تثبيت فوري بنقرة واحدة الآن' : 'Install Immediately'}
                </span>
              </button>
            )}

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              {/* iOS Safari */}
              <div
                className={`p-3.5 rounded-2xl border space-y-2 ${
                  isIOS
                    ? 'bg-blue-950/30 border-blue-500/40'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {isRtl
                      ? 'للآيفون والآيباد (متصفح Safari):'
                      : 'iPhone & iPad (Safari):'}
                  </span>
                </div>
                <ol className="space-y-1.5 list-decimal list-inside text-slate-300">
                  <li className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      {isRtl
                        ? '1. افتح رابط لوحة التحكم في متصفح Safari واضغط زر المشاركة'
                        : '1. Open dashboard URL in Safari and tap Share'}
                    </span>
                    <Share className="w-3.5 h-3.5 text-cyan-400 inline shrink-0" />
                  </li>
                  <li className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      {isRtl
                        ? '2. مرّر للأسفل واختر "إضافة إلى الصفحة الرئيسية"'
                        : '2. Scroll down and tap "Add to Home Screen"'}
                    </span>
                    <PlusSquare className="w-3.5 h-3.5 text-[#E0BA84] inline shrink-0" />
                  </li>
                  <li>
                    {isRtl
                      ? '3. اضغط "إضافة" في الأعلى — وبعد فتح التطبيق من الشاشة الرئيسية يمكنك تفعيل إشعارات الحجوزات.'
                      : '3. Tap Add — open the Home Screen icon to enable push/device booking alerts.'}
                  </li>
                </ol>
              </div>

              {/* Android & Desktop Chrome/Edge */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <MonitorSmartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isRtl
                      ? 'للأندرويد والتابلت والكمبيوتر (Chrome / Edge):'
                      : 'Android, Tablet & PC (Chrome / Edge):'}
                  </span>
                </div>
                <ol className="space-y-1.5 list-decimal list-inside text-slate-300">
                  <li>
                    {isRtl
                      ? 'في الجوال: افتح قائمة المتصفح (⋮) واختر "تثبيت التطبيق" أو "الإضافة إلى الشاشة الرئيسية".'
                      : 'On mobile: open browser menu (⋮) and choose "Install app" or "Add to Home screen".'}
                  </li>
                  <li>
                    {isRtl
                      ? 'في اللابتوب/PC: اضغط أيقونة التثبيت في شريط العنوان بالأعلى لتثبيتها كبرنامج مستقل.'
                      : 'On Desktop/PC: click the Install icon in the address bar to pin as a standalone app.'}
                  </li>
                </ol>
              </div>

              {/* Direct /admin link copy for client handoff */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  {isRtl
                    ? 'رابط لوحة التحكم المباشر (لتسليمه للعميل):'
                    : 'Direct Dashboard Link for Client Handoff:'}
                </span>
                <div className="flex items-center gap-2">
                  <code
                    dir="ltr"
                    className="flex-1 min-w-0 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono truncate select-all"
                  >
                    {adminUrl}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyAdminUrl}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full min-h-[42px] py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
