'use client';

import { useState } from 'react';
import { useIngredients } from '@/hooks/useIngredients';
import { filterRecipes, FilterState } from '@/lib/recipeFilter';
import { recipes } from '@/data/recipes';
import IngredientManager from '@/components/IngredientManager';
import FilterPanel from '@/components/FilterPanel';
import RecipeList from '@/components/RecipeList';

const DEFAULT_FILTER: FilterState = {
  category: 'all',
  flags: [],
  search: '',
};

export default function Home() {
  const { ingredients, addIngredient, removeIngredient, clearAll, loaded } = useIngredients();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const myIngredientNames = ingredients.map((i) => i.name);
  const filtered = filterRecipes(recipes, myIngredientNames, filter);

  if (!loaded) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <IngredientManager
        ingredients={ingredients}
        onAdd={addIngredient}
        onRemove={removeIngredient}
        onClear={clearAll}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-64 shrink-0">
          <FilterPanel
            filter={filter}
            onChange={setFilter}
            total={recipes.length}
            filtered={filtered.length}
          />
        </aside>

        <section className="flex-1 min-w-0">
          {myIngredientNames.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-medium text-emerald-600">{myIngredientNames.length}種類</span>の食材をもとにソートしています
            </p>
          )}
          <RecipeList recipes={filtered} myIngredients={myIngredientNames} />
        </section>
      </div>
    </main>
  );
}
