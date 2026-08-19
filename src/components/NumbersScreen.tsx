import React, { useState, useEffect } from 'react';
import { NUMBERS_DATA } from '../data/learningData';
import { ThemeConfig } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Grid, Layers } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface NumbersScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const NumbersScreen: React.FC<NumbersScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentItem = NUMBERS_DATA[currentIndex];

  const handleSpeak = (text?: string) => {
    if (!soundEnabled) return;
    setIsSpeaking(true);
    playChime('pop');
    speakWord(text || currentItem.word, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled) {
      handleSpeak();
    }
  }, [currentIndex, viewMode]);

  const handleNext = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev + 1) % NUMBERS_DATA.length);
  };

  const handlePrev = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev - 1 + NUMBERS_DATA.length) % NUMBERS_DATA.length);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 mb-4 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl shadow-sm border border-slate-200">
        <button
          id="numbers-mode-carousel"
          onClick={() => {
            playChime('click');
            setViewMode('carousel');
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-sm transition-all ${
            viewMode === 'carousel' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Flashcard</span>
        </button>
        <button
          id="numbers-mode-grid"
          onClick={() => {
            playChime('click');
            setViewMode('grid');
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-sm transition-all ${
            viewMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>All Numbers (1-10)</span>
        </button>
      </div>

      {viewMode === 'carousel' ? (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Main Card */}
          <div
            id="numbers-flashcard"
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
              title="Pronounce Number"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Illustration */}
            <div className="h-64 sm:h-72 w-full bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100">
              <img
                src={currentItem.image}
                alt={currentItem.word}
                className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/numbers/backgroundimage.jpg';
                }}
              />
            </div>

            {/* Words and Number */}
            <div className="p-6 text-center bg-gradient-to-b from-white to-slate-50 flex flex-col items-center">
              <div className="flex items-center justify-between w-full px-4 mb-2">
                <span className="font-fun text-3xl font-black text-amber-600">
                  {currentItem.number}
                </span>
                <span className="text-2xl font-bold text-slate-500 font-sans">
                  {currentItem.arabic}
                </span>
              </div>
              <span className="font-fun text-5xl sm:text-6xl font-black text-slate-800 tracking-wide mt-1">
                {currentItem.word}
              </span>
              <p className="text-slate-400 text-xs font-bold mt-3 flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> Tap anywhere to hear pronunciation
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              id="numbers-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 py-3 px-5 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl font-bold shadow-md transition-all border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <span className="font-fun font-bold text-slate-700 text-base bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              {currentIndex + 1} / {NUMBERS_DATA.length}
            </span>

            <button
              id="numbers-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1 py-3 px-5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Counting visual bubbles */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 bg-white/60 p-3 rounded-2xl border border-white">
            {Array.from({ length: currentItem.number }).map((_, i) => (
              <span
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white font-fun font-bold text-xs flex items-center justify-center shadow-xs animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {NUMBERS_DATA.map((item, idx) => (
            <div
              key={item.number}
              id={`numbers-grid-item-${item.number}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(item.word);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-amber-400 p-4 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-2">
                <img
                  src={item.image}
                  alt={item.word}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="font-fun text-4xl font-black text-slate-800">{item.number}</span>
              <span className="text-base font-bold text-amber-600 font-fun">{item.word}</span>
              <span className="text-xs text-slate-400 font-semibold">{item.arabic}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
