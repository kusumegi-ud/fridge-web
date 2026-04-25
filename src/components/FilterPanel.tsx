'use client';

import { FilterFlag, CategoryFilter } from '@/types';
import { FilterState } from '@/lib/recipeFilter';

interface Props {
  filter: FilterState;
  onChange: (next: FilterState) => void;
  total: number;
  filtered: number;
}

const FLAG_LABELS: { key: FilterFlag; label: string; emoji: string; desc: string }[] = [
  { key: 'quick', label: '時短', emoji: '⚡', desc: '20分以内' },
  { key: 'leftover', label: '余り食材', emoji: '♻️', desc: '残り物活用' },
  { key: 'mealprep', label: '作り置き', emoji: '📦', desc: 'まとめて調理' },
  { key: 'single', label: '一人前', emoji: '🍽️', desc: '少量OK' },
];

const CATEGORY_LABELS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'japanese', label: '和食' },
  { key: 'western', label: '洋食' },
  { key: 'chinese', label: '中華' },
];

export default function FilterPanel({ filter, onChange, total, filtered }: Props) {
  const toggleFlag = (flag: FilterFlag) => {
    const next = filter.flags.includes(flag)
      ? filter.flags.filter((f) => f !== flag)
      : [...filter.flags, flag];
    onChange({ ...filter, flags: next });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* 検索 */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          キーワード検索
        </label>
        <input
          type="text"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          placeholder="料理名・食材で検索"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* カテゴリ */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          カテゴリ
        </label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChange({ ...filter, category: key })}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                filter.category === key
                  ? 'bg-emerald-500 border-emerald-500 text-white font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* フラグフィルター */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          絞り込み
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FLAG_LABELS.map(({ key, label, emoji, desc }) => {
            const active = filter.flags.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleFlag(key)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                  active
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                }`}
              >
                <span>{emoji}</span>
                <span>
                  <span className="block font-medium leading-tight">{label}</span>
                  <span className="block text-xs text-gray-400 leading-tight">{desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 件数表示 */}
      <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
        {filtered === total
          ? `全 ${total} 件`
          : `${total} 件中 ${filtered} 件を表示中`}
      </p>
    </div>
  );
}
