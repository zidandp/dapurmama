"use client";

import Link from 'next/link';
import { ArrowDown, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    categoriesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-cream-50 via-pink-50 to-cream-100 dark:from-background dark:via-muted/20 dark:to-background overflow-hidden">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            <Heart className="h-4 w-4 animate-bounce-gentle" />
            Dessert Rumahan Terenak
          </div>

          {/* Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              <span className="text-gradient">DapurMama</span>
              <br />
              <span className="text-foreground">Kelezatan dalam</span>
              <br />
              <span className="text-pink-500">Setiap Gigitan</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Nikmati dessert rumahan berkualitas tinggi yang dibuat dengan cinta dan bahan-bahan pilihan terbaik untuk keluarga tercinta.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-xs sm:max-w-md mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Dessert DapurMama"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating Rating Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 dark:bg-background/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-full flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-xs sm:text-sm font-medium">4.9</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-pink-200 dark:bg-pink-800 rounded-full animate-bounce-gentle" />
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-cream-300 dark:bg-cream-600 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link href="/katalog">
              <Button size="lg" className="btn-touch w-full sm:w-auto bg-gradient-to-r from-brown-500 to-brown-600 hover:from-brown-600 hover:to-brown-700 h-12 px-8">
                Lihat Katalog
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToCategories}
              className="btn-touch w-full sm:w-auto group h-12 px-8"
            >
              Jelajahi Kategori
              <ArrowDown className="ml-2 h-4 w-4 group-hover:animate-bounce-gentle" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-md mx-auto pt-6 sm:pt-8 px-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">100+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Pelanggan Puas</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">15+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Varian Produk</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">4.9</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Rating Bintang</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}