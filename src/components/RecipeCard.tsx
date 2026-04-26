'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { getMatchedIngredients, getMissingIngredients } from '@/lib/recipeFilter';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import BottomSheet from './BottomSheet';

interface Props {
  recipe: Recipe;
  myIngredients: string[];
}

const CATEGORY_BADGE: Record<Recipe['category'], { label: string; className: string }> = {
  japanese: { label: '和食', className: 'bg-red-50 text-red-600 border-red-200' },
  western: { label: '洋食', className: 'bg-blue-50 text-blue-600 border-blue-200' },
  chinese: { label: '中華', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
};

const MAX_CHIPS = 3;

export default function RecipeCard({ recipe, myIngredients }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { items: shoppingList, addItem, addItems } = useShoppingList();

  const matched = getMatchedIngredients(recipe, myIngredients);
  const missing = getMissingIngredients(recipe, myIngredients);
  const hasIngredients = myIngredients.length > 0;
  const matchRatio = hasIngredients ? matched.length / recipe.ingredients.length : 0;

  const visibleMissing = missing.slice(0, MAX_CHIPS);
  const extraCount = missing.length - MAX_CHIPS;
  const notAddedItems = missing.filter((m) => !shoppingList.includes(m));

  const { label: catLabel, className: catClass } = CATEGORY_BADGE[recipe.category];

  const openSheet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSheetOpen(true);
  };

  return (
    <>
      <Link href={`/recipes/${recipe.id}`} className="block group">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-full hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.99]">
          {/* ヘッダ */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors leading-tight">
              {recipe.name}
            </h3>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${catClass}`}>
              {catLabel}
            </span>
          </div>

          {/* 説明文 */}
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
            <span>⏱ {recipe.cookTime}分</span>
            <span>👤 {recipe.servings}人前</span>
            <span>🔥 {recipe.calories}kcal</span>
          </div>

          {/* 食材マッチ状況 */}
          {hasIngredients && (
            <div className="mt-auto pt-3 border-t border-gray-50">
              {/* プログレスバー */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${matchRatio * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-emerald-600 shrink-0">
                  {matched.length}/{recipe.ingredients.length}
                </span>
              </div>

              {/* 不足食材チップ */}
              {missing.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {visibleMissing.map((m) => {
                    const inList = shoppingList.includes(m);
                    return (
                      <span
                        key={m}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                          inList
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                      >
                        {inList && <span className="text-[10px] font-bold">✓</span>}
                        {m}
                      </span>
                    );
                  })}
                  {extraCount > 0 && (
                    <button
                      onClick={openSheet}
                      className="text-xs text-gray-400 border border-gray-200 rounded-full px-2.5 py-0.5 active:bg-gray-50 shrink-0 hover:border-emerald-300 hover:text-emerald-500 transition-colors"
                    >
                      他{extraCount}品 ▼
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs font-medium text-emerald-600">✓ すべての食材がそろっています</p>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* 不足食材ボトムシート */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={`不足している食材（あと${missing.length}品）`}
      >
        <ul className="space-y-1 mb-6">
          {missing.map((m) => {
            const inList = shoppingList.includes(m);
            return (
              <li
                key={m}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  {inList && <span className="text-emerald-500 text-sm font-bold">✓</span>}
                  <span className={`text-sm ${inList ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {m}
                  </span>
                </div>
                <button
                  onClick={() => { if (!inList) addItem(m); }}
                  disabled={inList}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors shrink-0 ml-3 ${
                    inList
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : 'bg-emerald-500 text-white active:bg-emerald-700'
                  }`}
                >
                  {inList ? '追加済み' : '追加'}
                </button>
              </li>
            );
          })}
        </ul>

        {notAddedItems.length > 0 && (
          <button
            onClick={() => addItems(notAddedItems)}
            className="w-full py-3.5 bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors"
          >
            すべてまとめて追加（{notAddedItems.length}品）
          </button>
        )}
      </BottomSheet>
    </>
  );
}
