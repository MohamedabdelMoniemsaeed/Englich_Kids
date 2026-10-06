import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, HelpCircle, ArrowRight, Flame } from 'lucide-react';
import { playChime, speakWord, speakSequence, playPraise } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface OddOneOutGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface OddQuestion {
  id: number;
  questionEn: string;
  questionAr: string;
  explanationEn: string;
  explanationAr: string;
  oddItemName: string;
  items: { name: string; arabic: string; emoji: string; isOdd: boolean }[];
}

const ODD_QUESTIONS: OddQuestion[] = [
  {
    id: 1,
    questionEn: 'Which one is NOT an animal?',
    questionAr: 'أيها ليس حيواناً؟',
    explanationEn: 'Car is a vehicle, not an animal!',
    explanationAr: 'السيارة وسيلة مواصلات وليست حيواناً!',
    oddItemName: 'Car',
    items: [
      { name: 'Lion', arabic: 'أسد', emoji: '🦁', isOdd: false },
      { name: 'Dog', arabic: 'كلب', emoji: '🐶', isOdd: false },
      { name: 'Car', arabic: 'سيارة', emoji: '🚗', isOdd: true },
      { name: 'Cat', arabic: 'قطة', emoji: '🐱', isOdd: false },
    ],
  },
  {
    id: 2,
    questionEn: 'Which one is NOT a fruit?',
    questionAr: 'أيها ليس من الفواكه؟',
    explanationEn: 'Carrot is a healthy vegetable!',
    explanationAr: 'الجزر من الخضروات وليس الفواكه!',
    oddItemName: 'Carrot',
    items: [
      { name: 'Apple', arabic: 'تفاحة', emoji: '🍎', isOdd: false },
      { name: 'Banana', arabic: 'موزة', emoji: '🍌', isOdd: false },
      { name: 'Strawberry', arabic: 'فراولة', emoji: '🍓', isOdd: false },
      { name: 'Carrot', arabic: 'جزرة', emoji: '🥕', isOdd: true },
    ],
  },
  {
    id: 3,
    questionEn: 'Which one does NOT fly in the sky?',
    questionAr: 'أيها لا يطير في السماء؟',
    explanationEn: 'Fish swims in water, it cannot fly!',
    explanationAr: 'السمكة تسبح في الماء ولا تطير في الجو!',
    oddItemName: 'Fish',
    items: [
      { name: 'Bird', arabic: 'عصفور', emoji: '🐦', isOdd: false },
      { name: 'Airplane', arabic: 'طائرة', emoji: '✈️', isOdd: false },
      { name: 'Rocket', arabic: 'صاروخ', emoji: '🚀', isOdd: false },
      { name: 'Fish', arabic: 'سمكة', emoji: '🐟', isOdd: true },
    ],
  },
  {
    id: 4,
    questionEn: 'Which one is NOT something you wear?',
    questionAr: 'أيها ليس من الملابس؟',
    explanationEn: 'Clock tells time, it is not clothing!',
    explanationAr: 'الساعة لمعرفة الوقت وليست من الملابس!',
    oddItemName: 'Clock',
    items: [
      { name: 'Shirt', arabic: 'قميص', emoji: '👕', isOdd: false },
      { name: 'Shoes', arabic: 'حذاء', emoji: '👟', isOdd: false },
      { name: 'Clock', arabic: 'ساعة حائط', emoji: '⏰', isOdd: true },
      { name: 'Dress', arabic: 'فستان', emoji: '👗', isOdd: false },
    ],
  },
  {
    id: 5,
    questionEn: 'Which one is NOT a sweet dessert?',
    questionAr: 'أيها ليس من الحلويات؟',
    explanationEn: 'Pizza is delicious savory food, not sweet dessert!',
    explanationAr: 'البيتزا طعام مالح وليست من الحلويات السكرية!',
    oddItemName: 'Pizza',
    items: [
      { name: 'Ice Cream', arabic: 'مثلجات', emoji: '🍦', isOdd: false },
      { name: 'Cake', arabic: 'كعكة', emoji: '🎂', isOdd: false },
      { name: 'Cookie', arabic: 'بسكويت', emoji: '🍪', isOdd: false },
      { name: 'Pizza', arabic: 'بيتزا', emoji: '🍕', isOdd: true },
    ],
  },
  {
    id: 6,
    questionEn: 'Which one is NOT part of the human face?',
    questionAr: 'أيها ليس من أجزاء الوجه؟',
    explanationEn: 'Foot is at the bottom of the leg, not on the face!',
    explanationAr: 'القدم في أسفل الساق وليست في الوجه!',
    oddItemName: 'Foot',
    items: [
      { name: 'Eyes', arabic: 'عينان', emoji: '👀', isOdd: false },
      { name: 'Nose', arabic: 'أنف', emoji: '👃', isOdd: false },
      { name: 'Foot', arabic: 'قدم', emoji: '🦶', isOdd: true },
      { name: 'Mouth', arabic: 'فم', emoji: '👄', isOdd: false },
    ],
  },
];

export const OddOneOutGame: React.FC<OddOneOutGameProps> = ({
  speechRate,
  soundEnabled,
  onWin,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentQ = ODD_QUESTIONS[currentIdx];

  const playPrompt = () => {
    if (soundEnabled) {
      speakSequence([currentQ.questionEn], speechRate);
    }
  };

  useEffect(() => {
    setSelectedItemName(null);
    setAnswered(false);
    playPrompt();
  }, [currentIdx]);

  const handlePick = (item: { name: string; isOdd: boolean }) => {
    if (answered) return;

    setSelectedItemName(item.name);
    setAnswered(true);

    if (item.isOdd) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      onWin(25, 4);
      confetti({ particleCount: 50, spread: 60 });
      if (soundEnabled) {
        playPraise('success', ['Correct!', currentQ.explanationEn], speechRate);
      } else {
        playChime('success');
      }
    } else {
      setStreak(0);
      if (soundEnabled) {
        playPraise('wrong', ['Try again! That belongs to the group.'], speechRate);
      } else {
        playChime('wrong');
      }
    }
  };

  const handleNext = () => {
    playChime('pop');
    const next = (currentIdx + 1) % ODD_QUESTIONS.length;
    setCurrentIdx(next);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-orange-200 flex flex-col items-center text-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm bg-amber-50 px-3 py-1 rounded-xl">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>Streak: {streak}</span>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          Puzzle {currentIdx + 1} / {ODD_QUESTIONS.length}
        </span>
      </div>

      {/* Question Banner */}
      <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 mb-4 shadow-md flex items-center justify-between">
        <div className="text-left">
          <h4 className="font-fun text-lg sm:text-xl font-black">
            🔍 {currentQ.questionEn}
          </h4>
          <p className="text-xs font-bold text-amber-100 mt-0.5">{currentQ.questionAr}</p>
        </div>

        <button
          onClick={playPrompt}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all shrink-0 active:scale-95"
          title="Repeat Question"
        >
          <Volume2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="w-full grid grid-cols-2 gap-3.5 mb-5">
        {currentQ.items.map((item, i) => {
          const isSelected = selectedItemName === item.name;
          const isCorrect = item.isOdd;

          let cardStyle = 'border-slate-200 bg-slate-50 hover:border-orange-400 hover:bg-orange-50/30';
          if (answered) {
            if (isCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200 scale-102';
            } else if (isSelected) {
              cardStyle = 'border-rose-500 bg-rose-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handlePick(item)}
              disabled={answered}
              className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-xs ${cardStyle}`}
            >
              <span className="text-5xl sm:text-6xl mb-1 select-none">{item.emoji}</span>
              <span className="font-fun text-sm font-black text-slate-800">{item.name}</span>
              <span className="text-xs text-slate-400 font-bold">{item.arabic}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation & Next */}
      {answered && (
        <div className="w-full bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center animate-pop space-y-3">
          <div>
            <span className="font-fun text-sm sm:text-base font-black text-amber-900 block">
              💡 {currentQ.explanationEn}
            </span>
            <span className="text-xs text-slate-600 font-bold">{currentQ.explanationAr}</span>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-fun font-black rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Next Puzzle / اللغز التالي</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
