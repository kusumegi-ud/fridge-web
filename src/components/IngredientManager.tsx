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
  '卵', '玉ねぎ', '鶏もも肉', '豆腐', 'にんじん',
  'じゃがいも', 'キャベツ', '豚バラ肉', '長ねぎ', '生姜',
  'にんにく', 'ご飯', '豚ひき肉', '牛乳', 'バター',
  'ベーコン', 'もやし', '鶏むね肉', '豆板醤', 'ごま油',
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

      {/* ① 冷蔵庫の食材 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[18px] font-semibold text-[#111827]">冷蔵庫の食材</h2>
            <span className="text-[13px] text-[#6B7280]">{ingredients.length}件</span>
          </div>
          {ingredients.length > 0 && (
            <button
              onClick={onClear}
              className="text-[13px] text-[#6B7280] hover:text-red-500 transition-colors"
            >
              すべて削除
            </button>
          )}
        </div>
        <p className="text-[14px] text-[#6B7280] mb-4">登録している食材（検索に使用されます）</p>

        {/* テキスト入力 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="例：えび、ほうれん草..."
            className="flex-1 min-w-0 h-10 px-[14px] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E5E5] rounded-full focus:outline-none focus:border-[#16A34A] transition-colors"
          />
          <button
            onClick={submit}
            className="shrink-0 h-10 px-[18px] bg-[#16A34A] active:bg-green-800 text-white text-[14px] font-medium rounded-full transition-colors"
          >
            追加
          </button>
        </div>

        {/* 登録済み食材チップ */}
        {ingredients.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] py-2">
            食材を登録するとレシピをフィルタリングできます
          </p>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2">
              {displayedFridge.map((ing) => (
                <span
                  key={ing.id}
                  className="inline-flex items-center gap-1 h-10 px-[14px] bg-white text-[14px] font-medium text-[#16A34A] rounded-full border border-[#16A34A]"
                >
                  {ing.name}
                  <button
                    onClick={() => onRemove(ing.id)}
                    className="ml-0.5 text-[#16A34A] opacity-60 hover:opacity-100 leading-none text-[16px]"
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
                className="mt-3 text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                {showAllFridge ? '閉じる' : `＋もっと見る（${ingredients.length - FRIDGE_INITIAL}件）`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 区切り線 */}
      <div className="border-t border-[#F3F4F6] mb-6" />

      {/* ② よく使う食材 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#111827]">よく使う食材</h2>
          <button
            onClick={() => setShowAllCommon((v) => !v)}
            className="text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            {showAllCommon ? '閉じる' : 'すべて見る →'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {displayedCommon.map((name) => {
            const isAdded = addedNames.has(name);
            return (
              <button
                key={name}
                onClick={() => handleQuickAdd(name)}
                className={`
                  inline-flex items-center h-10 px-[14px]
                  rounded-full border
                  text-[14px] font-medium whitespace-nowrap
                  bg-white transition-colors duration-150
                  ${isAdded
                    ? 'border-[#16A34A] text-[#16A34A]'
                    : 'border-[#E5E5E5] text-[#111827] active:border-[#D1D5DB]'
                  }
                `}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
