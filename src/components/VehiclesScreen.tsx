import React, { useState, useEffect } from 'react';
import { VEHICLES_DATA } from '../data/learningData';
import { ThemeConfig, VehicleItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Grid, Layers, Sparkles, RotateCcw, Compass } from 'lucide-react';
import { speakWord, speakSequence, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface VehiclesScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const VehiclesScreen: React.FC<VehiclesScreenProps> = ({ speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'quiz'>('carousel');
  const [typeFilter, setTypeFilter] = useState<'all' | 'land' | 'air' | 'water'>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{
    correctItem: VehicleItem;
    options: VehicleItem[];
    isAnswered: boolean;
    selectedId: string | null;
  }>({
    correctItem: VEHICLES_DATA[0],
    options: [],
    isAnswered: false,
    selectedId: null,
  });

  const filteredItems = VEHICLES_DATA.filter((item) => {
    return typeFilter === 'all' || item.type === typeFilter;
  });

  const safeIndex = currentIndex < filteredItems.length ? currentIndex : 0;
  const currentItem = filteredItems[safeIndex] || VEHICLES_DATA[0];

  const handleSpeak = (item?: VehicleItem) => {
    if (!soundEnabled) return;
    const target = item || currentItem;
    setIsSpeaking(true);
    playChime('pop');
    speakWord(target.nameEnglish, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled && filteredItems.length > 0) {
      handleSpeak(currentItem);
    }
  }, [safeIndex, viewMode, typeFilter]);

  const handleNext = () => {
    if (filteredItems.length === 0) return;
    playChime('click');
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (filteredItems.length === 0) return;
    playChime('click');
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const generateQuiz = () => {
    const correctIdx = Math.floor(Math.random() * VEHICLES_DATA.length);
    const correct = VEHICLES_DATA[correctIdx];
    const options = [correct];

    while (options.length < 4) {
      const rand = Math.floor(Math.random() * VEHICLES_DATA.length);
      if (!options.some((o) => o.id === VEHICLES_DATA[rand].id)) {
        options.push(VEHICLES_DATA[rand]);
      }
    }
    options.sort(() => Math.random() - 0.5);

    setQuizQuestion({
      correctItem: correct,
      options,
      isAnswered: false,
      selectedId: null,
    });

    if (soundEnabled) {
      speakSequence(['Which vehicle is the', correct.nameEnglish], speechRate);
    }
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode]);

  const handleQuizAnswer = (option: VehicleItem) => {
    if (quizQuestion.isAnswered) return;

    const isCorrect = option.id === quizQuestion.correctItem.id;
    setQuizQuestion((prev) => ({
      ...prev,
      isAnswered: true,
      selectedId: option.id,
    }));

    if (isCorrect) {
      playChime('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (soundEnabled) {
        speakSequence(['Awesome!', option.nameEnglish], speechRate);
      }
    } else {
      playChime('click');
      if (soundEnabled) {
        speakSequence(['This is', option.nameEnglish, 'Find the', quizQuestion.correctItem.nameEnglish], speechRate);
      }
    }
  };

  const typeLabelMap = {
    land: '🛣️ Land / بري',
    air: '☁️ Air / جوي',
    water: '🌊 Water / بحري',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Mode & Type Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button
            id="vehicles-mode-carousel"
            onClick={() => {
              playChime('click');
              setViewMode('carousel');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'carousel' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcard</span>
          </button>
          <button
            id="vehicles-mode-grid"
            onClick={() => {
              playChime('click');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'grid' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All ({VEHICLES_DATA.length})</span>
          </button>
          <button
            id="vehicles-mode-quiz"
            onClick={() => {
              playChime('click');
              setViewMode('quiz');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'quiz' ? 'bg-amber-500 text-white shadow-xs animate-pulse' : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Quiz Game</span>
          </button>
        </div>

        {/* Filter by terrain */}
        {viewMode !== 'quiz' && (
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                playChime('click');
                setTypeFilter('all');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                typeFilter === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                playChime('click');
                setTypeFilter('land');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                typeFilter === 'land' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🚗 Land
            </button>
            <button
              onClick={() => {
                playChime('click');
                setTypeFilter('air');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                typeFilter === 'air' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ✈️ Air
            </button>
            <button
              onClick={() => {
                playChime('click');
                setTypeFilter('water');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                typeFilter === 'water' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🚢 Water
            </button>
          </div>
        )}
      </div>

      {/* FLASHCARD */}
      {viewMode === 'carousel' && currentItem && (
        <div className="w-full max-w-md flex flex-col items-center">
          <div
            id="vehicle-flashcard"
            onClick={() => handleSpeak()}
            className="w-full bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden cursor-pointer active:scale-98 transition-all hover:shadow-2xl relative group"
          >
            {/* Audio Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all active:scale-90 flex items-center gap-1.5 ${
                isSpeaking ? 'bg-sky-500 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Pronounce Vehicle Name"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Type badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs text-xs font-bold px-3 py-1.5 rounded-full shadow-md text-sky-800">
              {typeLabelMap[currentItem.type]}
            </div>

            {/* Big vehicle emoji graphic */}
            <div className="h-64 sm:h-72 w-full bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 overflow-hidden flex items-center justify-center p-3 relative">
              <div className="text-9xl sm:text-[140px] drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none animate-float">
                {currentItem.emoji}
              </div>
            </div>

            {/* Labels and Pronunciation */}
            <div className="p-5 sm:p-6 text-center bg-gradient-to-b from-white to-slate-50 flex flex-col items-center border-t border-slate-100">
              <span className="text-2xl font-bold text-slate-500 font-sans mb-0.5">
                {currentItem.nameArabic}
              </span>
              <span className="font-fun text-4xl sm:text-5xl font-black text-slate-800 tracking-wide">
                {currentItem.nameEnglish}
              </span>

              {/* Phonetic & Sound Cue */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                  {currentItem.phonetic}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                  Sound: {currentItem.soundCue}
                </span>
              </div>

              <div className="mt-3 bg-sky-50/80 border border-sky-200 rounded-xl p-2.5 text-xs text-sky-900 font-semibold max-w-xs">
                <p className="font-bold">{currentItem.description}</p>
                <p className="text-slate-600 mt-0.5">{currentItem.descriptionArabic}</p>
              </div>

              <p className="text-slate-400 text-xs font-bold mt-3 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-sky-500" /> Tap card to hear pronunciation
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              id="vehicles-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 py-3 px-5 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl font-bold shadow-md transition-all border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <span className="font-fun font-bold text-slate-700 text-base bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              {safeIndex + 1} / {filteredItems.length}
            </span>

            <button
              id="vehicles-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1 py-3 px-5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              id={`vehicle-grid-${item.id}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(item);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-sky-400 p-3.5 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group relative"
            >
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50/50 mb-2 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {item.emoji}
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white group-hover:bg-sky-500 transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="font-fun text-lg font-black text-slate-800">{item.nameEnglish}</span>
              <span className="text-xs font-bold text-slate-500 mt-0.5">{item.nameArabic}</span>
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
              Where is the {quizQuestion.correctItem.nameEnglish}?
            </h3>
          </div>
          <p className="text-slate-500 font-semibold text-sm mb-4">
            أين هو {quizQuestion.correctItem.nameArabic}؟
          </p>

          <button
            onClick={() => handleSpeak(quizQuestion.correctItem)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-full font-bold text-sm transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Vehicle Name</span>
          </button>

          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {quizQuestion.options.map((option) => {
              const isSelected = quizQuestion.selectedId === option.id;
              const isCorrect = option.id === quizQuestion.correctItem.id;

              let cardStyle = 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/30';
              if (quizQuestion.isAnswered) {
                if (isCorrect) cardStyle = 'border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50 scale-102';
                else if (isSelected) cardStyle = 'border-rose-500 bg-rose-50';
              }

              return (
                <button
                  key={option.id}
                  id={`vehicle-quiz-${option.id}`}
                  onClick={() => handleQuizAnswer(option)}
                  className={`p-4 rounded-2xl border-3 bg-white flex flex-col items-center text-center transition-all active:scale-95 shadow-sm ${cardStyle}`}
                >
                  <div className="text-6xl mb-2">{option.emoji}</div>
                  <span className="font-fun text-base font-black text-slate-800">{option.nameEnglish}</span>
                  <span className="text-xs font-bold text-slate-500">{option.nameArabic}</span>
                </button>
              );
            })}
          </div>

          {quizQuestion.isAnswered && (
            <button
              id="quiz-next-vehicle-btn"
              onClick={generateQuiz}
              className="py-3 px-8 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-base inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Next Vehicle / وسيلة أخرى</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
