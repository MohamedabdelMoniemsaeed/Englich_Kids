import React, { useState } from 'react';
import { ScreenId, ThemeConfig } from '../types';
import { Sparkles, Gamepad2, BookOpen, Star } from 'lucide-react';
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
  customIcon?: string;
  gradientBg?: string;
  categoryType: 'learning' | 'games';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ themeConfig, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'learning' | 'games'>('all');

  const cards: HomeCardItem[] = [
    // 1. Games Hub Spotlight Card
    {
      id: 'games',
      name: 'Games Hub',
      arabicName: 'ألعاب وأنشطة تفاعلية',
      badge: '6 Games 🎮⭐',
      customIcon: '🎮🧠✍️🔤',
      gradientBg: 'from-amber-400 via-rose-500 to-purple-600',
      categoryType: 'games',
    },
    // 2. ABC Alphabet
    {
      id: 'abc',
      name: 'A B C',
      arabicName: 'الحروف الإنجليزية',
      image: '/assets/images/abc/backgroundimage.jpg',
      categoryType: 'learning',
    },
    // 3. Numbers
    {
      id: 'numbers',
      name: 'Numbers',
      arabicName: 'الأرقام',
      image: '/assets/images/numbers/backgroundimage.jpg',
      categoryType: 'learning',
    },
    // 4. Animals
    {
      id: 'animals',
      name: 'Animals',
      arabicName: 'الحيوانات',
      image: '/assets/images/animals/animalshome.jpg',
      categoryType: 'learning',
    },
    // 5. Fruits & Vegetables
    {
      id: 'fruits',
      name: 'Fruits & Veggies',
      arabicName: 'الفواكه والخضروات',
      badge: 'New 🍓🥕',
      customIcon: '🍎🍌🍓🥦🥕',
      gradientBg: 'from-emerald-400 via-rose-400 to-amber-400',
      categoryType: 'learning',
    },
    // 6. Vehicles & Transport
    {
      id: 'vehicles',
      name: 'Vehicles',
      arabicName: 'المواصلات والمركبات',
      badge: 'New 🚗✈️',
      customIcon: '🚗✈️🚆🚀🚢',
      gradientBg: 'from-sky-400 via-blue-500 to-indigo-600',
      categoryType: 'learning',
    },
    // 7. Colors
    {
      id: 'colors',
      name: 'Colors',
      arabicName: 'الألوان',
      image: '/assets/images/colors/backgroundimage.jpg',
      categoryType: 'learning',
    },
    // 8. Shapes
    {
      id: 'shapes',
      name: 'Shapes',
      arabicName: 'الأشكال الهندسية',
      badge: '🔺⭐',
      customIcon: '🔺⏹️⭐🔵❤️',
      gradientBg: 'from-indigo-500 via-purple-500 to-pink-500',
      categoryType: 'learning',
    },
    // 9. Body Parts
    {
      id: 'body',
      name: 'Body Parts',
      arabicName: 'أجزاء الجسم',
      badge: 'New 👀👂',
      customIcon: '👀👂👃👄🖐️',
      gradientBg: 'from-purple-400 via-pink-400 to-rose-400',
      categoryType: 'learning',
    },
    // 10. Jobs & Careers
    {
      id: 'jobs',
      name: 'Jobs & Careers',
      arabicName: 'المهن والوظائف',
      badge: 'New 👨‍⚕️👩‍🏫',
      customIcon: '👨‍⚕️👩‍🏫👨‍🚒👮‍♂️🚀',
      gradientBg: 'from-amber-400 via-orange-500 to-red-500',
      categoryType: 'learning',
    },
    // 11. Clothes & Fashion
    {
      id: 'clothes',
      name: 'Clothes',
      arabicName: 'الملابس والأزياء',
      badge: 'New 👕👟',
      customIcon: '👕👖👗👟🧢',
      gradientBg: 'from-teal-400 via-cyan-500 to-blue-500',
      categoryType: 'learning',
    },
    // 12. Family
    {
      id: 'family',
      name: 'Family',
      arabicName: 'أفراد العائلة',
      image: '/assets/images/family_members/backgroundimage.jpg',
      categoryType: 'learning',
    },
  ];

  const filteredCards = cards.filter((c) => {
    if (activeTab === 'all') return true;
    return c.categoryType === activeTab;
  });

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="text-center mb-6 pt-1">
        <h2 className="font-fun text-2xl sm:text-4xl font-black text-slate-800 tracking-wide drop-shadow-xs flex items-center justify-center gap-2">
          <span>Explore & Learn English!</span>
          <span className="text-2xl sm:text-3xl animate-bounce">🌟</span>
        </h2>
        <p className="text-slate-600 font-bold text-sm sm:text-base mt-1">
          اختر قسماً أو العب ألعاباً مسلية لتعلم الإنجليزية بسهولة ومرح
        </p>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => {
              playChime('click');
              setActiveTab('all');
            }}
            className={`px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all shadow-xs ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            All Topics ({cards.length})
          </button>
          <button
            onClick={() => {
              playChime('click');
              setActiveTab('learning');
            }}
            className={`px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all shadow-xs flex items-center gap-1.5 ${
              activeTab === 'learning'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lessons / دروس</span>
          </button>
          <button
            onClick={() => {
              playChime('click');
              setActiveTab('games');
            }}
            className={`px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all shadow-xs flex items-center gap-1.5 ${
              activeTab === 'games'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Games / ألعاب</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {filteredCards.map((card) => {
          const isFeatured = card.id === 'games';

          return (
            <button
              key={card.id}
              id={`home-card-${card.id}`}
              onClick={() => {
                playChime('pop');
                onNavigate(card.id);
              }}
              className={`group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1.5 active:scale-95 transition-all duration-300 border-4 border-white/90 focus:outline-none focus:ring-4 focus:ring-amber-400 text-left flex flex-col h-48 sm:h-56 ${
                isFeatured
                  ? 'col-span-2 sm:col-span-2 md:col-span-2 ring-4 ring-amber-400 shadow-amber-200'
                  : ''
              }`}
            >
              {/* Graphic container */}
              <div className="relative w-full flex-1 bg-slate-100 overflow-hidden flex items-center justify-center">
                {card.customIcon ? (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${card.gradientBg} flex items-center justify-center p-4 relative overflow-hidden`}
                  >
                    <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/20 blur-xs" />
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-black/10 blur-xs" />

                    <div className="flex items-center justify-center gap-2 sm:gap-3 z-10 select-none">
                      {card.customIcon.split(' ').map((emoji, i) => (
                        <span
                          key={i}
                          className="text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-300"
                        >
                          {emoji}
                        </span>
                      ))}
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

                {/* Special Badge */}
                {card.badge && (
                  <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-20">
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                    {card.badge}
                  </div>
                )}
              </div>

              {/* Bottom Card Title Banner */}
              <div
                className={`py-2.5 sm:py-3 px-3 bg-gradient-to-r ${themeConfig.primaryColor} text-white flex items-center justify-between`}
              >
                <div className="overflow-hidden">
                  <span className="font-fun text-base sm:text-lg font-black block tracking-wide truncate">
                    {card.name}
                  </span>
                  <span className="text-[11px] sm:text-xs text-white/90 block font-bold truncate">
                    {card.arabicName}
                  </span>
                </div>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white group-hover:bg-white group-hover:text-slate-800 transition-colors shadow-xs shrink-0 text-sm">
                  ➜
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
