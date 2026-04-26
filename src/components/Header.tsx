import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-[16px] font-semibold text-[#111827] hover:text-[#16A34A] transition-colors">
          フリッジレシピ
        </Link>
        <p className="text-[13px] text-[#6B7280] hidden sm:block">冷蔵庫の食材からレシピを探そう</p>
      </div>
    </header>
  );
}
