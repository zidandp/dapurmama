import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ContactContent } from '@/components/contact/contact-content';

export const metadata = {
  title: 'Kontak - DapurMama',
  description: 'Hubungi kami untuk pertanyaan, saran, atau pemesanan khusus dessert DapurMama',
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <ContactContent />
      </main>
      <Footer />
    </div>
  );
}