import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCatalog } from '@/components/catalog/product-catalog';

export const metadata = {
  title: 'Katalog Produk - DapurMama',
  description: 'Jelajahi koleksi lengkap dessert rumahan berkualitas dari DapurMama',
};

export default function KatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  );
}