import Link from 'next/link';
import { Recipe } from '@/types';
import { getMatchedIngredients, getMissingIngredients } from '@/lib/recipeFilter';

interface Props {
  recipe: Recipe;
  myIngredients: string[];
}

const CATEGORY_BADGE: Record<Recipe['category'], { label: string; className: string }> = {
  japanese: { label: '和食', className: 'bg-red-50 text-red-600 border-red-200' },
  western: { label: '洋食', className: 'bg-blue-50 text-blue-600 border-blue-200' },
  chinese: { label: '中華', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
};

export default function RecipeCard({ recipe, myIngredients }: Props) {
  const matched = getMatchedIngredients(recipe, myIngredients);
  const missing = getMissingIngredients(recipe, myIngredients);
  const hasIngredients = myIngredients.length > 0;
  const matchRatio = hasIngredients ? matched.length / recipe.ingredients.length : 0;

  const { label: catLabel, className: catClass } = CATEGORY_BADGE[recipe.category];

  return (
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
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${matchRatio * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-emerald-600">
                {matched.length}/{recipe.ingredients.length}
              </span>
            </div>
            {missing.length > 0 && (
              <p className="text-xs text-gray-400">
                不足: {missing.slice(0, 3).join('・')}
                {missing.length > 3 && ` 他${missing.length - 3}品`}
              </p>
            )}
            {missing.length === 0 && (
              <p className="text-xs font-medium text-emerald-600">✓ すべての食材がそろっています</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
