'use client';

import Link from 'next/link';
import { Recipe } from '@/types';
import { useIngredients } from '@/hooks/useIngredients';
import { getMatchedIngredients, getMissingIngredients } from '@/lib/recipeFilter';

const CATEGORY_LABEL: Record<Recipe['category'], string> = {
  japanese: '和食',
  western:  '洋食',
  chinese:  '中華',
};

interface Props {
  recipe: Recipe;
}

export default function RecipeDetailClient({ recipe }: Props) {
  const { ingredients, addIngredient, loaded } = useIngredients();
  const myIngredientNames = ingredients.map((i) => i.name);
  const matched = loaded ? getMatchedIngredients(recipe, myIngredientNames) : [];
  const missing = loaded ? getMissingIngredients(recipe, myIngredientNames) : [];
  const addedNames = new Set(myIngredientNames);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4 lg:py-8">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[14px] text-[#6B7280] hover:text-[#16A34A] transition-colors"
      >
        ← レシピ一覧に戻る
      </Link>

      {/* タイトルエリア */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-[20px] font-semibold text-[#111827] flex-1 leading-tight">{recipe.name}</h1>
          <span className="shrink-0 text-[12px] h-7 px-3 flex items-center rounded-full border border-[#E5E5E5] text-[#6B7280]">
            {CATEGORY_LABEL[recipe.category]}
          </span>
        </div>

        <p className="text-[14px] text-[#6B7280] mb-4">{recipe.description}</p>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-[#6B7280]">
          <span>{recipe.cookTime}分</span>
          <span>{recipe.servings}人前</span>
          <span>{recipe.calories}kcal / 1人前</span>
        </div>
      </div>

      {/* 食材チェック（登録食材がある場合のみ） */}
      {loaded && myIngredientNames.length > 0 && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-3">食材チェック</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all"
                style={{ width: `${(matched.length / recipe.ingredients.length) * 100}%` }}
              />
            </div>
            <span className="text-[13px] font-medium text-[#6B7280]">
              {matched.length} / {recipe.ingredients.length}
            </span>
          </div>
          {missing.length === 0 ? (
            <p className="text-[14px] font-medium text-[#16A34A]">✓ すべての食材がそろっています</p>
          ) : (
            <div>
              <p className="text-[13px] text-[#6B7280] mb-3">不足している食材（タップで冷蔵庫に追加）</p>
              <div className="flex flex-wrap gap-2">
                {missing.map((m) => {
                  const alreadyAdded = addedNames.has(m);
                  return (
                    <button
                      key={m}
                      onClick={() => { if (!alreadyAdded) addIngredient(m); }}
                      disabled={alreadyAdded}
                      className={`inline-flex items-center gap-1 h-10 px-[14px] text-[14px] font-medium rounded-full border transition-colors bg-white ${
                        alreadyAdded
                          ? 'border-[#16A34A] text-[#16A34A] cursor-default'
                          : 'border-[#E5E5E5] text-[#111827] hover:border-[#16A34A] hover:text-[#16A34A]'
                      }`}
                    >
                      {alreadyAdded ? '✓' : '＋'} {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 材料 */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
        <h2 className="text-[16px] font-semibold text-[#111827] mb-4">材料（{recipe.servings}人前）</h2>
        <ul className="space-y-3">
          {recipe.ingredients.map((ing) => {
            const isMatched = loaded && matched.includes(ing);
            return (
              <li key={ing} className="flex items-center gap-3 text-[14px]">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 border ${
                  loaded && myIngredientNames.length > 0
                    ? isMatched
                      ? 'border-[#16A34A] text-[#16A34A]'
                      : 'border-[#E5E5E5] text-[#9CA3AF]'
                    : 'border-[#E5E5E5] text-[#9CA3AF]'
                }`}>
                  {loaded && myIngredientNames.length > 0 ? (isMatched ? '✓' : '·') : '·'}
                </span>
                <span className={
                  isMatched && myIngredientNames.length > 0
                    ? 'text-[#111827] font-medium'
                    : 'text-[#6B7280]'
                }>
                  {ing}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 作り方 */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
        <h2 className="text-[16px] font-semibold text-[#111827] mb-4">作り方</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 border border-[#16A34A] text-[#16A34A] text-[12px] font-semibold rounded-full flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-[14px] text-[#374151] leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
