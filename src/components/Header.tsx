import React from 'react';
import { ArrowLeft, Settings, Sparkles, Volume2, VolumeX, Gamepad2 } from 'lucide-react';
import { ScreenId, ThemeConfig } from '../types';
import { playChime } from '../utils/sound';

interface HeaderProps {
  currentScreen: ScreenId;
  themeConfig: ThemeConfig;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const TITLE_MAP: Record<ScreenId, { en: string; ar: string }> = {
  home: { en: 'English Kids', ar: 'إنجليزي للأطفال' },
  numbers: { en: 'Numbers', ar: 'الأرقام' },
  family: { en: 'Family Members', ar: 'أفراد العائلة' },
  animals: { en: 'Animals', ar: 'الحيوانات' },
  colors: { en: 'Colors', ar: 'الألوان' },
  abc: { en: 'A B C Alphabet', ar: 'الحروف الإنجليزية' },
  shapes: { en: 'Shapes', ar: 'الأشكال الهندسية' },
  fruits: { en: 'Fruits & Vegetables', ar: 'الفواكه والخضروات' },
  vehicles: { en: 'Vehicles & Transport', ar: 'المواصلات والمركبات' },
  body: { en: 'Body Parts', ar: 'أجزاء جسم الإنسان' },
  jobs: { en: 'Jobs & Professions', ar: 'المهن والوظائف' },
  clothes: { en: 'Clothes & Outfits', ar: 'الملابس والأزياء' },
  games: { en: 'Kids Games Hub', ar: 'ألعاب وأنشطة تفاعلية' },
};

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  themeConfig,
  onNavigate,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) => {
  const isHome = currentScreen === 'home';
  const info = TITLE_MAP[currentScreen] || TITLE_MAP.home;

  return (
    <header className={`sticky top-0 z-40 bg-gradient-to-r ${themeConfig.primaryColor} shadow-md text-white px-4 py-3 sm:py-4 transition-all duration-300`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Back button or cute App Icon */}
        <div className="flex items-center gap-2">
          {!isHome ? (
            <button
              id="back-button"
              onClick={() => {
                playChime('pop');
                onNavigate('home');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 active:scale-95 rounded-2xl font-bold transition-all shadow-sm"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold hidden sm:inline">Home</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/25 p-1 shadow-inner flex items-center justify-center">
                <img
                  src="/assets/images/iconHome.png"
                  alt="English Kids Logo"
                  className="w-8 h-8 object-contain drop-shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Center: Title */}
        <div className="text-center flex-1">
          <h1 className="font-fun text-xl sm:text-2xl font-extrabold tracking-wide drop-shadow-sm flex items-center justify-center gap-1.5">
            {info.en}
            {currentScreen === 'games' && <Gamepad2 className="w-5 h-5 text-yellow-300 animate-pulse" />}
            {currentScreen === 'shapes' && <Sparkles className="w-5 h-5 text-yellow-200" />}
          </h1>
          <span className="text-xs sm:text-sm font-medium text-white/90 block mt-0.5">
            {info.ar}
          </span>
        </div>

        {/* Right Side: Sound Toggle & Settings */}
        <div className="flex items-center gap-2">
          {isHome && (
            <button
              id="header-games-btn"
              onClick={() => {
                playChime('pop');
                onNavigate('games');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 rounded-2xl font-fun font-black text-xs transition-all shadow-md"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play Games</span>
            </button>
          )}

          <button
            id="sound-toggle-button"
            onClick={() => {
              playChime('click');
              onToggleSound();
            }}
            className={`p-2 sm:p-2.5 rounded-2xl transition-all active:scale-90 ${
              soundEnabled ? 'bg-white/25 hover:bg-white/35 text-white' : 'bg-red-500/80 text-white'
            }`}
            title={soundEnabled ? 'Sound is On' : 'Sound is Off'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            id="settings-button"
            onClick={() => {
              playChime('pop');
              onOpenSettings();
            }}
            className="p-2 sm:p-2.5 bg-white/25 hover:bg-white/35 active:scale-90 rounded-2xl text-white transition-all shadow-sm"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
