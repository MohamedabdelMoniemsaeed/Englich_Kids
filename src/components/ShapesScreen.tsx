import React, { useState, useEffect } from 'react';
import { SHAPES_DATA } from '../data/learningData';
import { ThemeConfig, ShapeItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Grid, Layers, RotateCcw, Award } from 'lucide-react';
import { speakWord, speakSequence, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface ShapesScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

// Render dynamic child-friendly SVG shapes with gradient fills and drop shadows
export const ShapeGraphic: React.FC<{ shapeType: ShapeItem['shapeType']; color: string; size?: number }> = ({
  shapeType,
  color,
  size = 180,
}) => {
  const half = size / 2;

  switch (shapeType) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <circle cx="50" cy="50" r="44" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <rect x="10" y="10" width="80" height="80" rx="8" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 120 80" className="drop-shadow-md transition-transform hover:scale-105">
          <rect x="8" y="10" width="104" height="60" rx="8" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <polygon points="50,10 90,85 10,85" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <polygon
            points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
            fill={color}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <path
            d="M50 88 C20 65 5 45 5 28 C5 15 15 5 28 5 C38 5 46 12 50 20 C54 12 62 5 72 5 C85 5 95 15 95 28 C95 45 80 65 50 88 Z"
            fill={color}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
          />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <polygon points="50,8 90,50 50,92 10,50" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'oval':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <ellipse cx="50" cy="50" rx="45" ry="32" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
        </svg>
      );
    case 'pentagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <polygon points="50,10 90,38 75,85 25,85 10,38" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'octagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'crescent':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md transition-transform hover:scale-105">
          <path
            d="M50 10 A40 40 0 1 0 90 60 A32 32 0 1 1 50 10 Z"
            fill={color}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
          />
        </svg>
      );
    default:
      return null;
  }
};

export const ShapesScreen: React.FC<ShapesScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'quiz'>('carousel');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{
    correctShape: ShapeItem;
    options: ShapeItem[];
    isAnswered: boolean;
    selectedId: string | null;
  }>({
    correctShape: SHAPES_DATA[0],
    options: [],
    isAnswered: false,
    selectedId: null,
  });

  const currentShape = SHAPES_DATA[currentIndex];

  const handleSpeak = (shape?: ShapeItem) => {
    if (!soundEnabled) return;
    const target = shape || currentShape;
    setIsSpeaking(true);
    playChime('pop');
    speakWord(target.nameEnglish, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled) {
      handleSpeak(currentShape);
    }
  }, [currentIndex, viewMode]);

  const handleNext = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev + 1) % SHAPES_DATA.length);
  };

  const handlePrev = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev - 1 + SHAPES_DATA.length) % SHAPES_DATA.length);
  };

  // Generate a quiz round
  const generateQuiz = () => {
    const correctIdx = Math.floor(Math.random() * SHAPES_DATA.length);
    const correct = SHAPES_DATA[correctIdx];
    const options = [correct];

    while (options.length < 4) {
      const rand = Math.floor(Math.random() * SHAPES_DATA.length);
      if (!options.some((o) => o.id === SHAPES_DATA[rand].id)) {
        options.push(SHAPES_DATA[rand]);
      }
    }
    options.sort(() => Math.random() - 0.5);

    setQuizQuestion({
      correctShape: correct,
      options,
      isAnswered: false,
      selectedId: null,
    });

    if (soundEnabled) {
      speakSequence(['Find the', correct.nameEnglish], speechRate);
    }
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode]);

  const handleQuizAnswer = (option: ShapeItem) => {
    if (quizQuestion.isAnswered) return;

    const isCorrect = option.id === quizQuestion.correctShape.id;
    setQuizQuestion((prev) => ({
      ...prev,
      isAnswered: true,
      selectedId: option.id,
    }));

    if (isCorrect) {
      playChime('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (soundEnabled) {
        speakSequence(['Excellent!', option.nameEnglish], speechRate);
      }
    } else {
      playChime('click');
      if (soundEnabled) {
        speakSequence(['This is', option.nameEnglish, 'Try finding the', quizQuestion.correctShape.nameEnglish], speechRate);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Mode Switch Tabs */}
      <div className="flex items-center gap-2 mb-5 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl shadow-sm border border-slate-200">
        <button
          id="shapes-mode-carousel"
          onClick={() => {
            playChime('click');
            setViewMode('carousel');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
            viewMode === 'carousel' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Flashcard</span>
        </button>
        <button
          id="shapes-mode-grid"
          onClick={() => {
            playChime('click');
            setViewMode('grid');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
            viewMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>All Shapes ({SHAPES_DATA.length})</span>
        </button>
        <button
          id="shapes-mode-quiz"
          onClick={() => {
            playChime('click');
            setViewMode('quiz');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
            viewMode === 'quiz' ? 'bg-amber-500 text-white shadow-xs animate-pulse' : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Shape Quiz</span>
        </button>
      </div>

      {/* FLASHCARD CAROUSEL VIEW */}
      {viewMode === 'carousel' && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Main Card */}
          <div
            id="shape-flashcard"
            onClick={() => handleSpeak()}
            className="w-full bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden cursor-pointer active:scale-98 transition-all hover:shadow-2xl relative group"
          >
            {/* Audio Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all active:scale-90 ${
                isSpeaking ? 'bg-amber-500 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Pronounce Shape Name"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Shape Display Box */}
            <div className="h-64 sm:h-72 w-full bg-gradient-to-b from-slate-50 to-slate-100/80 flex items-center justify-center p-6 relative">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <ShapeGraphic shapeType={currentShape.shapeType} color={currentShape.color} size={180} />
              </div>

              {/* Sides badge */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-black text-slate-700 px-3 py-1.5 rounded-xl shadow-xs border border-slate-200 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {currentShape.sides > 0 ? `${currentShape.sides} Sides / ${currentShape.sides} أضلاع` : 'Round / شكل مستدير'}
              </div>
            </div>

            {/* Card Content & Details */}
            <div className="p-6 text-center bg-white flex flex-col items-center border-t border-slate-100">
              <span className="text-2xl font-bold text-slate-500 font-sans mb-0.5">
                {currentShape.nameArabic}
              </span>
              <span className="font-fun text-4xl sm:text-5xl font-black text-slate-800 tracking-wide">
                {currentShape.nameEnglish}
              </span>

              {/* Real Life Example Pill */}
              <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 shadow-2xs">
                <span className="text-lg">{currentShape.realLifeEmoji}</span>
                <span>Example: {currentShape.realLifeExample} ({currentShape.realLifeExampleArabic})</span>
              </div>

              <p className="text-slate-400 text-xs font-bold mt-3 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-amber-500" /> Tap card to hear pronunciation
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              id="shapes-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 py-3 px-5 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl font-bold shadow-md transition-all border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <span className="font-fun font-bold text-slate-700 text-base bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              {currentIndex + 1} / {SHAPES_DATA.length}
            </span>

            <button
              id="shapes-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1 py-3 px-5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW (ALL SHAPES) */}
      {viewMode === 'grid' && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {SHAPES_DATA.map((shape, idx) => (
            <div
              key={shape.id}
              id={`shape-grid-item-${shape.id}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(shape);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-amber-400 p-4 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group"
            >
              <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center p-2 mb-2 group-hover:scale-110 transition-transform">
                <ShapeGraphic shapeType={shape.shapeType} color={shape.color} size={80} />
              </div>
              <span className="font-fun text-xl font-black text-slate-800">{shape.nameEnglish}</span>
              <span className="text-xs font-bold text-amber-600">{shape.nameArabic}</span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                <span>{shape.realLifeEmoji}</span>
                <span className="truncate">{shape.realLifeExample}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* QUIZ GAME */}
      {viewMode === 'quiz' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border-4 border-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h3 className="font-fun text-2xl font-bold text-slate-800">
              Where is the {quizQuestion.correctShape.nameEnglish}?
            </h3>
          </div>
          <p className="text-slate-500 font-semibold text-sm mb-4">
            أين هو {quizQuestion.correctShape.nameArabic}؟
          </p>

          <button
            onClick={() => handleSpeak(quizQuestion.correctShape)}
            className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-bold text-sm transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen to Shape Name / استمع لاسم الشكل</span>
          </button>

          {/* 4 Shape Choices */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {quizQuestion.options.map((option) => {
              const isSelected = quizQuestion.selectedId === option.id;
              const isCorrect = option.id === quizQuestion.correctShape.id;

              let cardStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30';
              if (quizQuestion.isAnswered) {
                if (isCorrect) cardStyle = 'border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50 scale-102';
                else if (isSelected) cardStyle = 'border-rose-500 bg-rose-50';
              }

              return (
                <button
                  key={option.id}
                  id={`shape-quiz-${option.id}`}
                  onClick={() => handleQuizAnswer(option)}
                  className={`p-4 rounded-2xl border-3 bg-white flex flex-col items-center justify-center text-center transition-all active:scale-95 shadow-sm ${cardStyle}`}
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-2">
                    <ShapeGraphic shapeType={option.shapeType} color={option.color} size={84} />
                  </div>
                  <span className="font-fun text-base font-black text-slate-800">{option.nameEnglish}</span>
                  <span className="text-xs font-bold text-slate-500">{option.nameArabic}</span>
                </button>
              );
            })}
          </div>

          {quizQuestion.isAnswered && (
            <button
              id="quiz-next-shape-btn"
              onClick={generateQuiz}
              className="py-3 px-8 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-base inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Next Shape / شكل آخر</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
