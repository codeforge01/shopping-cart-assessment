import { Product } from './types';

const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Mouse',
    price: { amount: 2500, currency: 'USD' } // Puting example price $25.00
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    price: { amount: 15000, currency: 'USD' } 
  },
  {
    id: 3,
    name: 'USB-C Cable',
    price: { amount: 1550, currency: 'USD' }
  },
  {
    id: 4,
    name: 'Monitor Stand',
    price: { amount: 4599, currency: 'USD' }
  }
];

export class ProductRepository {
  public static getById(id: number): Product | undefined {
    return products.find(p => p.id === id);
  }

  public static getAll(): Product[] {
    return products;
  }
}
