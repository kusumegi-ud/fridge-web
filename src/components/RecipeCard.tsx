'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Recipe } from '@/types';
import { getMatchedIngredients, getMissingIngredients } from '@/lib/recipeFilter';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import BottomSheet from './BottomSheet';
import IngredientIcon from './icons/IngredientIcon';

interface Props {
  recipe: Recipe;
  myIngredients: string[];
}

const CATEGORY_BADGE: Record<Recipe['category'], { label: string; className: string }> = {
  japanese: { label: '和食', className: 'border-[#E5E5E5] text-[#6B7280]' },
  western:  { label: '洋食', className: 'border-[#E5E5E5] text-[#6B7280]' },
  chinese:  { label: '中華', className: 'border-[#E5E5E5] text-[#6B7280]' },
};

const MAX_VISIBLE = 4;

export default function RecipeCard({ recipe, myIngredients }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { hasItem, addItem, addItems } = useShoppingList();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const matched = getMatchedIngredients(recipe, myIngredients);
  const missing = getMissingIngredients(recipe, myIngredients);
  const hasIngredients = myIngredients.length > 0;
  const matchRatio = hasIngredients ? matched.length / recipe.ingredients.length : 0;
  const caloriesPerServing = Math.round(recipe.calories / recipe.servings);

  // 持っている食材を先に、不足食材を後に、合計MAX_VISIBLE個表示
  const matchedSlot = Math.min(matched.length, Math.ceil(MAX_VISIBLE / 2));
  const missingSlot = Math.min(missing.length, MAX_VISIBLE - matchedSlot);
  const visibleMatched = matched.slice(0, matchedSlot);
  const visibleMissing = missing.slice(0, missingSlot);
  const extraCount = recipe.ingredients.length - visibleMatched.length - visibleMissing.length;
  const notAddedItems = missing.filter((m) => !hasItem(m));

  const { label: catLabel, className: catClass } = CATEGORY_BADGE[recipe.category];

  const openSheet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSheetOpen(true);
  };

  return (
    <>
      {/* トースト通知 */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-[#111827] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none whitespace-nowrap flex items-center gap-1.5">
          <Icon icon="mdi:check-circle-outline" width={16} height={16} className="text-[#4ADE80]" />
          {toast}
        </div>
      )}

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
            <span>{caloriesPerServing}kcal/人</span>
          </div>

          {/* 食材マッチ状況 */}
          {hasIngredients && (
            <div className="pt-3 border-t border-[#F3F4F6]">
              {/* プログレスバー */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all"
                    style={{ width: `${matchRatio * 100}%` }}
                  />
                </div>
                <span className="text-[12px] font-medium text-[#111827] shrink-0">
                  {matched.length}/{recipe.ingredients.length}
                  <span className="text-[#6B7280] font-normal ml-1">食材が揃っています</span>
                </span>
              </div>

              {/* 食材チップ（持っている→緑✓、不足→グレー!） */}
              {missing.length > 0 ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {visibleMatched.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1 text-[12px] font-medium h-7 px-3 rounded-full border bg-green-50 border-[#16A34A] text-[#16A34A]"
                      >
                        <Icon icon="mdi:check-circle" width={13} height={13} />
                        {m}
                      </span>
                    ))}
                    {visibleMissing.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1 text-[12px] font-medium h-7 px-3 rounded-full border bg-white border-[#E5E5E5] text-[#6B7280]"
                      >
                        <Icon icon="mdi:alert-circle-outline" width={13} height={13} className="text-[#F59E0B]" />
                        {m}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <button
                        onClick={openSheet}
                        className="inline-flex items-center gap-0.5 text-[12px] font-medium h-7 px-3 bg-white border border-[#E5E5E5] text-[#6B7280] rounded-full transition-colors active:border-[#D1D5DB]"
                      >
                        他{extraCount}品
                        <Icon icon="mdi:chevron-down" width={14} height={14} />
                      </button>
                    )}
                  </div>

                  {/* 買い物リストへ追加 CTA */}
                  <button
                    onClick={openSheet}
                    className="w-full flex items-center gap-2 mt-1 pt-2 border-t border-[#F3F4F6] text-[13px] text-[#6B7280] active:text-[#374151]"
                  >
                    <Icon icon="mdi:cart-outline" width={16} height={16} className="shrink-0" />
                    <span className="flex-1 text-left">不足食材を買い物リストに追加</span>
                    <Icon icon="mdi:chevron-right" width={16} height={16} className="shrink-0" />
                  </button>
                </>
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
        title={`不足している食材（${missing.length}品）`}
        subtitle={`このレシピを作るには、あと${missing.length}品必要です。`}
      >
        <ul className="space-y-1 mb-6">
          {missing.map((m) => {
            const inList = hasItem(m);
            return (
              <li
                key={m}
                className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center shrink-0">
                    <IngredientIcon name={m} size={22} />
                  </div>
                  <span className={`text-[14px] font-medium ${inList ? 'text-[#16A34A]' : 'text-[#111827]'}`}>
                    {m}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (!inList) {
                      addItem(m);
                      setToast(`「${m}」をリストに追加しました`);
                    }
                  }}
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
            onClick={() => {
              addItems(notAddedItems);
              setToast(`${notAddedItems.length}品をリストに追加しました`);
            }}
            className="w-full h-12 bg-[#16A34A] active:bg-green-800 text-white text-[15px] font-semibold rounded-full transition-colors"
          >
            すべてまとめて追加（{notAddedItems.length}品）
          </button>
        )}
      </BottomSheet>
    </>
  );
}
