import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Primary superadmin email (bootstrapped)
export const BOOTSTRAPPED_ADMIN_EMAIL = 'azozsindi23@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdminUser: boolean;
  isLoading: boolean;
  authError: string | null;
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

  const checkUserAdminStatus = async (currentUser: User): Promise<boolean> => {
    try {
      const email = currentUser.email?.toLowerCase().trim() || '';

      // 1. Check Bootstrapped Superadmin Email
      if (email === BOOTSTRAPPED_ADMIN_EMAIL) {
        return true;
      }

      // 2. Check Firebase Custom Claims (if token was minted with admin: true)
      try {
        const idTokenResult = await currentUser.getIdTokenResult(true);
        if (idTokenResult?.claims?.admin === true) {
          return true;
        }
      } catch (claimErr) {
        console.warn('Custom claim check note:', claimErr);
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
        console.warn('Firestore admin doc lookup note:', dbErr);
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
          setAuthError(
            `عذراً! الحساب (${currentUser.email || 'المجهول'}) غير مسجل كمدير مصرح له برواء الفن.`
          );
        } else {
          setAuthError(null);
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
          `عذراً! البريد الإلكتروني (${attemptedEmail}) غير مصرح له بالوصول إلى لوحة الإدارة. يرجى الدخول بحساب المدير المعتمد.`
        );
        setIsLoading(false);
        return false;
      }

      setIsAdminUser(true);
      setUser(result.user);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      console.error('Google Sign-In Error:', err);
      const msg = err.code === 'auth/popup-closed-by-user' 
        ? 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.'
        : (err.message || 'حدث خطأ أثناء تسجيل الدخول بحساب Google.');
      setAuthError(msg);
      return false;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      setAuthError(null);
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      
      if (!result.user) {
        throw new Error('لم يتم إرجاع أي مستخدم.');
      }

      const isAuthorized = await checkUserAdminStatus(result.user);
      if (!isAuthorized) {
        const attemptedEmail = result.user.email || '';
        await firebaseSignOut(auth);
        setUser(null);
        setIsAdminUser(false);
        setAuthError(
          `عذراً! البريد الإلكتروني (${attemptedEmail}) غير مصرح له بالوصول إلى لوحة الإدارة.`
        );
        setIsLoading(false);
        return false;
      }

      setIsAdminUser(true);
      setUser(result.user);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      console.error('Email Sign-In Error:', err);
      let msg = 'فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'صيغة البريد الإلكتروني غير صالحة.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'تم حظر المحاولات مؤقتاً بسبب كثرة المحاولات الخاطئة. الرجاء المحاولة بعد قليل.';
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
