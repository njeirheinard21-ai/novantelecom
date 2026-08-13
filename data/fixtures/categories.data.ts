import { Category } from '../../types/category';

export const categories: Category[] = [
  { id: 'cat_mac', slug: 'mac', name: 'Mac', order: 1 },
  { id: 'cat_iphone', slug: 'iphone', name: 'iPhone', order: 2 },
  { id: 'cat_ipad', slug: 'ipad', name: 'iPad', order: 3 },
  { id: 'cat_watch', slug: 'watch', name: 'Apple Watch', order: 4 },
  { id: 'cat_airpods', slug: 'airpods', name: 'AirPods', order: 5 },
  { id: 'cat_accessories', slug: 'accessories', name: 'Accessories', order: 6 },
  
  { id: 'cat_mac_laptops', slug: 'mac-laptops', name: 'Laptops', parentId: 'cat_mac', order: 1 },
  { id: 'cat_mac_desktops', slug: 'mac-desktops', name: 'Desktops', parentId: 'cat_mac', order: 2 },
  
  { id: 'cat_iphone_pro', slug: 'iphone-pro', name: 'iPhone Pro', parentId: 'cat_iphone', order: 1 },
  { id: 'cat_iphone_standard', slug: 'iphone-standard', name: 'iPhone', parentId: 'cat_iphone', order: 2 },
];
