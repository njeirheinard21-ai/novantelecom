import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../../types/i18n';
import { ProductRepository, ProductFilters, Paginated } from '../types';
import { Product, NewProduct } from '../../types/product';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, getDoc, doc, orderBy, limit, startAfter, serverTimestamp, setDoc, updateDoc, DocumentSnapshot, getCountFromServer, deleteDoc } from 'firebase/firestore';
import { removeAccents, generateSearchTokens, fromFirestoreDate } from './utils';

// We store DocumentSnapshots here to satisfy the requirement:
// "DocumentSnapshot held in an opaque cursor, keeping the Paginated<T> shape identical."
const cursorCache = new Map<string, DocumentSnapshot>();

function mapProduct(doc: DocumentSnapshot): Product {
  const data = doc.data() as any;
  return {
    ...data,
    id: doc.id,
    createdAt: fromFirestoreDate(data.createdAt),
    updatedAt: fromFirestoreDate(data.updatedAt)
  } as Product;
}

export const firestoreProductRepository: ProductRepository = {
  async search(queryStr: string, limitCount?: number): Promise<Product[]> {
    return this.list({ search: queryStr, limit: limitCount || 20 }).then(res => res.items);
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "products", id));
  },
  async list(filters: ProductFilters): Promise<Paginated<Product>> {
    let q = query(collection(db, 'products'));

    if (!filters.includeInactive) {
      q = query(q, where('isActive', '==', true));
    }
    
    if (filters.categoryId) {
      q = query(q, where('categoryId', '==', filters.categoryId));
    }
    
    if (filters.brand) {
      q = query(q, where('brand', '==', filters.brand));
    }
    
    if (filters.inStockOnly) {
      q = query(q, where('inStock', '==', true));
    }
    

    if (filters.search) {
      const searchTerms = removeAccents(filters.search.toLowerCase()).split(/[\s-]+/).filter(Boolean);
      if (searchTerms.length > 0) {
        // Use array-contains for the first term to leverage Firestore indexing
        q = query(q, where('searchTokens', 'array-contains', searchTerms[0]));
      }
    }
    if (filters.minPrice !== undefined) {
      q = query(q, where('price', '>=', filters.minPrice));
    }
    
    if (filters.maxPrice !== undefined) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }
    
    // Firestore has no full-text search. Implement search as a prefix match on a 
    // lowercased, accent-stripped searchTokens array field written at create/update time.
    // Client-side search for substring match (allowed for this demo)
    // We will apply this after fetching all docs that match other criteria.
    
    if (filters.sort) {
      switch (filters.sort) {
        case 'newest':
          q = query(q, orderBy('createdAt', 'desc'));
          break;
        case 'price_asc':
          q = query(q, orderBy('price', 'asc'));
          break;
        case 'price_desc':
          q = query(q, orderBy('price', 'desc'));
          break;
        case 'name':
          q = query(q, orderBy('name', 'asc'));
          break;
      }
    } else {
      // By default order by document ID if no other order is applied, to keep pagination stable.
      // Actually, if we apply range filters like price, we must order by price first.
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        q = query(q, orderBy('price', 'asc'));
      }
    }
    
    let totalCount = 0;
    if (filters.includeCount) {
      totalCount = (await getCountFromServer(q)).data().count;
    }
    const pageLimit = filters.limit || 20;
    q = query(q, limit(pageLimit));
    
    if (filters.cursor) {
      const snap = cursorCache.get(filters.cursor);
      if (snap) {
        q = query(q, startAfter(snap));
      }
    }
    
    const snapshot = await getDocs(q);
    
    // Additional client-side filtering for search terms beyond the first one
    let items = snapshot.docs.map(mapProduct);
    if (filters.search) {
       const searchTerms = removeAccents(filters.search.toLowerCase()).split(/[\s-]+/).filter(Boolean);
       if (searchTerms.length > 1) {
         items = items.filter(p => {
           const text = removeAccents((p.name + ' ' + p.description).toLowerCase());
           return searchTerms.every(term => text.includes(term));
         });
       }
    }
    
    const hasMore = snapshot.docs.length === pageLimit;
    let nextCursor: string | undefined = undefined;
    if (hasMore) {
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      nextCursor = 'cur_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      cursorCache.set(nextCursor, lastDoc);
    }
    
    return {
      items,
      total: totalCount,
      hasMore,
      cursor: nextCursor
    };
  },
  
  async getBySlug(slug: string): Promise<Product | null> {
    const q = query(collection(db, 'products'), where('slug', '==', slug), where('isActive', '==', true), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return mapProduct(snapshot.docs[0]);
  },
  
  async getById(id: string): Promise<Product | null> {
    const d = await getDoc(doc(db, 'products', id));
    if (!d.exists()) return null;
    return mapProduct(d);
  },
  
  async getByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    // Firestore 'in' query supports up to 10 items.
    const batches = [];
    for (let i = 0; i < ids.length; i += 10) {
      const batchIds = ids.slice(i, i + 10);
      const q = query(collection(db, 'products'), where('id', 'in', batchIds), where('isActive', '==', true));
      batches.push(getDocs(q));
    }
    const snapshots = await Promise.all(batches);
    return snapshots.flatMap(snap => snap.docs.map(mapProduct));
  },
  
  async featured(limitCount: number): Promise<Product[]> {
    const q = query(
      collection(db, 'products'), 
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapProduct);
  },
  
  async create(input: NewProduct): Promise<Product> {
    const docRef = doc(collection(db, 'products'));
    const data = {
      ...input,
      id: docRef.id,
      searchTokens: generateSearchTokens(input.name, input.description),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, data);
    const d = await getDoc(docRef);
    return mapProduct(d);
  },
  
  async update(id: string, patch: Partial<Product>): Promise<Product> {
    const docRef = doc(db, 'products', id);
    
    const updateData: any = {
      ...patch,
      updatedAt: serverTimestamp()
    };
    
    // If name or description changes, regenerate searchTokens
    if (patch.name !== undefined || patch.description !== undefined) {
      const curr = await getDoc(docRef);
      if (!curr.exists()) throw new Error(`Product ${id} not found`);
      const currData = curr.data() as Product;
      const name = patch.name ?? currData.name;
      const desc = patch.description ?? currData.description;
      updateData.searchTokens = generateSearchTokens(name, desc);
    }
    
    await updateDoc(docRef, updateData);
    const d = await getDoc(docRef);
    return mapProduct(d);
  },
  
  async setActive(id: string, isActive: boolean): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
  }
};
