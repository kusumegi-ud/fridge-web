'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/types';

const STORAGE_KEY = 'fridge-ingredients';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIngredients(JSON.parse(raw));
    } catch {
      // localStorage unavailable
    }
    setLoaded(true);
  }, []);

  const persist = (next: Ingredient[]) => {
    setIngredients(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // quota exceeded etc.
    }
  };

  const addIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (ingredients.some((i) => i.name === trimmed)) return;
    persist([...ingredients, { id: Date.now().toString(), name: trimmed, addedAt: Date.now() }]);
  };

  const removeIngredient = (id: string) => {
    persist(ingredients.filter((i) => i.id !== id));
  };

  const clearAll = () => persist([]);

  return { ingredients, addIngredient, removeIngredient, clearAll, loaded };
}
