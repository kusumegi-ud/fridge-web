'use client';

import { useState, KeyboardEvent } from 'react';
import { Ingredient } from '@/types';

interface Props {
  ingredients: Ingredient[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const COMMON_INGREDIENTS = [
  { name: '卵',       icon: '🥚' },
  { name: '玉ねぎ',   icon: '🧅' },
  { name: '鶏もも肉', icon: '🍗' },
  { name: '豆腐',     icon: '🫘' },
  { name: 'にんじん', icon: '🥕' },
  { name: 'じゃがいも', icon: '🥔' },
  { name: 'キャベツ', icon: '🥬' },
  { name: '豚バラ肉', icon: '🥩' },
  { name: '長ねぎ',   icon: '🌿' },
  { name: '生姜',     icon: '🌱' },
  { name: 'にんにく', icon: '🧄' },
  { name: 'ご飯',     icon: '🍚' },
  { name: '豚ひき肉', icon: '🥩' },
  { name: '牛乳',     icon: '🥛' },
  { name: 'バター',   icon: '🧈' },
  { name: 'ベーコン', icon: '🥓' },
  { name: 'もやし',   icon: '🌾' },
  { name: '鶏むね肉', icon: '🍗' },
  { name: '豆板醤',   icon: '🌶️' },
  { name: 'ごま油',   icon: '🫙' },
] as const;

const FRIDGE_INITIAL = 6;
const COMMON_INITIAL = 8;

export default function IngredientManager({ ingredients, onAdd, onRemove, onClear }: Props) {
  const [input, setInput] = useState('');
  const [showAllFridge, setShowAllFridge] = useState(false);
  const [showAllCommon, setShowAllCommon] = useState(false);

  const addedNames = new Set(ingredients.map((i) => i.name));

  const submit = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  const handleQuickAdd = (name: string) => {
    if (addedNames.has(name)) {
      const ing = ingredients.find((i) => i.name === name);
      if (ing) onRemove(ing.id);
    } else {
      onAdd(name);
    }
  };

  const displayedFridge = showAllFridge ? ingredients : ingredients.slice(0, FRIDGE_INITIAL);
  const displayedCommon = showAllCommon ? COMMON_INGREDIENTS : COMMON_INGREDIENTS.slice(0, COMMON_INITIAL);

  return (
    <div className="bg-white">
      {/* ── ① 冷蔵庫の食材 ── */}
      <div className="mb-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-800">冷蔵庫の食材</h2>
            <span className="text-xs text-gray-400">現在{ingredients.length}件</span>
          </div>
          {ingredients.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
            >
              すべて削除
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-3">登録している食材（検索に使用されます）</p>

        {/* テキスト入力 */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="例：えび、ほうれん草..."
            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
          />
          <button
            onClick={submit}
            className="shrink-0 px-4 py-2.5 bg-[#16A34A] active:bg-green-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            追加
          </button>
        </div>

        {/* 登録済み食材チップ */}
        {ingredients.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-3">
            食材を登録するとレシピをフィルタリングできます
          </p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5">
              {displayedFridge.map((ing) => (
                <span
                  key={ing.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-[#E5E5E5]"
                >
                  {ing.name}
                  <button
                    onClick={() => onRemove(ing.id)}
                    className="ml-0.5 text-gray-400 hover:text-gray-600 leading-none text-base"
                    aria-label={`${ing.name}を削除`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {ingredients.length > FRIDGE_INITIAL && (
              <button
                onClick={() => setShowAllFridge((v) => !v)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showAllFridge ? '閉じる' : `＋もっと見る（${ingredients.length - FRIDGE_INITIAL}件）`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── ② よく使う食材 ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-base font-bold text-gray-800">よく使う食材</h2>
          <button
            onClick={() => setShowAllCommon((v) => !v)}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showAllCommon ? '閉じる' : 'すべて見る →'}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {displayedCommon.map(({ name, icon }) => {
            const isAdded = addedNames.has(name);
            return (
              <button
                key={name}
                onClick={() => handleQuickAdd(name)}
                className={`
                  inline-flex items-center gap-1.5
                  h-9 px-3
                  rounded-full border
                  text-sm whitespace-nowrap
                  bg-white
                  transition-all duration-150
                  ${isAdded
                    ? 'border-[#16A34A] text-[#16A34A]'
                    : 'border-[#E5E5E5] text-gray-700 active:bg-gray-50'
                  }
                `}
              >
                <span className="text-sm leading-none">{icon}</span>
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
