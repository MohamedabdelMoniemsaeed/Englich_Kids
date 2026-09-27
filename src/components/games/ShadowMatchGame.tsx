import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { playChime, speakWord, speakSequence } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface ShadowMatchGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface ShadowItem {
  id: string;
  name: string;
  arabic: string;
  emoji: string;
}

interface RoundData {
  titleEn: string;
  titleAr: string;
  items: ShadowItem[];
}

const SHADOW_ROUNDS: RoundData[] = [
  {
    titleEn: 'Animal Kingdom',
    titleAr: 'عالم الحيوانات',
    items: [
      { id: 'lion', name: 'Lion', arabic: 'أسد', emoji: '🦁' },
      { id: 'elephant', name: 'Elephant', arabic: 'فيل', emoji: '🐘' },
      { id: 'rabbit', name: 'Rabbit', arabic: 'أرنب', emoji: '🐰' },
      { id: 'frog', name: 'Frog', arabic: 'ضفدع', emoji: '🐸' },
    ],
  },
  {
    titleEn: 'Vehicles & Transport',
    titleAr: 'المركبات والمواصلات',
    items: [
      { id: 'car', name: 'Car', arabic: 'سيارة', emoji: '🚗' },
      { id: 'plane', name: 'Airplane', arabic: 'طائرة', emoji: '✈️' },
      { id: 'rocket', name: 'Rocket', arabic: 'صاروخ', emoji: '🚀' },
      { id: 'ship', name: 'Ship', arabic: 'سفينة', emoji: '🚢' },
    ],
  },
  {
    titleEn: 'Delicious Fruits',
    titleAr: 'الفواكه اللذيذة',
    items: [
      { id: 'apple', name: 'Apple', arabic: 'تفاحة', emoji: '🍎' },
      { id: 'banana', name: 'Banana', arabic: 'موزة', emoji: '🍌' },
      { id: 'grapes', name: 'Grapes', arabic: 'عنب', emoji: '🍇' },
      { id: 'strawberry', name: 'Strawberry', arabic: 'فراولة', emoji: '🍓' },
    ],
  },
  {
    titleEn: 'Magical Shapes',
    titleAr: 'الأشكال السحرية',
    items: [
      { id: 'star', name: 'Star', arabic: 'نجمة', emoji: '⭐' },
      { id: 'heart', name: 'Heart', arabic: 'قلب', emoji: '❤️' },
      { id: 'sun', name: 'Sun', arabic: 'شمس', emoji: '☀️' },
      { id: 'moon', name: 'Moon', arabic: 'هلال', emoji: '🌙' },
    ],
  },
];

export const ShadowMatchGame: React.FC<ShadowMatchGameProps> = ({
  speechRate,
  soundEnabled,
  onWin,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [leftItems, setLeftItems] = useState<ShadowItem[]>([]);
  const [rightItems, setRightItems] = useState<ShadowItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isRoundWon, setIsRoundWon] = useState(false);

  const currentRound = SHADOW_ROUNDS[roundIdx];

  const setupRound = (idx: number) => {
    const round = SHADOW_ROUNDS[idx];
    setLeftItems([...round.items]);
    const shuffledRight = [...round.items].sort(() => Math.random() - 0.5);
    setRightItems(shuffledRight);
    setSelectedLeft(null);
    setMatchedIds([]);
    setIsRoundWon(false);

    if (soundEnabled) {
      speakSequence(['Match each picture with its shadow!'], speechRate);
    }
  };

  useEffect(() => {
    setupRound(roundIdx);
  }, [roundIdx]);

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    playChime('pop');
    setSelectedLeft(id);
    const item = leftItems.find((i) => i.id === id);
    if (item && soundEnabled) {
      speakWord(item.name, speechRate);
    }
  };

  const handleSelectRight = (id: string) => {
    if (!selectedLeft || matchedIds.includes(id)) return;

    if (selectedLeft === id) {
      // MATCH SUCCESS!
      playChime('success');
      const nextMatched = [...matchedIds, id];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);

      const item = leftItems.find((i) => i.id === id);
      if (item && soundEnabled) {
        speakSequence(['Correct match!', item.name], speechRate);
      }

      if (nextMatched.length === leftItems.length) {
        setIsRoundWon(true);
        onWin(30, 5);
        confetti({ particleCount: 70, spread: 80 });
      }
    } else {
      // WRONG MATCH
      playChime('wrong');
      setSelectedLeft(null);
      if (soundEnabled) {
        speakSequence(['Try again!'], speechRate);
      }
    }
  };

  const handleNextRound = () => {
    playChime('pop');
    const next = (roundIdx + 1) % SHADOW_ROUNDS.length;
    setRoundIdx(next);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-indigo-200 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div>
          <h3 className="font-fun text-xl sm:text-2xl font-black text-indigo-700 flex items-center gap-1.5">
            <span>Shadow Match</span>
            <span className="text-xl">🧩</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">طابق كل صورة ملونة بظلها المناسب</p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          Level {roundIdx + 1} / {SHADOW_ROUNDS.length}
        </span>
      </div>

      {/* Round Theme Badge */}
      <div className="w-full bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-2xl py-2 px-4 mb-4 flex items-center justify-between text-xs font-bold">
        <span>Topic: {currentRound.titleEn}</span>
        <span>{currentRound.titleAr}</span>
      </div>

      {/* Matching Columns Grid */}
      <div className="w-full grid grid-cols-2 gap-4 sm:gap-6 mb-5">
        {/* Left Column: Colorful Pictures */}
        <div className="space-y-3">
          <div className="text-center font-fun text-xs font-bold text-slate-500 uppercase tracking-wide">
            Colorful Pictures 🎨
          </div>
          {leftItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft === item.id;

            let borderStyle = 'border-slate-200 bg-white hover:border-indigo-400';
            if (isMatched) {
              borderStyle = 'border-emerald-500 bg-emerald-50 opacity-90';
            } else if (isSelected) {
              borderStyle = 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-200 scale-102';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectLeft(item.id)}
                disabled={isMatched}
                className={`w-full p-3 rounded-2xl border-3 flex items-center justify-between shadow-xs transition-all active:scale-95 ${borderStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-4xl sm:text-5xl select-none">{item.emoji}</span>
                  <div className="text-left">
                    <span className="font-fun text-sm font-black text-slate-800 block">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{item.arabic}</span>
                  </div>
                </div>

                {isMatched ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Silhouettes / Shadows */}
        <div className="space-y-3">
          <div className="text-center font-fun text-xs font-bold text-slate-500 uppercase tracking-wide">
            Mysterious Shadows 👤
          </div>
          {rightItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);

            let shadowStyle = 'border-slate-200 bg-slate-100 hover:border-indigo-400';
            if (isMatched) {
              shadowStyle = 'border-emerald-500 bg-emerald-50 opacity-90';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectRight(item.id)}
                disabled={isMatched || !selectedLeft}
                className={`w-full p-3 rounded-2xl border-3 flex items-center justify-center shadow-xs transition-all active:scale-95 ${shadowStyle} ${
                  !selectedLeft && !isMatched ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Black silhouette filter for the shadow effect */}
                  <span
                    className={`text-4xl sm:text-5xl select-none transition-all ${
                      isMatched
                        ? 'filter-none'
                        : 'brightness-0 contrast-200 opacity-60'
                    }`}
                  >
                    {item.emoji}
                  </span>
                  {isMatched && (
                    <span className="absolute -top-1 -right-4 text-xs font-fun font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded-full shadow-2xs">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Round Cleared Banner */}
      {isRoundWon && (
        <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-4 text-center shadow-lg animate-pop">
          <h4 className="font-fun text-xl font-black">Shadow Detective Champion! 🎉</h4>
          <p className="text-xs font-bold opacity-90 mt-0.5">
            You matched all pictures and shadows perfectly! +30 XP
          </p>
          <button
            onClick={handleNextRound}
            className="mt-3 px-6 py-2 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-fun font-black rounded-xl text-sm shadow-md transition-all flex items-center gap-1.5 mx-auto"
          >
            <span>Next Level</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
