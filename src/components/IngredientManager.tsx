'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { Ingredient } from '@/types';

interface Props {
  ingredients: Ingredient[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const COMMON_INGREDIENTS = [
  { name: '卵',      icon: '🥚' },
  { name: '玉ねぎ',  icon: '🧅' },
  { name: '鶏もも肉', icon: '🍗' },
  { name: '豆腐',    icon: '🫘' },
  { name: 'にんじん', icon: '🥕' },
  { name: 'じゃがいも', icon: '🥔' },
  { name: 'キャベツ', icon: '🥬' },
  { name: '豚バラ肉', icon: '🥩' },
  { name: '長ねぎ',  icon: '🌿' },
  { name: '生姜',    icon: '🌱' },
  { name: 'にんにく', icon: '🧄' },
  { name: 'ご飯',    icon: '🍚' },
  { name: '豚ひき肉', icon: '🥩' },
  { name: '牛乳',    icon: '🥛' },
  { name: 'バター',  icon: '🧈' },
  { name: 'ベーコン', icon: '🥓' },
  { name: 'もやし',  icon: '🌾' },
  { name: '鶏むね肉', icon: '🍗' },
  { name: '豆板醤',  icon: '🌶️' },
  { name: 'ごま油',  icon: '🫙' },
] as const;

const INITIAL_COUNT = 8;

export default function IngredientManager({ ingredients, onAdd, onRemove, onClear }: Props) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const recognitionRef = useRef<any>(null);

  const addedNames = new Set(ingredients.map((i) => i.name));

  const submit = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  const handleQuickAdd = (name: string) => {
    if (addedNames.has(name)) {
      const ing = ingredients.find((i) => i.name === name);
      if (ing) onRemove(ing.id);
    } else {
      onAdd(name);
    }
  };

  const startVoiceInput = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('このブラウザは音声入力に対応していません');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      transcript.split(/[、,，\s]+/).forEach((word) => {
        const trimmed = word.trim();
        if (trimmed) onAdd(trimmed);
      });
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  const displayItems = showAll
    ? COMMON_INGREDIENTS
    : COMMON_INGREDIENTS.slice(0, INITIAL_COUNT);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">🧊 冷蔵庫の食材</h2>
        {ingredients.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
          >
            すべて削除
          </button>
        )}
      </div>

      {/* ── 1. テキスト入力 + 音声入力 ── */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="例：えび、ほうれん草..."
            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          />
          <button
            onClick={startVoiceInput}
            title={isListening ? '録音中（タップで停止）' : '音声入力'}
            className={`
              shrink-0 w-11 h-11 flex items-center justify-center
              rounded-xl border transition-colors
              ${isListening
                ? 'bg-red-500 border-red-500 text-white animate-pulse'
                : 'bg-white border-gray-200 text-gray-500 active:bg-gray-50'
              }
            `}
          >
            🎤
          </button>
          <button
            onClick={submit}
            className="shrink-0 px-4 py-2.5 bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            追加
          </button>
        </div>
        {isListening && (
          <p className="text-xs text-red-500 mt-2 animate-pulse">
            🎤 聞き取り中… 食材名を話してください
          </p>
        )}
      </div>

      {/* ── 2. よく使う食材 ── */}
      <div className="mb-4">
        {/* セクションヘッダー */}
        <div className="flex items-start justify-between mb-2.5">
          <div>
            <p className="text-sm font-semibold text-gray-700 leading-tight">よく使う食材</p>
            <p className="text-xs text-gray-400 mt-0.5">タップしてすぐ記録できます</p>
          </div>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs text-emerald-500 active:text-emerald-700 transition-colors mt-0.5 ml-3 shrink-0"
          >
            {showAll ? '閉じる' : 'すべて見る →'}
          </button>
        </div>

        {/* チップスクロールエリア */}
        <div className="relative">
          <div className="overflow-x-auto no-scrollbar">
            <div
              className="grid gap-x-2 gap-y-1.5"
              style={{
                gridTemplateRows: 'repeat(2, auto)',
                gridAutoFlow: 'column',
                width: 'max-content',
              }}
            >
              {displayItems.map(({ name, icon }) => {
                const isAdded = addedNames.has(name);
                return (
                  <button
                    key={name}
                    onClick={() => handleQuickAdd(name)}
                    className={`
                      inline-flex items-center gap-1.5
                      h-9 px-3
                      rounded-full border
                      text-xs whitespace-nowrap
                      transition-all duration-150
                      ${isAdded
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700 active:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-sm leading-none">{icon}</span>
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右端フェード + 矢印（初期表示時のみ） */}
          {!showAll && (
            <div
              className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none flex items-center justify-end"
              style={{ background: 'linear-gradient(to left, white 40%, transparent)' }}
            >
              <span className="text-gray-300 text-xs mr-0.5">›</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 登録済み食材タグ ── */}
      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">
          食材を登録するとレシピをフィルタリングできます
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {ingredients.map((ing) => (
            <span
              key={ing.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full border border-emerald-200"
            >
              {ing.name}
              <button
                onClick={() => onRemove(ing.id)}
                className="ml-0.5 text-emerald-400 hover:text-emerald-700 leading-none text-base"
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
