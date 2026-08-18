import { useQuery } from '@tanstack/react-query';
import { categoryRepository } from '../data';

export const categoryKeys = {
  all: ['categories'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  slug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryRepository.list(),
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => categoryRepository.getTree(),
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: () => categoryRepository.getBySlug(slug),
    enabled: !!slug,
  });
}
