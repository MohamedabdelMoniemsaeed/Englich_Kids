import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Trophy, RotateCcw, Flame } from 'lucide-react';
import { playChime, speakWord, speakSequence, playPraise } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface BalloonPopGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface BalloonItem {
  id: number;
  text: string;
  emoji?: string;
  color: string;
  isPopped: boolean;
  isTarget: boolean;
  xPercent: number;
  delaySec: number;
}

interface RoundConfig {
  missionEn: string;
  missionAr: string;
  targetKey: string;
  balloons: { text: string; emoji?: string; color: string; isTarget: boolean }[];
}

const BALLOON_ROUNDS: RoundConfig[] = [
  {
    missionEn: 'Pop all letters "A" and "B"!',
    missionAr: 'فرقع بالونات الحرفين A و B!',
    targetKey: 'letter_AB',
    balloons: [
      { text: 'A', emoji: '🍎', color: '#EF4444', isTarget: true },
      { text: 'B', emoji: '🍌', color: '#3B82F6', isTarget: true },
      { text: 'C', emoji: '🐱', color: '#10B981', isTarget: false },
      { text: 'D', emoji: '🐶', color: '#F59E0B', isTarget: false },
      { text: 'A', emoji: '🍎', color: '#EC4899', isTarget: true },
      { text: 'E', emoji: '🥚', color: '#8B5CF6', isTarget: false },
    ],
  },
  {
    missionEn: 'Pop the Animals! 🦁🐱🐶',
    missionAr: 'فرقع بالونات الحيوانات اللطيفة!',
    targetKey: 'animals',
    balloons: [
      { text: 'Lion', emoji: '🦁', color: '#F59E0B', isTarget: true },
      { text: 'Car', emoji: '🚗', color: '#EF4444', isTarget: false },
      { text: 'Cat', emoji: '🐱', color: '#10B981', isTarget: true },
      { text: 'Plane', emoji: '✈️', color: '#3B82F6', isTarget: false },
      { text: 'Dog', emoji: '🐶', color: '#EC4899', isTarget: true },
      { text: 'Book', emoji: '📖', color: '#8B5CF6', isTarget: false },
    ],
  },
  {
    missionEn: 'Pop the Red and Yellow balloons! 🔴🟡',
    missionAr: 'فرقع البالونات الحمراء والصفراء!',
    targetKey: 'colors',
    balloons: [
      { text: 'Red', emoji: '🔴', color: '#EF4444', isTarget: true },
      { text: 'Blue', emoji: '🔵', color: '#3B82F6', isTarget: false },
      { text: 'Yellow', emoji: '🟡', color: '#EAB308', isTarget: true },
      { text: 'Green', emoji: '🟢', color: '#10B981', isTarget: false },
      { text: 'Red', emoji: '🍓', color: '#EF4444', isTarget: true },
      { text: 'Purple', emoji: '🟣', color: '#8B5CF6', isTarget: false },
    ],
  },
  {
    missionEn: 'Pop the Numbers "1", "2" and "3"! 🔢',
    missionAr: 'فرقع بالونات الأرقام 1 و 2 و 3!',
    targetKey: 'numbers',
    balloons: [
      { text: '1', emoji: '⭐', color: '#EC4899', isTarget: true },
      { text: '5', emoji: '💎', color: '#6B7280', isTarget: false },
      { text: '2', emoji: '⭐⭐', color: '#3B82F6', isTarget: true },
      { text: '8', emoji: '🎯', color: '#10B981', isTarget: false },
      { text: '3', emoji: '⭐⭐⭐', color: '#F59E0B', isTarget: true },
      { text: '9', emoji: '⚡', color: '#8B5CF6', isTarget: false },
    ],
  },
  {
    missionEn: 'Pop the Delicious Fruits! 🍎🍓🍉',
    missionAr: 'فرقع بالونات الفواكه اللذيذة!',
    targetKey: 'fruits',
    balloons: [
      { text: 'Apple', emoji: '🍎', color: '#EF4444', isTarget: true },
      { text: 'Chair', emoji: '🪑', color: '#6B7280', isTarget: false },
      { text: 'Berry', emoji: '🍓', color: '#EC4899', isTarget: true },
      { text: 'Shoe', emoji: '👟', color: '#3B82F6', isTarget: false },
      { text: 'Melon', emoji: '🍉', color: '#10B981', isTarget: true },
      { text: 'Clock', emoji: '⏰', color: '#F59E0B', isTarget: false },
    ],
  },
];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({
  speechRate,
  soundEnabled,
  onWin,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [roundScore, setRoundScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  const currentRound = BALLOON_ROUNDS[roundIdx];

  const initRound = (rIdx: number) => {
    const config = BALLOON_ROUNDS[rIdx];
    const initial: BalloonItem[] = config.balloons.map((b, i) => ({
      id: i,
      text: b.text,
      emoji: b.emoji,
      color: b.color,
      isPopped: false,
      isTarget: b.isTarget,
      xPercent: 12 + (i % 3) * 32 + (Math.random() * 8 - 4),
      delaySec: (i * 0.4) % 1.6,
    }));
    setBalloons(initial);
    setRoundCompleted(false);

    if (soundEnabled) {
      speakSequence([config.missionEn], speechRate);
    }
  };

  useEffect(() => {
    initRound(roundIdx);
  }, [roundIdx]);

  const handlePop = (balloon: BalloonItem) => {
    if (balloon.isPopped) return;

    if (balloon.isTarget) {
      const updated = balloons.map((b) =>
        b.id === balloon.id ? { ...b, isPopped: true } : b
      );
      setBalloons(updated);
      setStreak((s) => s + 1);
      setRoundScore((s) => s + 15);

      // Check if all targets are popped
      const remainingTargets = updated.filter((b) => b.isTarget && !b.isPopped);
      if (remainingTargets.length === 0) {
        setRoundCompleted(true);
        onWin(35, 5);
        confetti({ particleCount: 70, spread: 80 });
        if (soundEnabled) {
          playPraise('success', ['Awesome balloon popping!', 'Round cleared!'], speechRate);
        } else {
          playChime('success');
        }
      } else {
        if (soundEnabled) {
          playPraise('balloon', balloon.text, speechRate);
        } else {
          playChime('balloon');
        }
      }
    } else {
      // Wrong balloon clicked
      setStreak(0);
      if (soundEnabled) {
        playPraise('wrong', ['Try again!'], speechRate);
      } else {
        playChime('wrong');
      }
    }
  };

  const handleNextRound = () => {
    playChime('pop');
    const next = (roundIdx + 1) % BALLOON_ROUNDS.length;
    setRoundIdx(next);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-300 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm bg-amber-50 px-3 py-1 rounded-xl">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>Combo: {streak}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            Round {roundIdx + 1} / {BALLOON_ROUNDS.length}
          </span>
          <span className="font-fun font-black text-amber-800 text-sm bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
            {roundScore} pts
          </span>
        </div>
      </div>

      {/* Mission Box */}
      <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white rounded-2xl p-3 mb-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <h4 className="font-fun text-lg sm:text-xl font-black">
            🎯 {currentRound.missionEn}
          </h4>
          <button
            onClick={() => soundEnabled && speakSequence([currentRound.missionEn], speechRate)}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all"
            title="Read Mission"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs font-bold opacity-90 mt-0.5">{currentRound.missionAr}</p>
      </div>

      {/* Balloon Sky Playing Field */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 rounded-3xl overflow-hidden border-4 border-sky-300 shadow-inner flex items-center justify-center p-4">
        {/* Cute Clouds in sky */}
        <div className="absolute top-4 left-6 text-3xl opacity-60 pointer-events-none select-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-10 right-10 text-4xl opacity-70 pointer-events-none select-none">
          ☁️
        </div>
        <div className="absolute top-2 right-1/2 text-2xl opacity-50 pointer-events-none select-none">
          ✨
        </div>

        {/* Floating Balloons Grid */}
        <div className="w-full h-full grid grid-cols-3 gap-3 relative z-10 p-2">
          {balloons.map((b) => {
            if (b.isPopped) {
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-center text-3xl animate-ping select-none opacity-40"
                >
                  💥
                </div>
              );
            }

            return (
              <button
                key={b.id}
                onClick={() => handlePop(b)}
                className="group relative flex flex-col items-center justify-center transition-all duration-300 transform active:scale-90 hover:scale-105 cursor-pointer animate-float"
                style={{
                  animationDelay: `${b.delaySec}s`,
                }}
              >
                {/* Balloon Body */}
                <div
                  className="w-20 h-24 sm:w-24 sm:h-28 rounded-full shadow-lg flex flex-col items-center justify-center text-white font-fun font-black relative border-2 border-white/50 group-hover:brightness-110"
                  style={{
                    backgroundColor: b.color,
                    boxShadow: `0 8px 16px ${b.color}55`,
                  }}
                >
                  {/* Balloon reflection shine */}
                  <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/40 -rotate-25" />

                  {/* Emoji & Label */}
                  {b.emoji && <span className="text-2xl sm:text-3xl mb-0.5">{b.emoji}</span>}
                  <span className="text-xs sm:text-sm font-extrabold tracking-wide drop-shadow-sm">
                    {b.text}
                  </span>
                </div>

                {/* Balloon Knot & String */}
                <div
                  className="w-2.5 h-2 rounded-xs -mt-0.5"
                  style={{ backgroundColor: b.color }}
                />
                <div className="w-0.5 h-6 bg-slate-400/80 -mt-0.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Round Success Banner */}
      {roundCompleted && (
        <div className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl text-center shadow-lg animate-pop">
          <h4 className="font-fun text-xl font-black">Round Complete! 🎉 +35 XP</h4>
          <p className="text-xs font-bold opacity-90 mt-0.5">
            You popped all the target balloons like a superstar!
          </p>
          <button
            onClick={handleNextRound}
            className="mt-3 px-6 py-2 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-fun font-black rounded-xl text-sm shadow-md transition-all"
          >
            Next Balloon Round / المرحلة التالية ➜
          </button>
        </div>
      )}
    </div>
  );
};
