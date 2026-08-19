import React, { useState, useEffect } from 'react';
import { ABC_DATA } from '../data/learningData';
import { ThemeConfig } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, RotateCcw, Grid, Layers } from 'lucide-react';
import { speakSequence, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface AbcScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const AbcScreen: React.FC<AbcScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'quiz'>('carousel');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{
    correctIndex: number;
    options: number[];
    isAnswered: boolean;
    selectedOption: number | null;
  }>({
    correctIndex: 0,
    options: [],
    isAnswered: false,
    selectedOption: null,
  });

  const currentItem = ABC_DATA[currentIndex];

  const handleSpeak = (words?: string[]) => {
    if (!soundEnabled) return;
    setIsSpeaking(true);
    playChime('pop');
    speakSequence(words || currentItem.soundSequence, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled) {
      handleSpeak();
    }
  }, [currentIndex, viewMode]);

  // Next / Prev handlers
  const handleNext = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev + 1) % ABC_DATA.length);
  };

  const handlePrev = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev - 1 + ABC_DATA.length) % ABC_DATA.length);
  };

  // Setup a new Quiz round
  const generateQuiz = () => {
    const correct = Math.floor(Math.random() * ABC_DATA.length);
    const options = [correct];
    while (options.length < 4) {
      const rand = Math.floor(Math.random() * ABC_DATA.length);
      if (!options.includes(rand)) {
        options.push(rand);
      }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    setQuizQuestion({
      correctIndex: correct,
      options,
      isAnswered: false,
      selectedOption: null,
    });

    if (soundEnabled) {
      speakSequence(['Find the letter for', ABC_DATA[correct].word], speechRate);
    }
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode]);

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizQuestion.isAnswered) return;

    const isCorrect = optionIdx === quizQuestion.correctIndex;
    setQuizQuestion((prev) => ({
      ...prev,
      isAnswered: true,
      selectedOption: optionIdx,
    }));

    if (isCorrect) {
      playChime('success');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      if (soundEnabled) {
        speakSequence(['Awesome!', ABC_DATA[optionIdx].letter, ABC_DATA[optionIdx].word], speechRate);
      }
    } else {
      playChime('click');
      if (soundEnabled) {
        speakSequence(['Try again!', 'This is', ABC_DATA[quizQuestion.correctIndex].word], speechRate);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 mb-4 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl shadow-sm border border-slate-200">
        <button
          id="abc-mode-carousel"
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
          id="abc-mode-grid"
          onClick={() => {
            playChime('click');
            setViewMode('grid');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
            viewMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>All Letters (A-Z)</span>
        </button>
        <button
          id="abc-mode-quiz"
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

      {/* CAROUSEL FLASHCARD VIEW */}
      {viewMode === 'carousel' && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Interactive Card */}
          <div
            id="abc-flashcard"
            onClick={() => handleSpeak()}
            className="w-full bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden cursor-pointer transform active:scale-98 hover:shadow-2xl transition-all duration-300 relative group"
          >
            {/* Pronunciation audio float button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all active:scale-90 ${
                isSpeaking ? 'bg-amber-500 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Pronounce Letter and Word"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Object Image */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden flex items-center justify-center p-4">
              <img
                src={currentItem.image}
                alt={currentItem.word}
                className="w-full h-full object-cover rounded-2xl border-2 border-slate-200 shadow-inner group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/abc/backgroundimage.jpg';
                }}
              />
              <div className="absolute bottom-3 bg-black/60 backdrop-blur-xs text-white px-5 py-1.5 rounded-full font-fun text-2xl font-bold shadow-md">
                {currentItem.word}
              </div>
            </div>

            {/* Giant Letter Section */}
            <div className="p-6 text-center bg-gradient-to-b from-white to-slate-50 border-t border-slate-100 flex flex-col items-center">
              <span className="font-fun text-8xl sm:text-9xl font-black text-slate-800 tracking-tighter drop-shadow-sm select-none">
                {currentItem.letter}
              </span>
              <p className="text-slate-400 text-xs font-bold mt-2 flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> Tap card to hear "{currentItem.letter} for {currentItem.word}"
              </p>
            </div>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              id="abc-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 py-3 px-5 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl font-bold shadow-md transition-all border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <span className="font-fun font-bold text-slate-700 text-base bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              {currentIndex + 1} / {ABC_DATA.length}
            </span>

            <button
              id="abc-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1 py-3 px-5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Letter Jump Strip */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto py-3 px-1 mt-4 scrollbar-none">
            {ABC_DATA.map((item, idx) => (
              <button
                key={item.letter}
                onClick={() => {
                  playChime('pop');
                  setCurrentIndex(idx);
                }}
                className={`w-9 h-9 shrink-0 rounded-xl font-bold font-fun text-sm flex items-center justify-center transition-all ${
                  idx === currentIndex
                    ? 'bg-amber-500 text-white shadow-md scale-110'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.letter.slice(0, 1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GRID VIEW (ALL A-Z) */}
      {viewMode === 'grid' && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ABC_DATA.map((item, idx) => (
            <div
              key={item.letter}
              id={`abc-grid-item-${item.letter}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(item.soundSequence);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-amber-400 p-3.5 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group"
            >
              <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                <img
                  src={item.image}
                  alt={item.word}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="font-fun text-3xl font-black text-slate-800 block">{item.letter}</span>
              <span className="text-sm font-bold text-amber-600 font-fun">{item.word}</span>
            </div>
          ))}
        </div>
      )}

      {/* QUIZ GAME */}
      {viewMode === 'quiz' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border-4 border-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h3 className="font-fun text-2xl font-bold text-slate-800">Which letter starts this word?</h3>
          </div>
          <p className="text-slate-500 font-semibold mb-6">أي حرف يبدأ بهذه الكلمة؟</p>

          {/* Picture of word */}
          <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-amber-200 mb-4 relative">
            <img
              src={ABC_DATA[quizQuestion.correctIndex].image}
              alt="Quiz clue"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="font-fun text-3xl font-black text-amber-600 mb-6">
            "{ABC_DATA[quizQuestion.correctIndex].word}"
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {quizQuestion.options.map((optIdx) => {
              const optionLetter = ABC_DATA[optIdx].letter;
              const isSelected = quizQuestion.selectedOption === optIdx;
              const isCorrect = optIdx === quizQuestion.correctIndex;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
              if (quizQuestion.isAnswered) {
                if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105';
                else if (isSelected) btnStyle = 'bg-rose-500 text-white border-rose-600';
              }

              return (
                <button
                  key={optIdx}
                  id={`quiz-option-${optIdx}`}
                  onClick={() => handleQuizAnswer(optIdx)}
                  className={`py-4 px-4 rounded-2xl border-2 font-fun text-3xl font-black transition-all active:scale-95 ${btnStyle}`}
                >
                  {optionLetter}
                </button>
              );
            })}
          </div>

          {quizQuestion.isAnswered && (
            <button
              id="quiz-next-question-btn"
              onClick={generateQuiz}
              className="py-3 px-8 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-lg inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Next Question / سؤال آخر</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
