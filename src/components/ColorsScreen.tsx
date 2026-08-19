import React, { useState } from 'react';
import { COLORS_DATA } from '../data/learningData';
import { ThemeConfig, ColorItem } from '../types';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface ColorsScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const ColorsScreen: React.FC<ColorsScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [activeColorId, setActiveColorId] = useState<string | null>(null);

  const handleColorClick = (color: ColorItem) => {
    setActiveColorId(color.id);
    playChime('pop');
    if (soundEnabled) {
      speakWord(color.nameEnglish, speechRate, () => {
        setActiveColorId(null);
      });
    } else {
      setTimeout(() => setActiveColorId(null), 800);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Title subtitle */}
      <div className="text-center mb-5">
        <h3 className="font-fun text-2xl font-black text-slate-800">Explore Beautiful Colors! 🎨</h3>
        <p className="text-slate-500 font-semibold text-sm">اضغط على أي لون لتسمع طريقة نطقه</p>
      </div>

      {/* Colors List / Stack matching Flutter layout */}
      <div className="w-full space-y-3">
        {COLORS_DATA.map((color) => {
          const isActive = activeColorId === color.id;
          const isWhite = color.id === 'white';

          return (
            <button
              key={color.id}
              id={`color-bar-${color.id}`}
              onClick={() => handleColorClick(color)}
              className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between text-left transition-all duration-300 transform active:scale-98 shadow-md hover:shadow-xl hover:-translate-y-0.5 relative overflow-hidden ${
                isWhite ? 'border-2 border-slate-300' : ''
              } ${isActive ? 'scale-102 ring-4 ring-amber-400' : ''}`}
              style={{ backgroundColor: color.colorHex }}
            >
              {/* English Name */}
              <div className="flex items-center gap-3">
                <span
                  className={`font-fun text-2xl sm:text-3xl font-black tracking-wide ${color.textColor}`}
                >
                  {color.nameEnglish}
                </span>
                {isActive && (
                  <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
                )}
              </div>

              {/* Arabic Name & Audio Icon */}
              <div className="flex items-center gap-3">
                <span className={`text-xl sm:text-2xl font-bold font-sans ${color.textColor}`}>
                  {color.nameArabic}
                </span>
                <div
                  className={`p-2 rounded-full backdrop-blur-xs transition-colors ${
                    isWhite ? 'bg-slate-200 text-slate-800' : 'bg-black/25 text-white'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
