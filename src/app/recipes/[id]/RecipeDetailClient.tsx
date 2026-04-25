'use client';

import Link from 'next/link';
import { Recipe } from '@/types';
import { useIngredients } from '@/hooks/useIngredients';
import { getMatchedIngredients, getMissingIngredients } from '@/lib/recipeFilter';

const CATEGORY_LABEL: Record<Recipe['category'], string> = {
  japanese: '和食',
  western: '洋食',
  chinese: '中華',
};

const CATEGORY_COLOR: Record<Recipe['category'], string> = {
  japanese: 'bg-red-50 text-red-600 border-red-200',
  western: 'bg-blue-50 text-blue-600 border-blue-200',
  chinese: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

interface Props {
  recipe: Recipe;
}

export default function RecipeDetailClient({ recipe }: Props) {
  const { ingredients, loaded } = useIngredients();
  const myIngredientNames = ingredients.map((i) => i.name);
  const matched = loaded ? getMatchedIngredients(recipe, myIngredientNames) : [];
  const missing = loaded ? getMissingIngredients(recipe, myIngredientNames) : [];

  return (
    <main className="max-w-2xl mx-auto px-3 py-4 lg:px-4 lg:py-6">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors mb-4 py-1"
      >
        ← レシピ一覧に戻る
      </Link>

      {/* タイトルエリア */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-3">
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-xl font-bold text-gray-800 flex-1 leading-tight">{recipe.name}</h1>
          <span className={`shrink-0 text-sm px-3 py-1 rounded-full border ${CATEGORY_COLOR[recipe.category]}`}>
            {CATEGORY_LABEL[recipe.category]}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4">{recipe.description}</p>

        {/* メタ情報 */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
          <span>⏱ {recipe.cookTime}分</span>
          <span>👤 {recipe.servings}人前</span>
          <span>🔥 {recipe.calories}kcal</span>
        </div>
      </div>

      {/* 食材チェック（登録食材がある場合のみ） */}
      {loaded && myIngredientNames.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-3">
          <h2 className="font-bold text-gray-700 mb-3">食材チェック</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${(matched.length / recipe.ingredients.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-emerald-600">
              {matched.length} / {recipe.ingredients.length}
            </span>
          </div>
          {missing.length === 0 ? (
            <p className="text-sm font-medium text-emerald-600">✓ すべての食材がそろっています！</p>
          ) : (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">不足している食材：</p>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((m) => (
                  <span key={m} className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-full border border-red-100">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 材料 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-3">
        <h2 className="font-bold text-gray-700 mb-3">材料（{recipe.servings}人前）</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing) => {
            const isMatched = loaded && matched.includes(ing);
            return (
              <li key={ing} className="flex items-center gap-2 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  loaded && myIngredientNames.length > 0
                    ? isMatched
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {loaded && myIngredientNames.length > 0 ? (isMatched ? '✓' : '·') : '·'}
                </span>
                <span className={isMatched && myIngredientNames.length > 0 ? 'text-gray-800 font-medium' : 'text-gray-600'}>
                  {ing}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 作り方 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-700 mb-4">作り方</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
