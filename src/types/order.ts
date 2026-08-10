export type OrderStatus = 'pending' | 'payment_pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string; // firestore document id
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  taxContext: {
    taxEnabled: boolean;
    taxRatePercent: number;
    taxLabel: string;
    currency: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface OrderAuditLog {
  id: string;
  orderId: string;
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  updatedBy: string; // userId
  updatedAt: number;
}
