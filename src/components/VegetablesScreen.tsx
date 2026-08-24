import React, { useState, useEffect } from 'react';
import { VEGETABLES_DATA } from '../data/learningData';
import { ThemeConfig, VegetableItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Search, Grid, Layers, Sparkles, RotateCcw, Carrot, CheckCircle2, HelpCircle } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface VegetablesScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const VegetablesScreen: React.FC<VegetablesScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'quiz'>('carousel');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{
    correctItem: VegetableItem;
    options: VegetableItem[];
    isAnswered: boolean;
    selectedId: string | null;
  }>({
    correctItem: VEGETABLES_DATA[0],
    options: [],
    isAnswered: false,
    selectedId: null,
  });

  const filteredItems = VEGETABLES_DATA.filter((item) => {
    return (
      item.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameArabic.includes(searchQuery)
    );
  });

  const safeIndex = currentIndex < filteredItems.length ? currentIndex : 0;
  const currentItem = filteredItems[safeIndex] || VEGETABLES_DATA[0];

  const handleSpeak = (item?: VegetableItem) => {
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
  }, [safeIndex, viewMode]);

  const handleNext = () => {
    playChime('pop');
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    playChime('pop');
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  // Generate quiz question
  const generateQuiz = () => {
    const randomCorrect = VEGETABLES_DATA[Math.floor(Math.random() * VEGETABLES_DATA.length)];
    const shuffledOthers = VEGETABLES_DATA
      .filter((item) => item.id !== randomCorrect.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [randomCorrect, ...shuffledOthers].sort(() => 0.5 - Math.random());

    setQuizQuestion({
      correctItem: randomCorrect,
      options,
      isAnswered: false,
      selectedId: null,
    });
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode]);

  const handleQuizAnswer = (option: VegetableItem) => {
    if (quizQuestion.isAnswered) return;

    setQuizQuestion((prev) => ({
      ...prev,
      isAnswered: true,
      selectedId: option.id,
    }));

    if (option.id === quizQuestion.correctItem.id) {
      playChime('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      playChime('pop');
    }
    speakWord(option.nameEnglish, speechRate);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2">
          <button
            id="veggies-mode-carousel"
            onClick={() => {
              playChime('pop');
              setViewMode('carousel');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'carousel'
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Card Slider</span>
          </button>

          <button
            id="veggies-mode-grid"
            onClick={() => {
              playChime('pop');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All Veggies ({VEGETABLES_DATA.length})</span>
          </button>

          <button
            id="veggies-mode-quiz"
            onClick={() => {
              playChime('pop');
              setViewMode('quiz');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'quiz'
                ? 'bg-amber-500 text-white shadow-md scale-105 animate-pulse'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Guess Game! 🥕</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
          <input
            id="veggies-search-input"
            type="text"
            placeholder="Search vegetable / ابحث..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-emerald-400"
          />
        </div>
      </div>

      {/* Mode 1: Carousel / Flashcard */}
      {viewMode === 'carousel' && (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
              <Carrot className="w-12 h-12 text-emerald-300 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-500 font-bold">No vegetables found / لم يتم العثور على خضروات</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-100 text-center relative overflow-hidden transition-all">
              {/* Top info badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Carrot className="w-3.5 h-3.5" /> Healthy Vegetable • خضار صحي
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {safeIndex + 1} / {filteredItems.length}
                </span>
              </div>

              {/* Main Visual Emoji */}
              <div
                onClick={() => handleSpeak()}
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-8xl sm:text-9xl shadow-inner border-2 border-emerald-200 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                {currentItem.emoji}
              </div>

              {/* English & Arabic Names */}
              <div className="mt-6 space-y-1.5">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-wide">
                    {currentItem.nameEnglish}
                  </h2>
                  <button
                    id="speak-veggie-button"
                    onClick={() => handleSpeak()}
                    className={`p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-transform active:scale-90 ${
                      isSpeaking ? 'animate-bounce' : ''
                    }`}
                    aria-label="Listen pronunciation"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-emerald-600">{currentItem.phonetic}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-700 font-arabic pt-1">
                  {currentItem.nameArabic}
                </p>
              </div>

              {/* Health Benefit Fact */}
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm max-w-lg mx-auto">
                <p className="text-emerald-900 font-medium">{currentItem.benefit}</p>
                <p className="text-emerald-700 font-arabic mt-1 font-semibold">{currentItem.benefitArabic}</p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                <button
                  id="prev-veggie-button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-emerald-100 text-gray-700 font-bold text-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                <button
                  id="next-veggie-button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                handleSpeak(item);
              }}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-2 border-emerald-100 hover:border-emerald-400 transition-all cursor-pointer text-center group active:scale-95"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {item.emoji}
              </div>
              <h3 className="text-lg font-black text-gray-800 group-hover:text-emerald-600 transition-colors">
                {item.nameEnglish}
              </h3>
              <p className="text-xs font-semibold text-emerald-600">{item.phonetic}</p>
              <p className="text-md font-bold text-gray-600 font-arabic mt-1">{item.nameArabic}</p>
              <div className="mt-2.5 flex justify-center">
                <span className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Volume2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 3: Quiz Game */}
      {viewMode === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Veggie Detective • تخمين الخضار
            </span>
            <button
              onClick={generateQuiz}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-amber-100 text-xs font-bold text-gray-600"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Question
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-800">
              Where is the{' '}
              <span className="text-emerald-600 underline decoration-amber-400">
                {quizQuestion.correctItem.nameEnglish}
              </span>
              ?
            </h3>
            <p className="text-lg font-bold text-gray-600 font-arabic">
              أين هو ({quizQuestion.correctItem.nameArabic})؟
            </p>
            <button
              onClick={() => speakWord(quizQuestion.correctItem.nameEnglish, speechRate)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold text-sm"
            >
              <Volume2 className="w-4 h-4" /> Listen Again
            </button>
          </div>

          {/* Option Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {quizQuestion.options.map((option) => {
              const isCorrect = option.id === quizQuestion.correctItem.id;
              const isSelected = option.id === quizQuestion.selectedId;

              let btnStyle = 'bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100';
              if (quizQuestion.isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg scale-105';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 border-2 border-rose-600 text-white opacity-80';
                } else {
                  btnStyle = 'bg-gray-100 opacity-40 border-2 border-gray-200';
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={quizQuestion.isAnswered}
                  onClick={() => handleQuizAnswer(option)}
                  className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-2 text-6xl sm:text-7xl transition-all ${btnStyle}`}
                >
                  <span>{option.emoji}</span>
                  <span className="text-sm font-bold mt-2">
                    {quizQuestion.isAnswered ? option.nameEnglish : '???'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {quizQuestion.isAnswered && (
            <div className="pt-4 space-y-3">
              {quizQuestion.selectedId === quizQuestion.correctItem.id ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-xl animate-bounce">
                  <CheckCircle2 className="w-6 h-6" /> Excellent Job! أحسنت يا بطل!
                </div>
              ) : (
                <div className="text-rose-500 font-bold text-lg">
                  Nice try! Let's try another one • إجابة قريبة، حاول مجدداً!
                </div>
              )}
              <button
                onClick={generateQuiz}
                className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg transition-all active:scale-95"
              >
                Next Question 🥕➡️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
