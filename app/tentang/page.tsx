import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AboutContent } from '@/components/about/about-content';

export const metadata = {
  title: 'Tentang Kami - DapurMama',
  description: 'Kenali lebih dekat cerita di balik DapurMama dan komitmen kami untuk menghadirkan dessert rumahan terbaik',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <AboutContent />
      </main>
      <Footer />
    </div>
  );
}