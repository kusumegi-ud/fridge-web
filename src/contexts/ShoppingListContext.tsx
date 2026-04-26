'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CtxValue {
  items: string[];
  addItem: (name: string) => void;
  addItems: (names: string[]) => void;
  removeItem: (name: string) => void;
  clearAll: () => void;
}

const ShoppingListContext = createContext<CtxValue | null>(null);
const STORAGE_KEY = 'fridge-shopping-list';

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const addItem = (name: string) =>
    setItems((prev) => {
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });

  const addItems = (names: string[]) =>
    setItems((prev) => {
      const fresh = names.filter((n) => !prev.includes(n));
      if (!fresh.length) return prev;
      const next = [...prev, ...fresh];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });

  const removeItem = (name: string) =>
    setItems((prev) => {
      const next = prev.filter((i) => i !== name);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });

  const clearAll = () => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <ShoppingListContext.Provider value={{ items, addItem, addItems, removeItem, clearAll }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error('useShoppingList must be used within ShoppingListProvider');
  return ctx;
}
