import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';
import {
  Sparkles,
  Gamepad2,
  Brain,
  Edit3,
  SpellCheck,
  Headphones,
  Music,
  Award,
  Star,
  Trophy,
  Zap,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { playChime } from '../utils/sound';
import {
  getPlayerProfile,
  addGameScore,
  calculateLevel,
  PlayerProfile,
  LevelInfo,
  LEVELS,
} from '../utils/scoreManager';

import { MemoryGame } from './games/MemoryGame';
import { TracingGame } from './games/TracingGame';
import { SpellingGame } from './games/SpellingGame';
import { ListeningGame } from './games/ListeningGame';
import { BalloonPopGame } from './games/BalloonPopGame';
import { ShadowMatchGame } from './games/ShadowMatchGame';
import { OddOneOutGame } from './games/OddOneOutGame';
import { MathCountingGame } from './games/MathCountingGame';
import { SingAlongGame } from './games/SingAlongGame';
import { ScoreDashboardModal } from './games/ScoreDashboardModal';
import { LevelUpModal } from './games/LevelUpModal';
import gamesHubHomeImage from '../assets/images/games_hub_icon_1790509002829.jpg';

interface KidsGamesScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

type ActiveGame =
  | 'menu'
  | 'memory'
  | 'tracing'
  | 'spelling'
  | 'listening'
  | 'balloon'
  | 'shadow'
  | 'odd'
  | 'counting'
  | 'songs';

export const KidsGamesScreen: React.FC<KidsGamesScreenProps> = ({
  themeConfig,
  speechRate,
  soundEnabled,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [profile, setProfile] = useState<PlayerProfile>(() => getPlayerProfile());
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState<LevelInfo | null>(null);
  const [floatingBonus, setFloatingBonus] = useState<{ text: string; id: number } | null>(null);

  // Sync profile from storage
  useEffect(() => {
    setProfile(getPlayerProfile());
  }, []);

  const handleGameWin = (
    points: number,
    stars: number,
    gameKey?: keyof PlayerProfile['highScores']
  ) => {
    const result = addGameScore({
      points,
      stars,
      gameId: gameKey,
      gameWon: true,
    });

    setProfile(result.profile);

    // Show floating gain
    const bonusId = Date.now();
    setFloatingBonus({ text: `+${points} XP  ⭐+${stars}`, id: bonusId });
    setTimeout(() => {
      setFloatingBonus((cur) => (cur?.id === bonusId ? null : cur));
    }, 2500);

    // If level up triggered
    if (result.leveledUp && result.newLevel) {
      setLevelUpData(result.newLevel);
    }
  };

  const currentLevel = calculateLevel(profile.totalXp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  const xpProgress = nextLevel
    ? Math.min(
        100,
        Math.max(
          0,
          ((profile.totalXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
        )
      )
    : 100;

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 flex flex-col items-center">
      {/* ---------------------------------------------------- */}
      {/* TOP HERO SCORE & PROFILE BAR */}
      {/* ---------------------------------------------------- */}
      <div className="w-full bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-lg border-2 border-amber-300 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
        {/* Left Side: Back / Title & Player Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {activeGame !== 'menu' && (
            <button
              onClick={() => {
                playChime('pop');
                window.speechSynthesis?.cancel();
                setActiveGame('menu');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Games</span>
            </button>
          )}

          {/* Player Avatar & Level Title */}
          <div
            onClick={() => {
              playChime('pop');
              setIsScoreModalOpen(true);
            }}
            className="flex items-center gap-2.5 cursor-pointer group bg-amber-50/80 hover:bg-amber-100/80 p-1.5 pr-3 rounded-2xl border border-amber-200 transition-all"
            title="Click to view Trophies and Stats"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border-2 border-amber-400 flex items-center justify-center text-2xl select-none group-hover:scale-110 transition-transform">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fun text-sm font-black text-slate-800">
                  {profile.playerName}
                </span>
                <span className="text-[10px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded-full">
                  Lv.{currentLevel.level}
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-bold block">
                {currentLevel.titleEn}
              </span>
            </div>
          </div>
        </div>

        {/* Center: XP Progress Bar */}
        <div
          onClick={() => {
            playChime('pop');
            setIsScoreModalOpen(true);
          }}
          className="w-full sm:w-56 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 transition-all"
        >
          <div className="flex items-center justify-between text-[11px] font-black text-slate-600 mb-1">
            <span className="flex items-center gap-1 text-amber-600">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{profile.totalXp} XP</span>
            </span>
            <span className="text-slate-400">
              {nextLevel ? `${nextLevel.minXp - profile.totalXp} to Lv.${nextLevel.level}` : 'Max!'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Right Side: Stars & Trophy Center Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Shiny Stars Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-fun font-black px-3.5 py-2 rounded-2xl shadow-md text-sm sm:text-base animate-pulse">
            <Star className="w-4 h-4 fill-yellow-100 text-yellow-100" />
            <span>{profile.stars} Stars</span>
          </div>

          {/* Trophy Center Button */}
          <button
            onClick={() => {
              playChime('pop');
              setIsScoreModalOpen(true);
            }}
            className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
            title="Open Trophy Center"
          >
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="hidden sm:inline">Trophies</span>
          </button>
        </div>

        {/* Floating Gain Notification Popup */}
        {floatingBonus && (
          <div className="absolute top-1.5 right-1/2 translate-x-1/2 bg-amber-500 text-white font-fun font-black text-xs px-3 py-1 rounded-full shadow-lg border border-yellow-200 animate-bounce z-20">
            {floatingBonus.text}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. GAMES HUB MENU (9 Interactive Games) */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'menu' && (
        <div className="w-full space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-amber-300 bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500 p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={gamesHubHomeImage}
                alt="Games Hub"
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border-2 border-white/50 shrink-0"
              />
              <div>
                <span className="bg-amber-400 text-amber-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  Arcade & Learning
                </span>
                <h2 className="font-fun text-xl sm:text-2xl font-black mt-1">
                  Choose a Game & Play! 🎮
                </h2>
                <p className="text-white/90 text-xs sm:text-sm font-bold mt-0.5">
                  9 ألعاب تفاعلية ممتعة لتعلم الإنجليزية وكسب النجوم والأوسمة
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Card 1: Memory Match */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('memory');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-purple-200 hover:border-purple-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🧠
                </div>
                <span className="text-[11px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  High: {profile.highScores.memory} pts
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                  Memory Match
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  لعبة الذاكرة ومطابقة البطاقات (3 مستويات)
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-purple-600 bg-purple-50 py-1.5 px-3 rounded-xl">
                <span>Find Pairs</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 2: Balloon Pop (NEW) */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('balloon');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-amber-300 hover:border-amber-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden ring-2 ring-amber-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🎈
                </div>
                <span className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  New Game! 🔥
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                  Balloon Pop
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  فرقعة البالونات الحركية السريعة
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-700 bg-amber-50 py-1.5 px-3 rounded-xl">
                <span>Pop Target</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 3: Shadow Match (NEW) */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('shadow');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-indigo-200 hover:border-indigo-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden ring-2 ring-indigo-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🧩
                </div>
                <span className="text-[10px] font-black bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  New Game! ⭐
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                  Shadow Match
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  توصيل الصور الملونة بظلالها
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-indigo-700 bg-indigo-50 py-1.5 px-3 rounded-xl">
                <span>Match Shadows</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 4: Spelling Bee */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('spelling');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-emerald-200 hover:border-emerald-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🔤
                </div>
                <span className="text-[11px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  High: {profile.highScores.spelling} words
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Spelling Bee
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  لعبة تركيب الحروف والكلمات الإنجليزية
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl">
                <span>Build Words</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 5: Speed Listening */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('listening');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-rose-200 hover:border-rose-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🎧
                </div>
                <span className="text-[11px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  High: {profile.highScores.listening} pts
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                  Speed Listening
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  تحدي الاستماع "اسمع واختر بسرعة"
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-rose-700 bg-rose-50 py-1.5 px-3 rounded-xl">
                <span>Audio Quiz</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 6: Odd One Out (NEW) */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('odd');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-orange-200 hover:border-orange-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden ring-2 ring-orange-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🔍
                </div>
                <span className="text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  New Game! 💡
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors">
                  Odd One Out
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  اكتشف العنصر المختلف الذي لا ينتمي للمجموعة
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-orange-700 bg-orange-50 py-1.5 px-3 rounded-xl">
                <span>Find Different</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 7: Counting Quest (NEW) */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('counting');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-teal-200 hover:border-teal-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden ring-2 ring-teal-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🔢
                </div>
                <span className="text-[10px] font-black bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  New Game! 🍎
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-teal-600 transition-colors">
                  Counting Quest
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  عدّ الأشياء والأرقام بصوتك مع لمس العناصر
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-teal-700 bg-teal-50 py-1.5 px-3 rounded-xl">
                <span>Count & Learn</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 8: Tracing Board */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('tracing');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-blue-200 hover:border-blue-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  ✍️
                </div>
                <span className="text-[11px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Drawing & Glow
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  Tracing Board
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  سبورة كتابة وتتبع الحروف والأرقام
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-blue-700 bg-blue-50 py-1.5 px-3 rounded-xl">
                <span>Draw & Glow</span>
                <span>Play ➜</span>
              </div>
            </button>

            {/* Card 9: Sing-Along Songs */}
            <button
              onClick={() => {
                playChime('pop');
                setActiveGame('songs');
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-amber-200 hover:border-amber-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🎵
                </div>
                <span className="text-[11px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  5 Songs 🎤
                </span>
              </div>
              <div>
                <h3 className="font-fun text-lg font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                  Sing-Along Songs
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  أناشيد الأطفال التفاعلية مع الكلمات والموسيقى
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-700 bg-amber-50 py-1.5 px-3 rounded-xl">
                <span>Karaoke Sing</span>
                <span>Sing ➜</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. GAME VIEWS */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'memory' && (
        <MemoryGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'memory')}
        />
      )}

      {activeGame === 'balloon' && (
        <BalloonPopGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'balloonPop')}
        />
      )}

      {activeGame === 'shadow' && (
        <ShadowMatchGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'shadowMatch')}
        />
      )}

      {activeGame === 'spelling' && (
        <SpellingGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'spelling')}
        />
      )}

      {activeGame === 'listening' && (
        <ListeningGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'listening')}
        />
      )}

      {activeGame === 'odd' && (
        <OddOneOutGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'oddOneOut')}
        />
      )}

      {activeGame === 'counting' && (
        <MathCountingGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars, 'mathCounting')}
        />
      )}

      {activeGame === 'tracing' && (
        <TracingGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars)}
        />
      )}

      {activeGame === 'songs' && (
        <SingAlongGame
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onWin={(score, stars) => handleGameWin(score, stars)}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* SCORE & TROPHY CENTER MODAL */}
      {/* ---------------------------------------------------- */}
      <ScoreDashboardModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        profile={profile}
        onProfileUpdate={setProfile}
      />

      {/* ---------------------------------------------------- */}
      {/* LEVEL UP CELEBRATION MODAL */}
      {/* ---------------------------------------------------- */}
      <LevelUpModal
        levelInfo={levelUpData}
        onClose={() => setLevelUpData(null)}
      />
    </div>
  );
};
