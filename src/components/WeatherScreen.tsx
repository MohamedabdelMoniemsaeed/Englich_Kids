import React, { useState, useEffect } from 'react';
import { WEATHER_DATA } from '../data/learningData';
import { ThemeConfig, WeatherItem } from '../types';
import { Volume2, ChevronLeft, ChevronRight, Search, Grid, Layers, Sparkles, CloudSun, Shirt, Compass, Wind } from 'lucide-react';
import { speakWord, playChime } from '../utils/sound';
import confetti from 'canvas-confetti';

interface WeatherScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'interactive'>('carousel');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Interactive dress-up weather picker
  const [selectedWeatherId, setSelectedWeatherId] = useState<string>(WEATHER_DATA[0].id);

  const filteredItems = WEATHER_DATA.filter((item) => {
    return (
      item.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameArabic.includes(searchQuery)
    );
  });

  const safeIndex = currentIndex < filteredItems.length ? currentIndex : 0;
  const currentItem = filteredItems[safeIndex] || WEATHER_DATA[0];

  const handleSpeak = (item?: WeatherItem) => {
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

  const selectedInteractiveWeather =
    WEATHER_DATA.find((w) => w.id === selectedWeatherId) || WEATHER_DATA[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl shadow-sm border border-sky-100">
        <div className="flex items-center gap-2">
          <button
            id="weather-mode-carousel"
            onClick={() => {
              playChime('pop');
              setViewMode('carousel');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'carousel'
                ? 'bg-sky-500 text-white shadow-md scale-105'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Card View</span>
          </button>

          <button
            id="weather-mode-grid"
            onClick={() => {
              playChime('pop');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-sky-500 text-white shadow-md scale-105'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All Weather ({WEATHER_DATA.length})</span>
          </button>

          <button
            id="weather-mode-interactive"
            onClick={() => {
              playChime('pop');
              setViewMode('interactive');
              confetti({ particleCount: 30, spread: 50 });
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              viewMode === 'interactive'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>What to Wear? 👕</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
          <input
            id="weather-search-input"
            type="text"
            placeholder="Search weather / ابحث في الطقس..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-sky-50/70 border border-sky-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-sky-400"
          />
        </div>
      </div>

      {/* Mode 1: Carousel / Flashcard */}
      {viewMode === 'carousel' && (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
              <CloudSun className="w-12 h-12 text-sky-300 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-500 font-bold">No weather conditions found / لم يتم العثور على حالة طقس</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-sky-100 text-center relative overflow-hidden transition-all">
              {/* Top info badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-sky-100 text-sky-800 flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5" /> Weather Condition • حالة الطقس
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {safeIndex + 1} / {filteredItems.length}
                </span>
              </div>

              {/* Main Visual Emoji */}
              <div
                onClick={() => handleSpeak()}
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center text-8xl sm:text-9xl shadow-inner border-2 border-sky-200 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
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
                    id="speak-weather-button"
                    onClick={() => handleSpeak()}
                    className={`p-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-md transition-transform active:scale-90 ${
                      isSpeaking ? 'animate-bounce' : ''
                    }`}
                    aria-label="Listen pronunciation"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-sky-600">{currentItem.phonetic}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-700 font-arabic pt-1">
                  {currentItem.nameArabic}
                </p>
              </div>

              {/* Description & Outfit Tip Box */}
              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sm">
                  <div className="flex items-center gap-1.5 text-sky-800 font-bold mb-1">
                    <Compass className="w-4 h-4" /> Activity & Sky
                  </div>
                  <p className="text-gray-700 font-medium text-xs sm:text-sm">{currentItem.activity}</p>
                  <p className="text-sky-900 font-arabic font-semibold text-xs sm:text-sm mt-1">{currentItem.activityArabic}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
                    <Shirt className="w-4 h-4" /> Clothing Advice
                  </div>
                  <p className="text-gray-700 font-medium text-xs sm:text-sm">{currentItem.clothingTip}</p>
                  <p className="text-amber-900 font-arabic font-semibold text-xs sm:text-sm mt-1">{currentItem.clothingTipArabic}</p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                <button
                  id="prev-weather-button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-sky-100 text-gray-700 font-bold text-sm transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                <button
                  id="next-weather-button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
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
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl border-2 border-sky-100 hover:border-sky-400 transition-all cursor-pointer text-center group active:scale-95"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {item.emoji}
              </div>
              <h3 className="text-lg font-black text-gray-800 group-hover:text-sky-600 transition-colors">
                {item.nameEnglish}
              </h3>
              <p className="text-xs font-semibold text-sky-600">{item.phonetic}</p>
              <p className="text-md font-bold text-gray-600 font-arabic mt-1">{item.nameArabic}</p>
              <div className="mt-2.5 flex justify-center">
                <span className="p-1.5 rounded-full bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Volume2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 3: Interactive "What to Wear?" Explorer */}
      {viewMode === 'interactive' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-sky-200 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-800">
              Weather & Outfit Helper 🌤️👕
            </h3>
            <p className="text-sm font-semibold text-gray-500">
              Choose a weather to see what clothes are best to wear!
            </p>
          </div>

          {/* Weather Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {WEATHER_DATA.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWeatherId(w.id);
                  playChime('pop');
                  speakWord(w.nameEnglish, speechRate);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  selectedWeatherId === w.id
                    ? 'bg-sky-500 text-white shadow-lg scale-105 ring-2 ring-sky-300'
                    : 'bg-gray-100 hover:bg-sky-100 text-gray-700'
                }`}
              >
                <span className="text-xl">{w.emoji}</span>
                <span>{w.nameEnglish}</span>
              </button>
            ))}
          </div>

          {/* Selected Weather Visual Presentation */}
          <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border-2 border-sky-200 text-center space-y-4 max-w-xl mx-auto">
            <div className="text-8xl animate-bounce">{selectedInteractiveWeather.emoji}</div>
            <div>
              <h4 className="text-3xl font-black text-gray-800">
                It is {selectedInteractiveWeather.nameEnglish} today!
              </h4>
              <p className="text-xl font-bold text-sky-800 font-arabic mt-1">
                الطقس اليوم ({selectedInteractiveWeather.nameArabic})
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-sky-100 text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                <Shirt className="w-5 h-5 text-amber-600" />
                <span>Recommended Clothes • الملابس المناسبة:</span>
              </div>
              <p className="text-gray-800 font-semibold text-sm">
                {selectedInteractiveWeather.clothingTip}
              </p>
              <p className="text-gray-600 font-arabic text-sm">
                {selectedInteractiveWeather.clothingTipArabic}
              </p>
            </div>

            <button
              onClick={() => {
                playChime('success');
                speakWord(`${selectedInteractiveWeather.nameEnglish}. ${selectedInteractiveWeather.clothingTip}`, speechRate);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4" /> Listen All Tips
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
