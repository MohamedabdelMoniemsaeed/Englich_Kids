import React, { useState } from 'react';
import { FAMILY_DATA } from '../data/learningData';
import { ThemeConfig, FamilyItem } from '../types';
import { Volume2, X, Sparkles, Heart } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';

interface FamilyScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const FamilyScreen: React.FC<FamilyScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [selectedMember, setSelectedMember] = useState<FamilyItem | null>(null);

  const handleMemberClick = (member: FamilyItem) => {
    setSelectedMember(member);
    playChime('pop');
    if (soundEnabled) {
      speakWord(member.nameEnglish, speechRate);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="font-fun text-2xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
          My Loving Family! <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
        </h3>
        <p className="text-slate-500 font-semibold text-sm mt-1">تعرف على أفراد العائلة واستمع للنطق</p>
      </div>

      {/* Grid of Family Members matching Flutter Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {FAMILY_DATA.map((member) => (
          <button
            key={member.id}
            id={`family-item-${member.id}`}
            onClick={() => handleMemberClick(member)}
            className="group relative bg-white rounded-3xl p-4 shadow-md hover:shadow-xl border-4 border-white hover:border-amber-300 transition-all duration-300 flex flex-col items-center text-center transform active:scale-95"
          >
            {/* Avatar Circle */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner mb-3 bg-slate-50 p-1 flex items-center justify-center">
              <img
                src={member.image}
                alt={member.nameEnglish}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/family_members/backgroundimage.jpg';
                }}
              />
            </div>

            {/* Pill Name matching Flutter all_icon widget */}
            <div className={`w-full py-1.5 px-3 rounded-full bg-gradient-to-r ${themeConfig.primaryColor} text-white font-fun font-bold text-base sm:text-lg shadow-xs truncate`}>
              {member.nameEnglish}
            </div>

            <span className="text-xs font-semibold text-slate-500 mt-1.5">{member.nameArabic}</span>
          </button>
        ))}
      </div>

      {/* Selected Member Detail Popup / Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-white relative text-center flex flex-col items-center">
            <button
              onClick={() => {
                playChime('click');
                setSelectedMember(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-300 shadow-md mb-4 bg-slate-50">
              <img
                src={selectedMember.image}
                alt={selectedMember.nameEnglish}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-2xl font-bold text-slate-500 font-sans">{selectedMember.nameArabic}</span>
            <span className="font-fun text-4xl font-black text-slate-800 mt-1 mb-4">
              {selectedMember.nameEnglish}
            </span>

            <button
              id="family-speak-btn"
              onClick={() => {
                playChime('pop');
                speakWord(selectedMember.nameEnglish, speechRate);
              }}
              className="py-3 px-6 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Volume2 className="w-6 h-6" />
              <span>Listen Again / استمع مرة أخرى</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
