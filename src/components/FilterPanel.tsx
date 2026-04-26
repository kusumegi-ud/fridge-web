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
  { key: 'all',      label: 'すべて' },
  { key: 'japanese', label: '和食' },
  { key: 'western',  label: '洋食' },
  { key: 'chinese',  label: '中華' },
];

const COOK_TIME_OPTIONS: { key: CookTimeFilter; label: string }[] = [
  { key: 'any',      label: 'すべて' },
  { key: 'under15',  label: '15分以内' },
  { key: 'under30',  label: '30分以内' },
  { key: 'over30',   label: '30分以上' },
];

export default function FilterPanel({ filter, onChange, total, filtered }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilter =
    filter.category !== 'all' || filter.cookTime !== 'any' || filter.search !== '';

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl">
      {/* モバイル用トグルヘッダー */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-semibold text-[#111827] flex items-center gap-2">
          絞り込み
          {hasActiveFilter && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          )}
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[#6B7280]">
          <span>{filtered}/{total}件</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>

      {/* フィルター本体 */}
      <div className={`p-4 space-y-5 lg:block ${isOpen ? 'block' : 'hidden'}`}>
        {/* キーワード検索 */}
        <div>
          <p className="text-[12px] font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">
            キーワード
          </p>
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onChange({ ...filter, search: e.target.value })}
            placeholder="料理名・食材で検索"
            className="w-full h-10 px-[14px] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E5E5] rounded-full focus:outline-none focus:border-[#16A34A] transition-colors"
          />
        </div>

        {/* カテゴリ */}
        <div>
          <p className="text-[12px] font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">
            カテゴリ
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onChange({ ...filter, category: key })}
                className={`h-9 px-[14px] text-[14px] font-medium rounded-full border transition-colors ${
                  filter.category === key
                    ? 'border-[#16A34A] text-[#16A34A] bg-white'
                    : 'border-[#E5E5E5] text-[#111827] bg-white active:border-[#D1D5DB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 調理時間 */}
        <div>
          <p className="text-[12px] font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">
            調理時間
          </p>
          <div className="flex flex-wrap gap-2">
            {COOK_TIME_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onChange({ ...filter, cookTime: key })}
                className={`h-9 px-[14px] text-[14px] font-medium rounded-full border transition-colors ${
                  filter.cookTime === key
                    ? 'border-[#16A34A] text-[#16A34A] bg-white'
                    : 'border-[#E5E5E5] text-[#111827] bg-white active:border-[#D1D5DB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 件数（デスクトップのみ） */}
        <p className="text-[13px] text-[#6B7280] pt-2 border-t border-[#F3F4F6] hidden lg:block">
          {filtered === total ? `全 ${total} 件` : `${total} 件中 ${filtered} 件`}
        </p>
      </div>
    </div>
  );
}
