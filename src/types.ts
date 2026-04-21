export type Money = {
  amount: number;  
  currency: string;
};

export type Product = {
  id: number;
  name: string;
  price: Money;
};

export type CartItem = {
  productId: number;
  quantity: number;
  pricing: {
    unitPrice: Money;
    totalPrice: Money; 
  };
  metadata: {
    addedAt: Date;
    [key: string]: unknown;
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
  cartTotal: Money;
  totalQuantity: number;
};
