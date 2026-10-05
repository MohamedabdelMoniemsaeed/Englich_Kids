import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // e.g. "17:00"
  frequency: 'daily' | 'twice_daily' | 'weekdays';
  learningReminder: boolean;
  gamesChallenge: boolean;
  motivationalPraise: boolean;
  soundEnabled: boolean;
  lastNotifiedDate?: string;
}

export interface ActiveBannerItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
}

const STORAGE_KEY = 'english_kids_notifications_config_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  reminderTime: '17:00', // 5:00 PM
  frequency: 'daily',
  learningReminder: true,
  gamesChallenge: true,
  motivationalPraise: true,
  soundEnabled: true,
};

export const NOTIFICATION_TEMPLATES = [
  {
    title: 'English Kids Adventure! 🌟',
    body: "Let's explore today's ABC letter and win shiny stars! ⭐ وقت مغامرة الحروف الإنجليزية!",
    type: 'learning'
  },
  {
    title: 'Who is roaring today? 🦁',
    body: "Come meet your animal friends and hear their English names! 🐾 حيوان اليوم بانتظارك!",
    type: 'learning'
  },
  {
    title: 'Balloon & Memory Challenge! 🎈',
    body: "Ready for a fun 2-minute kids mini-game? 🧩 هيا نلعب تحدي البالونات والذاكرة!",
    type: 'games'
  },
  {
    title: 'Colors & Shapes Explorer! 🎨',
    body: "Can you spot the red circle and blue star? 🔷 اكتشف الألوان والأشكال الهندسية!",
    type: 'learning'
  },
  {
    title: 'Awesome Little Hero! 🏆',
    body: "Keep up the great learning today! You are getting smarter every day! 🚀 أنت بطل رائع!",
    type: 'motivation'
  },
  {
    title: 'Numbers & Counting Quest! 🔢',
    body: "Count 1 to 10 with funny sounds! 🍎 دعنا نعد من 1 إلى 10 مع التفاحات اللذيذة!",
    type: 'learning'
  }
];

// Banner Subscribers
type BannerCallback = (item: ActiveBannerItem) => void;
const bannerListeners = new Set<BannerCallback>();

export function subscribeToNotificationBanner(callback: BannerCallback): () => void {
  bannerListeners.add(callback);
  return () => {
    bannerListeners.delete(callback);
  };
}

export function triggerBannerNotification(title: string, body: string): void {
  const item: ActiveBannerItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title,
    body,
    timestamp: Date.now()
  };
  bannerListeners.forEach((fn) => fn(item));

  // Trigger device vibration if available
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([120, 60, 120]);
    } catch {
      // ignore
    }
  }
}

export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    scheduleOrUpdateNotifications(settings).catch(() => {});
  } catch {
    // Ignore storage errors
  }
}

export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) return true;
  return 'Notification' in window || ('serviceWorker' in navigator && 'PushManager' in window);
}

export async function getNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (typeof window === 'undefined') return 'default';

  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'default';
    }
  }

  if (isInIframe()) {
    // Inside iframe, Notification.permission often defaults to denied/default
    const settings = getNotificationSettings();
    return settings.enabled ? 'granted' : 'default';
  }

  if ('Notification' in window) {
    return Notification.permission;
  }
  return 'default';
}

export async function requestNotificationPermission(): Promise<{
  granted: boolean;
  inIframe: boolean;
  reason?: string;
}> {
  if (typeof window === 'undefined') {
    return { granted: false, inIframe: false };
  }

  const inIframe = isInIframe();

  // 1. If running natively in Capacitor (Android)
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.requestPermissions();
      return { granted: status.display === 'granted', inIframe: false };
    } catch (e: any) {
      return { granted: false, inIframe: false, reason: e?.message };
    }
  }

  // 2. If running inside an iframe (AI Studio preview)
  if (inIframe) {
    // Browsers intentionally forbid cross-origin iframes from requesting OS notification permissions.
    // Instead of failing or doing nothing, we grant in-app system notification permissions so the user can enjoy all reminders!
    return {
      granted: true,
      inIframe: true,
      reason: 'in_iframe'
    };
  }

  // 3. Standalone Browser Window
  if ('Notification' in window) {
    try {
      const perm = await new Promise<NotificationPermission>((resolve) => {
        try {
          const res = Notification.requestPermission((p) => {
            if (p) resolve(p);
          });
          if (res && typeof (res as any).then === 'function') {
            (res as any).then(resolve).catch(() => resolve('denied'));
          }
        } catch {
          resolve('denied');
        }
      });
      return { granted: perm === 'granted', inIframe: false };
    } catch (err: any) {
      return { granted: false, inIframe: false, reason: err?.message };
    }
  }

  return { granted: true, inIframe: false };
}

// Low-level sender for system notification (outside app)
export async function sendLocalNotification(
  title: string,
  body: string,
  options?: { tag?: string; data?: any; sound?: boolean }
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Always trigger the immediate floating system banner for guaranteed in-app visibility
  triggerBannerNotification(title, body);

  let osDelivered = false;

  // 1. Native Capacitor Android/iOS Local Notifications
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        if (req.display !== 'granted') return true;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000) + 1,
            title,
            body,
            schedule: { at: new Date(Date.now() + 300) },
            sound: options?.sound !== false ? 'beep.wav' : undefined,
            smallIcon: 'ic_launcher',
            iconColor: '#3B82F6',
            actionTypeId: 'OPEN_APP'
          }
        ]
      });
      osDelivered = true;
    } catch {
      // Fall through
    }
  }

  // 2. Service Worker showNotification (Best for Android Chrome / Desktop PWA)
  if (!isInIframe() && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, {
          body,
          icon: './icon-192.png',
          badge: './favicon.png',
          tag: options?.tag || 'english-kids-reminder',
          vibrate: [100, 50, 100],
          data: { url: '/', ...(options?.data || {}) },
          silent: options?.sound === false
        } as any);
        osDelivered = true;
      }
    } catch {
      // Fall through to regular window Notification
    }
  }

  // 3. Browser Notification API (if not in iframe and permission granted)
  if (!isInIframe() && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: './icon-192.png',
        badge: './favicon.png',
        tag: options?.tag || 'english-kids-reminder',
        silent: options?.sound === false
      });
      osDelivered = true;
    } catch {
      // ignore
    }
  }

  return true;
}

export function getRandomKidNotification(): { title: string; body: string } {
  const index = Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length);
  const item = NOTIFICATION_TEMPLATES[index];
  return { title: item.title, body: item.body };
}

// Immediate Test Notification
export async function sendTestNotification(): Promise<boolean> {
  const sample = getRandomKidNotification();
  return sendLocalNotification(sample.title, sample.body, {
    tag: `test-${Date.now()}`,
    sound: true
  });
}

// Schedule system notifications for native or background worker
export async function scheduleOrUpdateNotifications(settings: NotificationSettings): Promise<void> {
  if (!settings.enabled) {
    if (Capacitor.isNativePlatform()) {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
      } catch {
        // ignore
      }
    }
    return;
  }

  if (Capacitor.isNativePlatform()) {
    try {
      const [hourStr, minStr] = settings.reminderTime.split(':');
      const hour = parseInt(hourStr || '17', 10);
      const minute = parseInt(minStr || '0', 10);

      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      if (target.getTime() <= Date.now()) {
        target.setDate(target.getDate() + 1);
      }

      await LocalNotifications.cancel({
        notifications: [{ id: 101 }, { id: 102 }]
      });

      const sample = getRandomKidNotification();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 101,
            title: sample.title,
            body: sample.body,
            schedule: {
              on: { hour, minute },
              repeats: true,
              allowWhileIdle: true
            },
            sound: settings.soundEnabled ? 'beep.wav' : undefined,
            smallIcon: 'ic_launcher',
            iconColor: '#3B82F6'
          }
        ]
      });
    } catch {
      // ignore
    }
  }
}

// Real-time scheduler watcher while app or tab is open
let schedulerInterval: any = null;

export function initNotificationScheduler(): () => void {
  if (typeof window === 'undefined') return () => {};

  const checkAndTrigger = async () => {
    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Check if weekday check applies
    if (settings.frequency === 'weekdays') {
      const day = now.getDay();
      if (day === 0 || day === 6) return; // Skip weekends
    }

    const [schedH, schedM] = settings.reminderTime.split(':').map(Number);
    const currentH = now.getHours();
    const currentM = now.getMinutes();

    // Trigger within the target minute if not yet sent today
    if (currentH === schedH && currentM === schedM && settings.lastNotifiedDate !== todayStr) {
      const item = getRandomKidNotification();
      await sendLocalNotification(item.title, item.body, {
        sound: settings.soundEnabled
      });
      saveNotificationSettings({
        ...settings,
        lastNotifiedDate: todayStr
      });
    }
  };

  checkAndTrigger();

  if (schedulerInterval) clearInterval(schedulerInterval);
  schedulerInterval = setInterval(checkAndTrigger, 30000);

  return () => {
    if (schedulerInterval) {
      clearInterval(schedulerInterval);
      schedulerInterval = null;
    }
  };
}
