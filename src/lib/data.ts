import { Product, LensOption } from '@/types';

export const products: Product[] = [
  {
    id: 'du301',
    name: 'DU301 Classic',
    price: 49,
    description: 'Timeless design with premium acetate frame. Comfortable for all-day wear.',
    colors: ['Black', 'Tortoise', 'Bean Red'],
    image: '/images/du301-n1.png',
    category: 'standard',
  },
  {
    id: 'du302',
    name: 'DU302 Modern',
    price: 49,
    description: 'Contemporary rectangular shape with lightweight construction.',
    colors: ['Black', 'Purple', 'Tea Grey'],
    image: '/images/du302-d2.png',
    category: 'standard',
  },
  {
    id: 'du303',
    name: 'DU303 Elegant',
    price: 49,
    description: 'Sophisticated round frame with refined details. Perfect for any occasion.',
    colors: ['Black', 'Light Brown', 'Grey'],
    image: '/images/du303-n84.png',
    category: 'standard',
  },
  {
    id: 'og203',
    name: 'OG203 Titanium',
    price: 49,
    description: 'Ultra-light titanium frame with premium finish. Durable and comfortable.',
    colors: ['Tortoise', 'Brown'],
    image: '/images/frame-og203.png',
    category: 'standard',
  },
  {
    id: '8096',
    name: '8096 Rectangle',
    price: 49,
    description: 'Classic rectangular design with modern twist. Professional and stylish.',
    colors: ['Clear Tea', 'Tortoise', 'Black White', 'Clear Grey', 'Black'],
    image: '/images/8096-c1.jpg',
    category: 'standard',
  },
  {
    id: '8095',
    name: '8095 Round',
    price: 49,
    description: 'Vintage-inspired round frames. Lightweight and comfortable fit.',
    colors: ['Clear Tea', 'Tortoise', 'Black White', 'Grey', 'Dark Blue'],
    image: '/images/8095-c1.jpg',
    category: 'asiafit',
  },
  {
    id: '8097',
    name: '8097 Cat Eye',
    price: 49,
    description: 'Bold cat eye shape for a statement look. Feminine and fashionable.',
    colors: ['Black', 'Tortoise', 'Clear', 'Brown'],
    image: '/images/8097-c1.jpg',
    category: 'asiafit',
  },
  {
    id: 'a001',
    name: 'Asia Fit Classic',
    price: 49,
    description: 'Specially designed for Asian face shapes. Higher nose bridge fit.',
    colors: ['Black', 'Brown', 'Gold'],
    image: '/images/du301-n1.png',
    category: 'asiafit',
  },
  {
    id: 'a002',
    name: 'Asia Fit Modern',
    price: 49,
    description: 'Low-bridge design with adjusted temple angle for secure, comfortable fit.',
    colors: ['Black', 'Grey', 'Silver'],
    image: '/images/du302-d2.png',
    category: 'asiafit',
  },
  {
    id: 'a003',
    name: 'Asia Fit Titanium',
    price: 49,
    description: 'Professional half-rim design with Asia fit engineering. Lightweight and secure.',
    colors: ['Black', 'Gunmetal', 'Brown'],
    image: '/images/frame-og203.png',
    category: 'asiafit',
  },
  {
    id: '8098',
    name: '8098 Oval',
    price: 49,
    description: 'Elegant oval shape for a refined look. Perfect for everyday wear.',
    colors: ['Black', 'Tortoise', 'Gold', 'Silver'],
    image: '/images/8098-c2.jpg',
    category: 'standard',
  },
];

export const lensOptions: LensOption[] = [
  {
    id: 'classic',
    name: 'Classic Clear',
    description: 'Standard clear lenses with anti-reflective, scratch-resistant, and UV protection coatings.',
    price: 0,
  },
  {
    id: 'bluelight',
    name: 'Blue Light Filter',
    description: 'Filters harmful blue light from screens. Reduces eye strain during long screen sessions.',
    price: 20,
  },
  {
    id: 'photochromic',
    name: 'Photochromic',
    description: 'Lenses darken in sunlight and clear indoors. Two pairs in one.',
    price: 40,
  },
  {
    id: 'colortint',
    name: 'Color Tint',
    description: 'Add a pop of color to your look. Available in various fashionable shades.',
    price: 20,
  },
];

export const highIndexOptions = [
  { id: '1.60', name: '1.60 Mid-Index', description: 'Standard thinness, ideal for most prescriptions.', price: 0 },
  { id: '1.67', name: '1.67 High-Index', description: '14% thinner than 1.60. Recommended for +/-4.0 or higher.', price: 40 },
  { id: '1.74', name: '1.74 Ultra High-Index', description: 'Thinnest option. Recommended for +/-8.0 or higher.', price: 80 },
];

export const progressiveOption = {
  id: 'progressive',
  name: 'Progressive Lenses',
  description: 'Corrects distance, intermediate, and reading vision in one lens. No visible lines.',
  price: 80,
};
