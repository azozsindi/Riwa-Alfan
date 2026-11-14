/**
 * Firestore synchronization service for Riwa Alfan.
 * Manages cloud storage of site settings, course configurations, and customer bookings.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  getDocFromServer,
  Unsubscribe 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { SiteConfig, BookingRecord } from '../types/admin';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  return errInfo;
}

export const validateFirestoreConnection = async (): Promise<void> => {
  try {
    await getDocFromServer(doc(db, 'settings', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline.");
    }
  }
};

export const subscribeToBookings = (
  onUpdate: (bookings: BookingRecord[]) => void
): Unsubscribe => {
  const path = 'bookings';
  try {
    return onSnapshot(collection(db, path), (snapshot) => {
      if (!snapshot.empty) {
        const list: BookingRecord[] = [];
        snapshot.forEach(d => {
          const data = d.data() as BookingRecord;
          if (data && data.id) {
            list.push(data);
          }
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const subscribeToSiteConfig = (
  onUpdate: (remoteData: Partial<SiteConfig>) => void
): Unsubscribe => {
  const path = 'settings/site_config';
  try {
    const configDocRef = doc(db, 'settings', 'site_config');
    return onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        const remoteData = snap.data() as Partial<SiteConfig>;
        if (remoteData && Object.keys(remoteData).length > 0) {
          onUpdate(remoteData);
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, path);
    return () => {};
  }
};

export const saveSiteConfigToFirestore = async (config: SiteConfig): Promise<void> => {
  const path = 'settings/site_config';
  try {
    const configDocRef = doc(db, 'settings', 'site_config');
    // Sanitize object to strip undefined values that cause Firestore setDoc to fail
    const cleanConfig = JSON.parse(JSON.stringify(config));
    await setDoc(configDocRef, cleanConfig, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

export const saveBookingToFirestore = async (booking: BookingRecord): Promise<void> => {
  const path = `bookings/${booking.id}`;
  try {
    // Sanitize string lengths and types according to security blueprint
    const sanitizedBooking: BookingRecord = {
      id: String(booking.id || '').slice(0, 128),
      name: String(booking.name || '').slice(0, 120),
      phone: String(booking.phone || '').slice(0, 30),
      interest: String(booking.interest || '').slice(0, 250),
      experience: String(booking.experience || '').slice(0, 100),
      timing: String(booking.timing || '').slice(0, 100),
      notes: booking.notes ? String(booking.notes).slice(0, 2000) : undefined,
      paymentMethod: booking.paymentMethod,
      paymentAmount: booking.paymentAmount ? String(booking.paymentAmount).slice(0, 50) : undefined,
      status: (booking.status || 'new') as BookingRecord['status'],
      createdAt: booking.createdAt || new Date().toISOString()
    };

    // Filter out any undefined keys
    const cleanPayload = Object.fromEntries(
      Object.entries(sanitizedBooking).filter(([_, v]) => v !== undefined)
    );

    await setDoc(doc(db, 'bookings', sanitizedBooking.id), cleanPayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
};

export const updateBookingStatusInFirestore = async (
  id: string, 
  status: BookingRecord['status']
): Promise<void> => {
  const path = `bookings/${id}`;
  try {
    await updateDoc(doc(db, 'bookings', id), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
};

export const deleteBookingFromFirestore = async (id: string): Promise<void> => {
  const path = `bookings/${id}`;
  try {
    await deleteDoc(doc(db, 'bookings', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
};
