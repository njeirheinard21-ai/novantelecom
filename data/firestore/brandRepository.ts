import { BrandRepository } from '../types';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Brand } from '../../types/brand';

export const firestoreBrandRepository: BrandRepository = {
  async list() {
    const q = query(collection(db, 'brands'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Brand);
  },
  
  async getBySlug(slug: string) {
    const q = query(collection(db, 'brands'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Brand;
  }
};
