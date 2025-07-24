"use client";

import { testimonials } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Apa Kata <span className="text-gradient">Pelanggan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Testimoni dari pelanggan setia yang telah merasakan kelezatan produk DapurMama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="card-product animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-lg">
                    {testimonial.avatar || '👩'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "{testimonial.message}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}