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
  getDoc,
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { SiteConfig, BookingRecord, BookingStatusPublic } from '../types/admin';

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

let writeQuotaExhausted = false;
let lastWrittenSiteConfigJson = '';
let lastRemoteSiteConfigJson = '';
const lastPartnerMediaPayloadMap = new Map<string, string>();
const quotaListeners = new Set<(exhausted: boolean) => void>();

export const isFirestoreWriteQuotaExhausted = (): boolean => writeQuotaExhausted;

export const subscribeToQuotaStatus = (cb: (exhausted: boolean) => void): (() => void) => {
  quotaListeners.add(cb);
  cb(writeQuotaExhausted);
  return () => {
    quotaListeners.delete(cb);
  };
};

const markQuotaExhausted = () => {
  if (!writeQuotaExhausted) {
    writeQuotaExhausted = true;
    quotaListeners.forEach((cb) => {
      try {
        cb(true);
      } catch {}
    });
  }
};

export const isQuotaExceededError = (err: unknown): boolean => {
  const code = (err as { code?: string })?.code;
  const msg = err instanceof Error ? err.message : String(err || '');
  return (
    code === 'resource-exhausted' ||
    msg.includes('resource-exhausted') ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Quota exceeded')
  );
};

export const getPartnerMediaDocId = (partnerId: string): string => {
  const safe = String(partnerId || 'partner')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 90);
  return `partner_media_${safe}`;
};

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  if (isQuotaExceededError(error)) {
    markQuotaExhausted();
    console.warn(`[Firestore Quota] Daily free-tier limit reached while attempting ${operationType} on ${path}. Local edits remain saved; Firestore sync pauses until quota resets.`);
    return null;
  }

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
            try {
              lastRemoteSiteConfigJson = JSON.stringify(data);
            } catch {}
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
            const logoUrl = media.logoUrl ?? '';
            const licenseImageUrl = media.licenseImageUrl ?? '';
            partnerMedia[pid] = {
              logoUrl,
              licenseImageUrl,
              updatedAt: media.updatedAt
            };
            lastPartnerMediaPayloadMap.set(pid, `${logoUrl}::${licenseImageUrl}`);
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
  if (writeQuotaExhausted) return false;
  const docId = getPartnerMediaDocId(partnerId);
  const path = `settings/${docId}`;
  const cleanLogo = logoUrl || '';
  const cleanLicense = licenseImageUrl || '';
  const fingerprint = `${cleanLogo}::${cleanLicense}`;
  if (lastPartnerMediaPayloadMap.get(partnerId) === fingerprint) {
    return true;
  }

  try {
    await setDoc(
      doc(db, 'settings', docId),
      {
        partnerId,
        logoUrl: cleanLogo,
        licenseImageUrl: cleanLicense,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    lastPartnerMediaPayloadMap.set(partnerId, fingerprint);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
};

export const saveSiteConfigToFirestore = async (config: SiteConfig): Promise<void> => {
  if (writeQuotaExhausted) return;
  const path = 'settings/site_config';
  try {
    const configDocRef = doc(db, 'settings', 'site_config');
    const cleanConfig = JSON.parse(JSON.stringify(config)) as SiteConfig;

    // Strip large inline data:image payloads from site_config copy (explicitly saved via partner_media_* on image upload)
    const partners = cleanConfig.trustBadges?.partnerLogos;
    if (Array.isArray(partners) && partners.length > 0) {
      cleanConfig.trustBadges!.partnerLogos = partners.map((p) => ({
        ...p,
        logoUrl: p.logoUrl && p.logoUrl.startsWith('data:image/') && p.logoUrl.length > 20_000 ? '' : (p.logoUrl || ''),
        licenseImageUrl: p.licenseImageUrl && p.licenseImageUrl.startsWith('data:image/') && p.licenseImageUrl.length > 20_000 ? '' : (p.licenseImageUrl || ''),
      }));
    }

    // Re-serialize right before setDoc so zero undefined values ever reach Firestore
    const serialized = JSON.stringify(cleanConfig);
    if (serialized === lastWrittenSiteConfigJson || serialized === lastRemoteSiteConfigJson) {
      return;
    }

    const sanitizedPayload = JSON.parse(serialized);
    await setDoc(configDocRef, sanitizedPayload, { merge: true });
    lastWrittenSiteConfigJson = serialized;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

export const saveBookingToFirestore = async (booking: BookingRecord): Promise<void> => {
  if (writeQuotaExhausted) return;
  const path = `bookings/${booking.id}`;
  try {
    const cleanPhoneDigits = String(booking.phone || '').replace(/\D/g, '');
    const phoneSuffix = booking.phoneSuffix || cleanPhoneDigits.slice(-4) || '';

    const rawBooking: BookingRecord = {
      id: String(booking.id || '').slice(0, 128),
      name: String(booking.name || '').slice(0, 120),
      phone: String(booking.phone || '').slice(0, 30),
      phoneSuffix: phoneSuffix.slice(0, 10),
      interest: String(booking.interest || '').slice(0, 500),
      experience: String(booking.experience || '').slice(0, 150),
      timing: String(booking.timing || '').slice(0, 100),
      notes: booking.notes ? String(booking.notes).slice(0, 2000) : undefined,
      paymentMethod: booking.paymentMethod,
      paymentAmount: booking.paymentAmount ? String(booking.paymentAmount).slice(0, 100) : undefined,
      paymentReference: booking.paymentReference ? String(booking.paymentReference).slice(0, 120) : undefined,
      status: (booking.status || 'new') as BookingRecord['status'],
      bookingType: booking.bookingType,
      selectedCourses: Array.isArray(booking.selectedCourses) ? booking.selectedCourses.slice(0, 15) : undefined,
      highestCert: booking.highestCert,
      issuingAgency: booking.issuingAgency,
      qaAnswers: booking.qaAnswers,
      preliminaryEligibility: booking.preliminaryEligibility,
      eligibilityStatus: booking.eligibilityStatus || 'pending_instructor_review',
      equivalencyRequired: booking.equivalencyRequired,
      instructorActionType: booking.instructorActionType,
      instructorReviewNote: booking.instructorReviewNote ? String(booking.instructorReviewNote).slice(0, 1000) : undefined,
      paymentAllowed: booking.paymentAllowed === true && booking.eligibilityStatus === 'approved',
      reviewedAt: booking.reviewedAt ? String(booking.reviewedAt).slice(0, 50) : undefined,
      createdAt: booking.createdAt || new Date().toISOString()
    };

    const sanitizedPayload = JSON.parse(JSON.stringify(rawBooking));
    await setDoc(doc(db, 'bookings', rawBooking.id), sanitizedPayload);

    // Sync non-PII status mirror for customer status tracking & payment gate
    const statusDoc: BookingStatusPublic = {
      id: rawBooking.id,
      phoneSuffix: phoneSuffix.slice(0, 10),
      interest: rawBooking.interest,
      eligibilityStatus: rawBooking.eligibilityStatus || 'pending_instructor_review',
      preliminaryEligibility: rawBooking.preliminaryEligibility,
      paymentAllowed: Boolean(rawBooking.paymentAllowed),
      instructorActionType: rawBooking.instructorActionType,
      instructorReviewNote: rawBooking.instructorReviewNote,
      paymentAmount: rawBooking.paymentAmount,
      status: rawBooking.status,
      updatedAt: new Date().toISOString(),
    };
    const sanitizedStatusDoc = JSON.parse(JSON.stringify(statusDoc));
    await setDoc(doc(db, 'booking_status', rawBooking.id), sanitizedStatusDoc);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
};

export const updateBookingStatusInFirestore = async (
  id: string,
  status: BookingRecord['status']
): Promise<void> => {
  if (writeQuotaExhausted) return;
  const path = `bookings/${id}`;
  try {
    await updateDoc(doc(db, 'bookings', id), { status });
    try {
      await updateDoc(doc(db, 'booking_status', id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Legacy bookings created prior to booking_status mirror may not have a status doc yet
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
};

export const updateBookingReviewInFirestore = async (
  id: string,
  reviewUpdate: Partial<
    Pick<
      BookingRecord,
      'eligibilityStatus' | 'instructorActionType' | 'instructorReviewNote' | 'paymentAllowed' | 'reviewedAt' | 'status'
    >
  >,
  fallbackBooking?: BookingRecord
): Promise<void> => {
  if (writeQuotaExhausted) return;
  const path = `bookings/${id}`;
  try {
    const cleanPatch = JSON.parse(JSON.stringify(reviewUpdate));
    await updateDoc(doc(db, 'bookings', id), cleanPatch);

    const statusPatch: Record<string, unknown> = {
      ...cleanPatch,
      updatedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'booking_status', id), statusPatch);
    } catch {
      if (fallbackBooking) {
        const cleanPhoneDigits = String(fallbackBooking.phone || '').replace(/\D/g, '');
        const fullStatusDoc: BookingStatusPublic = {
          id,
          phoneSuffix: fallbackBooking.phoneSuffix || cleanPhoneDigits.slice(-4) || '',
          interest: String(fallbackBooking.interest || '').slice(0, 500),
          eligibilityStatus: (reviewUpdate.eligibilityStatus || fallbackBooking.eligibilityStatus || 'pending_instructor_review'),
          preliminaryEligibility: fallbackBooking.preliminaryEligibility,
          paymentAllowed: Boolean(reviewUpdate.paymentAllowed ?? fallbackBooking.paymentAllowed),
          instructorActionType: reviewUpdate.instructorActionType ?? fallbackBooking.instructorActionType,
          instructorReviewNote: reviewUpdate.instructorReviewNote ?? fallbackBooking.instructorReviewNote,
          paymentAmount: fallbackBooking.paymentAmount,
          status: (reviewUpdate.status || fallbackBooking.status || 'new'),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'booking_status', id), JSON.parse(JSON.stringify(fullStatusDoc)));
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
};

export const fetchBookingStatusFromFirestore = async (
  bookingId: string
): Promise<BookingStatusPublic | null> => {
  const normalizedId = String(bookingId || '').trim().toUpperCase();
  if (!normalizedId) return null;
  const path = `booking_status/${normalizedId}`;
  try {
    const snap = await getDoc(doc(db, 'booking_status', normalizedId));
    if (!snap.exists()) return null;
    return snap.data() as BookingStatusPublic;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
};

export const deleteBookingFromFirestore = async (id: string): Promise<void> => {
  if (writeQuotaExhausted) return;
  const path = `bookings/${id}`;
  try {
    await deleteDoc(doc(db, 'bookings', id));
    try {
      await deleteDoc(doc(db, 'booking_status', id));
    } catch {}
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
};
