import { Recipe, FilterFlag, CategoryFilter } from '@/types';

export interface FilterState {
  category: CategoryFilter;
  flags: FilterFlag[];
  search: string;
}

export function filterRecipes(
  recipes: Recipe[],
  myIngredients: string[],
  filter: FilterState,
  matchMode: 'any' | 'all' = 'any',
): Recipe[] {
  return recipes
    .filter((recipe) => {
      // カテゴリフィルター
      if (filter.category !== 'all' && recipe.category !== filter.category) return false;

      // テキスト検索
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const hit =
          recipe.name.toLowerCase().includes(q) ||
          recipe.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!hit) return false;
      }

      // フラグフィルター（選択したすべてのフラグを満たす）
      if (filter.flags.length > 0) {
        const pass = filter.flags.every((f) => recipe.flags[f]);
        if (!pass) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 手持ち食材にマッチする数が多い順にソート
      const scoreA = matchScore(a, myIngredients);
      const scoreB = matchScore(b, myIngredients);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.id - b.id;
    });
}

function matchScore(recipe: Recipe, myIngredients: string[]): number {
  if (myIngredients.length === 0) return 0;
  const lowerMine = myIngredients.map((i) => i.toLowerCase());
  return recipe.ingredients.filter((ing) =>
    lowerMine.some((m) => ing.toLowerCase().includes(m) || m.includes(ing.toLowerCase())),
  ).length;
}

export function getMatchedIngredients(recipe: Recipe, myIngredients: string[]): string[] {
  const lowerMine = myIngredients.map((i) => i.toLowerCase());
  return recipe.ingredients.filter((ing) =>
    lowerMine.some((m) => ing.toLowerCase().includes(m) || m.includes(ing.toLowerCase())),
  );
}

export function getMissingIngredients(recipe: Recipe, myIngredients: string[]): string[] {
  const lowerMine = myIngredients.map((i) => i.toLowerCase());
  return recipe.ingredients.filter(
    (ing) => !lowerMine.some((m) => ing.toLowerCase().includes(m) || m.includes(ing.toLowerCase())),
  );
}
