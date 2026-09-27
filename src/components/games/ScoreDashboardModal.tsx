import React, { useState } from 'react';
import {
  PlayerProfile,
  calculateLevel,
  LEVELS,
  ALL_BADGES,
  AVATAR_OPTIONS,
  savePlayerProfile,
  getPlayerProfile,
} from '../../utils/scoreManager';
import {
  Trophy,
  Star,
  Zap,
  Flame,
  X,
  Award,
  RotateCcw,
  CheckCircle2,
  Lock,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { playChime } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface ScoreDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onProfileUpdate: (updated: PlayerProfile) => void;
}

export const ScoreDashboardModal: React.FC<ScoreDashboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'highscores' | 'badges'>('profile');
  const [isEditingName, setIsEditingName] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState(profile.playerName);

  if (!isOpen) return null;

  const currentLevel = calculateLevel(profile.totalXp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);

  const xpProgress = nextLevel
    ? Math.min(
        100,
        Math.max(
          0,
          ((profile.totalXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
        )
      )
    : 100;

  const xpNeeded = nextLevel ? nextLevel.minXp - profile.totalXp : 0;

  const handleAvatarChange = (avatar: string) => {
    playChime('pop');
    const updated = { ...profile, avatar };
    savePlayerProfile(updated);
    onProfileUpdate(updated);
  };

  const handleSaveName = () => {
    const trimmed = playerNameInput.trim() || 'Super Star';
    playChime('click');
    const updated = { ...profile, playerName: trimmed };
    savePlayerProfile(updated);
    onProfileUpdate(updated);
    setIsEditingName(false);
  };

  const handleResetConfirm = () => {
    if (window.confirm('هل تريد تصفير النقاط والبدء من جديد؟ / Reset score progress?')) {
      localStorage.removeItem('english_kids_profile_v2');
      localStorage.removeItem('english_kids_stars');
      const fresh = getPlayerProfile();
      onProfileUpdate(fresh);
      playChime('pop');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="font-fun text-xl sm:text-2xl font-black">Score & Trophy Center</h2>
              <p className="text-xs text-amber-100 font-semibold">مركز الإنجازات والجوائز والأوسمة</p>
            </div>
          </div>
          <button
            onClick={() => {
              playChime('pop');
              onClose();
            }}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => {
              playChime('click');
              setActiveTab('profile');
            }}
            className={`flex-1 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>👤 Profile & Level</span>
          </button>
          <button
            onClick={() => {
              playChime('click');
              setActiveTab('highscores');
            }}
            className={`flex-1 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'highscores'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>High Scores</span>
          </button>
          <button
            onClick={() => {
              playChime('click');
              setActiveTab('badges');
            }}
            className={`flex-1 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Badges ({profile.unlockedBadgeIds.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PROFILE & LEVEL PROGRESS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Player Avatar & Name Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200 flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <div className="w-20 h-20 rounded-full bg-white shadow-md border-4 border-amber-400 flex items-center justify-center text-5xl select-none">
                    {profile.avatar}
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    Lv.{currentLevel.level}
                  </span>
                </div>

                {/* Avatar Selection Picker */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-3 max-w-xs">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      onClick={() => handleAvatarChange(av)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                        profile.avatar === av
                          ? 'bg-amber-400 scale-110 shadow-sm ring-2 ring-amber-500'
                          : 'bg-white hover:bg-amber-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>

                {/* Player Name */}
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={playerNameInput}
                      onChange={(e) => setPlayerNameInput(e.target.value)}
                      maxLength={15}
                      className="px-3 py-1 text-sm font-bold border-2 border-amber-400 rounded-xl focus:outline-none bg-white text-center"
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsEditingName(true)}>
                    <h3 className="font-fun text-xl font-black text-slate-800">{profile.playerName}</h3>
                    <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                      ✏️ Edit
                    </span>
                  </div>
                )}
                <span className="text-xs text-slate-500 font-bold mt-0.5">
                  {currentLevel.titleEn} • {currentLevel.titleAr}
                </span>
              </div>

              {/* Level XP Progress Bar */}
              <div className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>XP: {profile.totalXp}</span>
                  </span>
                  <span>
                    {nextLevel ? `Next: Lv.${nextLevel.level} (${xpNeeded} XP needed)` : 'Max Level Reached! 🏆'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500 mx-auto mb-1" />
                  <span className="font-fun text-lg font-black text-amber-800 block">{profile.stars}</span>
                  <span className="text-[10px] text-amber-700 font-bold">Total Stars</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
                  <Flame className="w-5 h-5 fill-rose-500 text-rose-500 mx-auto mb-1" />
                  <span className="font-fun text-lg font-black text-rose-800 block">
                    {profile.highestStreak}
                  </span>
                  <span className="text-[10px] text-rose-700 font-bold">Best Streak</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                  <Trophy className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="font-fun text-lg font-black text-emerald-800 block">
                    {profile.gamesWon}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">Games Won</span>
                </div>
              </div>

              {/* Reset Score Action */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleResetConfirm}
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Progress / إعادة ضبط النقاط</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HIGH SCORES BY GAME */}
          {activeTab === 'highscores' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-bold text-center">
                أفضل الأرقام والنتائج المحققة في كل لعبة:
              </p>

              <div className="space-y-2">
                {[
                  { id: 'memory', name: 'Memory Match', ar: 'لعبة الذاكرة', icon: '🧠', score: profile.highScores.memory, unit: 'pts' },
                  { id: 'spelling', name: 'Spelling Bee', ar: 'تركيب الكلمات', icon: '🔤', score: profile.highScores.spelling, unit: 'words' },
                  { id: 'listening', name: 'Speed Listening', ar: 'تحدي الاستماع', icon: '🎧', score: profile.highScores.listening, unit: 'pts' },
                  { id: 'balloonPop', name: 'Balloon Pop', ar: 'فرقعة البالونات', icon: '🎈', score: profile.highScores.balloonPop, unit: 'pts' },
                  { id: 'shadowMatch', name: 'Shadow Match', ar: 'لعبة الظلال والتوصيل', icon: '🧩', score: profile.highScores.shadowMatch, unit: 'pts' },
                  { id: 'oddOneOut', name: 'Odd One Out', ar: 'اكتشف العنصر المختلف', icon: '🔍', score: profile.highScores.oddOneOut, unit: 'pts' },
                  { id: 'mathCounting', name: 'Counting Quest', ar: 'عدّ الأشياء والأرقام', icon: '🔢', score: profile.highScores.mathCounting, unit: 'pts' },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <span className="font-fun text-sm font-bold text-slate-800 block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">{item.ar}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-fun font-black text-slate-800 text-sm">{item.score}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TROPHIES & BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                  Unlocked: {profile.unlockedBadgeIds.length} / {ALL_BADGES.length} Badges
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {ALL_BADGES.map((badge) => {
                  const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);

                  return (
                    <div
                      key={badge.id}
                      onClick={() => {
                        if (isUnlocked) {
                          playChime('star');
                          confetti({ particleCount: 25, spread: 40 });
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                        isUnlocked
                          ? 'border-indigo-300 bg-indigo-50/70 shadow-xs cursor-pointer hover:scale-102'
                          : 'border-slate-200 bg-slate-100/60 opacity-55 grayscale'
                      }`}
                    >
                      <div className="text-4xl mb-1">{badge.icon}</div>
                      <span className="font-fun text-xs font-bold text-slate-800 leading-tight">
                        {badge.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold mt-0.5">
                        {badge.nameAr}
                      </span>
                      <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-900 border border-indigo-200 shadow-2xs flex items-center gap-1">
                        {isUnlocked ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Unlocked</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>{badge.conditionText}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              playChime('pop');
              onClose();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-fun font-bold text-sm rounded-2xl transition-all shadow-md active:scale-95"
          >
            Done / إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
