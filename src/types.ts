export type AppTheme = 'boy' | 'girl' | 'orange';

export type ScreenId = 'home' | 'numbers' | 'family' | 'animals' | 'colors' | 'abc' | 'shapes';

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
  emoji?: string;
  phonetic?: string;
  soundCue?: string;
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

export interface ShapeItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  shapeType: 'triangle' | 'square' | 'circle' | 'rectangle' | 'star' | 'heart' | 'diamond' | 'oval' | 'pentagon' | 'hexagon' | 'octagon' | 'crescent';
  sides: number;
  color: string;
  realLifeExample: string;
  realLifeExampleArabic: string;
  realLifeEmoji: string;
  description: string;
  descriptionArabic: string;
}
