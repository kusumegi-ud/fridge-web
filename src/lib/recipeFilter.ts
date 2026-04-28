import { Recipe, CookTimeFilter, CategoryFilter } from '@/types';

export interface FilterState {
  category: CategoryFilter;
  cookTime: CookTimeFilter;
  search: string;
}

export function filterRecipes(
  recipes: Recipe[],
  myIngredients: string[],
  filter: FilterState,
): Recipe[] {
  if (myIngredients.length === 0) return [];
  return recipes
    .filter((recipe) => {
      if (filter.category !== 'all' && recipe.category !== filter.category) return false;

      if (filter.search) {
        const q = filter.search.toLowerCase();
        const hit =
          recipe.name.toLowerCase().includes(q) ||
          recipe.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!hit) return false;
      }

      if (filter.cookTime === 'under15' && recipe.cookTime > 15) return false;
      if (filter.cookTime === 'under30' && recipe.cookTime > 30) return false;
      if (filter.cookTime === 'over30' && recipe.cookTime <= 30) return false;

      return true;
    })
    .sort((a, b) => {
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
