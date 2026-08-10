const fs = require('fs');
let code = fs.readFileSync('src/hooks/useProducts.ts', 'utf8');

if (!code.includes('useSearchProducts')) {
  code += `\nexport function useSearchProducts(query: string, limitCount = 10) {
  return useQuery({
    queryKey: [...productKeys.all, 'search', query, limitCount],
    queryFn: () => productRepository.search(query, limitCount),
    enabled: !!query,
  });
}\n`;
}

if (!code.includes('useDeleteProduct')) {
  code += `\nexport function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}\n`;
}

fs.writeFileSync('src/hooks/useProducts.ts', code);

let catCode = '';
try {
  catCode = fs.readFileSync('src/hooks/useCategories.ts', 'utf8');
} catch (e) {
  catCode = `import { useQuery } from '@tanstack/react-query';
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
`;
  fs.writeFileSync('src/hooks/useCategories.ts', catCode);
}

