import { Heart, Users, Award, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: Heart,
    title: 'Dibuat dengan Cinta',
    description: 'Setiap produk dibuat dengan perhatian detail dan cinta seperti memasak untuk keluarga sendiri.',
  },
  {
    icon: Users,
    title: 'Untuk Keluarga',
    description: 'Kami memahami pentingnya momen kebersamaan keluarga dan dessert yang aman untuk semua.',
  },
  {
    icon: Award,
    title: 'Kualitas Terjamin',
    description: 'Menggunakan bahan-bahan berkualitas tinggi dan standar kebersihan yang ketat.',
  },
  {
    icon: Clock,
    title: 'Selalu Segar',
    description: 'Dibuat fresh setiap hari untuk menjamin kesegaran dan rasa terbaik.',
  },
];

export function AboutContent() {
  return (
    <div className="container-custom">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Tentang <span className="text-gradient">DapurMama</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Cerita di balik setiap gigitan manis yang kami hadirkan untuk keluarga Indonesia.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12 animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="DapurMama Kitchen"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none mb-12 animate-fade-in">
          <div className="bg-cream-50 dark:bg-muted/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Cerita Kami</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                DapurMama lahir dari kecintaan seorang ibu rumah tangga terhadap seni membuat dessert. 
                Dimulai dari dapur kecil di rumah, kami berkomitmen untuk menghadirkan kelezatan 
                dessert rumahan yang autentik dan berkualitas tinggi.
              </p>
              <p>
                Setiap resep yang kami gunakan telah melalui proses pengembangan yang panjang, 
                menggabungkan resep tradisional dengan sentuhan modern untuk menghasilkan cita rasa 
                yang unik dan tak terlupakan.
              </p>
              <p>
                Kami percaya bahwa dessert bukan hanya soal rasa, tetapi juga tentang momen 
                kebersamaan dan kebahagiaan yang tercipta ketika keluarga berkumpul. Oleh karena itu, 
                kami selalu berusaha menghadirkan produk yang tidak hanya lezat, tetapi juga aman 
                dan sehat untuk seluruh anggota keluarga.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 animate-fade-in">
            Nilai-Nilai <span className="text-gradient">Kami</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="card-product animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="text-center bg-gradient-to-r from-pink-50 to-cream-50 dark:from-pink-950/20 dark:to-cream-950/20 rounded-2xl p-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Menghadirkan dessert rumahan berkualitas tinggi yang dibuat dengan cinta, 
            untuk menciptakan momen kebersamaan yang manis dalam setiap keluarga Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}