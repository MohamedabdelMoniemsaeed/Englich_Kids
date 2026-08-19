import React, { useState, useEffect } from 'react';
import { ANIMALS_DATA } from '../data/learningData';
import { ThemeConfig, AnimalItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Search, Grid, Layers, Sparkles, RotateCcw } from 'lucide-react';
import { speakWord, speakSequence, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface AnimalsScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const AnimalsScreen: React.FC<AnimalsScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'quiz'>('carousel');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{
    correctAnimal: AnimalItem;
    options: AnimalItem[];
    isAnswered: boolean;
    selectedId: string | null;
  }>({
    correctAnimal: ANIMALS_DATA[0],
    options: [],
    isAnswered: false,
    selectedId: null,
  });

  const filteredAnimals = ANIMALS_DATA.filter(
    (a) =>
      a.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nameArabic.includes(searchQuery)
  );

  const safeIndex = currentIndex < filteredAnimals.length ? currentIndex : 0;
  const currentAnimal = filteredAnimals[safeIndex] || ANIMALS_DATA[0];

  const handleSpeak = (animal?: AnimalItem) => {
    if (!soundEnabled) return;
    const target = animal || currentAnimal;
    setIsSpeaking(true);
    playChime('pop');
    speakWord(target.nameEnglish, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled && filteredAnimals.length > 0) {
      handleSpeak(currentAnimal);
    }
  }, [safeIndex, viewMode]);

  const handleNext = () => {
    if (filteredAnimals.length === 0) return;
    playChime('click');
    setCurrentIndex((prev) => (prev + 1) % filteredAnimals.length);
  };

  const handlePrev = () => {
    if (filteredAnimals.length === 0) return;
    playChime('click');
    setCurrentIndex((prev) => (prev - 1 + filteredAnimals.length) % filteredAnimals.length);
  };

  // Generate a new animal quiz question
  const generateQuiz = () => {
    const correctIdx = Math.floor(Math.random() * ANIMALS_DATA.length);
    const correct = ANIMALS_DATA[correctIdx];
    const options = [correct];

    while (options.length < 4) {
      const rand = Math.floor(Math.random() * ANIMALS_DATA.length);
      if (!options.some((o) => o.id === ANIMALS_DATA[rand].id)) {
        options.push(ANIMALS_DATA[rand]);
      }
    }
    options.sort(() => Math.random() - 0.5);

    setQuizQuestion({
      correctAnimal: correct,
      options,
      isAnswered: false,
      selectedId: null,
    });

    if (soundEnabled) {
      speakSequence(['Which animal is the', correct.nameEnglish], speechRate);
    }
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode]);

  const handleQuizAnswer = (option: AnimalItem) => {
    if (quizQuestion.isAnswered) return;

    const isCorrect = option.id === quizQuestion.correctAnimal.id;
    setQuizQuestion((prev) => ({
      ...prev,
      isAnswered: true,
      selectedId: option.id,
    }));

    if (isCorrect) {
      playChime('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (soundEnabled) {
        speakSequence(['Great job!', option.nameEnglish], speechRate);
      }
    } else {
      playChime('click');
      if (soundEnabled) {
        speakSequence(['This is', option.nameEnglish, 'Look for the', quizQuestion.correctAnimal.nameEnglish], speechRate);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Controls Bar: Mode Switch & Search */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button
            id="animals-mode-carousel"
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
            id="animals-mode-grid"
            onClick={() => {
              playChime('click');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All Animals ({ANIMALS_DATA.length})</span>
          </button>
          <button
            id="animals-mode-quiz"
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

        {/* Search */}
        {viewMode !== 'quiz' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search animal / ابحث عن حيوان..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white/90 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        )}
      </div>

      {/* FLASHCARD CAROUSEL */}
      {viewMode === 'carousel' && currentAnimal && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Main Flashcard */}
          <div
            id="animal-flashcard"
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
                isSpeaking ? 'bg-amber-500 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Pronounce Animal Name in English"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Animal Emoji Badge */}
            {currentAnimal.emoji && (
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs text-2xl p-2 rounded-2xl shadow-md">
                {currentAnimal.emoji}
              </div>
            )}

            {/* Verified Photo */}
            <div className="h-64 sm:h-72 w-full bg-slate-100 overflow-hidden flex items-center justify-center p-3">
              <img
                src={currentAnimal.image}
                alt={currentAnimal.nameEnglish}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl border border-slate-200 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-emoji')) {
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'fallback-emoji text-8xl flex items-center justify-center h-full';
                    fallbackDiv.innerText = currentAnimal.emoji || '🐾';
                    parent.appendChild(fallbackDiv);
                  }
                }}
              />
            </div>

            {/* Labels and Pronunciation */}
            <div className="p-5 sm:p-6 text-center bg-gradient-to-b from-white to-slate-50 flex flex-col items-center border-t border-slate-100">
              <span className="text-2xl font-bold text-slate-500 font-sans mb-0.5">
                {currentAnimal.nameArabic}
              </span>
              <span className="font-fun text-4xl sm:text-5xl font-black text-slate-800 tracking-wide">
                {currentAnimal.nameEnglish}
              </span>

              {/* Phonetic & Sound Cue */}
              <div className="flex items-center gap-2 mt-2">
                {currentAnimal.phonetic && (
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    {currentAnimal.phonetic}
                  </span>
                )}
                {currentAnimal.soundCue && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    Sound: {currentAnimal.soundCue}
                  </span>
                )}
              </div>

              <p className="text-slate-400 text-xs font-bold mt-3 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-amber-500" /> Tap card to hear correct pronunciation
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              id="animals-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 py-3 px-5 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl font-bold shadow-md transition-all border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <span className="font-fun font-bold text-slate-700 text-base bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              {safeIndex + 1} / {filteredAnimals.length}
            </span>

            <button
              id="animals-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1 py-3 px-5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW (ALL ANIMALS) */}
      {viewMode === 'grid' && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredAnimals.map((animal, idx) => (
            <div
              key={animal.id}
              id={`animal-grid-item-${animal.id}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(animal);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-amber-400 p-3.5 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group relative"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                <img
                  src={animal.image}
                  alt={animal.nameEnglish}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-emoji')) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'fallback-emoji text-5xl flex items-center justify-center h-full';
                      fallbackDiv.innerText = animal.emoji || '🐾';
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                />
                <div className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 text-white group-hover:bg-amber-500 transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="font-fun text-lg font-black text-slate-800">{animal.nameEnglish}</span>
              <span className="text-xs font-bold text-slate-500 mt-0.5">{animal.nameArabic}</span>
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
              Where is the {quizQuestion.correctAnimal.nameEnglish}?
            </h3>
          </div>
          <p className="text-slate-500 font-semibold text-sm mb-4">
            أين هو {quizQuestion.correctAnimal.nameArabic}؟
          </p>

          <button
            onClick={() => handleSpeak(quizQuestion.correctAnimal)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-bold text-sm transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Name Again / استمع للاسم</span>
          </button>

          {/* 4 Animal Choices */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {quizQuestion.options.map((option) => {
              const isSelected = quizQuestion.selectedId === option.id;
              const isCorrect = option.id === quizQuestion.correctAnimal.id;

              let cardStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30';
              if (quizQuestion.isAnswered) {
                if (isCorrect) cardStyle = 'border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50 scale-102';
                else if (isSelected) cardStyle = 'border-rose-500 bg-rose-50';
              }

              return (
                <button
                  key={option.id}
                  id={`animal-quiz-${option.id}`}
                  onClick={() => handleQuizAnswer(option)}
                  className={`p-3 rounded-2xl border-3 bg-white flex flex-col items-center text-center transition-all active:scale-95 shadow-sm ${cardStyle}`}
                >
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img
                      src={option.image}
                      alt={option.nameEnglish}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="font-fun text-base font-black text-slate-800">{option.nameEnglish}</span>
                  <span className="text-xs font-bold text-slate-500">{option.nameArabic}</span>
                </button>
              );
            })}
          </div>

          {quizQuestion.isAnswered && (
            <button
              id="quiz-next-animal-btn"
              onClick={generateQuiz}
              className="py-3 px-8 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-base inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Next Animal / حيوان آخر</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
