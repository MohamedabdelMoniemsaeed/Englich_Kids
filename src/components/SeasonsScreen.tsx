import React, { useState, useEffect } from 'react';
import { SEASONS_DATA } from '../data/learningData';
import { ThemeConfig, SeasonItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Search, Grid, Layers, Sparkles, Calendar, SunMedium, Compass } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface SeasonsScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const SeasonsScreen: React.FC<SeasonsScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filteredItems = SEASONS_DATA.filter((item) => {
    return (
      item.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameArabic.includes(searchQuery)
    );
  });

  const safeIndex = currentIndex < filteredItems.length ? currentIndex : 0;
  const currentItem = filteredItems[safeIndex] || SEASONS_DATA[0];

  const handleSpeak = (item?: SeasonItem) => {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl shadow-sm border border-amber-100">
        <div className="flex items-center gap-2">
          <button
            id="seasons-mode-carousel"
            onClick={() => {
              playChime('pop');
              setViewMode('carousel');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'carousel'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Cards</span>
          </button>

          <button
            id="seasons-mode-grid"
            onClick={() => {
              playChime('pop');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All 4 Seasons (الأربعة)</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            id="seasons-search-input"
            type="text"
            placeholder="Search season / ابحث في الفصول..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-amber-50/70 border border-amber-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-amber-400"
          />
        </div>
      </div>

      {/* Mode 1: Carousel / Detailed Explorer */}
      {viewMode === 'carousel' && (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-6 shadow-sm border border-amber-100">
              <SunMedium className="w-12 h-12 text-amber-300 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-500 font-bold">No seasons found / لم يتم العثور على نتائج</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-100 text-center relative overflow-hidden transition-all">
              {/* Top info badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 flex items-center gap-1">
                  <SunMedium className="w-3.5 h-3.5" /> 4 Seasons of the Year • فصول السنة
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {safeIndex + 1} / {filteredItems.length}
                </span>
              </div>

              {/* Main Visual Emoji */}
              <div
                onClick={() => {
                  handleSpeak();
                  confetti({ particleCount: 25, spread: 45 });
                }}
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-8xl sm:text-9xl shadow-inner border-2 border-amber-200 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
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
                    id="speak-season-button"
                    onClick={() => handleSpeak()}
                    className={`p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform active:scale-90 ${
                      isSpeaking ? 'animate-bounce' : ''
                    }`}
                    aria-label="Listen pronunciation"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-amber-600">{currentItem.phonetic}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-700 font-arabic pt-1">
                  {currentItem.nameArabic}
                </p>
              </div>

              {/* Season Information Panels */}
              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
                    <Calendar className="w-4 h-4" /> Months & Nature
                  </div>
                  <p className="text-xs font-bold text-amber-700">{currentItem.months}</p>
                  <p className="text-gray-700 font-medium text-xs sm:text-sm mt-1">{currentItem.features}</p>
                  <p className="text-amber-900 font-arabic font-semibold text-xs sm:text-sm mt-1">{currentItem.featuresArabic}</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold mb-1">
                    <Compass className="w-4 h-4" /> Fun Activities
                  </div>
                  <p className="text-gray-700 font-medium text-xs sm:text-sm">{currentItem.activities}</p>
                  <p className="text-rose-900 font-arabic font-semibold text-xs sm:text-sm mt-1">{currentItem.activitiesArabic}</p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                <button
                  id="prev-season-button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-amber-100 text-gray-700 font-bold text-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                <button
                  id="next-season-button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: All 4 Seasons Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                handleSpeak(item);
              }}
              className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-amber-100 hover:border-amber-400 transition-all cursor-pointer text-center group active:scale-95 space-y-2"
            >
              <div className="text-7xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {item.emoji}
              </div>
              <h3 className="text-2xl font-black text-gray-800 group-hover:text-amber-600 transition-colors">
                {item.nameEnglish}
              </h3>
              <p className="text-xs font-semibold text-amber-600">{item.phonetic}</p>
              <p className="text-lg font-bold text-gray-700 font-arabic">{item.nameArabic}</p>
              <p className="text-xs text-gray-500 font-medium">{item.features}</p>
              <div className="pt-2 flex justify-center">
                <span className="p-2 rounded-full bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Volume2 className="w-5 h-5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
