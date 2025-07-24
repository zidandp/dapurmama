"use client";

import { useState } from 'react';
import { MessageCircle, Instagram, Send, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Phone,
    title: 'WhatsApp',
    value: '+62 812-3456-789',
    link: 'https://wa.me/628123456789',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    value: '@dapurmama',
    link: 'https://instagram.com/dapurmama',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
  },
  {
    icon: Send,
    title: 'Telegram',
    value: 'DapurMama',
    link: 'https://t.me/dapurmama',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
];

const businessHours = [
  { day: 'Senin - Jumat', hours: '08:00 - 20:00' },
  { day: 'Sabtu - Minggu', hours: '09:00 - 18:00' },
];

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const whatsappMessage = `Halo DapurMama! 👋

*Nama:* ${formData.name}
*Pesan:* ${formData.message}

Terima kasih!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/628123456789?text=${encodedMessage}`, '_blank');
    
    toast.success('Pesan dikirim ke WhatsApp!');
    setFormData({ name: '', message: '' });
  };

  return (
    <div className="container-custom max-w-4xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Hubungi <span className="text-gradient">Kami</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Ada pertanyaan atau ingin pesan dessert khusus? Jangan ragu untuk menghubungi kami!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Information */}
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold">Informasi Kontak</h2>
          
          {/* Contact Methods */}
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <Card key={info.title} className="card-product">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${info.bgColor} flex items-center justify-center`}>
                      <info.icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{info.title}</h3>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="btn-touch"
                    >
                      <a href={info.link} target="_blank" rel="noopener noreferrer">
                        Hubungi
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Business Hours */}
          <Card className="card-product">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Jam Operasional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {businessHours.map((schedule) => (
                  <div key={schedule.day} className="flex justify-between">
                    <span className="text-muted-foreground">{schedule.day}</span>
                    <span className="font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="card-product">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Alamat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Jl. Mawar No. 123, Perumahan Indah<br />
                Kelurahan Sejahtera, Kecamatan Bahagia<br />
                Jakarta Selatan 12345
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="card-product">
            <CardHeader>
              <CardTitle>Kirim Pesan</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="btn-touch"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tulis pesan Anda di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[120px] btn-touch"
                  />
                </div>

                <Button type="submit" className="w-full btn-touch">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Kirim via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Pertanyaan Umum</h3>
            <div className="space-y-4">
              <Card className="card-product">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Bagaimana cara memesan?</h4>
                  <p className="text-sm text-muted-foreground">
                    Pilih produk di katalog, tambahkan ke keranjang, lalu checkout via WhatsApp.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-product">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Berapa lama proses pembuatan?</h4>
                  <p className="text-sm text-muted-foreground">
                    Biasanya 1-2 hari kerja, tergantung jenis dan jumlah pesanan.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-product">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Apakah ada pengiriman?</h4>
                  <p className="text-sm text-muted-foreground">
                    Ya, kami melayani pengiriman untuk area Jakarta dan sekitarnya.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}