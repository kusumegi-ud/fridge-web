'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import IngredientIcon from './icons/IngredientIcon';

/** ひらがな → カタカナ変換（マッチング正規化用） */
function toKatakana(str: string): string {
  return str.replace(/[ぁ-ゖ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  );
}

function normalize(str: string): string {
  return toKatakana(str.trim());
}

interface Props {
  /** レシピから抽出した食材候補リスト */
  candidates: string[];
  /** 既に登録済みの食材名セット（重複チェック用） */
  addedNames: Set<string>;
  onAdd: (name: string) => void;
  /** 重複登録しようとしたときに呼ばれる */
  onDuplicate: (name: string) => void;
}

export default function AddIngredientInput({ candidates, addedNames, onAdd, onDuplicate }: Props) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const norm = normalize(input);
    const prefix = candidates.filter(
      (c) => normalize(c).startsWith(norm) && !addedNames.has(c)
    );
    const contains = candidates.filter(
      (c) => !normalize(c).startsWith(norm) && normalize(c).includes(norm) && !addedNames.has(c)
    );
    const next = [...prefix, ...contains].slice(0, 5);
    setSuggestions(next);
    setOpen(next.length > 0);
  }, [input, candidates, addedNames]);

  const commit = (name?: string) => {
    const trimmed = (name ?? input).trim();
    if (!trimmed) return;
    if (addedNames.has(trimmed)) {
      onDuplicate(trimmed);
    } else {
      onAdd(trimmed);
    }
    setInput('');
    setSuggestions([]);
    setOpen(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div className="border border-[#E5E7EB] rounded-2xl p-3 bg-white">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="例：豆腐、卵 などを追加..."
            className="w-full h-11 px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#16A34A] transition-colors bg-white"
          />

          {/* サジェストドロップダウン */}
          {open && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-sm z-20 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => commit(s)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#111827] hover:bg-[#F9FAFB] active:bg-green-50 text-left transition-colors"
                >
                  <IngredientIcon name={s} size={20} />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => commit()}
          className="shrink-0 h-11 px-5 bg-[#16A34A] active:bg-green-800 text-white text-[14px] font-semibold rounded-full transition-colors"
        >
          追加
        </button>
      </div>
    </div>
  );
}
