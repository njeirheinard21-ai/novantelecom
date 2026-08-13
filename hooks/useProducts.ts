import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository, ProductFilters } from '../data';
import { NewProduct, Product } from '../types/product';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  bySlug: (slug: string) => [...productKeys.details(), 'slug', slug] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
};

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productRepository.list(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productRepository.getById(id),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.bySlug(slug),
    queryFn: () => productRepository.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit = 4) {
  return useQuery({
    queryKey: [...productKeys.featured(), limit],
    queryFn: () => productRepository.featured(limit),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newProduct: NewProduct) => productRepository.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Product> }) => productRepository.update(id, patch),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
    },
  });
}

export function useSetProductActive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => productRepository.setActive(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useSearchProducts(query: string, limitCount = 10) {
  return useQuery({
    queryKey: [...productKeys.all, 'search', query, limitCount],
    queryFn: () => productRepository.search(query, limitCount),
    enabled: !!query,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
