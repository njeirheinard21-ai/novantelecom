import { CategoryRepository } from '../types';
import { Category } from '../../types/category';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, getDoc, doc, orderBy } from 'firebase/firestore';

export const firestoreCategoryRepository: CategoryRepository = {
  async list() {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Category);
  },
  
  async getBySlug(slug: string) {
    const q = query(collection(db, 'categories'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Category;
  },
  
  async getTree() {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(doc => doc.data() as Category);
    
    const roots = all.filter(c => !c.parentId);
    return roots.map(root => ({
      ...root,
      children: all.filter(c => c.parentId === root.id)
    }));
  }
};
