'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: '料理検索', icon: '🍳' },
  { href: '/shopping', label: '買い物リスト', icon: '🛒' },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14">
        {TABS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-emerald-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span className={`text-[11px] font-medium ${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
