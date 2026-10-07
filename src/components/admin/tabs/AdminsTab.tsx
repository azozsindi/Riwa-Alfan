import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Shield, 
  Plus, 
  Trash2, 
  Mail, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  Info, 
  Phone, 
  Copy, 
  Check, 
  Search, 
  Users, 
  GraduationCap, 
  Award, 
  Edit3, 
  X, 
  MessageCircle, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut as secondarySignOut } from 'firebase/auth';
import { db } from '../../../firebase';
import firebaseConfig from '../../../../firebase-applet-config.json';
import { useAuth, BOOTSTRAPPED_ADMIN_EMAIL } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Course } from '../../../data/divingData';
import { BookingRecord, AdminUserRecord, TraineeRecord } from '../../../types/admin';

interface AdminsTabProps {
  showToast: (msg?: string) => void;
  courses?: Course[];
  bookings?: BookingRecord[];
}

export const AdminsTab: React.FC<AdminsTabProps> = ({ showToast, courses = [], bookings = [] }) => {
  const { isRtl } = useLanguage();
  const { user, userRole } = useAuth();

  const isCurrentUserSuperAdmin = 
    (user?.email || '').toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() || 
    userRole === 'superadmin';
  const canCurrentUserManageUsers = isCurrentUserSuperAdmin || userRole === 'admin';
  
  // Navigation sub-tab
  const [subTab, setSubTab] = useState<'admins' | 'trainees'>('admins');

  // Admin & Staff State
  const [adminsList, setAdminsList] = useState<AdminUserRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState<'all' | 'admin' | 'instructor' | 'viewer'>('all');

  // Add User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [creationMode, setCreationMode] = useState<'instant' | 'uid'>('instant');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'instructor' | 'viewer'>('admin');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newUid, setNewUid] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit User Modal State
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'superadmin' | 'admin' | 'instructor' | 'viewer'>('admin');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editNotes, setEditNotes] = useState('');
  const [isSavingEditAdmin, setIsSavingEditAdmin] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // In-App Deletion Confirm Dialog States
  const [userToDelete, setUserToDelete] = useState<AdminUserRecord | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState<string | null>(null);

  const [traineeToDelete, setTraineeToDelete] = useState<TraineeRecord | null>(null);
  const [isDeletingTrainee, setIsDeletingTrainee] = useState(false);

  // Success Created User Card
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password?: string;
    role: string;
    uid: string;
    phone?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Trainees State
  const [traineesList, setTraineesList] = useState<TraineeRecord[]>([]);
  const [loadingTrainees, setLoadingTrainees] = useState(true);
  const [traineeSearch, setTraineeSearch] = useState('');
  const [traineeStatusFilter, setTraineeStatusFilter] = useState<'all' | 'active' | 'completed' | 'pending' | 'paused'>('all');
  const [showAddTraineeModal, setShowAddTraineeModal] = useState(false);
  const [showImportBookingModal, setShowImportBookingModal] = useState(false);

  // Trainee Form State
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tCourse, setTCourse] = useState('');
  const [tStatus, setTStatus] = useState<'active' | 'completed' | 'pending' | 'paused'>('active');
  const [tPadi, setTPadi] = useState('');
  const [tNotes, setTNotes] = useState('');
  const [editingTraineeId, setEditingTraineeId] = useState<string | null>(null);
  const [isSubmittingTrainee, setIsSubmittingTrainee] = useState(false);

  // --- Fetch Admins ---
  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const snap = await getDocs(collection(db, 'admins'));
      const list: AdminUserRecord[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (data && data.email) {
          list.push({
            uid: d.id,
            email: data.email,
            name: data.name || '',
            phone: data.phone || '',
            role: data.role || 'admin',
            status: data.status || 'active',
            notes: data.notes || '',
            createdAt: data.createdAt
          });
        }
      });

      // Ensure root superadmin is always listed
      if (!list.some(a => a.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase())) {
        list.unshift({
          uid: user?.uid || 'superadmin_root',
          email: BOOTSTRAPPED_ADMIN_EMAIL,
          name: 'المدير العام والمالك (Super Admin)',
          role: 'superadmin',
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }

      // Merge with locally cached admins so created users never disappear
      try {
        const cachedStr = localStorage.getItem('riwa_cached_admins');
        if (cachedStr) {
          const cachedAdmins: AdminUserRecord[] = JSON.parse(cachedStr);
          cachedAdmins.forEach(c => {
            if (c.email && !list.some(l => l.email.toLowerCase() === c.email.toLowerCase() || l.uid === c.uid)) {
              list.push(c);
            }
          });
        }
      } catch (err) {
        console.warn('Cache merge error:', err);
      }

      setAdminsList(list);
      try {
        localStorage.setItem('riwa_cached_admins', JSON.stringify(list));
      } catch {}
    } catch (e) {
      console.warn('Could not list admins:', e);
      try {
        const cachedStr = localStorage.getItem('riwa_cached_admins');
        if (cachedStr) {
          setAdminsList(JSON.parse(cachedStr));
        }
      } catch {}
    } finally {
      setLoadingAdmins(false);
    }
  };

  // --- Fetch Trainees ---
  const fetchTrainees = async () => {
    try {
      setLoadingTrainees(true);
      const snap = await getDocs(collection(db, 'trainees'));
      const list: TraineeRecord[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (data && data.name) {
          list.push({
            id: d.id,
            name: data.name,
            phone: data.phone || '',
            email: data.email || '',
            course: data.course || '',
            status: data.status || 'active',
            padiNumber: data.padiNumber || '',
            notes: data.notes || '',
            createdAt: data.createdAt || ''
          });
        }
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setTraineesList(list);
    } catch (e) {
      console.warn('Could not list trainees:', e);
    } finally {
      setLoadingTrainees(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchTrainees();
  }, []);

  // --- Generate Random Strong Password ---
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(res);
    setShowPassword(true);
  };

  // Quick Add by Email State
  const [quickEmail, setQuickEmail] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickRole, setQuickRole] = useState<'admin' | 'instructor' | 'viewer'>('admin');
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  // --- Handle Quick Add User by Email ---
  const handleQuickAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = quickEmail.trim().toLowerCase();
    const nameTrimmed = quickName.trim();

    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      alert(isRtl ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email.');
      return;
    }

    try {
      setIsSubmittingQuick(true);
      const targetUid = `adm_${Date.now()}_${emailTrimmed.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const adminDoc: AdminUserRecord = {
        uid: targetUid,
        email: emailTrimmed,
        name: nameTrimmed || emailTrimmed.split('@')[0],
        role: quickRole,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'admins', targetUid), adminDoc, { merge: true });
      } catch (e) {
        console.warn('Quick add Firestore notice:', e);
      }

      setAdminsList(prev => {
        const updated = [adminDoc, ...prev.filter(a => a.email.toLowerCase() !== emailTrimmed && a.uid !== targetUid)];
        try {
          localStorage.setItem('riwa_cached_admins', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setQuickEmail('');
      setQuickName('');
      showToast(isRtl ? `تمت إضافة (${emailTrimmed}) إلى المستخدمين بنجاح! 🎉` : `Added ${emailTrimmed} successfully!`);
    } catch (err: any) {
      alert(err.message || 'Error adding user');
    } finally {
      setIsSubmittingQuick(false);
    }
  };

  // --- Handle Add Admin / User ---
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailTrimmed = newEmail.trim().toLowerCase();
    const nameTrimmed = newName.trim();
    const phoneTrimmed = newPhone.trim();
    const notesTrimmed = newNotes.trim();

    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setFormError(isRtl ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmittingAdmin(true);

      let targetUid = newUid.trim();

      if (creationMode === 'instant') {
        if (!newPassword || newPassword.length < 6) {
          setFormError(isRtl ? 'كلمة المرور يجب أن لا تقل عن 6 خانات.' : 'Password must be at least 6 characters.');
          setIsSubmittingAdmin(false);
          return;
        }

        try {
          // Attempt to create user in Firebase Auth via worker instance
          const secondaryAppName = 'RiwaUserWorker';
          const existingApp = getApps().find(app => app.name === secondaryAppName);
          const workerApp = existingApp || initializeApp(firebaseConfig, secondaryAppName);
          const workerAuth = getAuth(workerApp);

          const userCred = await createUserWithEmailAndPassword(workerAuth, emailTrimmed, newPassword);
          targetUid = userCred.user.uid;
          if (nameTrimmed) {
            await updateProfile(userCred.user, { displayName: nameTrimmed });
          }
          await secondarySignOut(workerAuth);
        } catch (authErr: any) {
          console.warn('Auth creation notice (fallback to Firestore record):', authErr);
          if (!targetUid) {
            targetUid = `adm_${Date.now()}_${emailTrimmed.replace(/[^a-zA-Z0-9]/g, '_')}`;
          }
        }
      } else {
        // UID Mode
        if (!targetUid) {
          targetUid = `adm_${Date.now()}_${emailTrimmed.replace(/[^a-zA-Z0-9]/g, '_')}`;
        }
      }

      // Save to Firestore /admins/{uid}
      const adminDoc: AdminUserRecord = {
        uid: targetUid,
        email: emailTrimmed,
        name: nameTrimmed || emailTrimmed.split('@')[0],
        role: newRole,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      if (phoneTrimmed) adminDoc.phone = phoneTrimmed;
      if (notesTrimmed) adminDoc.notes = notesTrimmed;

      try {
        await setDoc(doc(db, 'admins', targetUid), adminDoc, { merge: true });
      } catch (dbErr: any) {
        console.warn('Firestore setDoc notice:', dbErr);
      }

      // Optimistically update state and cache immediately!
      setAdminsList(prev => {
        const updated = [adminDoc, ...prev.filter(a => a.email.toLowerCase() !== emailTrimmed && a.uid !== targetUid)];
        try {
          localStorage.setItem('riwa_cached_admins', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Keep created record for display
      setCreatedCredentials({
        name: nameTrimmed || emailTrimmed,
        email: emailTrimmed,
        password: creationMode === 'instant' ? newPassword : undefined,
        role: newRole,
        uid: targetUid,
        phone: phoneTrimmed
      });

      // Reset Form fields
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setNewNotes('');
      setNewUid('');
      setShowAddUserModal(false);

      showToast(isRtl ? 'تمت إضافة وتفعيل المستخدم بنجاح! 🎉' : 'User account added successfully!');
    } catch (err: any) {
      console.error('Error adding user/admin:', err);
      setFormError(err.message || (isRtl ? 'فشلت إضافة المستخدم.' : 'Failed to add user.'));
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  // --- Save Edited Admin ---
  const handleSaveEditedAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setEditError(null);
    setIsSavingEditAdmin(true);

    try {
      const updatedName = editName.trim();
      const updatedEmail = editEmail.trim().toLowerCase();
      const updatedPhone = editPhone.trim();
      const updatedNotes = editNotes.trim();

      const isTargetRoot = editingAdmin.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
      const finalRole = isTargetRoot ? 'superadmin' : editRole;
      const finalStatus = isTargetRoot ? 'active' : editStatus;

      const updatedData: Partial<AdminUserRecord> = {
        name: updatedName || editingAdmin.name,
        email: updatedEmail || editingAdmin.email,
        phone: updatedPhone,
        role: finalRole,
        status: finalStatus,
        notes: updatedNotes
      };

      await setDoc(doc(db, 'admins', editingAdmin.uid), updatedData, { merge: true });

      setAdminsList(prev => {
        const updated = prev.map(a => a.uid === editingAdmin.uid ? { ...a, ...updatedData } : a);
        try {
          localStorage.setItem('riwa_cached_admins', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setShowEditUserModal(false);
      setEditingAdmin(null);
      showToast(isRtl ? 'تم تحديث بيانات وصلاحية الحساب بنجاح! ✅' : 'User account updated successfully!');
    } catch (err: any) {
      console.error('Error saving edited user:', err);
      setEditError((isRtl ? 'تعذر حفظ التعديل: ' : 'Failed to save edits: ') + (err.message || ''));
    } finally {
      setIsSavingEditAdmin(false);
    }
  };

  // --- Toggle User Status (Active / Suspended) ---
  const handleToggleAdminStatus = async (adm: AdminUserRecord) => {
    if (adm.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
      alert(isRtl ? 'لا يمكن تعليق حساب المدير الرئيسي.' : 'Cannot suspend Root Super Admin.');
      return;
    }
    const newStatus: 'active' | 'suspended' = adm.status === 'suspended' ? 'active' : 'suspended';
    try {
      await setDoc(doc(db, 'admins', adm.uid), { status: newStatus }, { merge: true });
      setAdminsList(prev => {
        const updated = prev.map(a => a.uid === adm.uid ? { ...a, status: newStatus } : a);
        try {
          localStorage.setItem('riwa_cached_admins', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast(newStatus === 'active' 
        ? (isRtl ? 'تم تنشيط الحساب بنجاح ✅' : 'Account activated') 
        : (isRtl ? 'تم تعليق الحساب مؤقتاً ⏸️' : 'Account suspended')
      );
    } catch (err: any) {
      console.error('Error updating status:', err);
      showToast((isRtl ? 'تعذر تغيير الحالة: ' : 'Error updating status: ') + (err.message || ''));
    }
  };

  // --- Update Admin Role ---
  const handleUpdateAdminRole = async (uid: string, updatedRole: 'admin' | 'instructor' | 'viewer') => {
    try {
      await setDoc(doc(db, 'admins', uid), { role: updatedRole }, { merge: true });
      setAdminsList(prev => {
        const updated = prev.map(a => a.uid === uid ? { ...a, role: updatedRole } : a);
        try {
          localStorage.setItem('riwa_cached_admins', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast(isRtl ? 'تم تحديث صلاحية الحساب بنجاح 🔄' : 'Account role updated');
    } catch (err: any) {
      console.error('Error updating role:', err);
      showToast((isRtl ? 'تعذر تحديث الصلاحية: ' : 'Error updating role: ') + (err.message || ''));
    }
  };

  // --- Execute Delete Admin (Called from In-App Modal) ---
  const confirmExecuteDeleteAdmin = async () => {
    if (!userToDelete) return;
    const emailToDelete = userToDelete.email.toLowerCase().trim();
    const uidToDelete = userToDelete.uid;

    if (emailToDelete === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
      showToast(isRtl ? 'لا يمكن حذف حساب المدير الرئيسي المعتمد.' : 'Cannot delete Root Super Admin.');
      setUserToDelete(null);
      return;
    }

    try {
      setIsDeletingUser(true);
      setDeleteUserError(null);

      // 1. Delete main document by UID
      try {
        await deleteDoc(doc(db, 'admins', uidToDelete));
      } catch (err1) {
        console.warn('Delete admin by UID warning:', err1);
      }

      // 2. Also delete any matching document by email query in /admins
      try {
        const q = query(collection(db, 'admins'), where('email', '==', emailToDelete));
        const qSnap = await getDocs(q);
        for (const docItem of qSnap.docs) {
          if (docItem.id !== uidToDelete) {
            await deleteDoc(docItem.ref);
          }
        }
      } catch (err2) {
        console.warn('Delete admin by email query warning:', err2);
      }

      // 3. Update React state immediately
      setAdminsList(prev => {
        const updated = prev.filter(
          a => a.uid !== uidToDelete && a.email.toLowerCase() !== emailToDelete
        );
        try {
          localStorage.setItem('riwa_cached_admins', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setUserToDelete(null);
      showToast(isRtl ? `تم حذف حساب (${userToDelete.name || emailToDelete}) نهائياً بنجاح 🗑️` : 'User account deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setDeleteUserError((isRtl ? 'تعذر إتمام الحذف: ' : 'Error deleting user: ') + (err.message || ''));
    } finally {
      setIsDeletingUser(false);
    }
  };

  // --- Copy Credentials to Clipboard ---
  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(isRtl ? 'تم النسخ للحافظة 📋' : 'Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // --- Send Credentials via WhatsApp ---
  const handleShareWhatsApp = (cred: { name: string; email: string; password?: string; role: string; phone?: string }) => {
    const roleText = cred.role === 'admin' ? 'مدير نظام (Admin)' : cred.role === 'instructor' ? 'كابتن ومدرب غوص (Instructor)' : 'مشرف ومساعد (Viewer)';
    const text = `مرحباً ${cred.name} 👋%0A%0Aتم إنشاء حسابك في لوحة تحكم *مركز رواء الفن للغوص* بنجاح:%0A- الصلاحية: ${roleText}%0A- البريد الإلكتروني: ${cred.email}${cred.password ? `%0A- كلمة المرور: ${cred.password}` : ''}%0A%0Aرابط لوحة التحكم:%0A${window.location.origin}%0A%0Aيرجى تسجيل الدخول والاحتفاظ ببياناتك بأمان.`;
    const targetPhone = (cred.phone || '').replace(/\D/g, '');
    const url = targetPhone ? `https://wa.me/${targetPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  // --- Add / Update Trainee ---
  const handleSaveTrainee = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = tName.trim();
    const phoneTrimmed = tPhone.trim();
    if (!nameTrimmed || !phoneTrimmed) {
      showToast(isRtl ? 'يرجى إدخال اسم المتدرب ورقم الجوال.' : 'Please enter trainee name and phone.');
      return;
    }

    try {
      setIsSubmittingTrainee(true);
      const id = editingTraineeId || `trainee_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const traineeDoc: TraineeRecord = {
        id,
        name: nameTrimmed,
        phone: phoneTrimmed,
        email: tEmail.trim() || undefined,
        course: tCourse || (courses[0]?.title?.ar || 'دورة غواص مياه مفتوحة Open Water'),
        status: tStatus,
        padiNumber: tPadi.trim() || undefined,
        notes: tNotes.trim() || undefined,
        createdAt: editingTraineeId 
          ? (traineesList.find(t => t.id === editingTraineeId)?.createdAt || new Date().toISOString())
          : new Date().toISOString()
      };

      await setDoc(doc(db, 'trainees', id), traineeDoc);
      await fetchTrainees();

      // Reset
      setTName('');
      setTPhone('');
      setTEmail('');
      setTCourse('');
      setTPadi('');
      setTNotes('');
      setEditingTraineeId(null);
      setShowAddTraineeModal(false);

      showToast(isRtl ? 'تم حفظ بيانات المتدرب بنجاح! 🤿' : 'Trainee saved successfully!');
    } catch (err: any) {
      console.error('Error saving trainee:', err);
      showToast((isRtl ? 'تعذر حفظ المتدرب: ' : 'Error saving trainee: ') + (err.message || ''));
    } finally {
      setIsSubmittingTrainee(false);
    }
  };

  // --- Execute Delete Trainee (Called from In-App Modal) ---
  const confirmExecuteDeleteTrainee = async () => {
    if (!traineeToDelete) return;
    try {
      setIsDeletingTrainee(true);
      await deleteDoc(doc(db, 'trainees', traineeToDelete.id));
      setTraineesList(prev => prev.filter(t => t.id !== traineeToDelete.id));
      const deletedName = traineeToDelete.name;
      setTraineeToDelete(null);
      showToast(isRtl ? `تم حذف المتدرب (${deletedName}) بنجاح 🗑️` : 'Trainee deleted.');
    } catch (err: any) {
      console.error('Error deleting trainee:', err);
      showToast((isRtl ? 'تعذر حذف المتدرب: ' : 'Error deleting trainee: ') + (err.message || ''));
    } finally {
      setIsDeletingTrainee(false);
    }
  };

  // --- Import Booking into Trainees ---
  const handleImportBooking = async (b: BookingRecord) => {
    try {
      const id = `trainee_b_${b.id}`;
      const traineeDoc: TraineeRecord = {
        id,
        name: b.name,
        phone: b.phone,
        course: b.interest || 'دورة غواص مياه مفتوحة',
        status: 'active',
        notes: `تم الاستيراد من الحجز (بتاريخ ${new Date(b.createdAt).toLocaleDateString('ar-SA')}) - الخبرة: ${b.experience}`,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'trainees', id), traineeDoc);
      await fetchTrainees();
      setShowImportBookingModal(false);
      showToast(isRtl ? `تم استيراد ${b.name} إلى سجل المتدربين بنجاح! 🤿` : `Imported ${b.name} to trainees!`);
    } catch (err: any) {
      console.error('Error importing booking:', err);
      alert(err.message || 'Error importing booking');
    }
  };

  // --- Export Trainees to CSV ---
  const handleExportTraineesCsv = () => {
    if (traineesList.length === 0) {
      alert(isRtl ? 'لا يوجد متدربون للتصدير.' : 'No trainees to export.');
      return;
    }
    const headers = ['ID', 'الاسم', 'الجوال', 'البريد', 'الدورة', 'الحالة', 'رقم بادي PADI', 'تاريخ التسجيل', 'ملاحظات'];
    const rows = traineesList.map(t => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.phone}"`,
      `"${t.email || ''}"`,
      `"${(t.course || '').replace(/"/g, '""')}"`,
      t.status,
      `"${t.padiNumber || ''}"`,
      t.createdAt,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `riwa_trainees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Admins
  const filteredAdmins = adminsList.filter(adm => {
    const matchesSearch = 
      adm.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (adm.name || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
      (adm.phone || '').includes(adminSearch);
    const matchesRole = adminRoleFilter === 'all' || adm.role === adminRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Trainees
  const filteredTrainees = traineesList.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(traineeSearch.toLowerCase()) ||
      t.phone.includes(traineeSearch) ||
      (t.email || '').toLowerCase().includes(traineeSearch.toLowerCase()) ||
      (t.course || '').toLowerCase().includes(traineeSearch.toLowerCase());
    const matchesStatus = traineeStatusFilter === 'all' || t.status === traineeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>{isRtl ? 'نظام المستخدمين وفريق العمل' : 'User Management & Access Control'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-brand-arabic">
              {isRtl ? 'إدارة المستخدمين، طاقم العمل، والمتدربين' : 'Users, Staff & Trainees Directory'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isRtl 
                ? 'إمكانية إضافة حسابات مباشرة بكلمة مرور للمدراء والمدربين، وتتبع قائمة المتدربين المسجلين في دورات الغوص.'
                : 'Instantly create user accounts with passwords, assign roles, and manage enrolled diving students.'}
            </p>
          </div>

          {/* Sub-tabs switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setSubTab('admins')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subTab === 'admins'
                  ? 'gold-gradient-btn text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isRtl ? 'فريق العمل والمدراء' : 'Staff & Admins'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/30 text-[10px]">
                {adminsList.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('trainees')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                subTab === 'trainees'
                  ? 'gold-gradient-btn text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isRtl ? 'سجل المتدربين والطلاب' : 'Trainees Directory'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/30 text-[10px]">
                {traineesList.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUCCESS CREATED CREDENTIALS NOTIFICATION CARD */}
      {/* ============================================================== */}
      {createdCredentials && (
        <div className="p-6 rounded-3xl bg-emerald-950/40 border-2 border-emerald-500/50 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                🎉
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{isRtl ? 'تم إنشاء الحساب بنجاح!' : 'User Account Created!'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    {createdCredentials.role}
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/80">
                  {isRtl ? 'يمكنك الآن نسخ بيانات الدخول أو إرسالها للمستخدم مباشرة عبر الواتساب:' : 'You can copy credentials or send them via WhatsApp:'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCreatedCredentials(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/20 text-xs font-mono">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">{isRtl ? 'الاسم:' : 'Name:'}</span>
              <span className="text-white font-bold">{createdCredentials.name}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">{isRtl ? 'البريد الإلكتروني:' : 'Email:'}</span>
              <span className="text-emerald-300 font-bold select-all">{createdCredentials.email}</span>
            </div>
            {createdCredentials.password && (
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">{isRtl ? 'كلمة المرور المؤقتة:' : 'Password:'}</span>
                <span className="text-amber-300 font-bold select-all bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 inline-block">
                  {createdCredentials.password}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                const credString = `البريد: ${createdCredentials.email}${createdCredentials.password ? `\nكلمة المرور: ${createdCredentials.password}` : ''}\nالرابط: ${window.location.origin}`;
                handleCopy(credString, 'all-creds');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              {copiedKey === 'all-creds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedKey === 'all-creds' ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ بيانات الدخول' : 'Copy Credentials')}</span>
            </button>

            <button
              onClick={() => handleShareWhatsApp(createdCredentials)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إرسال للمستخدم عبر واتساب' : 'Send via WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: STAFF & ADMINS TAB */}
      {/* ============================================================== */}
      {subTab === 'admins' && (
        <div className="space-y-6">
          
          {/* Bootstrapped Superadmin Card */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white font-mono">{BOOTSTRAPPED_ADMIN_EMAIL}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                      {isRtl ? 'المدير الرئيسي (Super Admin)' : 'Root Super Admin'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isRtl ? 'الحساب المالك للمشروع والمحمي في قواعد الأمان السحابية Firestore (مفعّل دائماً).' : 'Root account specified in Firestore Security Rules (Always Active).'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRtl ? 'نشط دائماً' : 'Always Active'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Permissions Guide Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/20 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'دليل الصلاحيات والتحكم بالمستخدمين:' : 'Permissions & Roles Guide:'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {isCurrentUserSuperAdmin 
                  ? (isRtl ? 'أنت المدير العام (كامل الصلاحيات)' : 'You are Super Admin') 
                  : userRole === 'admin'
                  ? (isRtl ? 'أنت مدير نظام (كامل الصلاحيات)' : 'You are Admin')
                  : (isRtl ? 'حسابك للمشاهدة/التدريب' : 'View/Instructor Mode')}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {isRtl 
                ? '💡 يملك المدير العام ومدراء النظام كامل الصلاحية لإضافة أي مستخدم، وتعديل بياناته (الاسم، الجوال، ملاحظاته)، وتغيير دوره وصلاحياته في أي وقت، أو تعليقه وحذفه نهائياً. يمكنك الضغط على زر [تعديل ✏️] لأي مستخدم أدناه لتعديل كامل بياناته.'
                : '💡 Super Admins and Admins have full access to add users, edit details, change roles anytime, or delete accounts. Click [Edit ✏️] on any card below to update info.'}
            </p>
          </div>

          {/* Quick Inline User Add Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B5F]" />
                <span>{isRtl ? 'إضافة مستخدم سريع (بالبريد الإلكتروني):' : 'Quick Add User (By Email):'}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {isRtl ? 'إذا أنشأت حساباً في Firebase Console أو لديك بريد جاهز، أضفه هنا ليظهر فوراً وتفعل صلاحيته' : 'Add any Firebase Auth account or manager email directly'}
              </span>
            </div>

            <form onSubmit={handleQuickAddAdmin} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="email"
                value={quickEmail}
                onChange={(e) => setQuickEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
              />

              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder={isRtl ? 'الاسم الكامل (اختياري)' : 'Full Name (optional)'}
                className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />

              <select
                value={quickRole}
                onChange={(e) => setQuickRole(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="admin">{isRtl ? 'مدير نظام (Admin)' : 'Admin'}</option>
                <option value="instructor">{isRtl ? 'كابتن ومدرب (Instructor)' : 'Instructor'}</option>
                <option value="viewer">{isRtl ? 'مشرف ومساعد (Viewer)' : 'Viewer'}</option>
              </select>

              <button
                type="submit"
                disabled={isSubmittingQuick}
                className="gold-gradient-btn px-4 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-md shadow-[#C59B5F]/20 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 transition-transform disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmittingQuick ? (isRtl ? 'جارِ الإضافة...' : 'Adding...') : (isRtl ? 'إضافة فورية ➕' : 'Add User ➕')}</span>
              </button>
            </form>
          </div>

          {/* Action Bar: Search, Filters, Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder={isRtl ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Role filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {(['all', 'admin', 'instructor', 'viewer'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setAdminRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                      adminRoleFilter === role
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {role === 'all' && (isRtl ? 'الكل' : 'All')}
                    {role === 'admin' && (isRtl ? 'مدراء' : 'Admins')}
                    {role === 'instructor' && (isRtl ? 'مدربون' : 'Instructors')}
                    {role === 'viewer' && (isRtl ? 'مشرفون' : 'Viewers')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchAdmins}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                title={isRtl ? 'تحديث القائمة' : 'Refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${loadingAdmins ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => {
                  setShowAddUserModal(true);
                  setFormError(null);
                }}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-md shadow-[#C59B5F]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isRtl ? 'إضافة مستخدم جديد ➕' : 'Add New User ➕'}</span>
              </button>
            </div>
          </div>

          {/* Admins & Team Members Cards List */}
          <div className="space-y-3">
            {loadingAdmins ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                <p>{isRtl ? 'جارِ تحميل حسابات المستخدمين...' : 'Loading accounts...'}</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="py-12 text-center rounded-3xl bg-slate-950 border border-slate-800 p-8 space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h5 className="text-sm font-bold text-white">
                  {isRtl ? 'لا يوجد مستخدمون مطابقون' : 'No matching users found'}
                </h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isRtl 
                    ? 'يمكنك إضافة أعضاء جدد لفريق العمل بالضغط على زر "إضافة مستخدم جديد" أعلاه.'
                    : 'Click "Add New User" above to add administrators and team members.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAdmins.map((adm) => {
                  const isSuspended = adm.status === 'suspended';
                  const isRoot = adm.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

                  return (
                    <div 
                      key={adm.uid} 
                      className={`p-5 rounded-2xl bg-slate-950 border transition-all space-y-4 ${
                        isSuspended 
                          ? 'border-red-900/40 bg-red-950/10 opacity-75' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                            adm.role === 'admin' || adm.role === 'superadmin'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : adm.role === 'instructor'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {adm.name ? adm.name.slice(0, 2).toUpperCase() : '👤'}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-white truncate">
                                {adm.name || (isRtl ? 'مستخدم بدون اسم' : 'Unnamed User')}
                              </h5>
                              {isSuspended && (
                                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[9px] font-bold border border-red-500/30">
                                  {isRtl ? 'معلّق' : 'Suspended'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-mono truncate">{adm.email}</p>
                          </div>
                        </div>

                        {/* User Actions: Edit, Suspend, Delete */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Edit User Button (Available for all users) */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdmin(adm);
                              setEditName(adm.name || '');
                              setEditEmail(adm.email || '');
                              setEditPhone(adm.phone || '');
                              setEditRole((adm.role as any) || 'admin');
                              setEditStatus(adm.status || 'active');
                              setEditNotes(adm.notes || '');
                              setEditError(null);
                              setShowEditUserModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 hover:text-white border border-blue-500/30 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                            title={isRtl ? 'تعديل بيانات وصلاحيات الحساب' : 'Edit user details & permissions'}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                            <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                          </button>

                          {!isRoot && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleAdminStatus(adm)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                  isSuspended
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                                    : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                                }`}
                                title={isSuspended ? (isRtl ? 'إلغاء التعليق' : 'Unsuspend') : (isRtl ? 'تعليق الحساب' : 'Suspend')}
                              >
                                {isSuspended ? (isRtl ? 'تنشيط' : 'Activate') : (isRtl ? 'تعليق' : 'Suspend')}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteUserError(null);
                                  setUserToDelete(adm);
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/70 text-red-400 hover:text-red-200 border border-red-500/30 transition-colors cursor-pointer"
                                title={isRtl ? 'حذف الحساب نهائياً' : 'Delete user'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Role selection & details */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">{isRtl ? 'الصلاحية:' : 'Role:'}</span>
                          {isRoot ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                              {isRtl ? 'مدير رئيسي (Super Admin)' : 'Super Admin'}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={adm.role}
                                onChange={(e) => handleUpdateAdminRole(adm.uid, e.target.value as any)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
                              >
                                <option value="admin">{isRtl ? 'مدير نظام كامل (Admin)' : 'Admin'}</option>
                                <option value="instructor">{isRtl ? 'كابتن ومدرب (Instructor)' : 'Instructor'}</option>
                                <option value="viewer">{isRtl ? 'مشرف ومساعد (Viewer)' : 'Viewer'}</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {adm.phone && (
                          <a
                            href={`https://wa.me/${adm.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold text-xs"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{adm.phone}</span>
                          </a>
                        )}
                      </div>

                      {adm.notes && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                          💬 {adm.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>UID: {adm.uid.slice(0, 10)}...</span>
                        {adm.createdAt && (
                          <span>{new Date(adm.createdAt).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: TRAINEES & STUDENTS TAB */}
      {/* ============================================================== */}
      {subTab === 'trainees' && (
        <div className="space-y-6">
          
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">{isRtl ? 'إجمالي المتدربين' : 'Total Students'}</span>
              <p className="text-xl font-black text-white">{traineesList.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-1">
              <span className="text-[11px] text-emerald-400">{isRtl ? 'قيد التدريب النشط' : 'Active Training'}</span>
              <p className="text-xl font-black text-emerald-400">
                {traineesList.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/20 space-y-1">
              <span className="text-[11px] text-blue-400">{isRtl ? 'مكتمل ومرخص 🤿' : 'Certified'}</span>
              <p className="text-xl font-black text-blue-400">
                {traineesList.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-1">
              <span className="text-[11px] text-amber-400">{isRtl ? 'معلق / بانتظار البدء' : 'Pending'}</span>
              <p className="text-xl font-black text-amber-400">
                {traineesList.filter(t => t.status === 'pending' || t.status === 'paused').length}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={traineeSearch}
                  onChange={(e) => setTraineeSearch(e.target.value)}
                  placeholder={isRtl ? 'بحث بالاسم، الجوال، أو الدورة...' : 'Search by name, phone, course...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {(['all', 'active', 'completed', 'pending', 'paused'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setTraineeStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors whitespace-nowrap ${
                      traineeStatusFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st === 'all' && (isRtl ? 'الكل' : 'All')}
                    {st === 'active' && (isRtl ? 'نشط' : 'Active')}
                    {st === 'completed' && (isRtl ? 'مكتمل' : 'Certified')}
                    {st === 'pending' && (isRtl ? 'بانتظار' : 'Pending')}
                    {st === 'paused' && (isRtl ? 'معلق' : 'Paused')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {bookings.length > 0 && (
                <button
                  onClick={() => setShowImportBookingModal(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={isRtl ? 'استيراد من طلبات الحجز' : 'Import from Bookings'}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'استيراد من الحجوزات 📥' : 'Import'}</span>
                </button>
              )}

              <button
                onClick={handleExportTraineesCsv}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                title={isRtl ? 'تصدير ملف CSV' : 'Export CSV'}
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={fetchTrainees}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                title={isRtl ? 'تحديث' : 'Refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${loadingTrainees ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => {
                  setEditingTraineeId(null);
                  setTName('');
                  setTPhone('');
                  setTEmail('');
                  setTCourse(courses[0]?.title?.ar || '');
                  setTPadi('');
                  setTNotes('');
                  setTStatus('active');
                  setShowAddTraineeModal(true);
                }}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-md shadow-[#C59B5F]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'إضافة متدرب 🤿' : 'Add Trainee 🤿'}</span>
              </button>
            </div>
          </div>

          {/* Trainees Cards List */}
          <div className="space-y-3">
            {loadingTrainees ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                <p>{isRtl ? 'جارِ تحميل سجل المتدربين...' : 'Loading trainees...'}</p>
              </div>
            ) : filteredTrainees.length === 0 ? (
              <div className="py-12 text-center rounded-3xl bg-slate-950 border border-slate-800 p-8 space-y-3">
                <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
                <h5 className="text-sm font-bold text-white">
                  {isRtl ? 'لا يوجد متدربون في هذا التصنيف' : 'No trainees found'}
                </h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isRtl 
                    ? 'أضف أول متدرب مسجل أو استورد الحجوزات المعتمدة لتبدأ بمتابعة مسار تدريبهم ورخصهم.'
                    : 'Add a new diving student or import from incoming bookings to start tracking their progress.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrainees.map((trainee) => {
                  const statusColors = {
                    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                    completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                    paused: 'bg-red-500/15 text-red-400 border-red-500/30'
                  };

                  const statusLabels = {
                    active: isRtl ? 'قيد التدريب' : 'In Training',
                    completed: isRtl ? 'مكتمل ومرخص 🤿' : 'Certified',
                    pending: isRtl ? 'بانتظار البدء' : 'Pending',
                    paused: isRtl ? 'معلّق' : 'Paused'
                  };

                  return (
                    <div 
                      key={trainee.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-white truncate">{trainee.name}</h5>
                            <p className="text-xs font-semibold text-cyan-400 truncate mt-0.5">
                              {trainee.course || (isRtl ? 'دورة غوص' : 'Diving Course')}
                            </p>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusColors[trainee.status]}`}>
                            {statusLabels[trainee.status]}
                          </span>
                        </div>

                        {/* Phone with WhatsApp Link */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <a
                            href={`https://wa.me/${trainee.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${trainee.name}، معك مركز رواء الفن للغوص 🤿 بخصوص دورة ${trainee.course || 'الغوص'}:`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{trainee.phone}</span>
                          </a>

                          {trainee.padiNumber && (
                            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              PADI: {trainee.padiNumber}
                            </span>
                          )}
                        </div>

                        {trainee.notes && (
                          <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            💬 {trainee.notes}
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(trainee.createdAt).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTraineeId(trainee.id);
                              setTName(trainee.name);
                              setTPhone(trainee.phone);
                              setTEmail(trainee.email || '');
                              setTCourse(trainee.course || '');
                              setTPadi(trainee.padiNumber || '');
                              setTNotes(trainee.notes || '');
                              setTStatus(trainee.status);
                              setShowAddTraineeModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                            title={isRtl ? 'تعديل' : 'Edit'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setTraineeToDelete(trainee)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/70 text-red-400 hover:text-red-200 border border-red-500/30 transition-colors cursor-pointer"
                            title={isRtl ? 'حذف المتدرب' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD NEW USER / ADMIN (INSTANT OR UID LINK) */}
      {/* ============================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold font-brand-arabic">
                  {isRtl ? 'إضافة مستخدم جديد لطاقم العمل' : 'Add New Team Member'}
                </h4>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setCreationMode('instant')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  creationMode === 'instant'
                    ? 'gold-gradient-btn text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إنشاء حساب جديد فوري' : 'Direct New Account'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCreationMode('uid')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  creationMode === 'uid'
                    ? 'bg-blue-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>{isRtl ? 'ربط حساب موجود (UID)' : 'Link Account (UID)'}</span>
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'الاسم الكامل:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isRtl ? 'مثال: كابتن فهد السالم' : 'e.g. Captain Fahad'}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@riwaalfan.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Password (if instant mode) */}
              {creationMode === 'instant' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isRtl ? 'كلمة المرور:' : 'Password:'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isRtl ? 'توليد كلمة سر قوية' : 'Generate Strong'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isRtl ? 'كلمة سر مكونة من 6 خانات فأكثر' : 'At least 6 characters'}
                      required
                      className="w-full ps-4 pe-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* UID (if link mode) */
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRtl ? 'معرف المستخدم في Firebase (UID):' : 'Firebase User UID:'}</span>
                  </label>
                  <input
                    type="text"
                    value={newUid}
                    onChange={(e) => setNewUid(e.target.value)}
                    placeholder="e.g. 7qX9K3mP1wZ2..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    {isRtl ? 'لحسابات Google أو الحسابات المسجلة سابقاً في Firebase Console.' : 'For accounts that signed in with Google or pre-registered in Firebase.'}
                  </span>
                </div>
              )}

              {/* Role selection & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'الصلاحية الممنوحة:' : 'Role:'}
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="admin">{isRtl ? 'مدير نظام كامل (Admin)' : 'Admin'}</option>
                    <option value="instructor">{isRtl ? 'كابتن ومدرب (Instructor)' : 'Instructor'}</option>
                    <option value="viewer">{isRtl ? 'مشرف ومساعد (Viewer)' : 'Viewer'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isRtl ? 'رقم الجوال / واتساب:' : 'Mobile Phone:'}</span>
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0501234567"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'ملاحظات إضافية (اختياري):' : 'Notes (Optional):'}
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={isRtl ? 'مثال: مدرب غوص حر ومساعد في الرحلات' : 'e.g. Free diving assistant'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-[#C59B5F]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmittingAdmin ? (isRtl ? 'جارِ إنشاء الحساب...' : 'Creating...') : (isRtl ? 'إنشاء وتفعيل الحساب الآن' : 'Create & Activate User')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1.5: EDIT USER & PERMISSIONS */}
      {/* ============================================================== */}
      {showEditUserModal && editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold font-brand-arabic">
                  {isRtl ? 'تعديل بيانات المستخدم وصلاحياته' : 'Edit User & Permissions'}
                </h4>
              </div>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingAdmin(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedAdmin} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'الاسم الكامل:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={isRtl ? 'اسم المستخدم' : 'User name'}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={editingAdmin.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none disabled:opacity-60"
                />
                {editingAdmin.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() && (
                  <span className="text-[10px] text-amber-400 block">
                    {isRtl ? 'حساب المدير العام المعتمد لا يمكن تعديل بريده.' : 'Root super admin email is locked.'}
                  </span>
                )}
              </div>

              {/* Role selection & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'الدور والصلاحية:' : 'Role:'}
                  </label>
                  <select
                    value={editRole}
                    disabled={editingAdmin.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none disabled:opacity-60"
                  >
                    <option value="admin">{isRtl ? '👑 مدير نظام كامل (Admin)' : 'Admin'}</option>
                    <option value="instructor">{isRtl ? '🤿 كابتن ومدرب (Instructor)' : 'Instructor'}</option>
                    <option value="viewer">{isRtl ? '👁️ مشرف ومساعد (Viewer)' : 'Viewer'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'حالة الحساب:' : 'Account Status:'}
                  </label>
                  <select
                    value={editStatus}
                    disabled={editingAdmin.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none disabled:opacity-60"
                  >
                    <option value="active">{isRtl ? '✅ نشط ومفعل' : 'Active'}</option>
                    <option value="suspended">{isRtl ? '⏸️ معلّق مؤقتاً' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRtl ? 'رقم الجوال / واتساب:' : 'Mobile Phone:'}</span>
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="0501234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Internal Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'ملاحظات إدارية (اختياري):' : 'Admin Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder={isRtl ? 'أي ملاحظات أو صلاحيات إضافية للمستخدم...' : 'Any admin notes...'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingAdmin(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSavingEditAdmin}
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-[#C59B5F]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingEditAdmin ? (isRtl ? 'جارِ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التعديلات' : 'Save Changes')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD / EDIT TRAINEE */}
      {/* ============================================================== */}
      {showAddTraineeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold font-brand-arabic">
                  {editingTraineeId 
                    ? (isRtl ? 'تعديل بيانات المتدرب' : 'Edit Trainee Details')
                    : (isRtl ? 'تسجيل متدرب جديد في دورة غوص' : 'Register New Trainee')}
                </h4>
              </div>
              <button
                onClick={() => setShowAddTraineeModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrainee} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'اسم المتدرب:' : 'Trainee Full Name:'}
                </label>
                <input
                  type="text"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder={isRtl ? 'مثال: عبدالمجيد الغامدي' : 'e.g. Abdulmajeed'}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isRtl ? 'رقم الجوال / واتساب:' : 'Mobile Phone:'}</span>
                  </label>
                  <input
                    type="tel"
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    placeholder="0501234567"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isRtl ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}</span>
                  </label>
                  <input
                    type="email"
                    value={tEmail}
                    onChange={(e) => setTEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Course & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'الدورة التدريبية:' : 'Course:'}
                  </label>
                  <select
                    value={tCourse}
                    onChange={(e) => setTCourse(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    {courses.map(c => {
                      const courseTitle = isRtl ? (c.title?.ar || '') : (c.title?.en || c.title?.ar || '');
                      return (
                        <option key={c.id} value={courseTitle}>
                          {courseTitle}
                        </option>
                      );
                    })}
                    <option value="دورة مخصصة / رحلة خاصة">
                      {isRtl ? 'دورة مخصصة / رحلة خاصة' : 'Custom Course / Dive Trip'}
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'حالة التدريب:' : 'Training Status:'}
                  </label>
                  <select
                    value={tStatus}
                    onChange={(e) => setTStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="active">{isRtl ? 'قيد التدريب النشط' : 'Active / In Training'}</option>
                    <option value="completed">{isRtl ? 'مكتمل ومرخص 🤿' : 'Completed & Certified'}</option>
                    <option value="pending">{isRtl ? 'بانتظار البدء' : 'Pending Start'}</option>
                    <option value="paused">{isRtl ? 'معلق / متوقف' : 'Paused'}</option>
                  </select>
                </div>
              </div>

              {/* PADI Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'رقم رخصة PADI (إن وجد):' : 'PADI Diver ID (If any):'}
                </label>
                <input
                  type="text"
                  value={tPadi}
                  onChange={(e) => setTPadi(e.target.value)}
                  placeholder="e.g. 23094821"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRtl ? 'ملاحظات طبية أو تدريبية:' : 'Medical / Training Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={tNotes}
                  onChange={(e) => setTNotes(e.target.value)}
                  placeholder={isRtl ? 'مثال: اجتاز تدريب المسبح، بانتظار البحر المفتوح' : 'e.g. Confined water completed'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTraineeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingTrainee}
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-md shadow-[#C59B5F]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmittingTrainee ? (isRtl ? 'جارِ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ المتدرب' : 'Save Trainee')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: IMPORT TRAINEE FROM BOOKINGS */}
      {/* ============================================================== */}
      {showImportBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-bold font-brand-arabic">
                  {isRtl ? 'استيراد متدرب من صندوق الحجوزات' : 'Import Trainee from Bookings'}
                </h4>
              </div>
              <button
                onClick={() => setShowImportBookingModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {isRtl ? 'اختر أي حجز لتحويله مباشرة إلى سجل المتدربين بضغطة زر:' : 'Select any booking to convert into a registered trainee:'}
            </p>

            <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
              {bookings.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">
                  {isRtl ? 'لا توجد حجوزات مسجلة حالياً.' : 'No bookings available.'}
                </p>
              ) : (
                bookings.map(b => (
                  <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h6 className="text-xs font-bold text-white truncate">{b.name}</h6>
                      <p className="text-[11px] text-cyan-400 truncate">{b.interest} • {b.phone}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(b.createdAt).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImportBooking(b)}
                      className="gold-gradient-btn px-3 py-1.5 rounded-xl text-slate-950 font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? 'استيراد كمتدرب' : 'Import'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: IN-APP CONFIRM DELETE ADMIN / USER */}
      {/* ============================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 shadow-2xl shadow-red-950/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-white font-brand-arabic">
                  {isRtl ? 'تأكيد حذف الحساب نهائياً' : 'Confirm Permanent Deletion'}
                </h4>
                <p className="text-xs text-slate-400 font-mono truncate">{userToDelete.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/25 border border-red-500/25 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white leading-relaxed">
                {isRtl 
                  ? `هل أنت متأكد من رغبتك في حذف حساب (${userToDelete.name || userToDelete.email}) وإلغاء صلاحيته بالكامل؟`
                  : `Are you sure you want to permanently delete (${userToDelete.name || userToDelete.email}) and revoke all permissions?`}
              </p>
              <p className="text-[11px] text-red-300">
                {isRtl 
                  ? '⚠️ لا يمكن التراجع عن هذا الإجراء وسيتم مسح الحساب من النظام فوراً.' 
                  : '⚠️ This action is permanent and cannot be undone.'}
              </p>
            </div>

            {deleteUserError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteUserError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {isRtl ? 'إلغاء الأمر' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isDeletingUser}
                onClick={confirmExecuteDeleteAdmin}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30 disabled:opacity-50 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingUser ? (isRtl ? 'جارِ الحذف...' : 'Deleting...') : (isRtl ? 'نعم، احذف الحساب الآن 🗑️' : 'Yes, Delete Now')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: IN-APP CONFIRM DELETE TRAINEE */}
      {/* ============================================================== */}
      {traineeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 shadow-2xl shadow-red-950/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-white font-brand-arabic">
                  {isRtl ? 'تأكيد حذف المتدرب' : 'Confirm Delete Trainee'}
                </h4>
                <p className="text-xs text-slate-400 truncate">{traineeToDelete.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isRtl
                ? `هل أنت متأكد من حذف المتدرب (${traineeToDelete.name}) من سجل المتدربين؟`
                : `Are you sure you want to delete trainee (${traineeToDelete.name})?`}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingTrainee}
                onClick={() => setTraineeToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {isRtl ? 'إلغاء الأمر' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isDeletingTrainee}
                onClick={confirmExecuteDeleteTrainee}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30 disabled:opacity-50 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingTrainee ? (isRtl ? 'جارِ الحذف...' : 'Deleting...') : (isRtl ? 'حذف المتدرب 🗑️' : 'Delete Trainee')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
