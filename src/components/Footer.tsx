'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

const TABS = [
  { href: '/',         label: '料理検索',    icon: 'mdi:magnify',        activeIcon: 'mdi:magnify' },
  { href: '/shopping', label: '買い物リスト', icon: 'mdi:shopping-outline', activeIcon: 'mdi:shopping' },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E5E7EB]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-md mx-auto flex h-14">
        {TABS.map(({ href, label, icon, activeIcon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-[#16A34A]' : 'text-[#9CA3AF]'
              }`}
            >
              <Icon
                icon={isActive ? activeIcon : icon}
                width={24}
                height={24}
              />
              <span className={`text-[11px] font-medium ${isActive ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-10 h-0.5 bg-[#16A34A] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
