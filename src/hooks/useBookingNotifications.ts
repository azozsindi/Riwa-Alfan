import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookingRecord } from '../types/admin';

export type NotificationPermissionState = NotificationPermission | 'unsupported';

export interface BookingNotificationItem {
  id: string;
  bookingId: string;
  name: string;
  phone: string;
  interest: string;
  createdAt: string;
  read: boolean;
  isTest?: boolean;
}

const READ_STORAGE_KEY = 'riwa_admin_read_notifications_v1';
const SOUND_STORAGE_KEY = 'riwa_admin_notif_sound_v1';

const playBookingChime = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = [659.25, 880, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.3);
    });
  } catch {
    // Ignore autoplay AudioContext restrictions gracefully
  }
};

const showSystemNotification = async (title: string, body: string, tag: string) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const options: NotificationOptions = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag,
    dir: 'rtl',
    lang: 'ar',
    requireInteraction: false,
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, options);
        return;
      }
    }
    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  } catch {
    // Ignore notification delivery error in restricted iframe contexts
  }
};

export function useBookingNotifications(bookings: BookingRecord[], isRtl: boolean) {
  const [permission, setPermission] = useState<NotificationPermissionState>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [testNotifications, setTestNotifications] = useState<BookingNotificationItem[]>([]);
  const [latestAlert, setLatestAlert] = useState<BookingNotificationItem | null>(null);

  const knownIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(readIds.slice(0, 200)));
    } catch {
      // ignore storage errors
    }
  }, [readIds]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      if (next) playBookingChime();
      return next;
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported';
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        if (soundEnabled) playBookingChime();
        await showSystemNotification(
          isRtl ? 'تم تفعيل إشعارات الحجوزات 🔔' : 'Booking Notifications Active 🔔',
          isRtl
            ? 'سيصلك تنبيه فوري عند وصول أي طلب حجز جديد في رواء الفن.'
            : 'You will now receive instant alerts for new diving bookings.',
          'riwa-notif-enabled'
        );
      }
      return result;
    } catch {
      return permission;
    }
  }, [isRtl, permission, soundEnabled]);

  // Detect genuine newly incoming bookings in real time via onSnapshot
  useEffect(() => {
    const currentIds = new Set(bookings.map((b) => b.id));

    if (knownIdsRef.current === null) {
      knownIdsRef.current = currentIds;
      return;
    }

    const newlyArrived = bookings.filter((b) => !knownIdsRef.current!.has(b.id));
    knownIdsRef.current = currentIds;

    if (newlyArrived.length > 0) {
      const newest = newlyArrived[0];
      const alertItem: BookingNotificationItem = {
        id: `live-${newest.id}`,
        bookingId: newest.id,
        name: newest.name,
        phone: newest.phone,
        interest: newest.interest,
        createdAt: newest.createdAt,
        read: false,
      };
      setLatestAlert(alertItem);

      if (soundEnabled) {
        playBookingChime();
      }

      showSystemNotification(
        isRtl ? `حجز جديد: ${newest.name} 🤿` : `New Booking: ${newest.name} 🤿`,
        isRtl
          ? `${newest.interest} · جوال: ${newest.phone}`
          : `${newest.interest} · Phone: ${newest.phone}`,
        `riwa-booking-${newest.id}`
      );
    }
  }, [bookings, isRtl, soundEnabled]);

  const notifications = useMemo<BookingNotificationItem[]>(() => {
    const readSet = new Set(readIds);
    const liveItems: BookingNotificationItem[] = bookings
      .filter((b) => b.status === 'new' || b.eligibilityStatus === 'pending_instructor_review')
      .map((b) => ({
        id: b.id,
        bookingId: b.id,
        name: b.name,
        phone: b.phone,
        interest: b.interest,
        createdAt: b.createdAt,
        read: readSet.has(b.id),
      }));

    return [...testNotifications, ...liveItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [bookings, readIds, testNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setTestNotifications((prev) =>
      prev.map((t) => (t.id === id ? { ...t, read: true } : t))
    );
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markAllAsRead = useCallback(() => {
    setTestNotifications((prev) => prev.map((t) => ({ ...t, read: true })));
    const allLiveIds = bookings.map((b) => b.id);
    setReadIds((prev) => Array.from(new Set([...prev, ...allLiveIds])));
    setLatestAlert(null);
  }, [bookings]);

  const dismissAlert = useCallback(() => {
    setLatestAlert(null);
  }, []);

  const sendTestNotification = useCallback(async () => {
    const testId = `test-${Date.now()}`;
    const sample: BookingNotificationItem = {
      id: testId,
      bookingId: testId,
      name: isRtl ? 'حجز تجريبي (معاينة العميل)' : 'Test Booking (Demo)',
      phone: '0530549675',
      interest: isRtl ? 'تجربة الغوص · أبحر الشمالية' : 'Discover Scuba · North Obhur',
      createdAt: new Date().toISOString(),
      read: false,
      isTest: true,
    };

    setTestNotifications((prev) => [sample, ...prev.slice(0, 4)]);
    setLatestAlert(sample);

    if (soundEnabled) {
      playBookingChime();
    }

    await showSystemNotification(
      isRtl ? 'حجز جديد في رواء الفن 🤿' : 'New Diving Booking 🤿',
      isRtl
        ? 'طلب تجريبي: تجربة الغوص · أبحر الشمالية - جدة'
        : 'Demo booking: Discover Scuba · North Obhur - Jeddah',
      testId
    );
  }, [isRtl, soundEnabled]);

  return {
    permission,
    soundEnabled,
    notifications,
    unreadCount,
    latestAlert,
    requestPermission,
    toggleSound,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    sendTestNotification,
  };
}
