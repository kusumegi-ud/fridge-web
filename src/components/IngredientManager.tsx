'use client';

import { useState, KeyboardEvent } from 'react';
import { Ingredient } from '@/types';

interface Props {
  ingredients: Ingredient[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function IngredientManager({ ingredients, onAdd, onRemove, onClear }: Props) {
  const [input, setInput] = useState('');

  const submit = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">🧊 冷蔵庫の食材</h2>
        {ingredients.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            すべて削除
          </button>
        )}
      </div>

      {/* 入力フォーム */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="例：鶏もも肉、卵、豆腐..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
        />
        <button
          onClick={submit}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          追加
        </button>
      </div>

      {/* 食材タグ一覧 */}
      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          食材を登録するとレシピをフィルタリングできます
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <span
              key={ing.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full border border-emerald-200"
            >
              {ing.name}
              <button
                onClick={() => onRemove(ing.id)}
                className="ml-1 text-emerald-400 hover:text-emerald-700 leading-none"
                aria-label={`${ing.name}を削除`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
