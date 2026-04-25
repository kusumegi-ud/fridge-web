export interface Recipe {
  id: number;
  name: string;
  category: 'japanese' | 'western' | 'chinese';
  ingredients: string[];
  steps: string[];
  cookTime: number;
  servings: number;
  description: string;
  flags: {
    quick: boolean;
    leftover: boolean;
    mealprep: boolean;
    single: boolean;
  };
}

export interface Ingredient {
  id: string;
  name: string;
  addedAt: number;
}

export type FilterFlag = 'quick' | 'leftover' | 'mealprep' | 'single';
export type CategoryFilter = 'all' | 'japanese' | 'western' | 'chinese';
