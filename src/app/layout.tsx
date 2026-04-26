import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingListProvider } from '@/contexts/ShoppingListContext';

export const metadata: Metadata = {
  title: 'フリッジレシピ',
  description: '冷蔵庫の食材からレシピを探そう',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased">
        <ShoppingListProvider>
          <Header />
          <div style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
            {children}
          </div>
          <Footer />
        </ShoppingListProvider>
      </body>
    </html>
  );
}
