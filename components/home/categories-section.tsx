"use client";

import Link from 'next/link';
import { categories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

export function CategoriesSection() {
  return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Kategori <span className="text-gradient">Favorit</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih dari berbagai kategori dessert rumahan yang telah menjadi favorit pelanggan setia kami.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.slice(1).map((category, index) => {
            const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Circle;
            return (
              <Link key={category.id} href={`/katalog?category=${category.name}`}>
                <Card className="card-product group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/katalog">
            <Button variant="outline" size="lg" className="btn-touch">
              Lihat Semua Produk
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}