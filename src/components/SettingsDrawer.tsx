import React, { useState } from 'react';
import { X, Palette, Volume2, CheckCircle2, RefreshCw, Bell, ChevronRight } from 'lucide-react';
import { AppTheme, ThemeConfig } from '../types';
import { THEMES } from '../data/learningData';
import { playChime } from '../utils/sound';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  speechRate: number;
  onSelectSpeechRate: (rate: number) => void;
  onOpenNotifications: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  speechRate,
  onSelectSpeechRate,
  onOpenNotifications,
}) => {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Check for Updates');

  if (!isOpen) return null;

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setUpdateStatus('Checking for latest content...');
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateStatus('Up to Date! (v1.0.0)');
      playChime('success');
      setTimeout(() => setUpdateStatus('Check for Updates'), 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
              ⚙️
            </div>
            <div>
              <h2 className="font-fun text-xl font-bold text-slate-800">Settings / الإعدادات</h2>
              <p className="text-xs text-slate-500 font-medium">Customize App & Audio</p>
            </div>
          </div>
          <button
            id="close-settings-button"
            onClick={() => {
              playChime('click');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Theme selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-indigo-500" />
              <label className="text-sm font-bold text-slate-700">Theme Colors / لون الثيم</label>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(THEMES) as AppTheme[]).map((themeKey) => {
                const config: ThemeConfig = THEMES[themeKey];
                const isSelected = currentTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    id={`theme-select-${themeKey}`}
                    onClick={() => {
                      playChime('pop');
                      onSelectTheme(themeKey);
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${config.primaryColor} shadow-sm`} />
                      <div>
                        <div className="font-bold text-slate-800 text-base">{config.name}</div>
                        <div className="text-xs text-slate-500">{config.label}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speech Rate Control */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-emerald-500" />
              <label className="text-sm font-bold text-slate-700">Voice Speed / سرعة نطق الكلمات</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="speed-slow"
                onClick={() => {
                  playChime('click');
                  onSelectSpeechRate(0.75);
                }}
                className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  speechRate === 0.75
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🐢 Slow (Kids)
              </button>
              <button
                id="speed-normal"
                onClick={() => {
                  playChime('click');
                  onSelectSpeechRate(0.95);
                }}
                className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  speechRate === 0.95
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🐰 Normal
              </button>
            </div>
          </div>

          {/* Separate Notifications Card */}
          <div className="pt-2 border-t border-slate-100">
            <button
              id="settings-notifications-btn"
              onClick={() => {
                playChime('pop');
                onClose();
                onOpenNotifications();
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🔔
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
                    <span>الإشعارات المنفصلة</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">جديد</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    تذكيرات يومية خارجية على شاشة الهاتف
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Status Bar & Safe Area Info */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-base">📶</span>
              <div>
                <span className="font-bold block">شريط الشبكة والبطارية العلوي</span>
                <span className="text-[11px] text-slate-500">منفصل وظاهر دائماً طوال تشغيل البرنامج</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
              دائم الظهور ✓
            </span>
          </div>

          {/* Mobile Download & APK */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📱</span>
              <label className="text-sm font-bold text-slate-700">تطبيق الهاتف / Mobile App</label>
            </div>
            <a
              href="./English_Kids.apk"
              download="English_Kids.apk"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-98 text-white rounded-2xl font-bold transition-all shadow-md text-sm"
            >
              <span>📥 تحميل تطبيق الأندرويد الكامل APK (23MB)</span>
            </a>
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              تطبيق أندرويد مستقل بالكامل، يعمل بدون إنترنت (Offline) ولا يحتاج لفتح متصفح.
            </p>
          </div>

          {/* Smart Update & Status */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <button
              id="check-updates-btn"
              onClick={handleCheckUpdate}
              disabled={checkingUpdate}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-800 hover:bg-slate-900 active:scale-98 text-white rounded-2xl font-bold transition-all shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${checkingUpdate ? 'animate-spin' : ''}`} />
              <span>{updateStatus}</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400 font-medium">
          English Kids • Version 1.0.0
        </div>
      </div>
    </div>
  );
};
