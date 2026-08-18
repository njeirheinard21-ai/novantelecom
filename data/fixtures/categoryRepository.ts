import { CategoryRepository } from '../types';
import { Category } from '../../types/category';
import { categories } from './categories.data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fixtureCategoryRepository: CategoryRepository = {
  async list() {
    await delay(150);
    return categories;
  },
  
  async getBySlug(slug: string) {
    await delay(150);
    const cat = categories.find(c => c.slug === slug);
    return cat || null;
  },
  
  async getTree() {
    await delay(150);
    const roots = categories.filter(c => !c.parentId);
    return roots.map(root => ({
      ...root,
      children: categories.filter(c => c.parentId === root.id).sort((a, b) => a.order - b.order)
    })).sort((a, b) => a.order - b.order);
  }
};
