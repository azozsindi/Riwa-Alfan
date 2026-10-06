import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Primary superadmin email (bootstrapped, case-insensitive)
export const BOOTSTRAPPED_ADMIN_EMAIL = 'azozsindi23@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdminUser: boolean;
  isLoading: boolean;
  authError: string | null;
  authErrorCode: string | null;
  setAuthError: (err: string | null) => void;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkUserAdminStatus: (currentUser: User) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);

  const checkUserAdminStatus = async (currentUser: User): Promise<boolean> => {
    try {
      const email = (currentUser.email || '').toLowerCase().trim();

      // 1. Check Bootstrapped Superadmin Email
      if (email === BOOTSTRAPPED_ADMIN_EMAIL) {
        // Auto-seed admin document in Firestore /admins/{uid} so UID-based rules also pass
        try {
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          await setDoc(adminDocRef, {
            uid: currentUser.uid,
            email: email,
            role: 'superadmin',
            lastLoginAt: new Date().toISOString()
          }, { merge: true });
        } catch (seedErr) {
          console.warn('Auto-seed admin record notice:', seedErr);
        }
        return true;
      }

      // 2. Check Firebase Custom Claims (if token was minted with admin: true)
      try {
        const idTokenResult = await currentUser.getIdTokenResult(true);
        if (idTokenResult?.claims?.admin === true) {
          return true;
        }
      } catch (claimErr) {
        console.warn('Custom claim check notice:', claimErr);
      }

      // 3. Check Firestore /admins/{uid} whitelist
      try {
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        const adminDocSnap = await getDoc(adminDocRef);
        if (adminDocSnap.exists()) {
          const data = adminDocSnap.data();
          if (data && (data.role === 'admin' || data.role === 'superadmin')) {
            return true;
          }
        }
      } catch (dbErr) {
        console.warn('Firestore admin doc lookup notice:', dbErr);
      }

      return false;
    } catch (e) {
      console.error('Error verifying admin authorization:', e);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const authorized = await checkUserAdminStatus(currentUser);
        setIsAdminUser(authorized);
        if (!authorized) {
          const attemptedEmail = currentUser.email || 'مجهول';
          await firebaseSignOut(auth);
          setUser(null);
          setIsAdminUser(false);
          setAuthError(
            `عذراً! الحساب (${attemptedEmail}) غير مصرح له كمدير في رواء الفن.`
          );
          setAuthErrorCode('auth/unauthorized-user');
        } else {
          setAuthError(null);
          setAuthErrorCode(null);
        }
      } else {
        setUser(null);
        setIsAdminUser(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setAuthError(null);
      setAuthErrorCode(null);
      setIsLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      
      if (!result.user) {
        throw new Error('لم يتم إرجاع أي حساب من Google.');
      }

      const isAuthorized = await checkUserAdminStatus(result.user);
      if (!isAuthorized) {
        const attemptedEmail = result.user.email || '';
        await firebaseSignOut(auth);
        setUser(null);
        setIsAdminUser(false);
        setAuthError(
          `عذراً! البريد الإلكتروني (${attemptedEmail}) غير مصرح له بالوصول إلى لوحة الإدارة. يرجى الدخول بحساب المدير المعتمد في رواء الفن.`
        );
        setAuthErrorCode('auth/unauthorized-user');
        setIsLoading(false);
        return false;
      }

      setIsAdminUser(true);
      setUser(result.user);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      console.error('Firebase Google Sign-In Error Details:', {
        code: err.code,
        message: err.message,
        customData: err.customData
      });

      const errorCode = err.code || 'unknown';
      setAuthErrorCode(errorCode);

      let msg = err.message || 'حدث خطأ أثناء تسجيل الدخول بحساب Google.';
      
      if (errorCode === 'auth/unauthorized-domain') {
        msg = `الدومين الحالي غير مصرح له في Firebase Authentication (${window.location.hostname}). يرجى إضافة هذا الدومين إلى قائمة Authorized Domains في Firebase Console.`;
      } else if (errorCode === 'auth/popup-closed-by-user') {
        msg = 'تم إغلاق نافذة تسجيل الدخول عبر Google قبل إتمام العملية.';
      } else if (errorCode === 'auth/popup-blocked') {
        msg = 'المتصفح حظر النافذة المنبثقة لتسجيل الدخول. يرجى السماح بالنوافذ المنبثقة من إعدادات المتصفح.';
      } else if (errorCode === 'auth/cancelled-popup-request') {
        msg = 'تم إلغاء طلب تسجيل الدخول.';
      }

      setAuthError(msg);
      return false;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      setAuthError(null);
      setAuthErrorCode(null);
      setIsLoading(true);

      const cleanEmail = email.trim().toLowerCase();
      let resultUser: User | null = null;

      try {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        resultUser = res.user;
      } catch (loginErr: any) {
        // If the user is the primary superadmin and attempting first-time password setup
        if (
          cleanEmail === BOOTSTRAPPED_ADMIN_EMAIL && 
          (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential')
        ) {
          try {
            console.log('Attempting initial registration for manager email...');
            const newRes = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            resultUser = newRes.user;
          } catch (createErr: any) {
            console.warn('Could not auto-create manager email account:', createErr);
            throw loginErr; // rethrow original login error
          }
        } else {
          throw loginErr;
        }
      }
      
      if (!resultUser) {
        throw new Error('لم يتم إرجاع أي مستخدم.');
      }

      const isAuthorized = await checkUserAdminStatus(resultUser);
      if (!isAuthorized) {
        const attemptedEmail = resultUser.email || '';
        await firebaseSignOut(auth);
        setUser(null);
        setIsAdminUser(false);
        setAuthError(
          `عذراً! البريد الإلكتروني (${attemptedEmail}) غير مصرح له بالوصول إلى لوحة الإدارة.`
        );
        setAuthErrorCode('auth/unauthorized-user');
        setIsLoading(false);
        return false;
      }

      setIsAdminUser(true);
      setUser(resultUser);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      console.error('Firebase Email Sign-In Error Details:', {
        code: err.code,
        message: err.message,
        customData: err.customData
      });

      const errorCode = err.code || 'unknown';
      setAuthErrorCode(errorCode);

      let msg = `فشل تسجيل الدخول (${errorCode}): ${err.message}`;

      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        msg = `البريد الإلكتروني أو كلمة المرور غير مطابقة في Firebase (${errorCode}). إذا كان حسابك مسجلاً عبر Google، يرجى استخدام زر [تسجيل الدخول بحساب Google المعتمد] أعلاه.`;
      } else if (errorCode === 'auth/invalid-email') {
        msg = 'صيغة البريد الإلكتروني غير صالحة.';
      } else if (errorCode === 'auth/too-many-requests') {
        msg = 'تم حظر المحاولات مؤقتاً بسبب كثرة المحاولات الخاطئة. الرجاء المحاولة بعد قليل أو الدخول عبر حساب Google.';
      } else if (errorCode === 'auth/operation-not-allowed') {
        msg = 'تسجيل الدخول بالبريد وكلمة المرور غير مفعّل في Firebase Console. يرجى استخدام تسجيل الدخول بـ Google المفعّل افتراضياً.';
      }

      setAuthError(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdminUser(false);
      setAuthError(null);
      setAuthErrorCode(null);
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdminUser,
      isLoading,
      authError,
      authErrorCode,
      setAuthError,
      signInWithGoogle,
      signInWithEmail,
      logout,
      checkUserAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
