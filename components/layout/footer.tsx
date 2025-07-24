import Link from 'next/link';
import { Heart, Instagram, MessageCircle, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gradient">DapurMama</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dessert rumahan berkualitas tinggi dibuat dengan cinta dan dedikasi untuk keluarga Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Menu Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/katalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Hubungi Kami</h4>
            <div className="flex items-center space-x-3">
              <Link
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors btn-touch inline-flex items-center justify-center"
                aria-label="Hubungi via WhatsApp"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="https://instagram.com/dapurmama"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors btn-touch inline-flex items-center justify-center"
                aria-label="Follow di Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="https://t.me/dapurmama"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors btn-touch inline-flex items-center justify-center"
                aria-label="Hubungi via Telegram"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Dibuat dengan <Heart className="h-4 w-4 text-pink-500 animate-bounce-gentle" /> oleh DapurMama © 2024
          </p>
        </div>
      </div>
    </footer>
  );
}