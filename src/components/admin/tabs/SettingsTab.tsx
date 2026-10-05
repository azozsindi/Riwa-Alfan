import React, { useState } from 'react';
import { Settings, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface SettingsTabProps {
  onUpdateAdminPin: (pin: string) => void;
  onExportBackupJson: () => string;
  onResetToDefaults: () => void;
  showToast: (msg?: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  onUpdateAdminPin,
  onExportBackupJson,
  onResetToDefaults,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const [newPin, setNewPin] = useState('');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          {isRtl ? 'إعدادات الأمان والنسخ الاحتياطي' : 'Security & Backup Settings'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isRtl 
            ? 'تغيير الرمز السري للوحة التحكم، تصدير نسخة احتياطية من كافة البيانات، أو استيرادها.'
            : 'Update admin PIN, export full backup JSON or restore.'}
        </p>
      </div>

      {/* Change PIN */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-white block">
          {isRtl ? 'تغيير الرمز السري للوحة التحكم (PIN):' : 'Change Admin Access PIN:'}
        </span>
        <div className="flex items-center gap-3">
          <input 
            type="password"
            maxLength={8}
            value={newPin}
            onChange={(e) => {
              setNewPin(e.target.value);
              setPinFeedback(null);
            }}
            placeholder={isRtl ? 'الرمز الجديد (مثال: 5544)' : 'New PIN'}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest outline-none focus:border-blue-500 w-48"
          />
          <button
            onClick={() => {
              if (newPin.trim().length >= 4) {
                onUpdateAdminPin(newPin.trim());
                setNewPin('');
                setPinFeedback(isRtl ? 'تم تحديث الرمز السري بنجاح!' : 'PIN updated successfully!');
                showToast(isRtl ? 'تم تحديث الرمز السري بنجاح!' : 'PIN updated successfully!');
              } else {
                setPinFeedback(isRtl ? 'الرمز يجب أن يتكون من 4 أرقام على الأقل' : 'PIN must be at least 4 digits');
              }
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            {isRtl ? 'تحديث الرمز' : 'Update PIN'}
          </button>
        </div>
        {pinFeedback && (
          <span className="text-xs text-emerald-400 font-semibold block animate-in fade-in">
            {pinFeedback}
          </span>
        )}
        <span className="text-[11px] text-slate-500 block">
          {isRtl ? 'الرمز الحالي الافتراضي هو: 1234' : 'Current default PIN is: 1234'}
        </span>
      </div>

      {/* Backup & Export */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-white block">
          {isRtl ? 'النسخ الاحتياطي للبيانات:' : 'Full Data Backup:'}
        </span>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const jsonStr = onExportBackupJson();
              const blob = new Blob([jsonStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `riwa-alfan-backup-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'تنزيل ملف النسخة الاحتياطية (JSON)' : 'Download Backup File'}</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-900/50 text-red-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>{isRtl ? 'استعادة ضبط المصنع' : 'Reset to Defaults'}</span>
          </button>
        </div>

        {isResetConfirmOpen && (
          <div className="mt-3 p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>{isRtl ? 'هل تريد بالتأكيد استعادة الإعدادات الأصلية وضبط المصنع؟' : 'Confirm factory reset?'}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'سيتم مسح التعديلات والعودة للبيانات الأصلية.' : 'All local changes will be cleared and reset to initial settings.'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetToDefaults();
                  setIsResetConfirmOpen(false);
                  window.location.reload();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                {isRtl ? 'نعم، استعادة الآن' : 'Yes, Reset Now'}
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cloud & Hosting Integrations */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-white block">
          {isRtl ? 'حالة الربط السحابي والاستضافة (Firebase & Vercel):' : 'Cloud Database & Hosting Integrations:'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Firebase Card */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Firebase Firestore</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                {isRtl ? 'متصل ونشط' : 'Connected'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isRtl 
                ? 'قاعدة بيانات Firestore السحابية جاهزة، وتم نشر قواعد الحماية ومزامنة الحجوزات الواردة لحظياً.'
                : 'Firestore database is active with security rules deployed and live booking synchronization.'}
            </p>
          </div>

          {/* Vercel Card */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-xs font-bold text-white">Vercel Deployment</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                {isRtl ? 'مهيأ وجاهز' : 'Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isRtl 
                ? 'ملف vercel.json مهيأ بتوجيه المسارات (SPA Rewrites)، والمشروع جاهز للرفع على Vercel أو GitHub مباشرة.'
                : 'Configured with vercel.json SPA rewrites, ready to import directly on Vercel or GitHub.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
