'use client';

import { useState, KeyboardEvent } from 'react';
import { Icon } from '@iconify/react';
import { useIngredients } from '@/hooks/useIngredients';
import { filterRecipes, FilterState } from '@/lib/recipeFilter';
import { recipes } from '@/data/recipes';
import FilterPanel from '@/components/FilterPanel';
import RecipeList from '@/components/RecipeList';
import IngredientIcon, { getIngredientCategory } from '@/components/icons/IngredientIcon';

const CATEGORIES = [
  { key: 'veggie',   label: '野菜',            icon: 'fluent-emoji-flat:leafy-green' },
  { key: 'meat',     label: '肉・魚',           icon: 'fluent-emoji-flat:cut-of-meat' },
  { key: 'seafood',  label: '魚介',             icon: 'fluent-emoji-flat:fish' },
  { key: 'dairy',    label: '大豆・卵\n乳製品', icon: 'fluent-emoji-flat:egg' },
  { key: 'other',    label: 'その他',           icon: null },
] as const;

const DEFAULT_FILTER: FilterState = { category: 'all', cookTime: 'any', search: '' };

export default function Home() {
  const { ingredients, addIngredient, removeIngredient, loaded } = useIngredients();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [showRecipes, setShowRecipes] = useState(false);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const myIngredientNames = ingredients.map((i) => i.name);
  const filtered = filterRecipes(recipes, myIngredientNames, filter);

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, ingredients.filter((i) => getIngredientCategory(i.name) === c.key).length])
  );

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addIngredient(trimmed);
    setInput('');
    setShowInput(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setShowInput(false); setInput(''); }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-[14px] text-[#6B7280]">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── ヘッダー ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-[18px] font-semibold text-[#111827]">フリッジレシピ</h1>
          <button className="relative p-1.5" aria-label="通知">
            <Icon icon="mdi:bell-outline" width={24} height={24} className="text-[#374151]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#16A34A] rounded-full" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-6">

        {/* ─── 冷蔵庫の食材 ─── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#111827]">冷蔵庫の食材</h2>
              <span className="text-[12px] font-medium text-[#16A34A] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                {ingredients.length}品
              </span>
            </div>
            <button className="text-[14px] font-medium text-[#16A34A]">編集</button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className="flex flex-col items-center gap-1.5 py-3 px-1 border border-[#E5E7EB] rounded-xl bg-white"
              >
                {cat.icon ? (
                  <Icon icon={cat.icon} width={36} height={36} />
                ) : (
                  <span className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] text-[20px] font-bold leading-none tracking-widest">···</span>
                )}
                <span className="text-[10px] text-[#374151] text-center leading-tight whitespace-pre-line">{cat.label}</span>
                <span className="text-[14px] font-semibold text-[#111827]">{categoryCounts[cat.key] ?? 0}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 登録している食材 ─── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-[#111827]">登録している食材</h2>
            <button className="text-[14px] font-medium text-[#16A34A]">すべて見る &gt;</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <span
                key={ing.id}
                className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-[#E5E7EB] rounded-full text-[13px] text-[#111827]"
              >
                <IngredientIcon name={ing.name} size={18} />
                {ing.name}
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="text-[#9CA3AF] text-[15px] ml-0.5 leading-none hover:text-[#6B7280]"
                  aria-label={`${ing.name}を削除`}
                >
                  ×
                </button>
              </span>
            ))}

            {showInput ? (
              <div className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-[#16A34A] rounded-full">
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="食材名..."
                  className="text-[13px] outline-none w-24 bg-transparent"
                />
                <button
                  onClick={handleAdd}
                  className="text-[#16A34A] text-[13px] font-medium"
                >
                  追加
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowInput(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-[#E5E7EB] rounded-full text-[13px] text-[#6B7280] hover:border-[#16A34A] hover:text-[#16A34A] transition-colors"
              >
                <span className="text-[#16A34A] text-[16px] leading-none font-medium">＋</span>
                食材を追加する
              </button>
            )}
          </div>
        </section>

        {/* ─── 検索 CTA ─── */}
        <section className="bg-[#F9FAFB] rounded-2xl p-6 flex flex-col items-center gap-3 border border-[#F3F4F6]">
          <div className="w-12 h-12 bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center">
            <Icon icon="mdi:magnify" width={28} height={28} className="text-[#16A34A]" />
          </div>

          <div className="text-center">
            <p className="text-[18px] font-bold text-[#111827] leading-snug">
              冷蔵庫の食材から<br />レシピを検索しよう
            </p>
          </div>

          <p className="text-[13px] text-[#6B7280] text-center leading-relaxed">
            下のボタンからあなたにぴったりの<br />レシピを探せます
          </p>

          <button
            onClick={() => setShowRecipes(true)}
            className="w-full h-12 bg-[#16A34A] active:bg-green-800 text-white text-[15px] font-semibold rounded-full flex items-center justify-center gap-2 mt-1 transition-colors"
          >
            <Icon icon="mdi:magnify" width={20} height={20} />
            レシピを検索する
          </button>
        </section>

        {/* ─── 今日のおすすめ ─── */}
        <button className="w-full flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl bg-white active:bg-gray-50 transition-colors">
          <Icon icon="fluent-emoji-flat:light-bulb" width={36} height={36} className="shrink-0" />
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-[#111827]">今日のおすすめレシピを見る</p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">冷蔵庫の食材に合わせたおすすめを提案</p>
          </div>
          <Icon icon="mdi:chevron-right" width={20} height={20} className="text-[#9CA3AF] shrink-0" />
        </button>

        {/* ─── レシピ検索結果 ─── */}
        {showRecipes && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-[#111827]">検索結果</p>
              <button
                onClick={() => setShowRecipes(false)}
                className="text-[13px] text-[#6B7280] border border-[#E5E7EB] rounded-full px-3 py-1"
              >
                閉じる
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <FilterPanel
                  filter={filter}
                  onChange={setFilter}
                  total={recipes.length}
                  filtered={filtered.length}
                />
              </aside>
              <section className="flex-1 min-w-0 w-full">
                <p className="text-[14px] text-[#6B7280] mb-4">
                  <span className="font-medium text-[#111827]">{myIngredientNames.length}種類</span>の食材をもとにソートしています
                </p>
                <RecipeList recipes={filtered} myIngredients={myIngredientNames} />
              </section>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
