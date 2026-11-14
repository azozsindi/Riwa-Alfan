import React, { useEffect, useState } from 'react';
import {
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Power,
  ExternalLink,
  RefreshCw,
  Plus,
  MessageSquare,
  BellRing,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  deleteTelegramSubscriber,
  discoverTelegramChats,
  DiscoveredTelegramChat,
  fetchTelegramBotStatus,
  saveTelegramSubscriber,
  sendTelegramTestNotification,
  subscribeToTelegramSubscribers,
  TelegramBotStatus,
  TelegramSubscriber,
  toggleTelegramSubscriber,
} from '../../services/telegramService';

interface TelegramNotificationsCardProps {
  showToast: (msg?: string) => void;
}

export const TelegramNotificationsCard: React.FC<TelegramNotificationsCardProps> = ({
  showToast,
}) => {
  const { isRtl } = useLanguage();

  const [botStatus, setBotStatus] = useState<TelegramBotStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [subscribers, setSubscribers] = useState<TelegramSubscriber[]>([]);
  const [discoveredChats, setDiscoveredChats] = useState<DiscoveredTelegramChat[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const [manualChatId, setManualChatId] = useState('');
  const [manualLabel, setManualLabel] = useState('');
  const [isAddingManual, setIsAddingManual] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testingChatId, setTestingChatId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadBotStatus = async () => {
    try {
      setLoadingStatus(true);
      const status = await fetchTelegramBotStatus();
      setBotStatus(status);
    } catch (err) {
      console.warn('Telegram status fetch note:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    void loadBotStatus();
    const unsub = subscribeToTelegramSubscribers((list) => {
      setSubscribers(list);
    });
    return () => unsub();
  }, []);

  const handleDiscover = async () => {
    setErrorMsg(null);
    setIsDiscovering(true);
    try {
      const res = await discoverTelegramChats();
      if (!res.ok) {
        setErrorMsg(res.error || (isRtl ? 'تعذر جلب المحادثات من البوت.' : 'Failed to discover chats.'));
        return;
      }
      const list = res.chats || [];
      setDiscoveredChats(list);
      if (list.length === 0) {
        showToast(
          isRtl
            ? 'لا توجد رسائل جديدة. افتح البوت واضغط Start أولاً ثم أعد المحاولة.'
            : 'No recent messages found. Send /start to the bot first.'
        );
      } else {
        showToast(
          isRtl
            ? `تم العثور على ${list.length} محادثة نشطة مع البوت!`
            : `Found ${list.length} active bot chats!`
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleLinkDiscoveredChat = async (chat: DiscoveredTelegramChat) => {
    setErrorMsg(null);
    try {
      await saveTelegramSubscriber({
        chatId: chat.chatId,
        label: chat.title || chat.username || chat.chatId,
        username: chat.username,
        chatType: chat.chatType,
        enabled: true,
      });
      showToast(
        isRtl
          ? `تم ربط إشعارات التلجرام مع (${chat.title}) بنجاح!`
          : `Linked Telegram alerts to ${chat.title}!`
      );
      void loadBotStatus();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save subscriber');
    }
  };

  const handleAddManualChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanId = manualChatId.trim();
    if (!cleanId || !/^-?\d{4,32}$|^@[a-zA-Z0-9_]{4,60}$/.test(cleanId)) {
      setErrorMsg(
        isRtl
          ? 'يرجى إدخال رقم Chat ID صحيح (مثل 123456789 أو -1001234567890).'
          : 'Please enter a valid Telegram Chat ID (e.g. 123456789 or -100...).'
      );
      return;
    }

    try {
      setIsAddingManual(true);
      await saveTelegramSubscriber({
        chatId: cleanId,
        label: manualLabel.trim() || cleanId,
        chatType: cleanId.startsWith('-100') ? 'supergroup' : cleanId.startsWith('-') ? 'group' : cleanId.startsWith('@') ? 'channel' : 'private',
        enabled: true,
      });
      setManualChatId('');
      setManualLabel('');
      showToast(isRtl ? 'تمت إضافة معرف التلجرام بنجاح!' : 'Telegram Chat ID added!');
      void loadBotStatus();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add Chat ID');
    } finally {
      setIsAddingManual(false);
    }
  };

  const handleTestSend = async (targetChatId?: string) => {
    setErrorMsg(null);
    if (targetChatId) {
      setTestingChatId(targetChatId);
    } else {
      setIsTesting(true);
    }
    try {
      const res = await sendTelegramTestNotification(targetChatId);
      if (!res.ok) {
        setErrorMsg(
          res.error ||
            (isRtl
              ? 'فشل إرسال الرسالة التجريبية. تأكد من الضغط على Start داخل البوت.'
              : 'Failed to send test message.')
        );
        return;
      }
      showToast(
        isRtl
          ? 'تم إرسال رسالة تجريبية إلى التلجرام بنجاح!'
          : 'Test notification delivered to Telegram!'
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsTesting(false);
      setTestingChatId(null);
    }
  };

  const botUsername = botStatus?.botUsername || 'Riwaa_alfan_bot';
  const botUrl = `https://t.me/${botUsername}`;

  return (
    <div
      id="telegram-notifications-settings"
      className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-5"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header + Bot Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/90">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-black text-white">
                {isRtl ? 'إشعارات الحجوزات الفورية عبر تلجرام' : 'Telegram Instant Booking Alerts'}
              </h4>
              {loadingStatus ? (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                  {isRtl ? 'جارِ الفحص...' : 'Checking...'}
                </span>
              ) : botStatus?.connected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isRtl ? 'البوت متصل' : 'Bot Connected'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                  <AlertCircle className="w-3 h-3" />
                  <span>{isRtl ? 'يتطلب تفعيل التوكن على الخادم' : 'Server Token Needed'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl
                ? `البوت الرسمي (@${botUsername}) يرسل تفاصيل كل حجز جديد مع أزرار واتساب ولوحة التحكم تلقائياً.`
                : `Official bot (@${botUsername}) sends instant customer booking alerts with direct WhatsApp links.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-sky-600/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isRtl ? 'فتح البوت' : 'Open Bot'}</span>
          </a>

          <button
            type="button"
            onClick={() => void loadBotStatus()}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer flex items-center justify-center"
            title={isRtl ? 'تحديث حالة البوت' : 'Refresh bot status'}
          >
            <RefreshCw className={`w-4 h-4 ${loadingStatus ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Step-by-Step Setup Instructions */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
        <span className="font-bold text-sky-300 block">
          {isRtl ? 'خطوات ربط جوالك أو قروب الفريق (دقيقة واحدة):' : 'How to link your Telegram (1 minute):'}
        </span>
        <ol className="list-decimal list-inside space-y-1 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          <li>
            {isRtl ? (
              <>
                اضغط على زر <strong className="text-white">فتح البوت</strong> أعلاه وافتح{' '}
                <span className="font-mono text-sky-300" dir="ltr">@{botUsername}</span> ثم اضغط{' '}
                <strong className="text-white">ابدأ / Start</strong> (أو أضف البوت لقروب الإدارة وأرسل رسالة).
              </>
            ) : (
              <>Open @{botUsername} on Telegram and press Start (or add it to your staff group).</>
            )}
          </li>
          <li>
            {isRtl
              ? 'اضغط زر "جلب المحادثات من البوت" بالأسفل، ثم اضغط "ربط الإشعارات" بجانب اسمك.'
              : 'Click "Find Active Bot Chats" below, then click "Link Alerts" next to your chat.'}
          </li>
        </ol>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Auto Discover Button & Results */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDiscover}
            disabled={isDiscovering || !botStatus?.connected}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Search className={`w-4 h-4 ${isDiscovering ? 'animate-pulse' : ''}`} />
            <span>
              {isDiscovering
                ? isRtl ? 'جارِ البحث في رسائل البوت...' : 'Searching bot messages...'
                : isRtl ? 'جلب المحادثات التي راسلت البوت' : 'Find Active Bot Chats'}
            </span>
          </button>

          {subscribers.some((s) => s.enabled) && (
            <button
              type="button"
              onClick={() => void handleTestSend()}
              disabled={isTesting}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <BellRing className={`w-4 h-4 ${isTesting ? 'animate-bounce' : ''}`} />
              <span>
                {isTesting
                  ? isRtl ? 'جارِ الإرسال...' : 'Sending...'
                  : isRtl ? 'إرسال إشعار تجريبي للتلجرام' : 'Send Test Telegram Alert'}
              </span>
            </button>
          )}
        </div>

        {discoveredChats.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 block">
              {isRtl ? 'المحادثات المكتشفة حديثاً:' : 'Recently Discovered Chats:'}
            </span>
            <div className="space-y-2">
              {discoveredChats.map((chat) => {
                const isLinked = subscribers.some((s) => s.chatId === chat.chatId);
                return (
                  <div
                    key={chat.chatId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate">{chat.title}</span>
                        {chat.username && (
                          <span className="text-[11px] font-mono text-sky-300" dir="ltr">
                            @{chat.username}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono" dir="ltr">
                          {chat.chatId}
                        </span>
                      </div>
                      {chat.lastText && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {chat.lastText}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleLinkDiscoveredChat(chat)}
                      disabled={isLinked}
                      className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                        isLinked
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-sky-600 hover:bg-sky-500 text-white'
                      }`}
                    >
                      {isLinked
                        ? isRtl ? 'مربوط بالفعل ✓' : 'Linked ✓'
                        : isRtl ? 'ربط الإشعارات +' : 'Link Chat +'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Linked Subscribers List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">
            {isRtl
              ? `الحسابات والمجموعات المربوطة (${subscribers.length})`
              : `Linked Recipients (${subscribers.length})`}
          </span>
          {(botStatus?.envChatIdsCount ?? 0) > 0 && (
            <span className="text-[11px] text-slate-400 font-mono">
              +{botStatus?.envChatIdsCount} ENV
            </span>
          )}
        </div>

        {subscribers.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            {isRtl
              ? 'لم يتم ربط أي حساب تلجرام حتى الآن. استخدم زر "جلب المحادثات" أعلاه أو أضف Chat ID يدوياً.'
              : 'No Telegram chats linked yet. Discover chats above or add a Chat ID manually.'}
          </div>
        ) : (
          <div className="space-y-2">
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white">{sub.label}</span>
                    {sub.username && (
                      <span className="text-[11px] font-mono text-sky-300" dir="ltr">
                        @{sub.username}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400" dir="ltr">
                      {sub.chatId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.enabled
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sub.enabled ? (isRtl ? 'نشط' : 'Active') : isRtl ? 'متوقف مؤقتاً' : 'Paused'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => void handleTestSend(sub.chatId)}
                    disabled={testingChatId === sub.chatId}
                    className="min-h-[34px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    {testingChatId === sub.chatId
                      ? '...'
                      : isRtl ? 'تجربة' : 'Test'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void toggleTelegramSubscriber(sub)}
                    className={`min-h-[34px] min-w-[34px] p-1.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-center ${
                      sub.enabled
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                    title={sub.enabled ? (isRtl ? 'إيقاف مؤقت' : 'Pause') : isRtl ? 'تفعيل' : 'Enable'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => void deleteTelegramSubscriber(sub.id)}
                    className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 cursor-pointer transition-colors flex items-center justify-center"
                    title={isRtl ? 'حذف' : 'Remove'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Chat ID Form */}
      <form onSubmit={handleAddManualChat} className="pt-3 border-t border-slate-800/80 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 block">
          {isRtl ? 'أو أضف معرف المحادثة (Chat ID) يدوياً:' : 'Or add a Chat ID manually:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={manualChatId}
              onChange={(e) => setManualChatId(e.target.value)}
              placeholder={isRtl ? 'مثال: 123456789 أو -100...' : 'e.g. 123456789 or -100...'}
              dir="ltr"
              className="w-full min-h-[38px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-5">
            <input
              type="text"
              value={manualLabel}
              onChange={(e) => setManualLabel(e.target.value)}
              placeholder={isRtl ? 'الاسم التوضيحي (مثال: الكابتن عبدالعزيز)' : 'Label (e.g. Lead Captain)'}
              className="w-full min-h-[38px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isAddingManual}
              className="w-full min-h-[38px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>{isRtl ? 'إضافة' : 'Add'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
