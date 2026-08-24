export type AppTheme = 'boy' | 'girl' | 'orange';

export type ScreenId =
  | 'home'
  | 'abc'
  | 'numbers'
  | 'animals'
  | 'colors'
  | 'shapes'
  | 'family'
  | 'fruits'
  | 'vehicles'
  | 'body'
  | 'jobs'
  | 'clothes'
  | 'games';

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
  shapeType:
    | 'triangle'
    | 'square'
    | 'circle'
    | 'rectangle'
    | 'star'
    | 'heart'
    | 'diamond'
    | 'oval'
    | 'pentagon'
    | 'hexagon'
    | 'octagon'
    | 'crescent';
  sides: number;
  color: string;
  realLifeExample: string;
  realLifeExampleArabic: string;
  realLifeEmoji: string;
  description: string;
  descriptionArabic: string;
}

export interface FruitItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  emoji: string;
  color: string;
  category: 'fruit' | 'vegetable';
  phonetic: string;
  fact: string;
  factArabic: string;
}

export interface VehicleItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  emoji: string;
  type: 'land' | 'air' | 'water';
  phonetic: string;
  soundCue: string;
  description: string;
  descriptionArabic: string;
}

export interface BodyPartItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  emoji: string;
  phonetic: string;
  action: string;
  actionArabic: string;
}

export interface JobItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  emoji: string;
  workplace: string;
  workplaceArabic: string;
  tool: string;
  toolEmoji: string;
  phonetic: string;
}

export interface ClothesItem {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  emoji: string;
  season: 'summer' | 'winter' | 'all';
  phonetic: string;
  descriptionArabic: string;
}
