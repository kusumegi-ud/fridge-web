'use client';

import { useEffect, ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, subtitle, children }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* シート本体 */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[75vh] flex flex-col animate-slide-up">
        {/* ハンドル */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* ヘッダー */}
        <div className="flex items-start justify-between px-5 py-3 shrink-0 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
            {subtitle && <p className="text-[12px] text-[#6B7280] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-[16px] leading-none active:bg-[#E5E7EB] shrink-0 ml-3"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* スクロール可能なコンテンツ */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
