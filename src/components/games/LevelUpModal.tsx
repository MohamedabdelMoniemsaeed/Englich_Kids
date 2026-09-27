import React, { useEffect } from 'react';
import { LevelInfo } from '../../utils/scoreManager';
import { playChime } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy } from 'lucide-react';

interface LevelUpModalProps {
  levelInfo: LevelInfo | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ levelInfo, onClose }) => {
  useEffect(() => {
    if (levelInfo) {
      playChime('fanfare');
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  }, [levelInfo]);

  if (!levelInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-gradient-to-b from-amber-300 via-yellow-400 to-orange-500 p-1 rounded-3xl shadow-2xl max-w-sm w-full animate-bounce">
        <div className="bg-white rounded-[22px] p-6 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-6xl shadow-lg border-4 border-white -mt-12 mb-3">
            {levelInfo.icon}
          </div>

          <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>Level Up Celebration!</span>
            <Sparkles className="w-4 h-4 fill-amber-400" />
          </div>

          <h2 className="font-fun text-3xl font-black text-slate-800">
            Level {levelInfo.level}!
          </h2>
          <h3 className="font-fun text-xl font-bold text-amber-600 mt-1">
            {levelInfo.titleEn}
          </h3>
          <p className="text-sm font-bold text-slate-500">{levelInfo.titleAr}</p>

          <p className="text-xs text-slate-600 font-semibold my-4 bg-amber-50 p-3 rounded-2xl border border-amber-200">
            🎉 مبروك! لقد ارتقيت إلى مستوى جديد وحصلت على لقب وجوائز إضافية!
          </p>

          <button
            onClick={() => {
              playChime('pop');
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-fun font-black text-base rounded-2xl shadow-lg transition-all"
          >
            Awesome! High Five! ✋
          </button>
        </div>
      </div>
    </div>
  );
};
