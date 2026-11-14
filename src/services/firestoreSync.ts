/**
 * Firestore synchronization service for Riwa Alfan.
 * Manages cloud storage of site settings, partner media, course configurations, and customer bookings.
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

export interface PartnerMediaMap {
  [partnerId: string]: {
    logoUrl?: string;
    licenseImageUrl?: string;
    updatedAt?: string;
  };
}

export const getPartnerMediaDocId = (partnerId: string): string => {
  const safe = String(partnerId || 'partner')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 90);
  return `partner_media_${safe}`;
};

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

/**
 * Subscribe to the entire /settings collection so both `site_config` and
 * individual `partner_media_*` image documents stay synced without hitting the 1MB doc limit.
 */
export const subscribeToSiteConfig = (
  onUpdate: (remoteData: Partial<SiteConfig>, partnerMedia?: PartnerMediaMap) => void
): Unsubscribe => {
  const path = 'settings';
  try {
    return onSnapshot(collection(db, path), (snapshot) => {
      let siteConfigData: Partial<SiteConfig> | null = null;
      const partnerMedia: PartnerMediaMap = {};

      snapshot.forEach(d => {
        if (d.id === 'site_config') {
          const data = d.data() as Partial<SiteConfig>;
          if (data && Object.keys(data).length > 0) {
            siteConfigData = data;
          }
        } else if (d.id.startsWith('partner_media_')) {
          const media = d.data() as {
            partnerId?: string;
            logoUrl?: string;
            licenseImageUrl?: string;
            updatedAt?: string;
          };
          const pid = media?.partnerId || d.id.replace(/^partner_media_/, '');
          if (pid) {
            partnerMedia[pid] = {
              logoUrl: media.logoUrl ?? '',
              licenseImageUrl: media.licenseImageUrl ?? '',
              updatedAt: media.updatedAt
            };
          }
        }
      });

      if (siteConfigData || Object.keys(partnerMedia).length > 0) {
        onUpdate(siteConfigData || {}, partnerMedia);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const savePartnerMediaToFirestore = async (
  partnerId: string,
  logoUrl?: string,
  licenseImageUrl?: string
): Promise<boolean> => {
  const docId = getPartnerMediaDocId(partnerId);
  const path = `settings/${docId}`;
  try {
    await setDoc(
      doc(db, 'settings', docId),
      {
        partnerId,
        logoUrl: logoUrl || '',
        licenseImageUrl: licenseImageUrl || '',
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
};

export const saveSiteConfigToFirestore = async (config: SiteConfig): Promise<void> => {
  const path = 'settings/site_config';
  try {
    const configDocRef = doc(db, 'settings', 'site_config');
    const cleanConfig = JSON.parse(JSON.stringify(config)) as SiteConfig;

    // Offload partner images into dedicated partner_media_* docs so site_config never hits the 1MB Firestore limit
    const partners = cleanConfig.trustBadges?.partnerLogos;
    if (Array.isArray(partners) && partners.length > 0) {
      await Promise.all(
        partners.map((p) => {
          if (!p?.id) return Promise.resolve(true);
          if (p.logoUrl || p.licenseImageUrl) {
            return savePartnerMediaToFirestore(p.id, p.logoUrl, p.licenseImageUrl);
          }
          return Promise.resolve(true);
        })
      );

      // Strip large inline data:image payloads from site_config copy (stored safely in partner_media_*)
      cleanConfig.trustBadges!.partnerLogos = partners.map((p) => ({
        ...p,
        logoUrl: p.logoUrl && p.logoUrl.startsWith('data:image/') && p.logoUrl.length > 20_000 ? '' : p.logoUrl,
        licenseImageUrl: p.licenseImageUrl && p.licenseImageUrl.startsWith('data:image/') && p.licenseImageUrl.length > 20_000 ? '' : p.licenseImageUrl,
      }));
    }

    await setDoc(configDocRef, cleanConfig, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

export const saveBookingToFirestore = async (booking: BookingRecord): Promise<void> => {
  const path = `bookings/${booking.id}`;
  try {
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
