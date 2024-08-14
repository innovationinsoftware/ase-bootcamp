// products.ts

// Define the Product interface
interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  color: string;
  category: string;
  description: string;
  imageFile: string;
}

// List of over-the-counter medicine products
const products: Product[] = [
  {
    id: 1,
    name: 'Pain Relief Tablets',
    price: 12.99,
    brand: 'HealFast',
    color: 'White',
    category: 'Pain Relief',
    description: 'Fast-acting pain relief tablets for headaches and muscle aches.',
    imageFile: 'pain-relief-tablets.jpg',
  },
  {
    id: 2,
    name: 'Cold & Flu Syrup',
    price: 8.49,
    brand: 'ColdCure',
    color: 'Red',
    category: 'Cold & Flu',
    description: 'Syrup for relief from cold and flu symptoms, including congestion and sore throat.',
    imageFile: 'cold-flu-syrup.jpg',
  },
  {
    id: 3,
    name: 'Allergy Relief Capsules',
    price: 15.99,
    brand: 'AllerEase',
    color: 'Blue',
    category: 'Allergy Relief',
    description: 'Capsules to relieve allergy symptoms such as sneezing, itching, and runny nose.',
    imageFile: 'allergy-relief-capsules.jpg',
  },
  {
    id: 4,
    name: 'Antacid Chewable Tablets',
    price: 6.99,
    brand: 'AcidFree',
    color: 'Pink',
    category: 'Digestive Health',
    description: 'Chewable tablets for quick relief from heartburn and indigestion.',
    imageFile: 'antacid-chewable-tablets.jpg',
  },
  {
    id: 5,
    name: 'Cough Suppressant Lozenges',
    price: 4.99,
    brand: 'CoughGuard',
    color: 'Green',
    category: 'Cough & Sore Throat',
    description: 'Lozenges to soothe sore throat and suppress cough.',
    imageFile: 'cough-suppressant-lozenges.jpg',
  },
];

// Export the products array
export default products;
