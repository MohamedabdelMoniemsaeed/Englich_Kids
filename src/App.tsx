import React, { useState, useEffect } from 'react';
import { AppTheme, ScreenId } from './types';
import { THEMES } from './data/learningData';
import { Header } from './components/Header';
import { TopStatusBarStrip } from './components/TopStatusBarStrip';
import { SettingsDrawer } from './components/SettingsDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { SystemNotificationBanner } from './components/SystemNotificationBanner';
import { initNotificationScheduler } from './utils/notifications';
import { HomeScreen } from './components/HomeScreen';
import { AbcScreen } from './components/AbcScreen';
import { NumbersScreen } from './components/NumbersScreen';
import { AnimalsScreen } from './components/AnimalsScreen';
import { ColorsScreen } from './components/ColorsScreen';
import { FamilyScreen } from './components/FamilyScreen';
import { ShapesScreen } from './components/ShapesScreen';
import { FruitsScreen } from './components/FruitsScreen';
import { VegetablesScreen } from './components/VegetablesScreen';
import { WeatherScreen } from './components/WeatherScreen';
import { SeasonsScreen } from './components/SeasonsScreen';
import { VehiclesScreen } from './components/VehiclesScreen';
import { BodyPartsScreen } from './components/BodyPartsScreen';
import { JobsScreen } from './components/JobsScreen';
import { ClothesScreen } from './components/ClothesScreen';
import { KidsGamesScreen } from './components/KidsGamesScreen';

const VALID_SCREENS: ScreenId[] = [
  'home', 'abc', 'numbers', 'animals', 'colors', 'family',
  'shapes', 'fruits', 'vegetables', 'weather', 'seasons',
  'vehicles', 'body', 'jobs', 'clothes', 'games'
];

function getScreenFromHash(): ScreenId {
  if (typeof window === 'undefined') return 'home';
  const cleanHash = window.location.hash.replace(/^#\/?/, '').trim();
  return VALID_SCREENS.includes(cleanHash as ScreenId) ? (cleanHash as ScreenId) : 'home';
}

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreenState] = useState<ScreenId>(() => getScreenFromHash());
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('boy');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.85);

  // Initialize background notification scheduler for separate system alerts
  useEffect(() => {
    const cleanup = initNotificationScheduler();
    return () => {
      cleanup();
    };
  }, []);

  // HashRouter Navigation handler
  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreenState(screen);
    if (typeof window !== 'undefined') {
      const targetHash = screen === 'home' ? '' : `#${screen}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash || window.location.pathname);
      }
    }
  };

  // Synchronize with Android Hardware Back button & browser history
  useEffect(() => {
    const handleHashChange = () => {
      const targetScreen = getScreenFromHash();
      setCurrentScreenState(targetScreen);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const themeConfig = THEMES[currentTheme] || THEMES.boy;

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden ${themeConfig.bgColor}`}>
      {/* Background Graphic Layer */}
      {themeConfig.bgImage ? (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none opacity-25"
          style={{ backgroundImage: `url("${themeConfig.bgImage}")` }}
        />
      ) : null}

      {/* Sticky Top Status Bar & App Header */}
      <div className="sticky top-0 z-40 w-full flex flex-col shadow-md">
        <TopStatusBarStrip onOpenNotifications={() => setIsNotificationsOpen(true)} />
        <Header
          currentScreen={currentScreen}
          themeConfig={themeConfig}
          onNavigate={handleNavigate}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      </div>

      {/* Main Content View */}
      <main className="flex-1 relative z-10 w-full overflow-y-auto pb-8">
        {currentScreen === 'home' && (
          <HomeScreen
            themeConfig={themeConfig}
            onNavigate={handleNavigate}
          />
        )}
        {currentScreen === 'abc' && (
          <AbcScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'numbers' && (
          <NumbersScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'animals' && (
          <AnimalsScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'colors' && (
          <ColorsScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'family' && (
          <FamilyScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'shapes' && (
          <ShapesScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'fruits' && (
          <FruitsScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'vegetables' && (
          <VegetablesScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'weather' && (
          <WeatherScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'seasons' && (
          <SeasonsScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'vehicles' && (
          <VehiclesScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'body' && (
          <BodyPartsScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'jobs' && (
          <JobsScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'clothes' && (
          <ClothesScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'games' && (
          <KidsGamesScreen
            themeConfig={themeConfig}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        speechRate={speechRate}
        onSelectSpeechRate={setSpeechRate}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Separate Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Floating System Notification Banner (Drop-down alert) */}
      <SystemNotificationBanner />
    </div>
  );
};

export default App;
