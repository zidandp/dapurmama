import { Product, Category, Testimonial } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Semua', icon: 'Grid3X3' },
  { id: '2', name: 'Kue', icon: 'Cake' },
  { id: '3', name: 'Brownies', icon: 'Cookie' },
  { id: '4', name: 'Bolu', icon: 'ChefHat' },
  { id: '5', name: 'Puding', icon: 'IceCream' },
  { id: '6', name: 'Cookies', icon: 'Heart' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Red Velvet Cake',
    price: 85000,
    image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Kue red velvet yang lembut dengan cream cheese frosting. Terbuat dari bahan berkualitas tinggi dan cinta ibu rumah tangga.',
    category: 'Kue',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Brownies Fudgy',
    price: 45000,
    image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Brownies super fudgy dengan dark chocolate premium. Tekstur padat dan rasa coklat yang intense.',
    category: 'Brownies',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Bolu Pandan',
    price: 35000,
    image: 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Bolu pandan yang harum dan lembut. Dibuat dengan santan segar dan daun pandan asli.',
    category: 'Bolu',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Puding Coklat',
    price: 25000,
    image: 'https://images.pexels.com/photos/3026810/pexels-photo-3026810.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Puding coklat yang creamy dan manis. Cocok untuk dessert keluarga.',
    category: 'Puding',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Cookies Chocochips',
    price: 30000,
    image: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Cookies renyah dengan chocochips melimpah. Teman sempurna untuk teh sore.',
    category: 'Cookies',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Cheesecake Strawberry',
    price: 95000,
    image: 'https://images.pexels.com/photos/3026822/pexels-photo-3026822.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Cheesecake lembut dengan topping strawberry segar. No-bake dan sangat creamy.',
    category: 'Kue',
    isAvailable: true,
  },
  {
    id: '7',
    name: 'Brownies Cream Cheese',
    price: 55000,
    image: 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Kombinasi sempurna brownies coklat dengan swirl cream cheese yang rich.',
    category: 'Brownies',
    isAvailable: true,
  },
  {
    id: '8',
    name: 'Bolu Marmer',
    price: 40000,
    image: 'https://images.pexels.com/photos/3026801/pexels-photo-3026801.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Bolu dengan motif marmer cantik, perpaduan vanilla dan coklat yang sempurna.',
    category: 'Bolu',
    isAvailable: false,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sari Wulandari',
    message: 'Red velvet cake nya enak banget! Anak-anak suka sekali. Pasti order lagi untuk ulang tahun next month.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    id: '2',
    name: 'Ibu Ratna',
    message: 'Brownies fudgy nya juara! Teksturnya pas banget, ga terlalu manis. Suami juga doyan.',
    rating: 5,
    avatar: '👩‍🦳',
  },
  {
    id: '3',
    name: 'Maya Sari',
    message: 'Bolu pandan wanginya authentic banget, kayak buatan nenek dulu. Recommended!',
    rating: 5,
    avatar: '👩',
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};