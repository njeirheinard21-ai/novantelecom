const fs = require('fs');

let catCode = fs.readFileSync('src/pages/Category.tsx', 'utf8');

// Replace direct productRepository with useProducts hook
catCode = catCode.replace(/import \{ productRepository \} from '\.\.\/data';/, '');
if (!catCode.includes('useProducts')) {
  catCode = catCode.replace(/import \{ Link \} from 'react-router';/, "import { Link } from 'react-router';\nimport { useProducts } from '../hooks/useProducts';");
}

// Update the loadProducts part with React Query hook
catCode = catCode.replace(
  /  const \[products, setProducts\] = useState<Product\[\]>\(\[\]\);\n  const \[isLoading, setIsLoading\] = useState\(true\);[\s\S]*?  \}, \[id, debouncedSearchTerm\]\);/,
  `  const { data, isLoading } = useProducts({ categoryId: id, search: debouncedSearchTerm });
  const products = data?.items || [];`
);

// Make the product cards look more Apple-like
catCode = catCode.replace(
  /            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?            <\/div>/,
  `            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {filteredProducts.map(product => (
                <Link key={product.id} to={\`/product/\${product.id}\`} className="group flex flex-col items-center text-center bg-canvas-secondary rounded-3xl p-6 md:p-8 pt-10 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  <div className="z-10 flex flex-col items-center h-full w-full">
                    {product.isFeatured && (
                      <span className="text-[#bf4800] text-[10px] font-semibold tracking-wider uppercase mb-2">New</span>
                    )}
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-fg mb-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-fg-muted line-clamp-1 mb-6">{product.shortDescription || product.description}</p>
                    
                    {product.images && product.images.length > 0 ? (
                      <div className="mt-auto w-full aspect-square flex items-center justify-center mb-6">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          loading="lazy"
                          className="max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="mt-auto w-full aspect-square bg-canvas rounded-2xl flex items-center justify-center text-fg-muted mb-6">
                        Image non disponible
                      </div>
                    )}
                    
                    <div className="mt-auto flex flex-col items-center">
                      <p className="font-medium text-fg mb-4">From {product.price.toLocaleString()} {product.currency || 'FCFA'}</p>
                      <div className="flex gap-3">
                        <span className="inline-flex items-center justify-center h-8 px-4 text-xs font-medium bg-accent text-white rounded-full">
                          Buy
                        </span>
                        <span className="inline-flex items-center justify-center h-8 text-xs font-medium text-accent hover:underline">
                          Learn more {'>'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>`
);

// Update title and headers to English (or preserve French but with Apple styling)
catCode = catCode.replace(/Acheter \{id\}/g, "Shop {id}");
catCode = catCode.replace(/Tous les modèles\./g, "All models. Take your pick.");

fs.writeFileSync('src/pages/Category.tsx', catCode);
