import { UserProfile } from '../types/user';
import { Product, NewProduct } from '../types/product';
import { Category } from '../types/category';
import { Brand } from '../types/brand';
import { StoreSettings } from '../types/settings';

export interface Paginated<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}

export interface ProductFilters {
  categoryId?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  includeInactive?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  limit?: number;
  cursor?: string;
}

export interface ProductRepository {
  list(filters: ProductFilters): Promise<Paginated<Product>>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getByIds(ids: string[]): Promise<Product[]>;
  featured(limit: number): Promise<Product[]>;
  create(input: NewProduct): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  setActive(id: string, isActive: boolean): Promise<void>;
  search(query: string, limit?: number): Promise<Product[]>;
  delete(id: string): Promise<void>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
  getTree(): Promise<(Category & { children: Category[] })[]>;
}

export interface BrandRepository {
  list(): Promise<Brand[]>;
  getBySlug(slug: string): Promise<Brand | null>;
}

export interface SettingsRepository {
  get(): Promise<StoreSettings>;
}

export interface UserRepository {
  getProfile(uid: string): Promise<UserProfile | null>;
  updateProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile>;
  createProfile(uid: string, email: string): Promise<UserProfile>;
}
