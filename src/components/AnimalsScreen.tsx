import React, { useState, useEffect } from 'react';
import { ANIMALS_DATA } from '../data/learningData';
import { ThemeConfig } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Search, Grid, Layers } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';

interface AnimalsScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const AnimalsScreen: React.FC<AnimalsScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filteredAnimals = ANIMALS_DATA.filter(
    (a) =>
      a.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nameArabic.includes(searchQuery)
  );

  const safeIndex = currentIndex < filteredAnimals.length ? currentIndex : 0;
  const currentAnimal = filteredAnimals[safeIndex] || ANIMALS_DATA[0];

  const handleSpeak = (text?: string) => {
    if (!soundEnabled) return;
    setIsSpeaking(true);
    playChime('pop');
    speakWord(text || currentAnimal.nameEnglish, speechRate, () => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if (viewMode === 'carousel' && soundEnabled && filteredAnimals.length > 0) {
      handleSpeak();
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
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-sm transition-all ${
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
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All Animals ({ANIMALS_DATA.length})</span>
          </button>
        </div>

        {/* Search */}
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
      </div>

      {viewMode === 'carousel' && currentAnimal ? (
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
              className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all active:scale-90 ${
                isSpeaking ? 'bg-amber-500 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Pronounce Animal Name"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Photo */}
            <div className="h-64 sm:h-72 w-full bg-slate-100 overflow-hidden flex items-center justify-center p-3">
              <img
                src={currentAnimal.image}
                alt={currentAnimal.nameEnglish}
                className="w-full h-full object-cover rounded-2xl border border-slate-200 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/animals/animalshome.jpg';
                }}
              />
            </div>

            {/* Labels */}
            <div className="p-6 text-center bg-gradient-to-b from-white to-slate-50 flex flex-col items-center border-t border-slate-100">
              <span className="text-2xl font-bold text-slate-500 font-sans mb-1">
                {currentAnimal.nameArabic}
              </span>
              <span className="font-fun text-4xl sm:text-5xl font-black text-slate-800 tracking-wide">
                {currentAnimal.nameEnglish}
              </span>
              <p className="text-slate-400 text-xs font-bold mt-3 flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> Tap anywhere to hear sound
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
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredAnimals.map((animal, idx) => (
            <div
              key={animal.id}
              id={`animal-grid-item-${animal.id}`}
              onClick={() => {
                setCurrentIndex(idx);
                handleSpeak(animal.nameEnglish);
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border-2 border-slate-100 hover:border-amber-400 p-3.5 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                <img
                  src={animal.image}
                  alt={animal.nameEnglish}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/animals/animalshome.jpg';
                  }}
                />
              </div>
              <span className="font-fun text-xl font-black text-slate-800">{animal.nameEnglish}</span>
              <span className="text-xs font-bold text-amber-600 mt-0.5">{animal.nameArabic}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
