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
  japanese: { label: '和食', className: 'border-[#E5E5E5] text-[#6B7280]' },
  western:  { label: '洋食', className: 'border-[#E5E5E5] text-[#6B7280]' },
  chinese:  { label: '中華', className: 'border-[#E5E5E5] text-[#6B7280]' },
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
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 h-full transition-colors active:bg-[#FAFAFA]">
          {/* ヘッダ */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[15px] font-semibold text-[#111827] leading-tight">
              {recipe.name}
            </h3>
            <span className={`shrink-0 text-[12px] h-6 px-3 rounded-full border flex items-center ${catClass}`}>
              {catLabel}
            </span>
          </div>

          {/* 説明文 */}
          <p className="text-[13px] text-[#6B7280] mb-3 line-clamp-2">{recipe.description}</p>

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#6B7280] mb-3">
            <span>{recipe.cookTime}分</span>
            <span>{recipe.servings}人前</span>
            <span>{recipe.calories}kcal</span>
          </div>

          {/* 食材マッチ状況 */}
          {hasIngredients && (
            <div className="pt-3 border-t border-[#F3F4F6]">
              {/* プログレスバー */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all"
                    style={{ width: `${matchRatio * 100}%` }}
                  />
                </div>
                <span className="text-[12px] font-medium text-[#6B7280] shrink-0">
                  {matched.length}/{recipe.ingredients.length}
                </span>
              </div>

              {/* 不足食材チップ */}
              {missing.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {visibleMissing.map((m) => {
                    const inList = shoppingList.includes(m);
                    return (
                      <span
                        key={m}
                        className={`inline-flex items-center gap-1 text-[12px] font-medium h-7 px-3 rounded-full border ${
                          inList
                            ? 'bg-white border-[#16A34A] text-[#16A34A]'
                            : 'bg-white border-[#E5E5E5] text-[#6B7280]'
                        }`}
                      >
                        {inList && <span className="text-[10px]">✓</span>}
                        {m}
                      </span>
                    );
                  })}
                  {extraCount > 0 && (
                    <button
                      onClick={openSheet}
                      className="text-[12px] font-medium h-7 px-3 bg-white border border-[#E5E5E5] text-[#6B7280] rounded-full transition-colors active:border-[#D1D5DB]"
                    >
                      他{extraCount}品
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-[13px] font-medium text-[#16A34A]">✓ すべての食材がそろっています</p>
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
                className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-0"
              >
                <div className="flex items-center gap-2">
                  {inList && <span className="text-[#16A34A] text-[13px] font-bold">✓</span>}
                  <span className={`text-[14px] ${inList ? 'text-[#16A34A]' : 'text-[#111827]'}`}>
                    {m}
                  </span>
                </div>
                <button
                  onClick={() => { if (!inList) addItem(m); }}
                  disabled={inList}
                  className={`text-[13px] font-medium h-8 px-4 rounded-full transition-colors shrink-0 ml-3 border ${
                    inList
                      ? 'border-[#E5E5E5] text-[#9CA3AF] cursor-default'
                      : 'border-[#16A34A] text-[#16A34A] active:bg-green-50'
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
            className="w-full h-12 bg-[#16A34A] active:bg-green-800 text-white text-[15px] font-semibold rounded-full transition-colors"
          >
            すべてまとめて追加（{notAddedItems.length}品）
          </button>
        )}
      </BottomSheet>
    </>
  );
}
