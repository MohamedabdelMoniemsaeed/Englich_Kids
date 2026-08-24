import React, { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  Volume2,
  Eraser,
  Trash2,
  CheckCircle2,
  Flame,
  Star,
  Trophy,
  Play,
  Pause,
} from 'lucide-react';
import { speakWord, speakSequence, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface KidsGamesScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

type ActiveGame = 'menu' | 'memory' | 'tracing' | 'spelling' | 'listening' | 'songs' | 'stickers';

// SPELLING WORDS DATA
const SPELLING_WORDS = [
  { word: 'CAT', arabic: 'قطة', emoji: '🐱', hint: 'Says Meow!' },
  { word: 'DOG', arabic: 'كلب', emoji: '🐶', hint: 'Says Woof!' },
  { word: 'SUN', arabic: 'شمس', emoji: '☀️', hint: 'Bright and hot!' },
  { word: 'CAR', arabic: 'سيارة', emoji: '🚗', hint: 'Beep beep!' },
  { word: 'FISH', arabic: 'سمكة', emoji: '🐟', hint: 'Swims in water' },
  { word: 'LION', arabic: 'أسد', emoji: '🦁', hint: 'King of jungle' },
  { word: 'STAR', arabic: 'نجمة', emoji: '⭐', hint: 'Shines in sky' },
  { word: 'DUCK', arabic: 'بطة', emoji: '🦆', hint: 'Says Quack!' },
  { word: 'APPLE', arabic: 'تفاح', emoji: '🍎', hint: 'Sweet red fruit' },
  { word: 'BIRD', arabic: 'عصفور', emoji: '🐦', hint: 'Flies high' },
  { word: 'TREE', arabic: 'شجرة', emoji: '🌳', hint: 'Tall with leaves' },
  { word: 'BOOK', arabic: 'كتاب', emoji: '📖', hint: 'We read it' },
];

// LISTENING QUESTIONS POOL
const LISTENING_POOL = [
  { word: 'Elephant', arabic: 'فيل', emoji: '🐘', options: ['🐘', '🦒', '🦁', '🐵'] },
  { word: 'Banana', arabic: 'موز', emoji: '🍌', options: ['🍎', '🍌', '🍓', '🍇'] },
  { word: 'Airplane', arabic: 'طائرة', emoji: '✈️', options: ['🚗', '✈️', '🚆', '🚢'] },
  { word: 'Red', arabic: 'أحمر', emoji: '🔴', options: ['🔵', '🔴', '🟢', '🟡'] },
  { word: 'Doctor', arabic: 'طبيب', emoji: '👨‍⚕️', options: ['👨‍⚕️', '👩‍🏫', '👨‍🚒', '👮‍♂️'] },
  { word: 'Circle', arabic: 'دائرة', emoji: '🔵', options: ['🔺', '⏹️', '🔵', '⭐'] },
  { word: 'Eyes', arabic: 'عينان', emoji: '👀', options: ['👀', '👂', '👃', '👄'] },
  { word: 'Rocket', arabic: 'صاروخ', emoji: '🚀', options: ['🚲', '🚀', '🚁', '⛵'] },
  { word: 'Strawberry', arabic: 'فراولة', emoji: '🍓', options: ['🍓', '🍍', '🍉', '🍋'] },
  { word: 'Zebra', arabic: 'حمار وحشي', emoji: '🦓', options: ['🦓', '🦒', '🐪', '🦘'] },
];

export const KidsGamesScreen: React.FC<KidsGamesScreenProps> = ({
  speechRate,
  soundEnabled,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [starsCount, setStarsCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('english_kids_stars') || '25', 10);
  });

  const addStars = (amount: number) => {
    setStarsCount((prev) => {
      const next = prev + amount;
      localStorage.setItem('english_kids_stars', next.toString());
      return next;
    });
  };

  // ----------------------------------------------------
  // GAME 1: MEMORY MATCH GAME
  // ----------------------------------------------------
  const memoryItems = [
    { id: '1', name: 'Cat', emoji: '🐱' },
    { id: '2', name: 'Dog', emoji: '🐶' },
    { id: '3', name: 'Lion', emoji: '🦁' },
    { id: '4', name: 'Apple', emoji: '🍎' },
    { id: '5', name: 'Car', emoji: '🚗' },
    { id: '6', name: 'Star', emoji: '⭐' },
  ];

  interface MemoryCard {
    cardId: number;
    matchId: string;
    name: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    const pool = [...memoryItems, ...memoryItems];
    pool.sort(() => Math.random() - 0.5);

    pool.forEach((item, idx) => {
      deck.push({
        cardId: idx,
        matchId: item.id,
        name: item.name,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    setMemoryCards(deck);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    if (activeGame === 'memory') {
      initMemoryGame();
    }
  }, [activeGame]);

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length === 2 || memoryCards[idx].isFlipped || memoryCards[idx].isMatched) return;

    playChime('pop');
    const newCards = [...memoryCards];
    newCards[idx].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.matchId === secondCard.matchId) {
        // MATCH!
        setTimeout(() => {
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          playChime('success');
          if (soundEnabled) speakWord(firstCard.name, speechRate);

          // Check if all matched
          if (newCards.every((c) => c.isMatched)) {
            setMemoryWon(true);
            addStars(10);
            confetti({ particleCount: 80, spread: 80 });
            if (soundEnabled) speakSequence(['You won! High five!'], speechRate);
          }
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // ----------------------------------------------------
  // GAME 2: TRACING BOARD (Canvas Drawing)
  // ----------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tracingChar, setTracingChar] = useState<string>('A');
  const [brushColor, setBrushColor] = useState<string>('#3B82F6');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  const TRACING_CHARS = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', '⭐', '❤️'];

  const clearTracingCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (activeGame === 'tracing') {
      clearTracingCanvas();
      if (soundEnabled) speakWord(tracingChar, speechRate);
    }
  }, [tracingChar, activeGame]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = isEraser ? 32 : 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const celebrateTracing = () => {
    playChime('success');
    addStars(5);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    if (soundEnabled) speakSequence(['Super artist! Letter', tracingChar], speechRate);
  };

  // ----------------------------------------------------
  // GAME 3: SPELLING BEE WORD BUILDER
  // ----------------------------------------------------
  const [spellingIdx, setSpellingIdx] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [builtLetters, setBuiltLetters] = useState<string[]>([]);
  const [isSpellingCorrect, setIsSpellingCorrect] = useState(false);

  const currentSpelling = SPELLING_WORDS[spellingIdx];

  const initSpellingWord = (idx: number) => {
    const wordObj = SPELLING_WORDS[idx];
    const letters = wordObj.word.split('').map((char, i) => ({
      id: i,
      char,
      used: false,
    }));
    letters.sort(() => Math.random() - 0.5);
    setScrambledLetters(letters);
    setBuiltLetters([]);
    setIsSpellingCorrect(false);

    if (soundEnabled) {
      speakSequence(['Spell the word', wordObj.word], speechRate);
    }
  };

  useEffect(() => {
    if (activeGame === 'spelling') {
      initSpellingWord(spellingIdx);
    }
  }, [spellingIdx, activeGame]);

  const handleLetterTap = (letterItem: { id: number; char: string; used: boolean }) => {
    if (letterItem.used || isSpellingCorrect) return;

    playChime('pop');
    if (soundEnabled) speakWord(letterItem.char, speechRate);

    const nextBuilt = [...builtLetters, letterItem.char];
    setBuiltLetters(nextBuilt);

    setScrambledLetters((prev) =>
      prev.map((l) => (l.id === letterItem.id ? { ...l, used: true } : l))
    );

    // Check if word is complete
    if (nextBuilt.length === currentSpelling.word.length) {
      const fullWord = nextBuilt.join('');
      if (fullWord === currentSpelling.word) {
        // Correct!
        setIsSpellingCorrect(true);
        playChime('success');
        addStars(5);
        confetti({ particleCount: 70, spread: 70 });
        if (soundEnabled) speakSequence(['Awesome!', currentSpelling.word], speechRate);
      } else {
        // Wrong spelling -> reset
        playChime('click');
        setTimeout(() => {
          setBuiltLetters([]);
          setScrambledLetters((prev) => prev.map((l) => ({ ...l, used: false })));
          if (soundEnabled) speakSequence(['Try again!'], speechRate);
        }, 800);
      }
    }
  };

  const nextSpellingWord = () => {
    const nextIdx = (spellingIdx + 1) % SPELLING_WORDS.length;
    setSpellingIdx(nextIdx);
  };

  // ----------------------------------------------------
  // GAME 4: SPEED LISTENING CHALLENGE
  // ----------------------------------------------------
  const [listeningIdx, setListeningIdx] = useState(0);
  const [listeningScore, setListeningScore] = useState(0);
  const [listeningStreak, setListeningStreak] = useState(0);
  const [listeningAnswered, setListeningAnswered] = useState(false);
  const [selectedListeningOption, setSelectedListeningOption] = useState<string | null>(null);

  const currentListening = LISTENING_POOL[listeningIdx];

  const playListeningPrompt = () => {
    if (soundEnabled) {
      speakWord(currentListening.word, speechRate);
    }
  };

  useEffect(() => {
    if (activeGame === 'listening') {
      playListeningPrompt();
      setListeningAnswered(false);
      setSelectedListeningOption(null);
    }
  }, [listeningIdx, activeGame]);

  const handleListeningPick = (opt: string) => {
    if (listeningAnswered) return;

    const isCorrect = opt === currentListening.emoji;
    setSelectedListeningOption(opt);
    setListeningAnswered(true);

    if (isCorrect) {
      playChime('success');
      setListeningScore((s) => s + 10);
      setListeningStreak((st) => st + 1);
      addStars(5);
      confetti({ particleCount: 50, spread: 60 });
      if (soundEnabled) speakSequence(['Correct!', currentListening.word], speechRate);
    } else {
      playChime('click');
      setListeningStreak(0);
      if (soundEnabled) speakSequence(['This is not it', 'Find the', currentListening.word], speechRate);
    }
  };

  const nextListeningQuestion = () => {
    const nextIdx = (listeningIdx + 1) % LISTENING_POOL.length;
    setListeningIdx(nextIdx);
  };

  // ----------------------------------------------------
  // GAME 5: SING-ALONG SONGS (ABC & 1-10)
  // ----------------------------------------------------
  const [selectedSong, setSelectedSong] = useState<'abc' | 'numbers'>('abc');
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [highlightedWordIdx, setHighlightedWordIdx] = useState<number>(-1);

  const ABC_SONG_LYRICS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'and', 'Z',
    'Now', 'I', 'know', 'my', 'ABCs,',
    'Next', 'time', 'won\'t', 'you', 'sing', 'with', 'me!'
  ];

  const NUMBERS_SONG_LYRICS = [
    'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Let\'s', 'count', 'once', 'again', 'from', 'One', 'to', 'Ten!',
    'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten!'
  ];

  const playSongLyrics = () => {
    if (isPlayingSong) {
      window.speechSynthesis?.cancel();
      setIsPlayingSong(false);
      setHighlightedWordIdx(-1);
      return;
    }

    setIsPlayingSong(true);
    const lyrics = selectedSong === 'abc' ? ABC_SONG_LYRICS : NUMBERS_SONG_LYRICS;

    let index = 0;
    const playNext = () => {
      if (index >= lyrics.length) {
        setIsPlayingSong(false);
        setHighlightedWordIdx(-1);
        playChime('success');
        addStars(10);
        confetti({ particleCount: 70, spread: 80 });
        return;
      }

      setHighlightedWordIdx(index);
      const word = lyrics[index];
      index++;

      if (soundEnabled) {
        speakWord(word, speechRate * 1.05, () => {
          setTimeout(playNext, 120);
        });
      } else {
        setTimeout(playNext, 400);
      }
    };

    playNext();
  };

  // ----------------------------------------------------
  // GAME 6: STICKER BOOK & BADGES
  // ----------------------------------------------------
  const BADGES = [
    { id: 'b1', name: 'Alphabet Hero', req: 10, emoji: '🔤', desc: 'Practiced Letters' },
    { id: 'b2', name: 'Number Wizard', req: 25, emoji: '🔢', desc: 'Mastered Counting' },
    { id: 'b3', name: 'Memory Genius', req: 40, emoji: '🧠', desc: 'Matched All Cards' },
    { id: 'b4', name: 'Super Artist', req: 60, emoji: '🎨', desc: 'Traced Colorful Letters' },
    { id: 'b5', name: 'Animal Explorer', req: 80, emoji: '🦁', desc: 'Discovered Zoo Animals' },
    { id: 'b6', name: 'English Champion', req: 100, emoji: '🏆', desc: 'Earned 100 Stars!' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Stars & Header Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 bg-white/90 backdrop-blur-xs p-3 sm:p-4 rounded-3xl shadow-md border-2 border-amber-200">
        <div className="flex items-center gap-2">
          {activeGame !== 'menu' && (
            <button
              onClick={() => {
                playChime('pop');
                window.speechSynthesis?.cancel();
                setIsPlayingSong(false);
                setActiveGame('menu');
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl text-sm transition-all flex items-center gap-1"
            >
              ⬅️ All Games
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <div>
              <h2 className="font-fun text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                Kids Games Hub
              </h2>
              <p className="text-xs text-slate-500 font-semibold">ألعاب وأنشطة تفاعلية مسلية</p>
            </div>
          </div>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-fun font-black px-4 py-2 rounded-2xl shadow-md text-base sm:text-lg animate-pulse">
          <Star className="w-5 h-5 fill-yellow-200 text-yellow-100" />
          <span>{starsCount} Stars</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. GAMES MENU HUB */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'menu' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card 1: Memory Match */}
          <button
            onClick={() => {
              playChime('pop');
              setActiveGame('memory');
            }}
            className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-purple-200 hover:border-purple-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              🧠
            </div>
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                Memory Match
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                لعبة الذاكرة ومطابقة البطاقات
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-600 bg-purple-50 py-1.5 px-3 rounded-xl">
              <span>Find Pairs</span>
              <span>Play ➜</span>
            </div>
          </button>

          {/* Card 2: Letter & Number Tracing */}
          <button
            onClick={() => {
              playChime('pop');
              setActiveGame('tracing');
            }}
            className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-blue-200 hover:border-blue-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              ✍️
            </div>
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Tracing Board
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                سبورة تتبع وكتابة الحروف والأرقام
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-600 bg-blue-50 py-1.5 px-3 rounded-xl">
              <span>Draw & Glow</span>
              <span>Play ➜</span>
            </div>
          </button>

          {/* Card 3: Spelling Bee */}
          <button
            onClick={() => {
              playChime('pop');
              setActiveGame('spelling');
            }}
            className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-emerald-200 hover:border-emerald-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              🔤
            </div>
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Spelling Bee
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                لعبة تركيب حروف الكلمة
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-xl">
              <span>Build Words</span>
              <span>Play ➜</span>
            </div>
          </button>

          {/* Card 4: Listening Challenge */}
          <button
            onClick={() => {
              playChime('pop');
              setActiveGame('listening');
            }}
            className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-rose-200 hover:border-rose-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              🎧
            </div>
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                Listen & Tap
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                تحدي الاستماع "اسمع واختر"
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-rose-600 bg-rose-50 py-1.5 px-3 rounded-xl">
              <span>Audio Quiz</span>
              <span>Play ➜</span>
            </div>
          </button>

          {/* Card 5: Sing-Along Karaoke Songs */}
          <button
            onClick={() => {
              playChime('pop');
              setActiveGame('songs');
            }}
            className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-amber-200 hover:border-amber-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              🎵
            </div>
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                Sing-Along Songs
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                أناشيد الحروف والأرقام التفاعلية
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600 bg-amber-50 py-1.5 px-3 rounded-xl">
              <span>Karaoke ABC</span>
              <span>Sing ➜</span>
            </div>
          </button>

          {/* Card 6: Sticker Book */}
          <button
            onClick={() => {
              playChime('pop');
              setActiveGame('stickers');
            }}
            className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-3 border-indigo-200 hover:border-indigo-400 transition-all text-left flex flex-col justify-between group active:scale-98 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Sticker Book & Trophies
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                دفتر الجوائز والأوسمة والملصقات
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-xl">
              <span>{starsCount} Stars</span>
              <span>View ➜</span>
            </div>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. MEMORY MATCH GAME */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'memory' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-white text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h3 className="font-fun text-2xl font-bold text-purple-700">Memory Match 🧠</h3>
              <p className="text-xs text-slate-500">Moves: {memoryMoves}</p>
            </div>
            <button
              onClick={initMemoryGame}
              className="p-2.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {memoryCards.map((card, idx) => (
              <button
                key={card.cardId}
                onClick={() => handleCardClick(idx)}
                className={`h-24 sm:h-28 rounded-2xl text-4xl sm:text-5xl flex items-center justify-center border-3 font-fun font-bold transition-all transform active:scale-95 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-gradient-to-tr from-purple-50 to-pink-50 border-purple-400 rotate-0 shadow-sm'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 border-purple-500 text-white shadow-md'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '❓'}
              </button>
            ))}
          </div>

          {memoryWon && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center animate-bounce">
              <span className="text-3xl">🎉 ⭐ +10 Stars!</span>
              <p className="font-fun text-xl font-bold text-emerald-800 mt-1">
                You matched all pairs in {memoryMoves} moves!
              </p>
              <button
                onClick={initMemoryGame}
                className="mt-3 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md"
              >
                Play Again!
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. TRACING BOARD */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'tracing' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-white flex flex-col items-center">
          {/* Character selector */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
            {TRACING_CHARS.map((char) => (
              <button
                key={char}
                onClick={() => setTracingChar(char)}
                className={`w-11 h-11 shrink-0 rounded-2xl font-fun text-xl font-bold transition-all ${
                  tracingChar === char
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full aspect-square max-w-[340px] bg-slate-900 rounded-3xl overflow-hidden border-4 border-blue-400 shadow-inner flex items-center justify-center cursor-crosshair">
            {/* Guide stencil */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-fun text-[190px] font-black text-white/20 tracking-wider">
                {tracingChar}
              </span>
            </div>

            {/* Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="absolute inset-0 z-10 w-full h-full touch-none"
            />
          </div>

          {/* Color & Tool Palette */}
          <div className="w-full flex items-center justify-between gap-2 mt-4">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#EC4899'].map((col) => (
                <button
                  key={col}
                  onClick={() => {
                    setIsEraser(false);
                    setBrushColor(col);
                  }}
                  className={`w-7 h-7 rounded-xl transition-all ${
                    !isEraser && brushColor === col ? 'ring-3 ring-slate-800 scale-110' : ''
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
              <button
                onClick={() => setIsEraser(true)}
                className={`p-1.5 rounded-xl transition-all ${
                  isEraser ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>
              <button
                onClick={clearTracingCanvas}
                className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 transition-all"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={celebrateTracing}
              className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-fun font-bold rounded-2xl shadow-md text-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" /> Done! 🌟
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. SPELLING BEE WORD BUILDER */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'spelling' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border-4 border-white text-center">
          <div className="text-8xl mb-2 animate-float select-none">{currentSpelling.emoji}</div>
          <p className="text-slate-500 font-bold text-sm mb-1">{currentSpelling.arabic}</p>
          <p className="text-xs text-amber-600 font-semibold mb-4 bg-amber-50 py-1 px-3 rounded-full inline-block">
            💡 {currentSpelling.hint}
          </p>

          {/* Letter Slots */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            {currentSpelling.word.split('').map((_, i) => {
              const char = builtLetters[i];
              return (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-2xl border-3 flex items-center justify-center font-fun text-3xl font-black ${
                    char
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 scale-105 shadow-sm'
                      : 'border-dashed border-slate-300 bg-slate-50 text-slate-300'
                  }`}
                >
                  {char || '_'}
                </div>
              );
            })}
          </div>

          {/* Scrambled Bubble Options */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {scrambledLetters.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLetterTap(item)}
                disabled={item.used}
                className={`w-14 h-14 rounded-2xl font-fun text-2xl font-black shadow-md border-2 transition-all ${
                  item.used
                    ? 'opacity-20 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed scale-90'
                    : 'border-emerald-400 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-90 hover:scale-105'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>

          {isSpellingCorrect && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={nextSpellingWord}
                className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-base flex items-center gap-2"
              >
                <span>Next Word / كلمة أخرى</span> ➜
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. SPEED LISTENING CHALLENGE */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'listening' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border-4 border-white text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-xl">
              <Flame className="w-4 h-4 fill-amber-500" /> Streak: {listeningStreak}
            </div>
            <div className="font-fun font-bold text-slate-700 text-sm">
              Score: {listeningScore} pts
            </div>
          </div>

          <h3 className="font-fun text-2xl font-black text-slate-800 mb-1">
            Listen carefully! 🎧
          </h3>
          <p className="text-slate-500 text-xs font-semibold mb-4">
            اسمع الصوت واختر الصورة الصحيحة بسرعة
          </p>

          {/* Big Repeat Sound Button */}
          <button
            onClick={playListeningPrompt}
            className="mb-6 w-20 h-20 mx-auto rounded-full bg-rose-500 hover:bg-rose-600 active:scale-90 text-white shadow-xl flex items-center justify-center transition-all animate-pulse"
          >
            <Volume2 className="w-10 h-10" />
          </button>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {currentListening.options.map((opt, i) => {
              const isSelected = selectedListeningOption === opt;
              const isCorrect = opt === currentListening.emoji;

              let style = 'border-slate-200 hover:border-rose-400 bg-slate-50/50';
              if (listeningAnswered) {
                if (isCorrect) style = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200 scale-102';
                else if (isSelected) style = 'border-rose-500 bg-rose-50';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleListeningPick(opt)}
                  className={`p-5 rounded-2xl border-3 text-7xl flex items-center justify-center transition-all active:scale-95 shadow-sm ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {listeningAnswered && (
            <button
              onClick={nextListeningQuestion}
              className="py-3 px-8 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-base flex items-center gap-2 mx-auto"
            >
              <span>Next Challenge</span> ➜
            </button>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. SING-ALONG SONGS (KARAOKE) */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'songs' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border-4 border-white text-center">
          {/* Song selector */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsPlayingSong(false);
                setSelectedSong('abc');
              }}
              className={`px-4 py-2 rounded-xl font-fun font-bold text-sm transition-all ${
                selectedSong === 'abc' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              🔤 ABC Song
            </button>
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsPlayingSong(false);
                setSelectedSong('numbers');
              }}
              className={`px-4 py-2 rounded-xl font-fun font-bold text-sm transition-all ${
                selectedSong === 'numbers' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              🔢 Numbers Song
            </button>
          </div>

          {/* Big Play / Pause Button */}
          <button
            onClick={playSongLyrics}
            className={`w-20 h-20 mx-auto rounded-full text-white shadow-xl flex items-center justify-center transition-all active:scale-90 mb-6 ${
              isPlayingSong ? 'bg-amber-600 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isPlayingSong ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </button>

          {/* Karaoke Lyrics Area */}
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-5 max-h-72 overflow-y-auto flex flex-wrap justify-center gap-2">
            {(selectedSong === 'abc' ? ABC_SONG_LYRICS : NUMBERS_SONG_LYRICS).map((word, i) => {
              const isCurrent = highlightedWordIdx === i;
              return (
                <span
                  key={i}
                  className={`font-fun text-xl sm:text-2xl font-bold px-2.5 py-1 rounded-xl transition-all duration-200 ${
                    isCurrent
                      ? 'bg-amber-500 text-white scale-125 shadow-md -translate-y-1'
                      : 'text-slate-700'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. STICKER BOOK & TROPHIES */}
      {/* ---------------------------------------------------- */}
      {activeGame === 'stickers' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border-4 border-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            <h3 className="font-fun text-2xl font-black text-slate-800">
              My Achievement Stickers
            </h3>
          </div>
          <p className="text-slate-500 text-xs font-semibold mb-6">
            كلما تعلمت ولعبت أكثر، جمعت نجوماً وملصقات ذهبية!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {BADGES.map((badge) => {
              const isUnlocked = starsCount >= badge.req;
              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    if (isUnlocked) {
                      playChime('pop');
                      confetti({ particleCount: 30, spread: 50 });
                      if (soundEnabled) speakSequence(['Badge unlocked!', badge.name], speechRate);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                    isUnlocked
                      ? 'border-amber-300 bg-amber-50/70 shadow-sm cursor-pointer active:scale-95 hover:border-amber-400'
                      : 'border-slate-200 bg-slate-100/60 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-5xl mb-1.5">{badge.emoji}</div>
                  <span className="font-fun text-sm font-bold text-slate-800">{badge.name}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{badge.desc}</span>
                  <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-800 shadow-2xs border border-amber-200">
                    {isUnlocked ? '✅ Unlocked' : `🔒 ${badge.req} Stars`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
