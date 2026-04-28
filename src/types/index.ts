export interface Recipe {
  id: number;
  name: string;
  category: 'japanese' | 'western' | 'chinese';
  ingredients: string[];
  steps: string[];
  cookTime: number;
  servings: number;
  description: string;
  calories: number;
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

export type CookTimeFilter = 'any' | 'under15' | 'under30' | 'over30';
export type CategoryFilter = 'all' | 'japanese' | 'western' | 'chinese';

export interface ShoppingItem {
  name: string;
  type: 'missing' | 'added';
  checked: boolean;
}
