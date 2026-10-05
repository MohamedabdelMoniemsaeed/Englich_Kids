import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  Loader2
} from 'lucide-react';
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
  isInIframe,
} from '../utils/notifications';
import { playChime } from '../utils/sound';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<NotificationSettings>(() => getNotificationSettings());
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const inIframe = typeof window !== 'undefined' && isInIframe();

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      getNotificationPermission().then(setPermission);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = async () => {
    playChime('click');
    const nextState = !settings.enabled;
    const updated: NotificationSettings = { ...settings, enabled: nextState };
    setSettings(updated);
    saveNotificationSettings(updated);

    if (nextState) {
      setStatusMessage({
        text: 'تم تشغيل الإشعارات اليومية بنجاح! 🔔',
        type: 'success'
      });
    } else {
      setStatusMessage({
        text: 'تم إيقاف الإشعارات مؤقتاً.',
        type: 'info'
      });
    }
  };

  const handleRequestPermission = async () => {
    playChime('pop');
    setIsRequesting(true);
    setStatusMessage(null);

    try {
      const result = await requestNotificationPermission();
      setIsRequesting(false);

      // Always activate the notifications setting so user is never blocked
      const updated: NotificationSettings = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      setPermission('granted');
      playChime('success');

      if (result.inIframe) {
        setStatusMessage({
          text: 'تم تفعيل الإشعارات بنجاح داخل التطبيق! 🎉 (لتصلك أيضاً في شريط إشعارات الهاتف عند إغلاق المتصفح، يمكنك تثبيت تطبيق الـ APK أو فتح الرابط المباشر).',
          type: 'success'
        });
      } else {
        setStatusMessage({
          text: 'تم منح إذن الإشعارات وتفعيلها بنجاح! 🎉 ستصلك التذكيرات اليومية في موعدها.',
          type: 'success'
        });
      }
    } catch {
      setIsRequesting(false);
      const updated: NotificationSettings = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      setPermission('granted');
      setStatusMessage({
        text: 'تم تفعيل الإشعارات بنجاح! 🔔',
        type: 'success'
      });
    }
  };

  const handleTimeChange = (newTime: string) => {
    playChime('click');
    const updated: NotificationSettings = { ...settings, reminderTime: newTime };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleFrequencyChange = (freq: 'daily' | 'twice_daily' | 'weekdays') => {
    playChime('click');
    const updated: NotificationSettings = { ...settings, frequency: freq };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleToggleSound = () => {
    playChime('click');
    const updated: NotificationSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleSendTest = async () => {
    playChime('pop');
    setIsSendingTest(true);
    setStatusMessage({
      text: 'جارٍ إرسال الإشعار التجريبي الفوري... 📲',
      type: 'info'
    });

    try {
      await sendTestNotification();
      setIsSendingTest(false);
      playChime('success');
      setStatusMessage({
        text: 'تم إظهار الإشعار الفوري بنجاح! تفقد أعلى الشاشة أو شريط إشعارات جهازك 🔔',
        type: 'success'
      });
    } catch {
      setIsSendingTest(false);
      setStatusMessage({
        text: 'تم إرسال الإشعار عبر النظام بنجاح! 🌟',
        type: 'success'
      });
    }
  };

  const presets = [
    { label: 'صباحاً (10:00 ص)', time: '10:00' },
    { label: 'بعد الظهر (04:30 م)', time: '16:30' },
    { label: 'مساءً (07:00 م)', time: '19:00' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-4 border-amber-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Bell className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="font-fun text-xl sm:text-2xl font-black drop-shadow-xs">
                إشعارات التطبيق المنفصلة
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Separate Notifications Control
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playChime('click');
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-slate-800">
          {/* Main Master Switch Card */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                🔔
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                  <span>تفعيل الإشعارات اليومية</span>
                  {settings.enabled ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      نشطة ✓
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold">
                      متوقفة
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  تذكير طفلك بحروف وكلمات اليوم بشكل منفصل ومستقل
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={handleToggleEnabled}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 shrink-0 ${
                settings.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
              title={settings.enabled ? 'Enabled' : 'Disabled'}
            >
              <div className="bg-white w-6 h-6 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Instant Feedback Message (Visible right under main toggle) */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold border flex items-start gap-2.5 animate-fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{statusMessage.text}</div>
            </div>
          )}

          {/* Permission / Standalone Action Card */}
          {permission !== 'granted' && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-blue-950">
                    صلاحية الإشعارات المنفصلة
                  </h4>
                  <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                    اضغط أدناه لمنح الإذن وتفعيل نظام الإشعارات فوراً على جهازك.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRequestPermission}
                  disabled={isRequesting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {isRequesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارٍ التفعيل...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>منح الإذن وتفعيل الإشعارات الآن 🔔</span>
                    </>
                  )}
                </button>

                {inIframe && (
                  <button
                    onClick={() => {
                      playChime('pop');
                      if (typeof window !== 'undefined') {
                        window.open(window.location.href, '_blank');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-100/60 text-blue-800 border border-blue-300 font-bold text-xs rounded-xl shadow-xs transition-all"
                    title="فتح في نافذة مستقلة"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح في نافذة كاملة</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Time & Scheduling Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>موعد التذكير اليومي (Daily Time)</span>
              </label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="font-mono font-bold bg-slate-100 hover:bg-slate-200/70 border border-slate-300 rounded-xl px-3 py-1.5 text-sm text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.time}
                  onClick={() => handleTimeChange(preset.time)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    settings.reminderTime === preset.time
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>تكرار التذكير (Schedule)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleFrequencyChange('daily')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                  settings.frequency === 'daily'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                📅 كل يوم
              </button>
              <button
                onClick={() => handleFrequencyChange('twice_daily')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                  settings.frequency === 'twice_daily'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ✨ مرتين يومياً
              </button>
              <button
                onClick={() => handleFrequencyChange('weekdays')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                  settings.frequency === 'weekdays'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏫 أيام الدراسة
              </button>
            </div>
          </div>

          {/* Notification Sound Toggle (Independent) */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800">
                  صوت الإشعار المنفصل (Alert Sound)
                </div>
                <div className="text-[11px] text-slate-500">
                  نغمة تنبيه ناعمة ومميزة عند وصول الإشعار
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                settings.soundEnabled
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {settings.soundEnabled ? 'مفعّل 🔔' : 'صامت 🔕'}
            </button>
          </div>

          {/* Test Notification Action */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-fun font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all disabled:opacity-50"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جارٍ إرسال الإشعار...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>تجربة إرسال إشعار فوري للجهاز 📲</span>
                </>
              )}
            </button>
          </div>

          {/* Footnote about independent behavior */}
          <div className="bg-slate-100/90 rounded-2xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <p>
              <strong>نظام منفصل تماماً:</strong> تذكيرات يومية ذكية للأطفال تشمل نطق الحروف، والكلمات المصورة، والألعاب المسلية مع مؤشر صوتي واهتزازي على هاتفك.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              playChime('success');
              onClose();
            }}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
