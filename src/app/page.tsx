'use client';

import { useState, useEffect } from 'react';
import { useIngredients } from '@/hooks/useIngredients';
import { filterRecipes, FilterState } from '@/lib/recipeFilter';
import { recipes } from '@/data/recipes';
import IngredientManager from '@/components/IngredientManager';
import FilterPanel from '@/components/FilterPanel';
import RecipeList from '@/components/RecipeList';

const DEFAULT_FILTER: FilterState = {
  category: 'all',
  cookTime: 'any',
  search: '',
};

export default function Home() {
  const { ingredients, addIngredient, removeIngredient, clearAll, loaded } = useIngredients();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [showRecipes, setShowRecipes] = useState(false);

  const myIngredientNames = ingredients.map((i) => i.name);
  const hasIngredients = myIngredientNames.length > 0;
  const filtered = filterRecipes(recipes, myIngredientNames, filter);

  // 食材が0件になったらレシピ一覧を閉じる
  useEffect(() => {
    if (!hasIngredients) setShowRecipes(false);
  }, [hasIngredients]);

  if (!loaded) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-3 py-4 space-y-4 lg:max-w-6xl lg:px-4 lg:py-6 lg:space-y-6">
      <IngredientManager
        ingredients={ingredients}
        onAdd={addIngredient}
        onRemove={removeIngredient}
        onClear={clearAll}
      />

      {/* 食材なし：空状態 */}
      {!hasIngredients && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <span className="text-5xl mb-4">🧊</span>
          <p className="text-gray-600 font-medium text-base">冷蔵庫に食材を追加して</p>
          <p className="text-gray-600 font-medium text-base">レシピを探しましょう</p>
          <p className="text-sm text-gray-400 mt-2">登録した食材でつくれるレシピが見つかります</p>
        </div>
      )}

      {/* 食材あり・未検索：検索ボタン */}
      {hasIngredients && !showRecipes && (
        <button
          onClick={() => setShowRecipes(true)}
          className="w-full py-4 bg-emerald-500 active:bg-emerald-700 text-white font-bold text-base rounded-2xl transition-colors shadow-sm"
        >
          🔍 レシピを検索する
        </button>
      )}

      {/* 食材あり・検索後：フィルター + レシピ一覧 */}
      {hasIngredients && showRecipes && (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          <aside className="w-full lg:w-64 shrink-0">
            <FilterPanel
              filter={filter}
              onChange={setFilter}
              total={recipes.length}
              filtered={filtered.length}
            />
          </aside>
          <section className="flex-1 min-w-0 w-full">
            <p className="text-sm text-gray-500 mb-3">
              <span className="font-medium text-emerald-600">{myIngredientNames.length}種類</span>の食材をもとにソートしています
            </p>
            <RecipeList recipes={filtered} myIngredients={myIngredientNames} />
          </section>
        </div>
      )}
    </main>
  );
}
