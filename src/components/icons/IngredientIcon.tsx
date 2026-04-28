'use client';

import { Icon } from '@iconify/react';

// Icon name mappings per ingredient (exact match first)
const ICON_MAP: Record<string, string> = {
  'キャベツ': 'fluent-emoji-flat:leafy-green',
  '人参': 'fluent-emoji-flat:carrot',
  'にんじん': 'fluent-emoji-flat:carrot',
  '玉ねぎ': 'fluent-emoji-flat:onion',
  'たまねぎ': 'fluent-emoji-flat:onion',
  'じゃがいも': 'fluent-emoji-flat:potato',
  'ほうれん草': 'fluent-emoji-flat:leafy-green',
  'ピーマン': 'fluent-emoji-flat:bell-pepper',
  'トマト': 'fluent-emoji-flat:tomato',
  'レタス': 'fluent-emoji-flat:leafy-green',
  '長ねぎ': 'fluent-emoji-flat:onion',
  'もやし': 'fluent-emoji-flat:seedling',
  '生姜': 'fluent-emoji-flat:ginger',
  'にんにく': 'fluent-emoji-flat:garlic',
  'しめじ': 'fluent-emoji-flat:mushroom',
  'エリンギ': 'fluent-emoji-flat:mushroom',
  'えのき': 'fluent-emoji-flat:mushroom',
  'なす': 'fluent-emoji-flat:eggplant',
  'かぼちゃ': 'fluent-emoji-flat:pumpkin',
  'ブロッコリー': 'fluent-emoji-flat:broccoli',
  '大根': 'fluent-emoji-flat:leafy-green',
  '白菜': 'fluent-emoji-flat:leafy-green',
  '水菜': 'fluent-emoji-flat:leafy-green',
  'ズッキーニ': 'fluent-emoji-flat:cucumber',
  'アスパラ': 'fluent-emoji-flat:leafy-green',
  'セロリ': 'fluent-emoji-flat:leafy-green',
  '小松菜': 'fluent-emoji-flat:leafy-green',
  'チンゲン菜': 'fluent-emoji-flat:leafy-green',
  '鶏もも肉': 'fluent-emoji-flat:cut-of-meat',
  '鶏むね肉': 'fluent-emoji-flat:cut-of-meat',
  '豚バラ肉': 'fluent-emoji-flat:cut-of-meat',
  '豚ひき肉': 'fluent-emoji-flat:cut-of-meat',
  '豚ロース薄切り肉': 'fluent-emoji-flat:cut-of-meat',
  '牛薄切り肉': 'fluent-emoji-flat:cut-of-meat',
  'ベーコン': 'fluent-emoji-flat:bacon',
  'ハム': 'fluent-emoji-flat:cut-of-meat',
  'ソーセージ': 'fluent-emoji-flat:hot-dog',
  'えび': 'fluent-emoji-flat:shrimp',
  'エビ': 'fluent-emoji-flat:shrimp',
  'たこ': 'fluent-emoji-flat:octopus',
  'いか': 'fluent-emoji-flat:squid',
  'サーモン': 'fluent-emoji-flat:fish',
  '鮭': 'fluent-emoji-flat:fish',
  'まぐろ': 'fluent-emoji-flat:sushi',
  'ツナ': 'fluent-emoji-flat:fish',
  'アサリ': 'fluent-emoji-flat:oyster',
  '豆腐': 'fluent-emoji-flat:tofu',
  '卵': 'fluent-emoji-flat:egg',
  '牛乳': 'fluent-emoji-flat:glass-of-milk',
  'バター': 'fluent-emoji-flat:butter',
  '納豆': 'fluent-emoji-flat:soybean',
  'チーズ': 'fluent-emoji-flat:cheese-wedge',
  '粉チーズ': 'fluent-emoji-flat:cheese-wedge',
  '油揚げ': 'fluent-emoji-flat:tofu',
  'コンソメ': 'fluent-emoji-flat:package',
  'ごま油': 'fluent-emoji-flat:jar',
  'ご飯': 'fluent-emoji-flat:rice-ball',
  '豆板醤': 'fluent-emoji-flat:hot-pepper',
  'ラーメン': 'fluent-emoji-flat:ramen',
  'パスタ': 'fluent-emoji-flat:spaghetti',
  'うどん': 'fluent-emoji-flat:spaghetti',
  'そば': 'fluent-emoji-flat:spaghetti',
  'パン': 'fluent-emoji-flat:bread',
};

const CATEGORY_ICONS: Record<string, string> = {
  veggie: 'fluent-emoji-flat:leafy-green',
  meat: 'fluent-emoji-flat:cut-of-meat',
  seafood: 'fluent-emoji-flat:fish',
  dairy: 'fluent-emoji-flat:egg',
  other: 'fluent-emoji-flat:fork-and-knife',
};

const VEGGIE_KEYWORDS = ['キャベツ', 'にんじん', '人参', '玉ねぎ', 'たまねぎ', 'じゃがいも', 'ほうれん草', 'ピーマン', 'トマト', 'レタス', '長ねぎ', 'もやし', '生姜', 'にんにく', 'しめじ', 'きのこ', 'なす', 'かぼちゃ', 'ブロッコリー', 'ごぼう', 'れんこん', 'ネギ', '大根', 'さつまいも', '白菜', '水菜', 'ズッキーニ', 'アスパラ', 'エリンギ', 'えのき', 'セロリ', '小松菜', 'チンゲン菜', '春菊'];
const MEAT_KEYWORDS = ['鶏', '豚', '牛', 'ベーコン', 'ハム', 'ソーセージ', 'ひき肉', '肉', 'チキン', 'ラム'];
const SEAFOOD_KEYWORDS = ['えび', 'エビ', 'たこ', 'いか', 'サーモン', '鮭', 'まぐろ', 'ツナ', 'かに', 'アサリ', 'しじみ', '魚', 'あじ', 'さば', '鯛', 'ブリ', 'タラ', 'ちくわ', 'かまぼこ', 'ほたて'];
const DAIRY_KEYWORDS = ['豆腐', '卵', '牛乳', 'バター', '納豆', 'チーズ', '豆乳', '大豆', '油揚げ', 'ヨーグルト', '生クリーム', '厚揚げ'];

export function getIngredientCategory(name: string): 'veggie' | 'meat' | 'seafood' | 'dairy' | 'other' {
  if (VEGGIE_KEYWORDS.some((k) => name.includes(k))) return 'veggie';
  // dairy before meat so "牛乳" isn't misclassified by the "牛" keyword
  if (DAIRY_KEYWORDS.some((k) => name.includes(k))) return 'dairy';
  if (MEAT_KEYWORDS.some((k) => name.includes(k))) return 'meat';
  if (SEAFOOD_KEYWORDS.some((k) => name.includes(k))) return 'seafood';
  return 'other';
}

export function getIngredientIconName(name: string): string {
  if (ICON_MAP[name]) return ICON_MAP[name];
  const category = getIngredientCategory(name);
  return CATEGORY_ICONS[category];
}

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export default function IngredientIcon({ name, size = 24, className }: Props) {
  return <Icon icon={getIngredientIconName(name)} width={size} height={size} className={className} />;
}
