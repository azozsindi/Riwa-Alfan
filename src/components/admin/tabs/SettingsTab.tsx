import React, { useState } from 'react';
import { Settings, Download, RotateCcw, AlertTriangle, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth, BOOTSTRAPPED_ADMIN_EMAIL } from '../../../context/AuthContext';

interface SettingsTabProps {
  onExportBackupJson: () => string;
  onResetToDefaults: () => void;
  showToast: (msg?: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  onExportBackupJson,
  onResetToDefaults,
  showToast,
}) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="pb-4 border-b border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          {isRtl ? 'إعدادات الأمان والنسخ الاحتياطي' : 'Security & Backup Settings'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isRtl 
            ? 'حالة أمان لوحة التحكم، المصادقة السحابية، وتصدير نسخة احتياطية من كافة البيانات.'
            : 'Dashboard security status, cloud authentication, and full data backups.'}
        </p>
      </div>

      {/* Cloud Security & Auth Status */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isRtl ? 'نظام الحماية والمصادقة السحابية (Firebase Zero-Trust)' : 'Firebase Zero-Trust Security'}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                {isRtl ? 'مفعّل ومحمي بقواعد Firestore Security Rules السحابية' : 'Enforced by Firestore Cloud Security Rules'}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            {isRtl ? 'محمي 100%' : '100% Protected'}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{isRtl ? 'المدير الرئيسي المصرح له:' : 'Root Super Admin:'}</span>
            <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              {BOOTSTRAPPED_ADMIN_EMAIL}
            </span>
          </div>
          {user && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isRtl ? 'الحساب المسجل حالياً:' : 'Currently Signed In:'}</span>
              <span className="font-mono text-cyan-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {user.email}
              </span>
            </div>
          )}
        </div>
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
              showToast(isRtl ? 'تم تنزيل النسخة الاحتياطية بنجاح!' : 'Backup downloaded successfully!');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'تنزيل ملف النسخة الاحتياطية (JSON)' : 'Download Backup File'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          {isRtl 
            ? 'يتضمن الملف كافة إعدادات الهوية، الدورات، الأسعار، العروض، المواقع، والأسئلة الشائعة.' 
            : 'Contains complete snapshot of brand data, courses, pricing, sites, and FAQs.'}
        </p>
      </div>

      {/* Reset to Defaults */}
      <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/30 space-y-3">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold">
            {isRtl ? 'منطقة الخطر: استعادة البيانات الافتراضية' : 'Danger Zone: Reset Defaults'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isRtl 
            ? 'سيؤدي هذا الإجراء إلى مسح كافة التعديلات المخصصة وإعادة الموقع لحالته الأصلية الأولى.' 
            : 'This will erase all custom configurations and restore the factory default settings.'}
        </p>

        {!isResetConfirmOpen ? (
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استعادة الإعدادات الأصلية...' : 'Reset to Defaults...'}</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 space-y-3 animate-in fade-in">
            <span className="text-xs font-bold text-red-200 block">
              {isRtl ? 'هل أنت متأكد تماماً؟ لا يمكن التراجع عن هذا الإجراء!' : 'Are you completely sure? This action cannot be undone!'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onResetToDefaults();
                  setIsResetConfirmOpen(false);
                  showToast(isRtl ? 'تمت استعادة الإعدادات الأصلية للمركز بنجاح' : 'Reset completed');
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                {isRtl ? 'نعم، استعد البيانات' : 'Yes, Reset Now'}
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
