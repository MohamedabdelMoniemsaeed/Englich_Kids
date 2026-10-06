import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Eraser, Trash2, Volume2, CheckCircle2 } from 'lucide-react';
import { playChime, speakWord, speakSequence, playPraise } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface TracingGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

const CATEGORIES = {
  uppercase: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'S', 'Z'],
  lowercase: ['a', 'b', 'c', 'd', 'e', 'g', 'm', 'p', 'r', 's', 'y'],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  shapes: ['⭐', '❤️', '⭕', '🔷', '☀️', '🌸'],
};

const PHONICS_MAP: Record<string, string> = {
  A: 'A is for Apple',
  B: 'B is for Book',
  C: 'C is for Cat',
  D: 'D is for Dog',
  E: 'E is for Egg',
  F: 'F is for Fish',
  G: 'G is for Girl',
  H: 'H is for Horse',
  M: 'M is for Monkey',
  S: 'S is for Sun',
  Z: 'Z is for Zoo',
  '1': 'Number One',
  '2': 'Number Two',
  '3': 'Number Three',
  '4': 'Number Four',
  '5': 'Number Five',
  '6': 'Number Six',
  '7': 'Number Seven',
  '8': 'Number Eight',
  '9': 'Number Nine',
  '10': 'Number Ten',
  '⭐': 'Star Shape',
  '❤️': 'Heart Shape',
  '⭕': 'Circle Shape',
  '🔷': 'Diamond Shape',
  '☀️': 'Sunny Sun',
  '🌸': 'Flower Blossom',
};

export const TracingGame: React.FC<TracingGameProps> = ({ speechRate, soundEnabled, onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES>('uppercase');
  const [tracingChar, setTracingChar] = useState<string>('A');
  const [brushColor, setBrushColor] = useState<string>('#3B82F6');
  const [isRainbow, setIsRainbow] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [completedList, setCompletedList] = useState<string[]>([]);
  const hueRef = useRef(0);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearCanvas();
    if (soundEnabled) {
      const phrase = PHONICS_MAP[tracingChar] || tracingChar;
      speakSequence([phrase], speechRate);
    }
  }, [tracingChar]);

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

    ctx.lineWidth = isEraser ? 34 : 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      if (isRainbow) {
        hueRef.current = (hueRef.current + 8) % 360;
        ctx.strokeStyle = `hsl(${hueRef.current}, 90%, 55%)`;
      } else {
        ctx.strokeStyle = brushColor;
      }
      ctx.shadowBlur = 8;
      ctx.shadowColor = isRainbow ? `hsl(${hueRef.current}, 90%, 55%)` : brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCelebrate = () => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    if (!completedList.includes(tracingChar)) {
      setCompletedList((prev) => [...prev, tracingChar]);
    }
    onWin(20, 5);
    if (soundEnabled) {
      playPraise('star', ['Super writing artist!', tracingChar], speechRate);
    } else {
      playChime('star');
    }
  };

  const speakPrompt = () => {
    if (soundEnabled) {
      const phrase = PHONICS_MAP[tracingChar] || tracingChar;
      speakSequence([phrase], speechRate);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-blue-200 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <div>
          <h3 className="font-fun text-xl sm:text-2xl font-black text-blue-700 flex items-center gap-1.5">
            <span>Tracing Board</span>
            <span className="text-xl">✍️</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">تتبع واكتب الحروف والأرقام بالألوان المشعة</p>
        </div>

        <button
          onClick={speakPrompt}
          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors active:scale-95"
          title="Pronounce"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 mb-3 bg-blue-50/70 p-1.5 rounded-2xl w-full justify-center">
        {(
          [
            { key: 'uppercase', label: 'ABC' },
            { key: 'lowercase', label: 'abc' },
            { key: 'numbers', label: '123' },
            { key: 'shapes', label: 'Shapes' },
          ] as const
        ).map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              setTracingChar(CATEGORIES[cat.key][0]);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-fun font-bold transition-all ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Characters Carousel */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {CATEGORIES[selectedCategory].map((char) => {
          const isDone = completedList.includes(char);
          const isSelected = tracingChar === char;

          return (
            <button
              key={char}
              onClick={() => setTracingChar(char)}
              className={`w-11 h-11 shrink-0 rounded-2xl font-fun text-lg font-black transition-all relative ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {char}
              {isDone && (
                <span className="absolute -top-1 -right-1 text-xs">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tracing Canvas Area */}
      <div className="relative w-full aspect-square max-w-[330px] bg-slate-900 rounded-3xl overflow-hidden border-4 border-blue-400 shadow-inner flex items-center justify-center cursor-crosshair">
        {/* Background Guide Stencil */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-fun text-[180px] font-black text-white/20 tracking-wider">
            {tracingChar}
          </span>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={330}
          height={330}
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

      {/* Palette & Controls */}
      <div className="w-full flex items-center justify-between gap-2 mt-4">
        {/* Colors & Tools */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl flex-wrap">
          {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#EC4899'].map((col) => (
            <button
              key={col}
              onClick={() => {
                setIsEraser(false);
                setIsRainbow(false);
                setBrushColor(col);
              }}
              className={`w-6 h-6 rounded-lg transition-all ${
                !isEraser && !isRainbow && brushColor === col
                  ? 'ring-2 ring-slate-800 scale-110'
                  : ''
              }`}
              style={{ backgroundColor: col }}
            />
          ))}

          {/* Rainbow Pen */}
          <button
            onClick={() => {
              setIsEraser(false);
              setIsRainbow(true);
            }}
            className={`px-1.5 py-0.5 rounded-lg text-xs font-black transition-all ${
              isRainbow
                ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700'
            }`}
            title="Rainbow pen"
          >
            🌈
          </button>

          {/* Eraser */}
          <button
            onClick={() => setIsEraser(true)}
            className={`p-1.5 rounded-lg transition-all ${
              isEraser ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-all"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Done / Celebrate */}
        <button
          onClick={handleCelebrate}
          className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-fun font-black rounded-2xl shadow-md text-xs sm:text-sm flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>I Drew It! 🌟</span>
        </button>
      </div>
    </div>
  );
};
