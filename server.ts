import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FirebaseClientConfig {
  projectId: string;
  apiKey: string;
  firestoreDatabaseId: string;
}

interface TelegramSubscriberRecord {
  id: string;
  chatId: string;
  label: string;
  username?: string;
  chatType?: 'private' | 'group' | 'supergroup' | 'channel';
  enabled: boolean;
  addedByEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StoredTelegramConfig {
  subscribers: TelegramSubscriberRecord[];
  updatedAt: string;
}

interface DiscoveredTelegramChat {
  chatId: string;
  title: string;
  username?: string;
  chatType: 'private' | 'group' | 'supergroup' | 'channel';
  lastText?: string;
  date?: string;
}

interface NotifyBookingPayload {
  id: string;
  name: string;
  phone: string;
  interest: string;
  experience?: string;
  timing?: string;
  notes?: string;
  bookingType?: string;
  preliminaryEligibility?: string;
  paymentAmount?: string;
  createdAt?: string;
}

const BOOTSTRAPPED_SUPERADMINS = new Set([
  'azozsindi23@gmail.com',
  'riwaalfan@gmail.com',
]);

const firebaseConfigPath = path.resolve(__dirname, 'firebase-applet-config.json');
const firebaseConfig: FirebaseClientConfig = JSON.parse(
  fs.readFileSync(firebaseConfigPath, 'utf-8')
);

const DATA_DIR = path.resolve(__dirname, '.data');
const TELEGRAM_STORE_PATH = path.join(DATA_DIR, 'telegram-config.json');

const cleanEnvValue = (val: string | undefined): string =>
  String(val || '').trim().replace(/^["']|["']$/g, '');

const getBotToken = (): string => cleanEnvValue(process.env.TELEGRAM_BOT_TOKEN);

const getEnvChatIds = (): string[] =>
  cleanEnvValue(process.env.TELEGRAM_CHAT_IDS)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^-?\d{4,32}$|^@[a-zA-Z0-9_]{4,60}$/.test(s));

const readStoredTelegramConfig = (): StoredTelegramConfig => {
  try {
    if (fs.existsSync(TELEGRAM_STORE_PATH)) {
      const raw = fs.readFileSync(TELEGRAM_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoredTelegramConfig>;
      if (Array.isArray(parsed.subscribers)) {
        return {
          subscribers: parsed.subscribers,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Notice reading .data/telegram-config.json:', err);
  }
  return { subscribers: [], updatedAt: new Date().toISOString() };
};

const writeStoredTelegramConfig = (subscribers: TelegramSubscriberRecord[]): void => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload: StoredTelegramConfig = {
      subscribers,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(TELEGRAM_STORE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice writing .data/telegram-config.json:', err);
  }
};

const getActiveChatTargets = (): { chatId: string; label: string }[] => {
  const map = new Map<string, string>();
  const stored = readStoredTelegramConfig();
  for (const sub of stored.subscribers) {
    if (sub.enabled && sub.chatId) {
      map.set(String(sub.chatId).trim(), sub.label || sub.chatId);
    }
  }
  for (const envId of getEnvChatIds()) {
    if (!map.has(envId)) {
      map.set(envId, 'ENV Subscriber');
    }
  }
  return Array.from(map.entries()).map(([chatId, label]) => ({ chatId, label }));
};

const escapeHtml = (input: string | undefined): string =>
  String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const formatWhatsAppPhone = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('05') && digits.length === 10) {
    return `966${digits.slice(1)}`;
  }
  if (digits.startsWith('5') && digits.length === 9) {
    return `966${digits}`;
  }
  return digits;
};

const callTelegramApi = async <T = unknown>(
  method: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; result?: T; description?: string }> => {
  const token = getBotToken();
  if (!token) {
    return { ok: false, description: 'TELEGRAM_BOT_TOKEN is not configured on the server.' };
  }

  const url = `https://api.telegram.org/bot${token}/${method}`;
  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await response.json()) as {
    ok: boolean;
    result?: T;
    description?: string;
  };
  return json;
};

const verifyFirebaseAdmin = async (
  req: Request
): Promise<{ authorized: boolean; uid?: string; email?: string; reason?: string }> => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { authorized: false, reason: 'Missing Authorization Bearer token' };
  }

  const idToken = match[1].trim();
  if (!idToken) {
    return { authorized: false, reason: 'Empty ID token' };
  }

  try {
    const lookupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!lookupRes.ok) {
      return { authorized: false, reason: 'Invalid Firebase ID token' };
    }

    const lookupData = (await lookupRes.json()) as {
      users?: Array<{
        localId: string;
        email?: string;
        emailVerified?: boolean;
        providerUserInfo?: Array<{ providerId?: string }>;
      }>;
    };

    const fbUser = lookupData.users?.[0];
    if (!fbUser?.localId) {
      return { authorized: false, reason: 'User not found for ID token' };
    }

    const email = (fbUser.email || '').trim().toLowerCase();
    const isGoogle = fbUser.providerUserInfo?.some((p) => p.providerId === 'google.com') ?? false;
    const isVerified = Boolean(fbUser.emailVerified || isGoogle);

    if (BOOTSTRAPPED_SUPERADMINS.has(email) && isVerified) {
      return { authorized: true, uid: fbUser.localId, email };
    }

    const adminDocUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/admins/${encodeURIComponent(fbUser.localId)}`;
    const adminDocRes = await fetch(adminDocUrl, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!adminDocRes.ok) {
      return { authorized: false, reason: 'Not registered in admins whitelist' };
    }

    const adminDocJson = (await adminDocRes.json()) as {
      fields?: {
        role?: { stringValue?: string };
        status?: { stringValue?: string };
      };
    };

    const role = adminDocJson.fields?.role?.stringValue || '';
    const status = adminDocJson.fields?.status?.stringValue || 'active';

    if (status !== 'suspended' && ['superadmin', 'admin', 'instructor'].includes(role)) {
      return { authorized: true, uid: fbUser.localId, email };
    }

    return { authorized: false, reason: 'Insufficient admin role or account suspended' };
  } catch (err) {
    console.error('Admin verification error:', err);
    return { authorized: false, reason: 'Verification service error' };
  }
};

const verifyBookingExistsInFirestore = async (bookingId: string): Promise<boolean> => {
  if (!/^[a-zA-Z0-9_-]{3,128}$/.test(bookingId)) {
    return false;
  }

  const statusUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/booking_status/${encodeURIComponent(bookingId)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(statusUrl);
      if (res.ok) {
        return true;
      }
    } catch {
      // Retry shortly on transient network issue
    }
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
  return false;
};

// In-memory deduplication for booking notifications (prevents double-pings)
const notifiedBookings = new Map<string, number>();

const markAndCheckDuplicateBooking = (bookingId: string): boolean => {
  const now = Date.now();
  for (const [id, ts] of notifiedBookings.entries()) {
    if (now - ts > 15 * 60 * 1000) {
      notifiedBookings.delete(id);
    }
  }
  if (notifiedBookings.has(bookingId)) {
    return true;
  }
  notifiedBookings.set(bookingId, now);
  return false;
};

const getPublicBaseUrl = (req: Request): string => {
  const envUrl = cleanEnvValue(process.env.APP_URL);
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || '';
  return host ? `${proto}://${host}` : '';
};

const buildBookingTelegramMessage = (b: NotifyBookingPayload, dashboardUrl: string) => {
  const cleanPhone = b.phone.trim();
  const waDigits = formatWhatsAppPhone(cleanPhone);

  const eligibilityLabel =
    b.preliminaryEligibility === 'eligible'
      ? '✅ مؤهل مبدئياً'
      : b.preliminaryEligibility === 'missing_requirements'
      ? '⚠️ يحتاج مراجعة المتطلبات'
      : '📋 قيد مراجعة الكابتن';

  const lines = [
    '🤿 <b>حجز جديد — مركز رواء الفن للغوص</b>',
    '━━━━━━━━━━━━━━━━━━',
    `🆔 <b>رقم الطلب:</b> <code>${escapeHtml(b.id)}</code>`,
    `👤 <b>الاسم:</b> ${escapeHtml(b.name)}`,
    `📱 <b>الجوال:</b> <code>${escapeHtml(cleanPhone)}</code>`,
    `🌊 <b>البرنامج / الطلب:</b> ${escapeHtml(b.interest)}`,
  ];

  if (b.experience) {
    lines.push(`🏅 <b>مستوى الخبرة:</b> ${escapeHtml(b.experience)}`);
  }
  if (b.timing) {
    lines.push(`🗓 <b>التوقيت المفضل:</b> ${escapeHtml(b.timing)}`);
  }
  if (b.paymentAmount) {
    lines.push(`💳 <b>المبلغ التقديري:</b> ${escapeHtml(b.paymentAmount)}`);
  }
  lines.push(`🔎 <b>التقييم الأولي:</b> ${eligibilityLabel}`);

  if (b.notes) {
    lines.push(`📝 <b>ملاحظات:</b> ${escapeHtml(b.notes.slice(0, 400))}`);
  }

  lines.push('━━━━━━━━━━━━━━━━━━');
  lines.push('📍 <i>أبحر الشمالية - جدة</i>');

  const inlineButtons: Array<{ text: string; url: string }> = [];
  if (waDigits) {
    inlineButtons.push({
      text: '💬 مراسلة العميل واتساب',
      url: `https://wa.me/${waDigits}`,
    });
  }
  if (dashboardUrl) {
    inlineButtons.push({
      text: '📊 فتح لوحة التحكم',
      url: `${dashboardUrl}/admin`,
    });
  }

  return {
    text: lines.join('\n'),
    reply_markup: inlineButtons.length > 0 ? { inline_keyboard: [inlineButtons] } : undefined,
  };
};

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '256kb' }));

  // 1. Telegram Bot Health / Status (authenticated admins)
  app.get('/api/telegram/status', async (req: Request, res: Response) => {
    const authCheck = await verifyFirebaseAdmin(req);
    if (!authCheck.authorized) {
      res.status(401).json({ ok: false, error: authCheck.reason || 'Unauthorized' });
      return;
    }

    const token = getBotToken();
    const envChatIds = getEnvChatIds();
    const stored = readStoredTelegramConfig();

    if (!token) {
      res.json({
        ok: true,
        configured: false,
        connected: false,
        botUsername: 'Riwaa_alfan_bot',
        botName: '',
        subscribersCount: stored.subscribers.filter((s) => s.enabled).length + envChatIds.length,
        envChatIdsCount: envChatIds.length,
        error: 'TELEGRAM_BOT_TOKEN is missing on server',
      });
      return;
    }

    try {
      const me = await callTelegramApi<{ id: number; username?: string; first_name?: string }>('getMe');
      res.json({
        ok: true,
        configured: true,
        connected: Boolean(me.ok && me.result),
        botUsername: me.result?.username || 'Riwaa_alfan_bot',
        botName: me.result?.first_name || 'Riwa Alfan Bot',
        subscribersCount: stored.subscribers.filter((s) => s.enabled).length + envChatIds.length,
        envChatIdsCount: envChatIds.length,
        error: me.ok ? undefined : me.description,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        configured: true,
        connected: false,
        error: err instanceof Error ? err.message : 'Telegram status check failed',
      });
    }
  });

  // 2. Discover recent Telegram chats that sent /start or messages to @Riwaa_alfan_bot
  app.post('/api/telegram/discover', async (req: Request, res: Response) => {
    const authCheck = await verifyFirebaseAdmin(req);
    if (!authCheck.authorized) {
      res.status(401).json({ ok: false, error: authCheck.reason || 'Unauthorized' });
      return;
    }

    const token = getBotToken();
    if (!token) {
      res.status(400).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN is not configured on server.' });
      return;
    }

    try {
      interface TgChat {
        id: number;
        type: 'private' | 'group' | 'supergroup' | 'channel';
        title?: string;
        username?: string;
        first_name?: string;
        last_name?: string;
      }

      interface TgUpdate {
        update_id: number;
        message?: {
          date?: number;
          text?: string;
          chat?: TgChat;
        };
        edited_message?: {
          date?: number;
          text?: string;
          chat?: TgChat;
        };
        my_chat_member?: {
          date?: number;
          chat?: TgChat;
        };
        channel_post?: {
          date?: number;
          text?: string;
          chat?: TgChat;
        };
      }

      const updatesRes = await callTelegramApi<TgUpdate[]>('getUpdates', {
        limit: 50,
        allowed_updates: ['message', 'edited_message', 'my_chat_member', 'channel_post'],
      });

      if (!updatesRes.ok) {
        res.status(400).json({
          ok: false,
          error: updatesRes.description || 'Failed to read updates from Telegram',
        });
        return;
      }

      const chatMap = new Map<string, DiscoveredTelegramChat>();
      const updates = Array.isArray(updatesRes.result) ? updatesRes.result : [];

      for (const u of updates) {
        const container = u.message || u.edited_message || u.my_chat_member || u.channel_post;
        const chat = container?.chat;
        if (!chat || !chat.id) continue;

        const chatId = String(chat.id);
        const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(' ').trim();
        const title = chat.title || fullName || (chat.username ? `@${chat.username}` : chatId);
        const lastText =
          u.message?.text || u.channel_post?.text || (u.my_chat_member ? '/start' : '');
        const dateIso = container?.date
          ? new Date(container.date * 1000).toISOString()
          : new Date().toISOString();

        chatMap.set(chatId, {
          chatId,
          title,
          username: chat.username,
          chatType: chat.type || 'private',
          lastText: lastText ? lastText.slice(0, 80) : undefined,
          date: dateIso,
        });
      }

      const chats = Array.from(chatMap.values()).reverse();
      res.json({ ok: true, chats });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Discovery failed',
      });
    }
  });

  // 3. Sync linked Firestore subscribers into server-side store
  app.post('/api/telegram/sync', async (req: Request, res: Response) => {
    const authCheck = await verifyFirebaseAdmin(req);
    if (!authCheck.authorized) {
      res.status(401).json({ ok: false, error: authCheck.reason || 'Unauthorized' });
      return;
    }

    const incomingSubs = Array.isArray(req.body?.subscribers)
      ? (req.body.subscribers as TelegramSubscriberRecord[])
      : [];

    const cleaned = incomingSubs
      .filter((s) => s && typeof s.chatId === 'string' && s.chatId.trim().length > 0)
      .slice(0, 50)
      .map((s) => ({
        id: String(s.id || s.chatId).slice(0, 128),
        chatId: String(s.chatId).trim().slice(0, 64),
        label: String(s.label || s.chatId).slice(0, 150),
        username: s.username ? String(s.username).slice(0, 100) : undefined,
        chatType: s.chatType || 'private',
        enabled: Boolean(s.enabled),
        addedByEmail: s.addedByEmail,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));

    writeStoredTelegramConfig(cleaned);
    res.json({
      ok: true,
      activeTargets: getActiveChatTargets().length,
    });
  });

  // 4. Send a Test Notification to linked Telegram chat(s)
  app.post('/api/telegram/test', async (req: Request, res: Response) => {
    const authCheck = await verifyFirebaseAdmin(req);
    if (!authCheck.authorized) {
      res.status(401).json({ ok: false, error: authCheck.reason || 'Unauthorized' });
      return;
    }

    const specificChatId =
      typeof req.body?.chatId === 'string' && req.body.chatId.trim()
        ? req.body.chatId.trim()
        : null;

    const targets = specificChatId
      ? [{ chatId: specificChatId, label: specificChatId }]
      : getActiveChatTargets();

    if (targets.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'لا توجد محادثات تلجرام مربوطة بعد. أرسل /start للبوت ثم اربط حسابك.',
      });
      return;
    }

    const dashboardUrl = getPublicBaseUrl(req);
    const testText = [
      '🔔 <b>اختبار إشعارات مركز رواء الفن للغوص</b>',
      '━━━━━━━━━━━━━━━━━━',
      '✅ تم ربط بوت التلجرام بنجاح!',
      'سيصلك هنا تنبيه فوري يحتوي على اسم العميل ورقم جواله والبرنامج المطلوب فور وصول أي حجز جديد على الموقع.',
      `🕒 ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}`,
    ].join('\n');

    let sentCount = 0;
    const errors: string[] = [];

    for (const target of targets) {
      const result = await callTelegramApi('sendMessage', {
        chat_id: target.chatId,
        text: testText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: dashboardUrl
          ? { inline_keyboard: [[{ text: '📊 فتح لوحة التحكم', url: `${dashboardUrl}/admin` }]] }
          : undefined,
      });
      if (result.ok) {
        sentCount++;
      } else {
        errors.push(`${target.label}: ${result.description || 'Failed'}`);
      }
    }

    if (sentCount === 0) {
      res.status(400).json({
        ok: false,
        sentCount,
        errors,
        error: errors[0] || 'Failed to send test message',
      });
      return;
    }

    res.json({ ok: true, sentCount, errors });
  });

  // 5. Public Booking Notification Hook (verified against Firestore booking_status/{id})
  app.post('/api/telegram/notify-booking', async (req: Request, res: Response) => {
    const body = (req.body || {}) as Partial<NotifyBookingPayload>;
    const bookingId = String(body.id || '').trim();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const interest = String(body.interest || '').trim();

    if (!bookingId || !name || !phone || !interest) {
      res.status(400).json({ ok: false, error: 'Missing required booking fields' });
      return;
    }

    const token = getBotToken();
    const targets = getActiveChatTargets();
    if (!token || targets.length === 0) {
      res.json({ ok: true, skipped: true, reason: 'No active Telegram recipients' });
      return;
    }

    if (markAndCheckDuplicateBooking(bookingId)) {
      res.json({ ok: true, deduplicated: true });
      return;
    }

    const exists = await verifyBookingExistsInFirestore(bookingId);
    if (!exists) {
      res.status(403).json({ ok: false, error: 'Booking verification failed' });
      return;
    }

    const dashboardUrl = getPublicBaseUrl(req);
    const messagePayload = buildBookingTelegramMessage(
      {
        id: bookingId,
        name,
        phone,
        interest,
        experience: body.experience ? String(body.experience) : undefined,
        timing: body.timing ? String(body.timing) : undefined,
        notes: body.notes ? String(body.notes) : undefined,
        bookingType: body.bookingType ? String(body.bookingType) : undefined,
        preliminaryEligibility: body.preliminaryEligibility
          ? String(body.preliminaryEligibility)
          : undefined,
        paymentAmount: body.paymentAmount ? String(body.paymentAmount) : undefined,
        createdAt: body.createdAt ? String(body.createdAt) : undefined,
      },
      dashboardUrl
    );

    let sentCount = 0;
    const errors: string[] = [];

    for (const target of targets) {
      try {
        const result = await callTelegramApi('sendMessage', {
          chat_id: target.chatId,
          text: messagePayload.text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: messagePayload.reply_markup,
        });
        if (result.ok) {
          sentCount++;
        } else {
          errors.push(`${target.chatId}: ${result.description || 'Send error'}`);
        }
      } catch (err) {
        errors.push(`${target.chatId}: ${err instanceof Error ? err.message : 'Network error'}`);
      }
    }

    res.json({ ok: sentCount > 0, sentCount, errors });
  });

  // Frontend serving (Vite dev middleware in dev, dist static files in production)
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Riwa Alfan Dive Center server listening on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
