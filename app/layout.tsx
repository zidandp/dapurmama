import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/components/providers/cart-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DapurMama - Dessert Rumahan Terenak',
  description: 'Katalog dan pemesanan dessert rumahan berkualitas dari DapurMama. Kue, brownies, bolu dan dessert lezat lainnya.',
  keywords: ['dessert rumahan', 'kue', 'brownies', 'bolu', 'DapurMama', 'pemesanan online'],
  authors: [{ name: 'DapurMama' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}