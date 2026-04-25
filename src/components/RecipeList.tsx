'use client';

import { Recipe } from '@/types';
import RecipeCard from './RecipeCard';

interface Props {
  recipes: Recipe[];
  myIngredients: string[];
}

export default function RecipeList({ recipes, myIngredients }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-gray-500 font-medium">条件に合うレシピが見つかりませんでした</p>
        <p className="text-sm text-gray-400 mt-1">フィルターを変更してみてください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} myIngredients={myIngredients} />
      ))}
    </div>
  );
}
