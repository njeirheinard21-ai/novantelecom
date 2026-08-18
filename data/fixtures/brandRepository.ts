import { BrandRepository } from '../types';
import { brands } from './brands.data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fixtureBrandRepository: BrandRepository = {
  async list() {
    await delay(150);
    return brands;
  },
  
  async getBySlug(slug: string) {
    await delay(150);
    const brand = brands.find(b => b.slug === slug);
    return brand || null;
  }
};
