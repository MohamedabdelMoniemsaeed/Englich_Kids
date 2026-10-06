import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Star, Sparkles, Clock, Flame } from 'lucide-react';
import { playChime, speakWord, speakSequence, playPraise } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface MemoryGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type ThemeType = 'animals' | 'fruits' | 'vehicles' | 'shapes';

interface CardItem {
  id: string;
  name: string;
  emoji: string;
}

const THEME_POOLS: Record<ThemeType, CardItem[]> = {
  animals: [
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'dog', name: 'Dog', emoji: '🐶' },
    { id: 'lion', name: 'Lion', emoji: '🦁' },
    { id: 'elephant', name: 'Elephant', emoji: '🐘' },
    { id: 'monkey', name: 'Monkey', emoji: '🐵' },
    { id: 'panda', name: 'Panda', emoji: '🐼' },
    { id: 'frog', name: 'Frog', emoji: '🐸' },
    { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  ],
  fruits: [
    { id: 'apple', name: 'Apple', emoji: '🍎' },
    { id: 'banana', name: 'Banana', emoji: '🍌' },
    { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
    { id: 'watermelon', name: 'Watermelon', emoji: '🍉' },
    { id: 'orange', name: 'Orange', emoji: '🍊' },
    { id: 'grapes', name: 'Grapes', emoji: '🍇' },
    { id: 'pineapple', name: 'Pineapple', emoji: '🍍' },
    { id: 'cherry', name: 'Cherry', emoji: '🍒' },
  ],
  vehicles: [
    { id: 'car', name: 'Car', emoji: '🚗' },
    { id: 'airplane', name: 'Airplane', emoji: '✈️' },
    { id: 'rocket', name: 'Rocket', emoji: '🚀' },
    { id: 'train', name: 'Train', emoji: '🚆' },
    { id: 'ship', name: 'Ship', emoji: '🚢' },
    { id: 'bus', name: 'Bus', emoji: '🚌' },
    { id: 'helicopter', name: 'Helicopter', emoji: '🚁' },
    { id: 'bicycle', name: 'Bicycle', emoji: '🚲' },
  ],
  shapes: [
    { id: 'star', name: 'Star', emoji: '⭐' },
    { id: 'heart', name: 'Heart', emoji: '❤️' },
    { id: 'circle', name: 'Circle', emoji: '🔴' },
    { id: 'square', name: 'Square', emoji: '🟦' },
    { id: 'triangle', name: 'Triangle', emoji: '🔺' },
    { id: 'diamond', name: 'Diamond', emoji: '💎' },
    { id: 'sun', name: 'Sun', emoji: '☀️' },
    { id: 'moon', name: 'Moon', emoji: '🌙' },
  ],
};

interface MemoryCard {
  cardId: number;
  matchId: string;
  name: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ speechRate, soundEnabled, onWin }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [theme, setTheme] = useState<ThemeType>('animals');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const pairCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 6 : 8;

  const initGame = () => {
    const rawPool = THEME_POOLS[theme].slice(0, pairCount);
    const combined = [...rawPool, ...rawPool];
    combined.sort(() => Math.random() - 0.5);

    const deck: MemoryCard[] = combined.map((item, idx) => ({
      cardId: idx,
      matchId: item.id,
      name: item.name,
      emoji: item.emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setTimerSeconds(0);
    setIsWon(false);
    setIsTimerActive(true);
  };

  useEffect(() => {
    initGame();
  }, [difficulty, theme]);

  // Timer counter
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && !isWon) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isWon]);

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return;

    playChime('pop');
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.matchId === secondCard.matchId) {
        // MATCH!
        setTimeout(() => {
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);

          // Check if all matched
          if (newCards.every((c) => c.isMatched)) {
            setIsWon(true);
            setIsTimerActive(false);
            const scoreMultiplier = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10;
            const finalScore = Math.max(10, scoreMultiplier * pairCount - moves * 2);
            const starsAwarded = difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 6;
            onWin(finalScore, starsAwarded);
            confetti({ particleCount: 80, spread: 80 });
            if (soundEnabled) {
              playPraise('success', ['You matched them all!', 'Great job!'], speechRate);
            } else {
              playChime('success');
            }
          } else {
            if (soundEnabled) {
              playPraise('success', [firstCard.name], speechRate);
            } else {
              playChime('success');
            }
          }
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  const calculateStars = () => {
    if (moves <= pairCount + 2) return 3;
    if (moves <= pairCount * 2) return 2;
    return 1;
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-purple-200 flex flex-col items-center">
      {/* Top Header & Settings */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-fun text-xl sm:text-2xl font-black text-purple-700 flex items-center gap-1.5">
            <span>Memory Match</span>
            <span className="text-xl">🧠</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">طابق كل بطاقتين متشابهتين بأقل حركات</p>
        </div>

        <button
          onClick={initGame}
          className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl transition-colors font-bold text-xs flex items-center gap-1 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      {/* Selectors Bar: Difficulty & Themes */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 bg-purple-50/70 p-2.5 rounded-2xl border border-purple-100">
        {/* Difficulty */}
        <div className="flex items-center gap-1">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-2.5 py-1 rounded-xl text-xs font-fun font-bold capitalize transition-all ${
                difficulty === d
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-purple-100'
              }`}
            >
              {d === 'easy' ? 'Easy (6)' : d === 'medium' ? 'Medium (12)' : 'Hard (16)'}
            </button>
          ))}
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-1">
          {(
            [
              { key: 'animals', icon: '🦁' },
              { key: 'fruits', icon: '🍎' },
              { key: 'vehicles', icon: '🚗' },
              { key: 'shapes', icon: '⭐' },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              title={t.key}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-all ${
                theme === t.key
                  ? 'bg-purple-600 text-white shadow-xs scale-105'
                  : 'bg-white hover:bg-purple-100'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full flex items-center justify-around bg-slate-50 py-2 px-4 rounded-xl border border-slate-200 mb-4 text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>{timerSeconds}s</span>
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Moves: {moves}</span>
        </span>
        <span className="text-purple-600">
          Pairs: {cards.filter((c) => c.isMatched).length / 2} / {pairCount}
        </span>
      </div>

      {/* Cards Grid */}
      <div
        className={`w-full grid gap-2.5 sm:gap-3 mb-4 ${
          difficulty === 'easy'
            ? 'grid-cols-3'
            : difficulty === 'medium'
            ? 'grid-cols-4'
            : 'grid-cols-4 sm:grid-cols-4'
        }`}
      >
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.cardId}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-3 font-fun font-bold transition-all duration-300 transform active:scale-95 select-none shadow-sm ${
                isRevealed
                  ? 'bg-gradient-to-tr from-purple-50 to-pink-50 border-purple-400 rotate-0 scale-98 shadow-inner'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 border-purple-500 text-white hover:shadow-md hover:scale-102 cursor-pointer'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-3xl sm:text-4xl animate-pop">{card.emoji}</span>
                  <span className="text-[10px] sm:text-xs font-black text-purple-800 mt-1">
                    {card.name}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-purple-200">?</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory Banner */}
      {isWon && (
        <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-4 text-center shadow-lg animate-pop">
          <div className="flex justify-center gap-1 text-2xl mb-1">
            {Array.from({ length: calculateStars() }).map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
          <h4 className="font-fun text-xl font-black">Fantastic Memory! 🎉</h4>
          <p className="text-xs font-bold opacity-90 mt-0.5">
            Finished in {moves} moves & {timerSeconds} seconds!
          </p>
          <button
            onClick={initGame}
            className="mt-3 px-6 py-2 bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95 rounded-xl font-fun font-black text-sm shadow-md transition-all"
          >
            Play Again / العب مرة أخرى
          </button>
        </div>
      )}
    </div>
  );
};
