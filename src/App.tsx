import React, { useState } from 'react';
import { AppTheme, ScreenId } from './types';
import { THEMES } from './data/learningData';
import { Header } from './components/Header';
import { SettingsDrawer } from './components/SettingsDrawer';
import { HomeScreen } from './components/HomeScreen';
import { AbcScreen } from './components/AbcScreen';
import { NumbersScreen } from './components/NumbersScreen';
import { AnimalsScreen } from './components/AnimalsScreen';
import { ColorsScreen } from './components/ColorsScreen';
import { FamilyScreen } from './components/FamilyScreen';
import { AiChatScreen } from './components/AiChatScreen';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('boy');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.85);

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

      {/* App Header */}
      <Header
        currentScreen={currentScreen}
        themeConfig={themeConfig}
        onNavigate={setCurrentScreen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Main Content View */}
      <main className="flex-1 relative z-10 w-full overflow-y-auto">
        {currentScreen === 'home' && (
          <HomeScreen
            themeConfig={themeConfig}
            onNavigate={setCurrentScreen}
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
        {currentScreen === 'ai_chat' && (
          <AiChatScreen
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
      />
    </div>
  );
};

export default App;
