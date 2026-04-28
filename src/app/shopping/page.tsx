'use client';

import { useState, KeyboardEvent } from 'react';
import { Icon } from '@iconify/react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingItem } from '@/types';
import IngredientIcon from '@/components/icons/IngredientIcon';

type Tab = 'all' | 'missing' | 'added';

function ItemRow({
  item,
  onToggle,
  onRemove,
  isLast,
}: {
  item: ShoppingItem;
  onToggle: () => void;
  onRemove: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${!isLast ? 'border-b border-[#F3F4F6]' : ''} ${item.checked ? 'opacity-40' : ''}`}
    >
      {/* 食材アイコン */}
      <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center shrink-0">
        <IngredientIcon name={item.name} size={26} />
      </div>

      {/* 食材名 */}
      <span className={`flex-1 text-[15px] font-medium ${item.checked ? 'text-[#9CA3AF]' : 'text-[#111827]'}`}>
        {item.name}
      </span>

      {/* 削除ボタン（長押し的な補助） */}
      <button
        onClick={onRemove}
        className="text-[#D1D5DB] text-[18px] leading-none px-1 hover:text-[#9CA3AF] transition-colors"
        aria-label={`${item.name}を削除`}
      >
        ×
      </button>

      {/* チェックボタン */}
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
          item.checked
            ? 'bg-[#16A34A] border-[#16A34A]'
            : 'bg-white border-[#D1D5DB] hover:border-[#16A34A]'
        }`}
        aria-label={item.checked ? 'チェックを外す' : 'チェックする'}
      >
        {item.checked && <Icon icon="mdi:check" width={16} height={16} className="text-white" />}
      </button>
    </div>
  );
}

export default function ShoppingPage() {
  const { items, addManualItem, removeItem, toggleChecked } = useShoppingList();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showAddInput, setShowAddInput] = useState(false);
  const [addInput, setAddInput] = useState('');

  const missingItems = items.filter((i) => i.type === 'missing');
  const addedItems = items.filter((i) => i.type === 'added');

  const tabCount: Record<Tab, number> = {
    all: items.length,
    missing: missingItems.length,
    added: addedItems.length,
  };

  const visibleMissing = activeTab === 'added' ? [] : missingItems;
  const visibleAdded = activeTab === 'missing' ? [] : addedItems;

  const handleAddManual = () => {
    const trimmed = addInput.trim();
    if (!trimmed) return;
    addManualItem(trimmed);
    setAddInput('');
    setShowAddInput(false);
  };

  const handleAddKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddManual();
    if (e.key === 'Escape') { setShowAddInput(false); setAddInput(''); }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── ヘッダー ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <h1 className="text-[18px] font-semibold text-[#111827]">買い物リスト</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-5">

        {/* ─── タブ ─── */}
        <div className="flex items-center bg-[#F3F4F6] rounded-full p-0.5">
          {(
            [
              { key: 'all', label: 'すべて' },
              { key: 'missing', label: '不足食材' },
              { key: 'added', label: '追加した食材' },
            ] as { key: Tab; label: string }[]
          ).map((tab, idx, arr) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 h-9 rounded-full text-[13px] font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#16A34A] text-white'
                  : 'text-[#6B7280]'
              } ${idx < arr.length - 1 && activeTab !== tab.key && activeTab !== arr[idx + 1].key ? 'border-r border-[#E5E7EB]' : ''}`}
            >
              {tab.label}
              <span className={`text-[12px] font-semibold ${activeTab === tab.key ? 'text-white' : 'text-[#9CA3AF]'}`}>
                ({tabCount[tab.key]})
              </span>
            </button>
          ))}
        </div>

        {/* ─── アイテムがない場合 ─── */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Icon icon="fluent-emoji-flat:shopping-bags" width={56} height={56} className="mb-4 opacity-60" />
            <p className="text-[15px] font-medium text-[#374151]">買い物リストは空です</p>
            <p className="text-[13px] text-[#9CA3AF] mt-1">レシピカードから不足食材を追加できます</p>
          </div>
        )}

        {/* ─── 不足している食材 ─── */}
        {visibleMissing.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <div>
                <h2 className="text-[15px] font-semibold text-[#111827]">不足している食材</h2>
                <p className="text-[12px] text-[#6B7280] mt-0.5">レシピを作るために必要な食材です</p>
              </div>
              <span className="ml-auto text-[12px] font-semibold text-[#16A34A] bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                {visibleMissing.length}
              </span>
            </div>

            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
              {visibleMissing.map((item, idx) => (
                <ItemRow
                  key={item.name}
                  item={item}
                  onToggle={() => toggleChecked(item.name)}
                  onRemove={() => removeItem(item.name)}
                  isLast={idx === visibleMissing.length - 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── 追加した食材 ─── */}
        {visibleAdded.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <div>
                <h2 className="text-[15px] font-semibold text-[#111827]">追加した食材</h2>
                <p className="text-[12px] text-[#6B7280] mt-0.5">レシピを見て追加した食材です</p>
              </div>
              <span className="ml-auto text-[12px] font-semibold text-[#16A34A] bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                {visibleAdded.length}
              </span>
            </div>

            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
              {visibleAdded.map((item, idx) => (
                <ItemRow
                  key={item.name}
                  item={item}
                  onToggle={() => toggleChecked(item.name)}
                  onRemove={() => removeItem(item.name)}
                  isLast={idx === visibleAdded.length - 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── 食材を追加する CTA ─── */}
        {showAddInput ? (
          <div className="flex items-center gap-2 w-full h-12 px-4 border-2 border-[#16A34A] rounded-full bg-white">
            <Icon icon="mdi:plus" width={18} height={18} className="text-[#16A34A] shrink-0" />
            <input
              autoFocus
              type="text"
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={handleAddKey}
              placeholder="食材名を入力..."
              className="flex-1 text-[14px] outline-none bg-transparent text-[#111827]"
            />
            <button
              onClick={handleAddManual}
              className="text-[14px] font-semibold text-[#16A34A] shrink-0"
            >
              追加
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="w-full h-12 flex items-center justify-center gap-2 border-2 border-[#16A34A] rounded-full bg-white text-[#16A34A] text-[14px] font-semibold active:bg-green-50 transition-colors"
          >
            <Icon icon="mdi:plus" width={18} height={18} />
            食材を追加する
          </button>
        )}

        {/* ─── 活用 Tips カード ─── */}
        <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-2xl px-4 py-4">
          <div className="flex-1">
            <p className="text-[14px] font-bold text-[#16A34A] leading-snug">
              リストを活用して、<br />買い物をもっと効率的に
            </p>
            <p className="text-[12px] text-[#4B7C5A] mt-1 leading-relaxed">
              不足食材をまとめて管理して、<br />お買い物をスムーズにしましょう。
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Icon icon="fluent-emoji-flat:shopping-bags" width={48} height={48} />
            <Icon icon="fluent-emoji-flat:leafy-green" width={36} height={36} className="-ml-3 mt-3" />
          </div>
        </div>

      </main>
    </div>
  );
}
