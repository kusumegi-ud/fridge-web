'use client';

import { useState } from 'react';
import { CookTimeFilter, CategoryFilter } from '@/types';
import { FilterState } from '@/lib/recipeFilter';

interface Props {
  filter: FilterState;
  onChange: (next: FilterState) => void;
  total: number;
  filtered: number;
}

const CATEGORY_LABELS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'japanese', label: '和食' },
  { key: 'western', label: '洋食' },
  { key: 'chinese', label: '中華' },
];

const COOK_TIME_OPTIONS: { key: CookTimeFilter; label: string }[] = [
  { key: 'any', label: 'すべて' },
  { key: 'under15', label: '15分以内' },
  { key: 'under30', label: '30分以内' },
  { key: 'over30', label: '30分以上' },
];

export default function FilterPanel({ filter, onChange, total, filtered }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilter =
    filter.category !== 'all' || filter.cookTime !== 'any' || filter.search !== '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* モバイル用トグルヘッダー */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-700 text-sm flex items-center gap-2">
          絞り込み
          {hasActiveFilter && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-400">
          <span>{filtered}/{total}件</span>
          <span className="text-gray-300">{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>

      {/* フィルター本体 */}
      <div className={`p-4 space-y-4 lg:block ${isOpen ? 'block' : 'hidden'}`}>
        {/* キーワード検索 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            キーワード
          </label>
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onChange({ ...filter, search: e.target.value })}
            placeholder="料理名・食材で検索"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            カテゴリ
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORY_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onChange({ ...filter, category: key })}
                className={`py-2 text-sm rounded-xl border transition-colors ${
                  filter.category === key
                    ? 'bg-emerald-500 border-emerald-500 text-white font-medium'
                    : 'bg-white border-gray-200 text-gray-600 active:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 調理時間 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            調理時間
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {COOK_TIME_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onChange({ ...filter, cookTime: key })}
                className={`py-2 text-sm rounded-xl border transition-colors ${
                  filter.cookTime === key
                    ? 'bg-emerald-500 border-emerald-500 text-white font-medium'
                    : 'bg-white border-gray-200 text-gray-600 active:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 件数表示（デスクトップのみ） */}
        <p className="text-xs text-gray-400 pt-1 border-t border-gray-100 hidden lg:block">
          {filtered === total
            ? `全 ${total} 件`
            : `${total} 件中 ${filtered} 件を表示中`}
        </p>
      </div>
    </div>
  );
}
