const fs = require('fs');

fs.writeFileSync('src/pages/Category.tsx', `
import { useParams, useSearchParams } from 'react-router';
import { SEO } from '../components/SEO';
import { Container } from '../components/ui/Container';
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../lib/hooks';

export default function Category() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data, isLoading } = useProducts({ categoryId: id, search: debouncedSearchTerm });
  const products = data?.items || [];

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchParams.set('q', debouncedSearchTerm);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams, { replace: true });
  }, [debouncedSearchTerm, setSearchParams, searchParams]);

  const lines = useMemo(() => {
    const uniqueLines = new Set<string>();
    products.forEach(p => {
      if (p.productLine) uniqueLines.add(p.productLine.toString());
    });
    return Array.from(uniqueLines);
  }, [products]);

  const generations = useMemo(() => {
    const uniqueGens = new Set<string>();
    products.forEach(p => {
      if (p.generation) uniqueGens.add(p.generation.toString());
    });
    return Array.from(uniqueGens);
  }, [products]);

  const selectedLine = searchParams.get('line');
  const selectedGen = searchParams.get('gen');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let matches = true;
      if (selectedLine && p.productLine !== selectedLine) matches = false;
      if (selectedGen && p.generation !== selectedGen) matches = false;
      return matches;
    });
  }, [products, selectedLine, selectedGen]);

  return (
    <div className="flex flex-col w-full min-h-[60vh] pb-12 bg-canvas text-fg">
      <SEO title={\`Shop \${id}\`} />
      
      <div className="bg-canvas-secondary py-12 border-b border-border/50">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight capitalize mb-4">
            Shop {id}
          </h1>
          <p className="text-xl text-fg-muted">
            All models. Take your pick.
          </p>
        </Container>
      </div>
      
      <Container className="py-8 flex flex-col md:flex-row gap-12">
        {/* Facets Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0" aria-label="Filters">
          <div className="mb-8">
            <label htmlFor="search-input" className="block text-sm font-medium mb-2">Search</label>
            <input 
              id="search-input"
              type="text" 
              placeholder="Search products..." 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 focus:bg-canvas transition-colors outline-none focus:ring-2 focus:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {lines.length > 0 && (
            <div className="mb-8 border-t border-border/30 pt-6">
              <h3 className="font-semibold mb-4 text-lg">Line</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {
                      searchParams.delete('line');
                      setSearchParams(searchParams);
                    }}
                    className={\`text-sm hover:text-accent transition-colors \${!selectedLine ? 'font-semibold text-fg' : 'text-fg-muted'}\`}
                  >
                    All Lines
                  </button>
                </li>
                {lines.map(line => (
                  <li key={line}>
                    <button 
                      onClick={() => {
                        searchParams.set('line', line);
                        setSearchParams(searchParams);
                      }}
                      className={\`text-sm hover:text-accent transition-colors \${selectedLine === line ? 'font-semibold text-fg' : 'text-fg-muted'}\`}
                    >
                      {line}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generations.length > 0 && (
            <div className="mb-8 border-t border-border/30 pt-6">
              <h3 className="font-semibold mb-4 text-lg">Generation</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {
                      searchParams.delete('gen');
                      setSearchParams(searchParams);
                    }}
                    className={\`text-sm hover:text-accent transition-colors \${!selectedGen ? 'font-semibold text-fg' : 'text-fg-muted'}\`}
                  >
                    All Generations
                  </button>
                </li>
                {generations.map(gen => (
                  <li key={gen}>
                    <button 
                      onClick={() => {
                        searchParams.set('gen', gen);
                        setSearchParams(searchParams);
                      }}
                      className={\`text-sm hover:text-accent transition-colors \${selectedGen === gen ? 'font-semibold text-fg' : 'text-fg-muted'}\`}
                    >
                      {gen}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-fg-muted">Loading...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-canvas-secondary rounded-3xl">
              <p className="text-fg-muted text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <Link key={product.id} to={\`/product/\${product.id}\`} className="group flex flex-col items-center text-center bg-canvas-secondary rounded-[2rem] p-6 md:p-8 pt-10 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  <div className="z-10 flex flex-col items-center h-full w-full">
                    {product.isFeatured && (
                      <span className="text-[#bf4800] text-[10px] font-semibold tracking-wider uppercase mb-2">New</span>
                    )}
                    <h3 className="text-xl font-semibold tracking-tight text-fg mb-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-fg-muted line-clamp-2 mb-8">{product.shortDescription || product.description}</p>
                    
                    {product.images && product.images.length > 0 ? (
                      <div className="mt-auto w-full aspect-square flex items-center justify-center mb-8">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          loading="lazy"
                          className="max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="mt-auto w-full aspect-square bg-canvas rounded-2xl flex items-center justify-center text-fg-muted mb-8 border border-border/50">
                        No Image
                      </div>
                    )}
                    
                    <div className="mt-auto flex flex-col items-center w-full">
                      <p className="font-medium text-fg mb-4">From {product.price.toLocaleString()} {product.currency || 'FCFA'}</p>
                      <div className="flex gap-4">
                        <span className="inline-flex items-center justify-center h-8 px-5 text-xs font-medium bg-accent text-white rounded-full">
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
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
`);
