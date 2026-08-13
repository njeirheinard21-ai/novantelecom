import { ProductRepository, ProductFilters, Paginated } from '../types';
import { Product, NewProduct } from '../../types/product';
import { products as initialProducts } from './products.data';

const store = [...initialProducts];
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to remove accents for search
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const fixtureProductRepository: ProductRepository = {
  async search(queryStr: string, limitCount?: number): Promise<Product[]> {
    return this.list({ search: queryStr, limit: limitCount || 20 }).then(res => res.items);
  },
  async delete(id: string): Promise<void> {
    const index = store.findIndex(p => p.id === id);
    if (index > -1) store.splice(index, 1);
  },
  async list(filters: ProductFilters): Promise<Paginated<Product>> {
    await delay(150);
    
    let filtered = store;
    
    if (!filters.includeInactive) {
      filtered = filtered.filter(p => p.isActive);
    }
    
    if (filters.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.search) {
      const searchTerms = removeAccents(filters.search.toLowerCase()).split(' ').filter(Boolean);
      filtered = filtered.filter(p => {
        const text = removeAccents((p.name + ' ' + p.description).toLowerCase());
        return searchTerms.every(term => text.includes(term));
      });
    }
    
    if (filters.sort) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sort) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }
    
    const limit = filters.limit || 20;
    const startIndex = filters.cursor ? filtered.findIndex(p => p.id === filters.cursor) + 1 : 0;
    // Note: this simple cursor based on id assumes items are mostly stable and we pass the ID of the last item.
    // Real cursor implementation might differ. Let's just slice for now using startIndex.
    const items = filtered.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filtered.length;
    const nextCursor = hasMore ? items[items.length - 1].id : undefined;
    
    return {
      items,
      total: filtered.length,
      hasMore,
      cursor: nextCursor
    };
  },
  
  async getBySlug(slug: string): Promise<Product | null> {
    await delay(150);
    return store.find(p => p.slug === slug && p.isActive) || null;
  },
  
  async getById(id: string): Promise<Product | null> {
    await delay(150);
    return store.find(p => p.id === id) || null;
  },
  
  async getByIds(ids: string[]): Promise<Product[]> {
    await delay(150);
    return store.filter(p => ids.includes(p.id) && p.isActive);
  },
  
  async featured(limit: number): Promise<Product[]> {
    await delay(150);
    return store.filter(p => p.isFeatured && p.isActive).slice(0, limit);
  },
  
  async create(input: NewProduct): Promise<Product> {
    await delay(150);
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...input,
      id: `prod_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    store.push(newProduct);
    return newProduct;
  },
  
  async update(id: string, patch: Partial<Product>): Promise<Product> {
    await delay(150);
    const index = store.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);
    
    const updated = {
      ...store[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    
    store[index] = updated;
    return updated;
  },
  
  async setActive(id: string, isActive: boolean): Promise<void> {
    await delay(150);
    const index = store.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);
    
    store[index].isActive = isActive;
    store[index].updatedAt = new Date().toISOString();
  }
};
