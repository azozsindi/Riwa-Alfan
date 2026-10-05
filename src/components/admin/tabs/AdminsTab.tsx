import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Plus, Trash2, Mail, Key, AlertCircle, CheckCircle2, UserPlus, Info } from 'lucide-react';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth, BOOTSTRAPPED_ADMIN_EMAIL } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

interface AdminDoc {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt?: string;
}

interface AdminsTabProps {
  showToast: (msg?: string) => void;
}

export const AdminsTab: React.FC<AdminsTabProps> = ({ showToast }) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  
  const [adminsList, setAdminsList] = useState<AdminDoc[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Admin Form
  const [newEmail, setNewEmail] = useState('');
  const [newUid, setNewUid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'admins'));
      const list: AdminDoc[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (data && data.email) {
          list.push({
            uid: d.id,
            email: data.email,
            role: data.role || 'admin',
            createdAt: data.createdAt
          });
        }
      });
      setAdminsList(list);
    } catch (e) {
      console.warn('Could not list admins:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailTrimmed = newEmail.trim().toLowerCase();
    const uidTrimmed = newUid.trim();

    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setFormError(isRtl ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.');
      return;
    }

    if (!uidTrimmed) {
      setFormError(
        isRtl 
          ? 'يرجى إدخال معرف المستخدم في Firebase (UID) للشخص المراد منحه الصلاحية.'
          : 'Please enter the Firebase User ID (UID) of the account.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const newDoc: AdminDoc = {
        uid: uidTrimmed,
        email: emailTrimmed,
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'admins', uidTrimmed), newDoc);
      setNewEmail('');
      setNewUid('');
      await fetchAdmins();
      showToast(isRtl ? 'تمت إضافة حساب المدير بنجاح!' : 'Admin account added successfully!');
    } catch (err: any) {
      console.error('Error adding admin:', err);
      setFormError(err.message || (isRtl ? 'فشلت إضافة المدير.' : 'Failed to add admin.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (uidToDelete: string) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من إلغاء صلاحية هذا المدير؟' : 'Revoke this admin access?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'admins', uidToDelete));
      await fetchAdmins();
      showToast(isRtl ? 'تم إلغاء صلاحية المدير بنجاح.' : 'Admin access revoked.');
    } catch (err: any) {
      console.error('Error revoking admin:', err);
      alert(err.message || 'Error revoking admin');
    }
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>{isRtl ? 'حماية وأمان لوحة التحكم' : 'Security & Access Control'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
          {isRtl ? 'إدارة حسابات المدراء المصرح لهم' : 'Authorized Administrators'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {isRtl 
            ? 'لوحة التحكم محمية بنظام Firebase Authentication وقواعد أمان Firestore. لا يمكن لأي شخص خارج هذه القائمة أو البريد الرئيسي المعتمد الدخول للوحة الإدارة.'
            : 'Dashboard is secured via Firebase Authentication & Firestore Security Rules. Only whitelisted managers can gain access.'}
        </p>
      </div>

      {/* Bootstrapped Superadmin Card */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{BOOTSTRAPPED_ADMIN_EMAIL}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  {isRtl ? 'المدير الرئيسي (Super Admin)' : 'Super Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isRtl ? 'الحساب الأساسي المثبت في قواعد الأمان السحابية والمالك للمشروع.' : 'Root administrator defined in Firestore Security Rules.'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مفعّل دائماً' : 'Always Active'}</span>
          </span>
        </div>
      </div>

      {/* Add New Admin Form */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span>{isRtl ? 'إضافة حساب مدير جديد' : 'Add New Administrator'}</span>
        </h4>

        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? 'البريد الإلكتروني لحساب المدير:' : 'Manager Email:'}</span>
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="fahad@riwaalfan.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? 'معرف المستخدم في Firebase (UID):' : 'Firebase UID:'}</span>
              </label>
              <input
                type="text"
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                placeholder="e.g. 7qX9K3mP1wZ2..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                {isRtl 
                  ? 'يمكن استخراج الـ UID للمستخدم مباشرة من تبويب Authentication في وحدة تحكم Firebase.'
                  : 'UID is available under Authentication > Users in Firebase Console.'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="gold-gradient-btn px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-md shadow-[#C59B5F]/20 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? (isRtl ? 'جارِ الإضافة...' : 'Adding...') : (isRtl ? 'منح صلاحية الإدارة' : 'Grant Admin Access')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Additional Whitelisted Admins List */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'المدراء الإضافيون المسجلون في قاعدة البيانات' : 'Additional Whitelisted Managers'}</span>
        </h4>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
            {isRtl ? 'جارِ التحقق من الحسابات...' : 'Checking accounts...'}
          </div>
        ) : adminsList.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {isRtl ? 'لا يوجد مدراء إضافيون حالياً. الدخول محصور بالمدير الرئيسي فقط.' : 'No additional managers. Access is limited to Super Admin.'}
          </p>
        ) : (
          <div className="divide-y divide-slate-800">
            {adminsList.map((adm) => (
              <div key={adm.uid} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">{adm.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-semibold">
                      {adm.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">UID: {adm.uid}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteAdmin(adm.uid)}
                  className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-500/30 transition-colors cursor-pointer"
                  title={isRtl ? 'إلغاء صلاحية هذا المدير' : 'Revoke Admin'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
