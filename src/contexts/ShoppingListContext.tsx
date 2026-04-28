'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShoppingItem } from '@/types';

interface CtxValue {
  items: ShoppingItem[];
  addMissingItem: (name: string) => void;
  addMissingItems: (names: string[]) => void;
  addManualItem: (name: string) => void;
  removeItem: (name: string) => void;
  toggleChecked: (name: string) => void;
  clearAll: () => void;
  hasItem: (name: string) => boolean;
  // Backward-compat aliases used by RecipeCard
  addItem: (name: string) => void;
  addItems: (names: string[]) => void;
}

const ShoppingListContext = createContext<CtxValue | null>(null);
const STORAGE_KEY = 'fridge-shopping-list-v2';

function persist(next: ShoppingItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
}

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const addMissingItem = (name: string) =>
    setItems((prev) => {
      if (prev.some((i) => i.name === name)) return prev;
      const next = [...prev, { name, type: 'missing' as const, checked: false }];
      persist(next);
      return next;
    });

  const addMissingItems = (names: string[]) =>
    setItems((prev) => {
      const fresh = names.filter((n) => !prev.some((i) => i.name === n));
      if (!fresh.length) return prev;
      const next = [...prev, ...fresh.map((n) => ({ name: n, type: 'missing' as const, checked: false }))];
      persist(next);
      return next;
    });

  const addManualItem = (name: string) =>
    setItems((prev) => {
      if (prev.some((i) => i.name === name)) return prev;
      const next = [...prev, { name, type: 'added' as const, checked: false }];
      persist(next);
      return next;
    });

  const removeItem = (name: string) =>
    setItems((prev) => {
      const next = prev.filter((i) => i.name !== name);
      persist(next);
      return next;
    });

  const toggleChecked = (name: string) =>
    setItems((prev) => {
      const next = prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i));
      persist(next);
      return next;
    });

  const clearAll = () => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const hasItem = (name: string) => items.some((i) => i.name === name);

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        addMissingItem,
        addMissingItems,
        addManualItem,
        removeItem,
        toggleChecked,
        clearAll,
        hasItem,
        addItem: addMissingItem,
        addItems: addMissingItems,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error('useShoppingList must be used within ShoppingListProvider');
  return ctx;
}
