export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  sku: string;
  images: string[];
  stock: number;
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  
  // SINGLE_BRAND_AUTHORIZED specific fields
  productLine?: string;
  generation?: string;
  variants?: ProductVariant[];
}

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
