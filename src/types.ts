export type AppTheme = 'boy' | 'girl' | 'orange';

export type ScreenId = 'home' | 'numbers' | 'family' | 'animals' | 'colors' | 'abc' | 'ai_chat';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  label: string;
  bgImage: string;
  bgColor: string;
  cardBg: string;
  primaryColor: string;
  accentColor: string;
  badgeColor: string;
}

export interface AbcItem {
  letter: string;
  word: string;
  image: string;
  arabic?: string;
  soundSequence: string[];
}

export interface NumberItem {
  number: number;
  word: string;
  arabic: string;
  image: string;
}

export interface AnimalItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  image: string;
}

export interface ColorItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  colorHex: string;
  textColor: string;
  image?: string;
}

export interface FamilyItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string;
  timestamp: number;
}
