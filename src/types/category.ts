export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId?: string;
  description?: string;
  image?: string;
  order: number;
}
