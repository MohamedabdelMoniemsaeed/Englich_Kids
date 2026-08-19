import React from 'react';
import { ScreenId, ThemeConfig } from '../types';
import { Sparkles, Shapes as ShapesIcon } from 'lucide-react';
import { playChime } from '../utils/sound';

interface HomeScreenProps {
  themeConfig: ThemeConfig;
  onNavigate: (screen: ScreenId) => void;
}

interface HomeCardItem {
  id: ScreenId;
  name: string;
  arabicName: string;
  image?: string;
  badge?: string;
  isShapes?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ themeConfig, onNavigate }) => {
  const cards: HomeCardItem[] = [
    {
      id: 'numbers',
      name: 'Numbers',
      arabicName: 'الأرقام',
      image: '/assets/images/numbers/backgroundimage.jpg',
    },
    {
      id: 'family',
      name: 'Family',
      arabicName: 'العائلة',
      image: '/assets/images/family_members/backgroundimage.jpg',
    },
    {
      id: 'animals',
      name: 'Animals',
      arabicName: 'الحيوانات',
      image: '/assets/images/animals/animalshome.jpg',
    },
    {
      id: 'colors',
      name: 'Colors',
      arabicName: 'الألوان',
      image: '/assets/images/colors/backgroundimage.jpg',
    },
    {
      id: 'abc',
      name: 'A B C',
      arabicName: 'الحروف',
      image: '/assets/images/abc/backgroundimage.jpg',
    },
    {
      id: 'shapes',
      name: 'Shapes',
      arabicName: 'الأشكال الهندسية',
      badge: 'New 🔺⭐',
      isShapes: true,
    },
  ];

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="text-center mb-6 pt-2">
        <h2 className="font-fun text-2xl sm:text-3xl font-black text-slate-800 tracking-wide drop-shadow-xs">
          Choose a Fun Topic! 🌟
        </h2>
        <p className="text-slate-600 font-bold text-sm sm:text-base mt-1">
          اختر موضوعاً لتبدأ التعلم والمرح
        </p>
      </div>

      {/* 2-Column Responsive Card Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            id={`home-card-${card.id}`}
            onClick={() => {
              playChime('pop');
              onNavigate(card.id);
            }}
            className={`group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 border-4 border-white/80 focus:outline-none focus:ring-4 focus:ring-amber-400 text-left flex flex-col h-44 sm:h-56 ${
              card.isShapes ? 'ring-2 ring-indigo-400 shadow-indigo-100' : ''
            }`}
          >
            {/* Background Image / Illustration */}
            <div className="relative w-full flex-1 bg-slate-100 overflow-hidden flex items-center justify-center">
              {card.isShapes ? (
                /* Vibrant Geometric Shapes Graphic for Shapes Card */
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-yellow-400/30 blur-sm" />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-pink-400/30 blur-sm" />
                  
                  {/* Floating shapes */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 z-10">
                    <span className="text-3xl sm:text-4xl animate-bounce" style={{ animationDuration: '2s' }}>🔺</span>
                    <span className="text-3xl sm:text-4xl animate-pulse" style={{ animationDuration: '2.5s' }}>⏹️</span>
                    <span className="text-3xl sm:text-4xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.3s' }}>⭐</span>
                    <span className="text-3xl sm:text-4xl animate-pulse" style={{ animationDuration: '2.8s' }}>🔵</span>
                  </div>
                </div>
              ) : (
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/iconHome.png';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Special Badge if any */}
              {card.badge && (
                <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                  {card.badge}
                </div>
              )}
            </div>

            {/* Bottom Card Title Banner */}
            <div className={`py-2.5 sm:py-3 px-3 bg-gradient-to-r ${themeConfig.primaryColor} text-white flex items-center justify-between`}>
              <div className="overflow-hidden">
                <span className="font-fun text-base sm:text-xl font-black block tracking-wide truncate">
                  {card.name}
                </span>
                <span className="text-[11px] sm:text-xs text-white/85 block font-semibold truncate">
                  {card.arabicName}
                </span>
              </div>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white group-hover:bg-white group-hover:text-slate-800 transition-colors shadow-xs shrink-0 text-sm">
                ➜
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
