'use client';

import { useShoppingList } from '@/contexts/ShoppingListContext';

export default function ShoppingPage() {
  const { items, removeItem, clearAll } = useShoppingList();

  return (
    <main className="max-w-3xl mx-auto px-3 py-4 lg:px-4 lg:py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-gray-800">🛒 買い物リスト</h1>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
          >
            すべて削除
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <span className="text-5xl mb-4">🛒</span>
          <p className="text-gray-600 font-medium">買い物リストは空です</p>
          <p className="text-sm text-gray-400 mt-2">
            レシピカードの不足食材から追加できます
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
              <button
                onClick={() => removeItem(item)}
                className="text-gray-300 hover:text-gray-500 text-xl leading-none ml-3"
                aria-label={`${item}を削除`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
