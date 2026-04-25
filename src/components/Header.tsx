import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-800 hover:text-emerald-600 transition-colors">
          <span className="text-2xl">🧊</span>
          <span>フリッジレシピ</span>
        </Link>
        <p className="text-xs text-gray-400 hidden sm:block">冷蔵庫の食材からレシピを探そう</p>
      </div>
    </header>
  );
}
