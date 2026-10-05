import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Battery, BatteryCharging, Bell, Shield, Sparkles } from 'lucide-react';
import { getNotificationSettings } from '../utils/notifications';

interface TopStatusBarStripProps {
  onOpenNotifications?: () => void;
}

export const TopStatusBarStrip: React.FC<TopStatusBarStripProps> = ({ onOpenNotifications }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const notifSettings = getNotificationSettings();

  useEffect(() => {
    // 1. Live Time Update
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 15000);

    // 2. Online / Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // 3. Real Device Battery info if supported
    if (typeof navigator !== 'undefined' && 'getBattery' in (navigator as any)) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }

    return () => {
      clearInterval(timeInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  return (
    <aside
      aria-label="Phone and App Status Bar"
      className="w-full bg-slate-950 text-slate-200 border-b border-slate-800/80 select-none transition-all duration-300 relative z-50"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)',
      }}
    >
      {/* Visual Status Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between text-[11px] sm:text-xs font-mono font-semibold tracking-wider">
        {/* Left Side: Real-time clock & Network Signal */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-bold text-white tracking-tight">{timeStr || '12:00 PM'}</span>
          <span className="text-slate-600">•</span>
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-400" title="Network Connected">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-sans hidden xs:inline">متصل</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400" title="Offline Mode">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="text-[10px] font-sans">بدون نت</span>
            </span>
          )}
        </div>

        {/* Center: System & Notifications Active Badge */}
        <button
          onClick={onOpenNotifications}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/60 active:scale-95 transition-all text-amber-300"
          title="شريط الإشعارات المنفصل / Separate Notifications"
        >
          <Bell className="w-3 h-3 text-amber-400 animate-pulse" />
          <span className="text-[10px] font-sans font-bold hidden sm:inline">
            {notifSettings.enabled ? 'الإشعارات مفعلة' : 'الإشعارات'}
          </span>
          {notifSettings.enabled && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        {/* Right Side: Battery Level & System Icons */}
        <div className="flex items-center gap-2 text-slate-300">
          {/* Battery Status */}
          <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs">
            {isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-slate-300" />
            )}
            <span>{batteryLevel !== null ? `${batteryLevel}%` : '100%'}</span>
          </div>

          <span className="text-slate-600">•</span>

          {/* Secure / Kid Safe Indicator */}
          <div className="flex items-center gap-1 text-cyan-400" title="بيئة آمنة للأطفال">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px] font-sans hidden md:inline">آمن للأطفال</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
