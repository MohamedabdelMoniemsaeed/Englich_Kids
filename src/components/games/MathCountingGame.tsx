import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, ArrowRight, Flame } from 'lucide-react';
import { playChime, speakWord, speakSequence, playPraise } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface MathCountingGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface CountingQuestion {
  id: number;
  itemNameEn: string;
  itemNameAr: string;
  emoji: string;
  count: number;
  options: number[];
}

const COUNTING_ROUNDS: CountingQuestion[] = [
  { id: 1, itemNameEn: 'Apples', itemNameAr: 'تفاحات', emoji: '🍎', count: 3, options: [2, 3, 4, 5] },
  { id: 2, itemNameEn: 'Cute Ducks', itemNameAr: 'بطات لطيفة', emoji: '🦆', count: 5, options: [3, 4, 5, 6] },
  { id: 3, itemNameEn: 'Shiny Stars', itemNameAr: 'نجوم لامعة', emoji: '⭐', count: 4, options: [2, 4, 6, 7] },
  { id: 4, itemNameEn: 'Little Fish', itemNameAr: 'أسماك صغيرة', emoji: '🐟', count: 6, options: [4, 5, 6, 8] },
  { id: 5, itemNameEn: 'Fast Cars', itemNameAr: 'سيارات سريعة', emoji: '🚗', count: 2, options: [1, 2, 3, 4] },
  { id: 6, itemNameEn: 'Sweet Strawberries', itemNameAr: 'فراولة شهية', emoji: '🍓', count: 7, options: [5, 6, 7, 8] },
  { id: 7, itemNameEn: 'Colorful Balloons', itemNameAr: 'بالونات ملونة', emoji: '🎈', count: 8, options: [6, 7, 8, 9] },
  { id: 8, itemNameEn: 'Playful Puppies', itemNameAr: 'جراء صغيرة', emoji: '🐶', count: 4, options: [3, 4, 5, 6] },
];

export const MathCountingGame: React.FC<MathCountingGameProps> = ({
  speechRate,
  soundEnabled,
  onWin,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentQ = COUNTING_ROUNDS[roundIdx];

  const playPrompt = () => {
    if (soundEnabled) {
      speakSequence([`How many ${currentQ.itemNameEn} do you see?`], speechRate);
    }
  };

  useEffect(() => {
    setTappedIndices([]);
    setSelectedAnswer(null);
    setAnswered(false);
    playPrompt();
  }, [roundIdx]);

  const handleTapObject = (idx: number) => {
    let nextTapped = [...tappedIndices];
    if (!nextTapped.includes(idx)) {
      nextTapped.push(idx);
      setTappedIndices(nextTapped);
      if (soundEnabled) {
        speakWord(nextTapped.length.toString(), speechRate);
      } else {
        playChime('pop');
      }
    }
  };

  const handlePickAnswer = (num: number) => {
    if (answered) return;

    setSelectedAnswer(num);
    setAnswered(true);

    if (num === currentQ.count) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      onWin(20, 4);
      confetti({ particleCount: 50, spread: 60 });
      if (soundEnabled) {
        playPraise('success', [`Correct! There are ${currentQ.count} ${currentQ.itemNameEn}!`], speechRate);
      } else {
        playChime('success');
      }
    } else {
      setStreak(0);
      if (soundEnabled) {
        playPraise('wrong', ['Not quite! Count them one by one!'], speechRate);
      } else {
        playChime('wrong');
      }
    }
  };

  const handleNext = () => {
    playChime('pop');
    const next = (roundIdx + 1) % COUNTING_ROUNDS.length;
    setRoundIdx(next);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-teal-200 flex flex-col items-center text-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm bg-amber-50 px-3 py-1 rounded-xl">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>Streak: {streak}</span>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          Round {roundIdx + 1} / {COUNTING_ROUNDS.length}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl p-4 mb-4 shadow-md flex items-center justify-between">
        <div className="text-left">
          <h4 className="font-fun text-lg sm:text-xl font-black">
            🔢 How many {currentQ.itemNameEn} do you see?
          </h4>
          <p className="text-xs font-bold text-teal-100 mt-0.5">
            كم عدد {currentQ.itemNameAr} التي تراها؟ (المسها للعد بصوتك!)
          </p>
        </div>

        <button
          onClick={playPrompt}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all shrink-0 active:scale-95"
          title="Repeat Question"
        >
          <Volume2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Objects Play Area (Tappable items to count) */}
      <div className="w-full bg-teal-50/60 rounded-3xl p-5 border-2 border-dashed border-teal-300 min-h-48 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-5">
        {Array.from({ length: currentQ.count }).map((_, i) => {
          const isTapped = tappedIndices.includes(i);
          const tapNumber = tappedIndices.indexOf(i) + 1;

          return (
            <button
              key={i}
              onClick={() => handleTapObject(i)}
              className="relative p-2 rounded-2xl transition-all transform active:scale-90 hover:scale-110 cursor-pointer"
            >
              <span className="text-5xl sm:text-6xl select-none animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                {currentQ.emoji}
              </span>

              {isTapped && (
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shadow-md animate-pop">
                  {tapNumber}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Number Options */}
      <div className="w-full grid grid-cols-4 gap-3 mb-4">
        {currentQ.options.map((num) => {
          const isSelected = selectedAnswer === num;
          const isCorrect = num === currentQ.count;

          let btnStyle = 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50';
          if (answered) {
            if (isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-100 ring-4 ring-emerald-300 scale-105';
            } else if (isSelected) {
              btnStyle = 'border-rose-500 bg-rose-50';
            }
          }

          return (
            <button
              key={num}
              onClick={() => handlePickAnswer(num)}
              disabled={answered}
              className={`py-4 rounded-2xl border-3 font-fun text-2xl sm:text-3xl font-black text-slate-800 shadow-xs transition-all active:scale-95 ${btnStyle}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Correct Result / Next */}
      {answered && (
        <div className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center animate-pop space-y-3">
          <span className="font-fun text-base font-black text-emerald-800 block">
            🎉 That's right! Exactly {currentQ.count} {currentQ.itemNameEn}!
          </span>

          <button
            onClick={handleNext}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-fun font-black rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Next Counting Quest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
