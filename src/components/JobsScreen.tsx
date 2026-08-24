import React, { useState, useEffect } from 'react';
import { JOBS_DATA } from '../data/learningData';
import { ThemeConfig, JobItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Grid, Layers, Sparkles, RotateCcw, Briefcase } from 'lucide-react';
import { speakWord, speakSequence, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface JobsScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const JobsScreen: React.FC<JobsScreenProps> = ({ speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'quiz'>('carousel');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{
    correctItem: JobItem;
    options: JobItem[];
    isAnswered: boolean;
    selectedId: string | null;
  }>({
    correctItem: JOBS_DATA[0],
    options: [],
    isAnswered: false,
    selectedId: null,
  });

  const currentItem = JOBS_DATA[currentIndex] || JOBS_DATA[0];

  const handleSpeak = (item?: JobItem) => {
    if (!soundEnabled) return;
    const target = item || currentItem;
    setIsSpeaking(true);
    playChime('pop');
    speakWord(target.nameEnglish, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled) {
      handleSpeak(currentItem);
    }
  }, [currentIndex, viewMode]);

  const handleNext = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev + 1) % JOBS_DATA.length);
  };

  const handlePrev = () => {
    playChime('click');
    setCurrentIndex((prev) => (prev - 1 + JOBS_DATA.length) % JOBS_DATA.length);
  };

  const generateQuiz = () => {
    const correctIdx = Math.floor(Math.random() * JOBS_DATA.length);
    const correct = JOBS_DATA[correctIdx];
    const options = [correct];

    while (options.length < 4) {
      const rand = Math.floor(Math.random() * JOBS_DATA.length);
      if (!options.some((o) => o.id === JOBS_DATA[rand].id)) {
        options.push(JOBS_DATA[rand]);
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
      speakSequence(['Who is the', correct.nameEnglish], speechRate);
    }
  };

  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode]);

  const handleQuizAnswer = (option: JobItem) => {
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
        speakSequence(['Excellent!', option.nameEnglish], speechRate);
      }
    } else {
      playChime('click');
      if (soundEnabled) {
        speakSequence(['This is', option.nameEnglish, 'Find the', quizQuestion.correctItem.nameEnglish], speechRate);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Mode Controls */}
      <div className="w-full flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button
            id="jobs-mode-carousel"
            onClick={() => {
              playChime('click');
              setViewMode('carousel');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'carousel' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcard</span>
          </button>
          <button
            id="jobs-mode-grid"
            onClick={() => {
              playChime('click');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'grid' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All ({JOBS_DATA.length})</span>
          </button>
          <button
            id="jobs-mode-quiz"
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
      </div>

      {/* FLASHCARD */}
      {viewMode === 'carousel' && currentItem && (
        <div className="w-full max-w-md flex flex-col items-center">
          <div
            id="job-flashcard"
            onClick={() => handleSpeak()}
            className="w-full bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden cursor-pointer active:scale-98 transition-all hover:shadow-2xl relative group"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all active:scale-90 flex items-center gap-1.5 ${
                isSpeaking ? 'bg-amber-500 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Pronounce Job"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            <div className="h-64 sm:h-72 w-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 overflow-hidden flex items-center justify-center p-3 relative">
              <div className="text-9xl sm:text-[140px] drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none animate-float">
                {currentItem.emoji}
              </div>
            </div>

            <div className="p-5 sm:p-6 text-center bg-gradient-to-b from-white to-slate-50 flex flex-col items-center border-t border-slate-100">
              <span className="text-2xl font-bold text-slate-500 font-sans mb-0.5">
                {currentItem.nameArabic}
              </span>
              <span className="font-fun text-4xl sm:text-5xl font-black text-slate-800 tracking-wide">
                {currentItem.nameEnglish}
              </span>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {currentItem.phonetic}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 w-full max-w-xs">
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2 text-center text-xs">
                  <span className="block text-slate-500 font-semibold">🏢 Workplace</span>
                  <span className="font-bold text-amber-900">{currentItem.workplace}</span>
                  <span className="block text-[11px] text-slate-600">{currentItem.workplaceArabic}</span>
                </div>
                <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-2 text-center text-xs">
                  <span className="block text-slate-500 font-semibold">{currentItem.toolEmoji} Tool</span>
                  <span className="font-bold text-orange-900">{currentItem.tool}</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs font-bold mt-3 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-amber-500" /> Tap card to hear pronunciation
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-5 px-2">
            <button
              id="jobs-prev-btn"
              onClick={handlePrev}
              className="flex items-center gap-1 py-3 px-5 bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl font-bold shadow-md transition-all border border-slate-200"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Previous</span>
            </button>

            <span className="font-fun font-bold text-slate-700 text-base bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              {currentIndex + 1} / {JOBS_DATA.length}
            </span>

            <button
              id="jobs-next-btn"
              onClick={handleNext}
              className="flex items-center gap-1 py-3 px-5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all"
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
          {JOBS_DATA.map((item, idx) => (
            <div
              key={item.id}
              id={`job-grid-${item.id}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(item);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-amber-400 p-3.5 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group relative"
            >
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-50 to-amber-50/50 mb-2 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {item.emoji}
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white group-hover:bg-amber-500 transition-colors">
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
            أين {quizQuestion.correctItem.nameArabic}؟
          </p>

          <button
            onClick={() => handleSpeak(quizQuestion.correctItem)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-bold text-sm transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Profession Name</span>
          </button>

          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {quizQuestion.options.map((option) => {
              const isSelected = quizQuestion.selectedId === option.id;
              const isCorrect = option.id === quizQuestion.correctItem.id;

              let cardStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30';
              if (quizQuestion.isAnswered) {
                if (isCorrect) cardStyle = 'border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50 scale-102';
                else if (isSelected) cardStyle = 'border-rose-500 bg-rose-50';
              }

              return (
                <button
                  key={option.id}
                  id={`job-quiz-${option.id}`}
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
              id="quiz-next-job-btn"
              onClick={generateQuiz}
              className="py-3 px-8 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all text-base inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Next Profession / مهنة أخرى</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
