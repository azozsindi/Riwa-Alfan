import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { BookingRecord } from '../types/admin';

export interface TelegramSubscriber {
  id: string;
  chatId: string;
  label: string;
  username?: string;
  chatType?: 'private' | 'group' | 'supergroup' | 'channel';
  enabled: boolean;
  addedByEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TelegramBotStatus {
  ok: boolean;
  configured: boolean;
  connected: boolean;
  botUsername: string;
  botName: string;
  subscribersCount: number;
  envChatIdsCount: number;
  error?: string;
}

export interface DiscoveredTelegramChat {
  chatId: string;
  title: string;
  username?: string;
  chatType: 'private' | 'group' | 'supergroup' | 'channel';
  lastText?: string;
  date?: string;
}

export const toTelegramSubscriberDocId = (chatId: string): string => {
  const safe = String(chatId || '')
    .trim()
    .replace(/^@/, 'channel_')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120);
  return `tg_${safe}`;
};

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const fetchTelegramBotStatus = async (): Promise<TelegramBotStatus> => {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/telegram/status', { headers });
  return (await res.json()) as TelegramBotStatus;
};

export const discoverTelegramChats = async (): Promise<{
  ok: boolean;
  chats?: DiscoveredTelegramChat[];
  error?: string;
}> => {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/telegram/discover', {
    method: 'POST',
    headers,
  });
  return (await res.json()) as {
    ok: boolean;
    chats?: DiscoveredTelegramChat[];
    error?: string;
  };
};

export const syncTelegramSubscribersToServer = async (
  subscribers: TelegramSubscriber[]
): Promise<void> => {
  try {
    if (!auth.currentUser) return;
    const headers = await getAuthHeaders();
    await fetch('/api/telegram/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscribers }),
    });
  } catch (err) {
    console.warn('Telegram subscriber sync notice:', err);
  }
};

export const sendTelegramTestNotification = async (
  chatId?: string
): Promise<{
  ok: boolean;
  sentCount?: number;
  errors?: string[];
  error?: string;
}> => {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/telegram/test', {
    method: 'POST',
    headers,
    body: JSON.stringify(chatId ? { chatId } : {}),
  });
  return (await res.json()) as {
    ok: boolean;
    sentCount?: number;
    errors?: string[];
    error?: string;
  };
};

export const subscribeToTelegramSubscribers = (
  onUpdate: (subscribers: TelegramSubscriber[]) => void
): Unsubscribe => {
  return onSnapshot(
    collection(db, 'telegram_subscribers'),
    (snapshot) => {
      const list: TelegramSubscriber[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Partial<TelegramSubscriber>;
        if (data && data.chatId) {
          list.push({
            id: d.id,
            chatId: String(data.chatId),
            label: String(data.label || data.chatId),
            username: data.username,
            chatType: data.chatType || 'private',
            enabled: Boolean(data.enabled),
            addedByEmail: data.addedByEmail,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt,
          });
        }
      });
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      onUpdate(list);
      void syncTelegramSubscribersToServer(list);
    },
    (err) => {
      console.warn('Telegram subscribers listener notice:', err);
    }
  );
};

export const syncExistingTelegramSubscribersOnBoot = async (): Promise<void> => {
  try {
    const snap = await getDocs(collection(db, 'telegram_subscribers'));
    const list: TelegramSubscriber[] = [];
    snap.forEach((d) => {
      const data = d.data() as Partial<TelegramSubscriber>;
      if (data && data.chatId) {
        list.push({
          id: d.id,
          chatId: String(data.chatId),
          label: String(data.label || data.chatId),
          username: data.username,
          chatType: data.chatType || 'private',
          enabled: Boolean(data.enabled),
          addedByEmail: data.addedByEmail,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
        });
      }
    });
    if (list.length > 0) {
      await syncTelegramSubscribersToServer(list);
    }
  } catch {
    // Ignore if user does not have permission or offline
  }
};

export const saveTelegramSubscriber = async (input: {
  chatId: string;
  label: string;
  username?: string;
  chatType?: 'private' | 'group' | 'supergroup' | 'channel';
  enabled?: boolean;
}): Promise<TelegramSubscriber> => {
  const cleanChatId = input.chatId.trim().slice(0, 64);
  const id = toTelegramSubscriberDocId(cleanChatId);
  const now = new Date().toISOString();

  const record: TelegramSubscriber = {
    id,
    chatId: cleanChatId,
    label: (input.label || cleanChatId).trim().slice(0, 150),
    username: input.username ? input.username.replace(/^@/, '').slice(0, 100) : undefined,
    chatType: input.chatType || 'private',
    enabled: input.enabled ?? true,
    addedByEmail: auth.currentUser?.email?.toLowerCase().slice(0, 150) || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const cleanPayload = JSON.parse(JSON.stringify(record));
  await setDoc(doc(db, 'telegram_subscribers', id), cleanPayload, { merge: true });
  return record;
};

export const toggleTelegramSubscriber = async (
  subscriber: TelegramSubscriber
): Promise<void> => {
  await setDoc(
    doc(db, 'telegram_subscribers', subscriber.id),
    {
      enabled: !subscriber.enabled,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

export const deleteTelegramSubscriber = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'telegram_subscribers', id));
};

export const notifyTelegramOnNewBooking = async (
  booking: BookingRecord
): Promise<void> => {
  try {
    await fetch('/api/telegram/notify-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: booking.id,
        name: booking.name,
        phone: booking.phone,
        interest: booking.interest,
        experience: booking.experience,
        timing: booking.timing,
        notes: booking.notes,
        bookingType: booking.bookingType,
        preliminaryEligibility: booking.preliminaryEligibility,
        paymentAmount: booking.paymentAmount,
        createdAt: booking.createdAt,
      }),
    });
  } catch (err) {
    console.warn('Telegram booking notification hook notice:', err);
  }
};
