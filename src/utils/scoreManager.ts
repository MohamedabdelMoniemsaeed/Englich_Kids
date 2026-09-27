// Comprehensive Score, Level & Trophy Manager for English Kids App

export interface PlayerProfile {
  playerName: string;
  avatar: string;
  stars: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  highestStreak: number;
  gamesPlayed: number;
  gamesWon: number;
  wordsLearned: number;
  highScores: {
    memory: number;
    spelling: number;
    listening: number;
    balloonPop: number;
    shadowMatch: number;
    oddOneOut: number;
    mathCounting: number;
  };
  unlockedBadgeIds: string[];
}

export interface LevelInfo {
  level: number;
  titleEn: string;
  titleAr: string;
  icon: string;
  minXp: number;
  maxXp: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, titleEn: 'Little Explorer', titleAr: 'مستكشف مبتدئ', icon: '🌱', minXp: 0, maxXp: 100 },
  { level: 2, titleEn: 'Clever Fox', titleAr: 'ثعلب ذكي', icon: '🦊', minXp: 100, maxXp: 250 },
  { level: 3, titleEn: 'Brave Lion', titleAr: 'أسد شجاع', icon: '🦁', minXp: 250, maxXp: 500 },
  { level: 4, titleEn: 'Star Cadet', titleAr: 'رائد النجوم', icon: '🚀', minXp: 500, maxXp: 850 },
  { level: 5, titleEn: 'Word Wizard', titleAr: 'ساحر الكلمات', icon: '🧙‍♂️', minXp: 850, maxXp: 1300 },
  { level: 6, titleEn: 'Super Genius', titleAr: 'العبقري البطل', icon: '⚡', minXp: 1300, maxXp: 2000 },
  { level: 7, titleEn: 'English Champion', titleAr: 'بطل الإنجليزية', icon: '👑', minXp: 2000, maxXp: 3000 },
  { level: 8, titleEn: 'Legendary Master', titleAr: 'الأسطورة الذهبية', icon: '🏆', minXp: 3000, maxXp: 5000 },
];

export interface BadgeItem {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  icon: string;
  conditionText: string;
}

export const ALL_BADGES: BadgeItem[] = [
  {
    id: 'first_win',
    nameEn: 'First Victory',
    nameAr: 'الفوز الأول',
    descEn: 'Completed your first game!',
    descAr: 'أكملت أول لعبة بنجاح!',
    icon: '🎖️',
    conditionText: 'Win 1 game',
  },
  {
    id: 'streak_5',
    nameEn: 'Hot Streak',
    nameAr: 'سلسلة نارية',
    descEn: 'Achieved 5 correct answers in a row!',
    descAr: 'أجبت 5 إجابات متتالية صحيحة!',
    icon: '🔥',
    conditionText: '5 streak',
  },
  {
    id: 'streak_10',
    nameEn: 'Unstoppable Flame',
    nameAr: 'شعلة لا تنطفئ',
    descEn: 'Achieved 10 correct answers in a row!',
    descAr: 'أجبت 10 إجابات متتالية صحيحة!',
    icon: '⚡',
    conditionText: '10 streak',
  },
  {
    id: 'memory_master',
    nameEn: 'Memory Genius',
    nameAr: 'عبقري الذاكرة',
    descEn: 'Mastered the Memory Match game!',
    descAr: 'فزت في لعبة الذاكرة!',
    icon: '🧠',
    conditionText: 'Win Memory Match',
  },
  {
    id: 'spelling_whiz',
    nameEn: 'Spelling Star',
    nameAr: 'نجم الحروف',
    descEn: 'Spelled words accurately!',
    descAr: 'ركبت كلمات إنجليزية صحيحة!',
    icon: '🔤',
    conditionText: 'Win Spelling Bee',
  },
  {
    id: 'listening_ace',
    nameEn: 'Sharp Ears',
    nameAr: 'أذن سحرية',
    descEn: 'High listening accuracy!',
    descAr: 'تمييز الأصوات بدقة عالية!',
    icon: '🎧',
    conditionText: 'Score 50+ in Listening',
  },
  {
    id: 'balloon_popper',
    nameEn: 'Balloon Ace',
    nameAr: 'صائد البالونات',
    descEn: 'Popped all target balloons!',
    descAr: 'فرقعت البالونات المطلوبة بنجاح!',
    icon: '🎈',
    conditionText: 'Win Balloon Pop',
  },
  {
    id: 'shadow_detective',
    nameEn: 'Shadow Detective',
    nameAr: 'محقق الظلال',
    descEn: 'Matched all pictures with shadows!',
    descAr: 'طابقت الصور مع ظلالها بدقة!',
    icon: '🕵️‍♂️',
    conditionText: 'Win Shadow Match',
  },
  {
    id: 'odd_master',
    nameEn: 'Eagle Eyes',
    nameAr: 'عيون الصقر',
    descEn: 'Found the odd one out correctly!',
    descAr: 'اكتشفت العنصر المختلف بذكاء!',
    icon: '👁️',
    conditionText: 'Win Odd One Out',
  },
  {
    id: 'math_champ',
    nameEn: 'Counting Wizard',
    nameAr: 'ساحر الأرقام والعد',
    descEn: 'Counted playful objects perfectly!',
    descAr: 'أتقنت عد وحساب العناصر!',
    icon: '🔢',
    conditionText: 'Win Counting Quest',
  },
  {
    id: 'star_collector_50',
    nameEn: '50 Stars Club',
    nameAr: 'نادي 50 نجمة',
    descEn: 'Collected 50 total shiny stars!',
    descAr: 'جمعت 50 نجمة براقة!',
    icon: '⭐',
    conditionText: 'Reach 50 Stars',
  },
  {
    id: 'star_collector_100',
    nameEn: '100 Stars Superstar',
    nameAr: 'سوبر ستار 100 نجمة',
    descEn: 'Collected 100 total shiny stars!',
    descAr: 'جمعت 100 نجمة براقة!',
    icon: '🌟',
    conditionText: 'Reach 100 Stars',
  },
];

export const AVATAR_OPTIONS = ['🦁', '🚀', '🐱', '🦄', '🐼', '🦖', '⭐', '👑', '🐶', '🦊'];

const STORAGE_KEY = 'english_kids_profile_v2';
const LEGACY_STARS_KEY = 'english_kids_stars';

export function getPlayerProfile(): PlayerProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    // ignore
  }

  // Fallback to legacy stars if existing
  const legacyStars = parseInt(localStorage.getItem(LEGACY_STARS_KEY) || '25', 10);

  const initialProfile: PlayerProfile = {
    playerName: 'Super Star',
    avatar: '🦁',
    stars: legacyStars,
    totalXp: legacyStars * 10,
    level: 1,
    currentStreak: 0,
    highestStreak: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    wordsLearned: 15,
    highScores: {
      memory: 0,
      spelling: 0,
      listening: 0,
      balloonPop: 0,
      shadowMatch: 0,
      oddOneOut: 0,
      mathCounting: 0,
    },
    unlockedBadgeIds: ['first_win'],
  };

  savePlayerProfile(initialProfile);
  return initialProfile;
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(LEGACY_STARS_KEY, profile.stars.toString());
  } catch (e) {
    // ignore
  }
}

export function calculateLevel(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export interface ScoreRewardResult {
  addedXp: number;
  addedStars: number;
  leveledUp: boolean;
  newLevel?: LevelInfo;
  newBadgesUnlocked: BadgeItem[];
  profile: PlayerProfile;
}

export function addGameScore(params: {
  points: number;
  stars: number;
  gameId?: keyof PlayerProfile['highScores'];
  gameWon?: boolean;
  streak?: number;
  wordsCount?: number;
}): ScoreRewardResult {
  const profile = getPlayerProfile();
  const oldLevelInfo = calculateLevel(profile.totalXp);

  // Update streak
  const newStreak = params.streak !== undefined ? params.streak : profile.currentStreak;
  const highestStreak = Math.max(profile.highestStreak, newStreak);

  // Add stars and XP
  const addedXp = params.points;
  const addedStars = params.stars;
  const newXp = profile.totalXp + addedXp;
  const newStars = profile.stars + addedStars;

  const newLevelInfo = calculateLevel(newXp);
  const leveledUp = newLevelInfo.level > oldLevelInfo.level;

  // Games stats
  const gamesPlayed = profile.gamesPlayed + 1;
  const gamesWon = profile.gamesWon + (params.gameWon ? 1 : 0);
  const wordsLearned = profile.wordsLearned + (params.wordsCount || 0);

  // High score update
  const newHighScores = { ...profile.highScores };
  if (params.gameId && params.points > (newHighScores[params.gameId] || 0)) {
    newHighScores[params.gameId] = params.points;
  }

  // Check badges to unlock
  const currentBadges = new Set(profile.unlockedBadgeIds);
  const newlyUnlocked: BadgeItem[] = [];

  const checkBadge = (badgeId: string, condition: boolean) => {
    if (condition && !currentBadges.has(badgeId)) {
      currentBadges.add(badgeId);
      const b = ALL_BADGES.find((item) => item.id === badgeId);
      if (b) newlyUnlocked.push(b);
    }
  };

  checkBadge('first_win', gamesWon >= 1);
  checkBadge('streak_5', highestStreak >= 5);
  checkBadge('streak_10', highestStreak >= 10);
  checkBadge('memory_master', params.gameId === 'memory' && !!params.gameWon);
  checkBadge('spelling_whiz', params.gameId === 'spelling' && !!params.gameWon);
  checkBadge('listening_ace', params.gameId === 'listening' && (params.points >= 50 || newHighScores.listening >= 50));
  checkBadge('balloon_popper', params.gameId === 'balloonPop' && !!params.gameWon);
  checkBadge('shadow_detective', params.gameId === 'shadowMatch' && !!params.gameWon);
  checkBadge('odd_master', params.gameId === 'oddOneOut' && !!params.gameWon);
  checkBadge('math_champ', params.gameId === 'mathCounting' && !!params.gameWon);
  checkBadge('star_collector_50', newStars >= 50);
  checkBadge('star_collector_100', newStars >= 100);

  const updatedProfile: PlayerProfile = {
    ...profile,
    stars: newStars,
    totalXp: newXp,
    level: newLevelInfo.level,
    currentStreak: newStreak,
    highestStreak,
    gamesPlayed,
    gamesWon,
    wordsLearned,
    highScores: newHighScores,
    unlockedBadgeIds: Array.from(currentBadges),
  };

  savePlayerProfile(updatedProfile);

  return {
    addedXp,
    addedStars,
    leveledUp,
    newLevel: leveledUp ? newLevelInfo : undefined,
    newBadgesUnlocked: newlyUnlocked,
    profile: updatedProfile,
  };
}
