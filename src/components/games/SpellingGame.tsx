import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, HelpCircle, Delete, Flame, ArrowRight } from 'lucide-react';
import { playChime, speakWord, speakSequence, playPraise } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface SpellingGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface SpellingWord {
  word: string;
  arabic: string;
  emoji: string;
  hint: string;
  category: string;
}

const SPELLING_DICTIONARY: SpellingWord[] = [
  // Animals
  { word: 'CAT', arabic: 'قطة', emoji: '🐱', hint: 'Says Meow and catches mice', category: 'Animals' },
  { word: 'DOG', arabic: 'كلب', emoji: '🐶', hint: 'Barks and loves to play fetch', category: 'Animals' },
  { word: 'LION', arabic: 'أسد', emoji: '🦁', hint: 'The King of the jungle', category: 'Animals' },
  { word: 'FISH', arabic: 'سمكة', emoji: '🐟', hint: 'Swims in lakes and oceans', category: 'Animals' },
  { word: 'BIRD', arabic: 'عصفور', emoji: '🐦', hint: 'Has feathers and flies high', category: 'Animals' },
  { word: 'DUCK', arabic: 'بطة', emoji: '🦆', hint: 'Says Quack Quack in ponds', category: 'Animals' },
  { word: 'FROG', arabic: 'ضفدع', emoji: '🐸', hint: 'Green and jumps high', category: 'Animals' },
  { word: 'BEAR', arabic: 'دب', emoji: '🐻', hint: 'Loves honey and sleeps in winter', category: 'Animals' },
  // Nature & Objects
  { word: 'SUN', arabic: 'شمس', emoji: '☀️', hint: 'Shines warm light in summer', category: 'Nature' },
  { word: 'STAR', arabic: 'نجمة', emoji: '⭐', hint: 'Twinkles in the night sky', category: 'Nature' },
  { word: 'MOON', arabic: 'قمر', emoji: '🌙', hint: 'Glows gently in the night', category: 'Nature' },
  { word: 'RAIN', arabic: 'مطر', emoji: '🌧️', hint: 'Water falling from clouds', category: 'Nature' },
  { word: 'TREE', arabic: 'شجرة', emoji: '🌳', hint: 'Tall with green leaves and fruits', category: 'Nature' },
  { word: 'ROSE', arabic: 'وردة', emoji: '🌹', hint: 'Beautiful red fragrant flower', category: 'Nature' },
  // Food & Fruits
  { word: 'APPLE', arabic: 'تفاحة', emoji: '🍎', hint: 'Sweet red crunchy fruit', category: 'Food' },
  { word: 'CORN', arabic: 'ذرة', emoji: '🌽', hint: 'Yellow crunchy sweet veggie', category: 'Food' },
  { word: 'MILK', arabic: 'حليب', emoji: '🥛', hint: 'Healthy white drink for strong bones', category: 'Food' },
  { word: 'EGG', arabic: 'بيضة', emoji: '🥚', hint: 'Breakfast food from hens', category: 'Food' },
  { word: 'CAKE', arabic: 'كعكة', emoji: '🎂', hint: 'Sweet birthday treat with candles', category: 'Food' },
  // Vehicles & Around us
  { word: 'CAR', arabic: 'سيارة', emoji: '🚗', hint: 'Has four wheels and goes Beep Beep', category: 'Things' },
  { word: 'BUS', arabic: 'حافلة', emoji: '🚌', hint: 'Big yellow school transport', category: 'Things' },
  { word: 'BOAT', arabic: 'قارب', emoji: '⛵', hint: 'Floats on sea water', category: 'Things' },
  { word: 'BOOK', arabic: 'كتاب', emoji: '📖', hint: 'We read exciting stories inside it', category: 'Things' },
  { word: 'BALL', arabic: 'كرة', emoji: '⚽', hint: 'Round toy we kick and bounce', category: 'Things' },
  { word: 'DOLL', arabic: 'دمية', emoji: '🪆', hint: 'Cute toy figure to dress up', category: 'Things' },
  { word: 'KITE', arabic: 'طائرة ورقية', emoji: '🪁', hint: 'Flies high in windy skies', category: 'Things' },
];

export const SpellingGame: React.FC<SpellingGameProps> = ({ speechRate, soundEnabled, onWin }) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [scrambled, setScrambled] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [built, setBuilt] = useState<{ id: number; char: string }[]>([]);
  const [streak, setStreak] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentItem = SPELLING_DICTIONARY[wordIdx];

  const setupWord = (idx: number) => {
    const item = SPELLING_DICTIONARY[idx];
    const letters = item.word.split('').map((char, i) => ({
      id: i,
      char,
      used: false,
    }));
    letters.sort(() => Math.random() - 0.5);
    setScrambled(letters);
    setBuilt([]);
    setIsCorrect(false);
    setShowHint(false);

    if (soundEnabled) {
      speakSequence(['Spell the word', item.word], speechRate);
    }
  };

  useEffect(() => {
    setupWord(wordIdx);
  }, [wordIdx]);

  const handleLetterTap = (letterItem: { id: number; char: string; used: boolean }) => {
    if (letterItem.used || isCorrect) return;

    if (soundEnabled) {
      speakWord(letterItem.char, speechRate);
    } else {
      playChime('pop');
    }

    const nextBuilt = [...built, { id: letterItem.id, char: letterItem.char }];
    setBuilt(nextBuilt);

    setScrambled((prev) =>
      prev.map((l) => (l.id === letterItem.id ? { ...l, used: true } : l))
    );

    // Check if finished
    if (nextBuilt.length === currentItem.word.length) {
      const spelled = nextBuilt.map((b) => b.char).join('');
      if (spelled === currentItem.word) {
        setIsCorrect(true);
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        const nextWordsCount = wordsCompleted + 1;
        setWordsCompleted(nextWordsCount);

        const scoreEarned = 25 * (nextStreak >= 3 ? 2 : 1);
        onWin(scoreEarned, 5);
        confetti({ particleCount: 75, spread: 70 });
        if (soundEnabled) {
          playPraise('success', ['Super!', currentItem.word], speechRate);
        } else {
          playChime('success');
        }
      } else {
        setStreak(0);
        setTimeout(() => {
          // Reset current attempt
          setBuilt([]);
          setScrambled((prev) => prev.map((l) => ({ ...l, used: false })));
          if (soundEnabled) {
            playPraise('wrong', ['Try again!'], speechRate);
          } else {
            playChime('wrong');
          }
        }, 600);
      }
    }
  };

  const handleUndo = () => {
    if (built.length === 0 || isCorrect) return;
    playChime('click');
    const lastItem = built[built.length - 1];
    setBuilt((prev) => prev.slice(0, prev.length - 1));
    setScrambled((prev) =>
      prev.map((l) => (l.id === lastItem.id ? { ...l, used: false } : l))
    );
  };

  const handleNextWord = () => {
    playChime('pop');
    const next = (wordIdx + 1) % SPELLING_DICTIONARY.length;
    setWordIdx(next);
  };

  const handleUseHint = () => {
    setShowHint(true);
    playChime('star');
    const nextCharIndex = built.length;
    if (nextCharIndex < currentItem.word.length) {
      const neededChar = currentItem.word[nextCharIndex];
      if (soundEnabled) speakSequence(['Next letter is', neededChar], speechRate);
    }
  };

  const speakCurrentWord = () => {
    if (soundEnabled) speakWord(currentItem.word, speechRate);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-emerald-200 flex flex-col items-center text-center">
      {/* Top Header & Streak */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm bg-amber-50 px-3 py-1 rounded-xl">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>Streak: {streak}</span>
          {streak >= 3 && <span className="text-[10px] bg-amber-400 text-white px-1.5 rounded-full font-black">2x XP</span>}
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
          Word {wordIdx + 1} / {SPELLING_DICTIONARY.length}
        </span>
      </div>

      {/* Target Word Graphic */}
      <div className="relative my-2">
        <div className="text-8xl sm:text-9xl mb-1 select-none animate-float filter drop-shadow">
          {currentItem.emoji}
        </div>
        <button
          onClick={speakCurrentWord}
          className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 active:scale-90 transition-all"
          title="Speak"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-2">
        <span className="font-fun text-xl font-black text-slate-800">{currentItem.arabic}</span>
        <span className="text-xs text-slate-400 font-bold ml-2">({currentItem.category})</span>
      </div>

      {/* Hint Bubble */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200">
          💡 {currentItem.hint}
        </p>
        <button
          onClick={handleUseHint}
          className="p-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-full transition-all"
          title="Letter Hint"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Target Letter Slots */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-5 flex-wrap">
        {currentItem.word.split('').map((targetChar, i) => {
          const filled = built[i]?.char;

          return (
            <div
              key={i}
              className={`w-13 h-15 sm:w-14 sm:h-16 rounded-2xl border-3 flex items-center justify-center font-fun text-2xl sm:text-3xl font-black transition-all ${
                filled
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 scale-105 shadow-xs'
                  : showHint && i === built.length
                  ? 'border-amber-400 bg-amber-50 text-amber-600 border-dashed animate-pulse'
                  : 'border-dashed border-slate-300 bg-slate-50 text-slate-300'
              }`}
            >
              {filled || (showHint && i === built.length ? targetChar : '_')}
            </div>
          );
        })}
      </div>

      {/* Scrambled Bubble Buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 flex-wrap">
        {scrambled.map((item) => (
          <button
            key={item.id}
            onClick={() => handleLetterTap(item)}
            disabled={item.used || isCorrect}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl font-fun text-2xl font-black shadow-md border-2 transition-all ${
              item.used
                ? 'opacity-20 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed scale-90'
                : 'border-emerald-400 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-90 hover:scale-105'
            }`}
          >
            {item.char}
          </button>
        ))}

        {/* Undo Button */}
        {built.length > 0 && !isCorrect && (
          <button
            onClick={handleUndo}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border-2 border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-90 flex items-center justify-center transition-all"
            title="Delete last letter"
          >
            <Delete className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Correct Celebration / Next Word Button */}
      {isCorrect && (
        <div className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 animate-pop flex items-center justify-between">
          <div className="text-left">
            <span className="font-fun text-base font-black text-emerald-800 block">
              Excellent! 🎉 +25 XP
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              You spelled {currentItem.word} correctly!
            </span>
          </div>

          <button
            onClick={handleNextWord}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-fun font-black rounded-xl shadow-md text-xs sm:text-sm flex items-center gap-1.5 transition-all"
          >
            <span>Next Word</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
