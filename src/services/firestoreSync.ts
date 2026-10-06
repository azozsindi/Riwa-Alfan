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
import { db } from '../firebase';
import { SiteConfig, BookingRecord } from '../types/admin';

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
  try {
    return onSnapshot(collection(db, 'bookings'), (snapshot) => {
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
      console.warn('Firestore bookings snapshot error:', err);
    });
  } catch (e) {
    console.warn('Firestore sync failed to initialize:', e);
    return () => {};
  }
};

export const subscribeToSiteConfig = (
  onUpdate: (remoteData: Partial<SiteConfig>) => void
): Unsubscribe => {
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
      console.warn('Firestore site_config snapshot notice:', err);
    });
  } catch (e) {
    console.warn('Firestore site_config sync notice:', e);
    return () => {};
  }
};

export const saveSiteConfigToFirestore = async (config: SiteConfig): Promise<void> => {
  try {
    const configDocRef = doc(db, 'settings', 'site_config');
    // Sanitize object to strip undefined values that cause Firestore setDoc to fail
    const cleanConfig = JSON.parse(JSON.stringify(config));
    await setDoc(configDocRef, cleanConfig, { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc site_config notice:', err);
  }
};

export const saveBookingToFirestore = async (booking: BookingRecord): Promise<void> => {
  try {
    await setDoc(doc(db, 'bookings', booking.id), booking);
  } catch (err) {
    console.warn('Firestore booking sync notice:', err);
  }
};

export const updateBookingStatusInFirestore = async (
  id: string, 
  status: BookingRecord['status']
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'bookings', id), { status });
  } catch (err) {
    console.warn('Firestore status update notice:', err);
  }
};

export const deleteBookingFromFirestore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'bookings', id));
  } catch (err) {
    console.warn('Firestore delete notice:', err);
  }
};
