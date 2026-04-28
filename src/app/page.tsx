'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useIngredients } from '@/hooks/useIngredients';
import { filterRecipes, FilterState } from '@/lib/recipeFilter';
import { recipes } from '@/data/recipes';
import FilterPanel from '@/components/FilterPanel';
import RecipeList from '@/components/RecipeList';
import IngredientIcon, { getIngredientCategory } from '@/components/icons/IngredientIcon';
import AddIngredientInput from '@/components/AddIngredientInput';

const CATEGORIES = [
  { key: 'veggie',   label: '野菜',            icon: 'fluent-emoji-flat:leafy-green' },
  { key: 'meat',     label: '肉・魚',           icon: 'fluent-emoji-flat:cut-of-meat' },
  { key: 'seafood',  label: '魚介',             icon: 'fluent-emoji-flat:fish' },
  { key: 'dairy',    label: '大豆・卵\n乳製品', icon: 'fluent-emoji-flat:egg' },
  { key: 'other',    label: 'その他',           icon: null },
] as const;

const DEFAULT_FILTER: FilterState = { category: 'all', cookTime: 'any', search: '' };

const COMMON_INGREDIENTS = [
  '卵', '玉ねぎ', '鶏もも肉', '豆腐', 'にんじん',
  'じゃがいも', 'キャベツ', '豚バラ肉', '長ねぎ', '生姜',
  'にんにく', 'ご飯', '豚ひき肉', '牛乳', 'バター',
  'ベーコン', 'もやし', '鶏むね肉', '豆板醤', 'ごま油',
] as const;

/** レシピ全品から食材名を重複なく抽出してソート */
const RECIPE_CANDIDATES = Array.from(
  new Set(recipes.flatMap((r) => r.ingredients))
).sort();

export default function Home() {
  const { ingredients, addIngredient, removeIngredient, loaded } = useIngredients();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [showRecipes, setShowRecipes] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showCommon, setShowCommon] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const commonScrollRef = useRef<HTMLDivElement>(null);

  const scrollCommon = (dir: 'left' | 'right') => {
    commonScrollRef.current?.scrollBy({ left: dir === 'right' ? 160 : -160, behavior: 'smooth' });
  };

  const myIngredientNames = ingredients.map((i) => i.name);
  const addedNames = new Set(myIngredientNames);
  const filtered = filterRecipes(recipes, myIngredientNames, filter);

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, ingredients.filter((i) => getIngredientCategory(i.name) === c.key).length])
  );

  const handleAdd = (name: string) => {
    addIngredient(name);
  };

  const showToast = (name: string) => {
    setToast(`「${name}」は登録済みです`);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-[14px] text-[#6B7280]">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ─── トースト通知 ─── */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* ─── ヘッダー ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <h1 className="text-[18px] font-semibold text-[#111827]">フリッジレシピ</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-6">

        {/* ─── キャッチコピー ─── */}
        <div className="pt-1">
          <p className="text-[20px] font-bold text-[#111827]">冷蔵庫の食材からレシピを検索しよう</p>
        </div>

        {/* ─── 食材追加フィールド ─── */}
        <AddIngredientInput
          candidates={RECIPE_CANDIDATES}
          addedNames={addedNames}
          onAdd={handleAdd}
          onDuplicate={showToast}
        />

        {/* ─── 登録している食材 ─── */}
        <section>
          <h2 className="text-[16px] font-semibold text-[#111827] mb-3">登録している食材</h2>

          {ingredients.length === 0 ? (
            <p className="text-[14px] text-[#9CA3AF] py-1">
              上のフィールドから食材を追加してください
            </p>
          ) : (
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
            </div>
          )}
        </section>

        {/* ─── 冷蔵庫の食材 ─── */}
        <section>
          <button
            onClick={() => setShowCategory((v) => !v)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#111827]">冷蔵庫の食材</h2>
              <span className="text-[12px] font-medium text-[#16A34A] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                {ingredients.length}品
              </span>
            </div>
            <Icon
              icon={showCategory ? 'mdi:minus' : 'mdi:plus'}
              width={20}
              height={20}
              className="text-[#9CA3AF]"
            />
          </button>

          {showCategory && (
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
          )}
        </section>

        {/* ─── よく使う食材 ─── */}
        <section>
          <button
            onClick={() => setShowCommon((v) => !v)}
            className="w-full flex items-center justify-between mb-3"
          >
            <h2 className="text-[16px] font-semibold text-[#111827]">よく使う食材</h2>
            <Icon
              icon={showCommon ? 'mdi:minus' : 'mdi:plus'}
              width={20}
              height={20}
              className="text-[#9CA3AF]"
            />
          </button>
          {showCommon && (
            <>
              <div
                ref={commonScrollRef}
                className="grid gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x"
                style={{ gridTemplateRows: 'repeat(2, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content' }}
              >
                {COMMON_INGREDIENTS.map((name) => {
                  const isAdded = addedNames.has(name);
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        if (isAdded) {
                          const ing = ingredients.find((i) => i.name === name);
                          if (ing) removeIngredient(ing.id);
                        } else {
                          addIngredient(name);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full border text-[13px] font-medium transition-colors ${
                        isAdded
                          ? 'bg-white border-[#16A34A] text-[#16A34A]'
                          : 'bg-white border-[#E5E7EB] text-[#111827] active:border-[#D1D5DB]'
                      }`}
                    >
                      <IngredientIcon name={name} size={16} />
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => scrollCommon('left')}
                  className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] active:bg-gray-50"
                  aria-label="左へスクロール"
                >
                  <Icon icon="mdi:chevron-left" width={18} height={18} />
                </button>
                <button
                  onClick={() => scrollCommon('right')}
                  className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] active:bg-gray-50"
                  aria-label="右へスクロール"
                >
                  <Icon icon="mdi:chevron-right" width={18} height={18} />
                </button>
              </div>
            </>
          )}
        </section>

        {/* ─── 検索 CTA ─── */}
        <section>
          <button
            onClick={() => setShowRecipes(true)}
            className="w-full h-12 bg-[#16A34A] active:bg-green-800 text-white text-[15px] font-semibold rounded-full flex items-center justify-center transition-colors"
          >
            レシピを検索する
          </button>
        </section>


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
