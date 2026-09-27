import React, { useState, useEffect } from 'react';
import { Volume2, Flame, Sparkles, Timer, RotateCcw } from 'lucide-react';
import { playChime, speakWord, speakSequence } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface ListeningGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface Question {
  word: string;
  arabic: string;
  emoji: string;
  options: { emoji: string; name: string }[];
}

const QUESTIONS_POOL: Question[] = [
  {
    word: 'Elephant',
    arabic: 'فيل',
    emoji: '🐘',
    options: [
      { emoji: '🐘', name: 'Elephant' },
      { emoji: '🦒', name: 'Giraffe' },
      { emoji: '🦁', name: 'Lion' },
      { emoji: '🐵', name: 'Monkey' },
    ],
  },
  {
    word: 'Banana',
    arabic: 'موز',
    emoji: '🍌',
    options: [
      { emoji: '🍎', name: 'Apple' },
      { emoji: '🍌', name: 'Banana' },
      { emoji: '🍓', name: 'Strawberry' },
      { emoji: '🍇', name: 'Grapes' },
    ],
  },
  {
    word: 'Carrot',
    arabic: 'جزر',
    emoji: '🥕',
    options: [
      { emoji: '🥦', name: 'Broccoli' },
      { emoji: '🥕', name: 'Carrot' },
      { emoji: '🍅', name: 'Tomato' },
      { emoji: '🌽', name: 'Corn' },
    ],
  },
  {
    word: 'Airplane',
    arabic: 'طائرة',
    emoji: '✈️',
    options: [
      { emoji: '🚗', name: 'Car' },
      { emoji: '✈️', name: 'Airplane' },
      { emoji: '🚆', name: 'Train' },
      { emoji: '🚢', name: 'Ship' },
    ],
  },
  {
    word: 'Rainbow',
    arabic: 'قوس قزح',
    emoji: '🌈',
    options: [
      { emoji: '☁️', name: 'Cloud' },
      { emoji: '💨', name: 'Wind' },
      { emoji: '🌈', name: 'Rainbow' },
      { emoji: '☀️', name: 'Sun' },
    ],
  },
  {
    word: 'Rocket',
    arabic: 'صاروخ',
    emoji: '🚀',
    options: [
      { emoji: '🚲', name: 'Bicycle' },
      { emoji: '🚀', name: 'Rocket' },
      { emoji: '🚁', name: 'Helicopter' },
      { emoji: '⛵', name: 'Boat' },
    ],
  },
  {
    word: 'Strawberry',
    arabic: 'فراولة',
    emoji: '🍓',
    options: [
      { emoji: '🍓', name: 'Strawberry' },
      { emoji: '🍍', name: 'Pineapple' },
      { emoji: '🍉', name: 'Watermelon' },
      { emoji: '🍋', name: 'Lemon' },
    ],
  },
  {
    word: 'Winter',
    arabic: 'شتاء',
    emoji: '⛄',
    options: [
      { emoji: '🌸', name: 'Spring' },
      { emoji: '🏖️', name: 'Summer' },
      { emoji: '🍂', name: 'Autumn' },
      { emoji: '⛄', name: 'Winter' },
    ],
  },
  {
    word: 'Doctor',
    arabic: 'طبيب',
    emoji: '👨‍⚕️',
    options: [
      { emoji: '👨‍⚕️', name: 'Doctor' },
      { emoji: '👩‍🏫', name: 'Teacher' },
      { emoji: '👨‍🚒', name: 'Firefighter' },
      { emoji: '👮‍♂️', name: 'Police' },
    ],
  },
  {
    word: 'Eyes',
    arabic: 'عينان',
    emoji: '👀',
    options: [
      { emoji: '👀', name: 'Eyes' },
      { emoji: '👂', name: 'Ears' },
      { emoji: '👃', name: 'Nose' },
      { emoji: '👄', name: 'Mouth' },
    ],
  },
  {
    word: 'Zebra',
    arabic: 'حمار وحشي',
    emoji: '🦓',
    options: [
      { emoji: '🦓', name: 'Zebra' },
      { emoji: '🦒', name: 'Giraffe' },
      { emoji: '🐪', name: 'Camel' },
      { emoji: '🦘', name: 'Kangaroo' },
    ],
  },
  {
    word: 'Butterfly',
    arabic: 'فراشة',
    emoji: '🦋',
    options: [
      { emoji: '🐝', name: 'Bee' },
      { emoji: '🦋', name: 'Butterfly' },
      { emoji: '🐞', name: 'Ladybug' },
      { emoji: '🐛', name: 'Caterpillar' },
    ],
  },
];

export const ListeningGame: React.FC<ListeningGameProps> = ({ speechRate, soundEnabled, onWin }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isTimedMode, setIsTimedMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);

  const currentQ = QUESTIONS_POOL[currentIdx];

  const playPrompt = () => {
    if (soundEnabled) {
      speakWord(currentQ.word, speechRate);
    }
  };

  useEffect(() => {
    setSelectedOpt(null);
    setAnswered(false);
    setTimeLeft(10);
    playPrompt();
  }, [currentIdx]);

  // Timer countdown
  useEffect(() => {
    if (!isTimedMode || answered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimedMode, answered, currentIdx]);

  const handleTimeOut = () => {
    setAnswered(true);
    playChime('wrong');
    setStreak(0);
    if (soundEnabled) {
      speakSequence(['Time is up!', 'The answer was', currentQ.word], speechRate);
    }
  };

  const handlePick = (optEmoji: string) => {
    if (answered) return;

    setSelectedOpt(optEmoji);
    setAnswered(true);

    const isCorrect = optEmoji === currentQ.emoji;

    if (isCorrect) {
      playChime('success');
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const points = 15 * (nextStreak >= 3 ? 2 : 1) + (isTimedMode ? timeLeft * 2 : 0);
      setScore((s) => s + points);
      onWin(points, 3);
      confetti({ particleCount: 50, spread: 60 });
      if (soundEnabled) speakSequence(['Correct!', currentQ.word], speechRate);
    } else {
      playChime('wrong');
      setStreak(0);
      if (soundEnabled) {
        speakSequence(['Oops! Find the', currentQ.word], speechRate);
      }
    }
  };

  const nextQuestion = () => {
    const next = (currentIdx + 1) % QUESTIONS_POOL.length;
    setCurrentIdx(next);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-rose-200 flex flex-col items-center text-center">
      {/* Top Header & Streak */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm bg-amber-50 px-3 py-1 rounded-xl">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>Streak: {streak}</span>
          {streak >= 3 && (
            <span className="text-[10px] bg-rose-500 text-white px-1.5 rounded-full font-black animate-pulse">
              2x Combo!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Timed Mode Toggle */}
          <button
            onClick={() => setIsTimedMode((p) => !p)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isTimedMode
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{isTimedMode ? `${timeLeft}s` : 'Timer Off'}</span>
          </button>

          <span className="font-fun font-black text-rose-700 text-sm bg-rose-50 px-3 py-1 rounded-xl border border-rose-100">
            {score} pts
          </span>
        </div>
      </div>

      <h3 className="font-fun text-xl sm:text-2xl font-black text-slate-800 mb-0.5">
        Listen & Pick Fast! 🎧
      </h3>
      <p className="text-slate-500 text-xs font-bold mb-4">
        استمع للكلمة الإنجليزية واختر الصورة المناسبة بأسرع وقت
      </p>

      {/* Big Sound Button */}
      <button
        onClick={playPrompt}
        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-90 text-white shadow-lg flex items-center justify-center transition-all mb-4 animate-pulse cursor-pointer"
        title="Listen Again"
      >
        <Volume2 className="w-10 h-10" />
      </button>

      {/* 4 Large Options Grid */}
      <div className="w-full grid grid-cols-2 gap-3.5 mb-5">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOpt === opt.emoji;
          const isCorrect = opt.emoji === currentQ.emoji;

          let btnStyle = 'border-slate-200 bg-slate-50 hover:border-rose-300 hover:bg-rose-50/40';
          if (answered) {
            if (isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200 scale-102';
            } else if (isSelected) {
              btnStyle = 'border-rose-500 bg-rose-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handlePick(opt.emoji)}
              disabled={answered}
              className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-xs ${btnStyle}`}
            >
              <span className="text-5xl sm:text-6xl mb-1 select-none">{opt.emoji}</span>
              <span className="font-fun text-xs sm:text-sm font-bold text-slate-700">
                {opt.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Result / Next Button */}
      {answered && (
        <div className="w-full animate-pop">
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-fun font-black rounded-2xl shadow-md text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Next Question / السؤال التالي</span> ➜
          </button>
        </div>
      )}
    </div>
  );
};
