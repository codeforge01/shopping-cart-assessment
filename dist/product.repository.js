"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
// In-memory product database mock
const products = [
    {
        id: 1,
        name: 'Wireless Mouse',
        price: { amount: 2500, currency: 'USD' } // $25.00
    },
    {
        id: 2,
        name: 'Mechanical Keyboard',
        price: { amount: 15000, currency: 'USD' } // $150.00
    },
    {
        id: 3,
        name: 'USB-C Cable',
        price: { amount: 1550, currency: 'USD' } // $15.50
    },
    {
        id: 4,
        name: 'Monitor Stand',
        price: { amount: 4599, currency: 'USD' } // $45.99
    }
];
class ProductRepository {
    static getById(id) {
        return products.find(p => p.id === id);
    }
    static getAll() {
        return products;
    }
}
exports.ProductRepository = ProductRepository;
