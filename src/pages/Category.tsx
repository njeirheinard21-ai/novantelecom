import { useParams, useSearchParams } from 'react-router';
import { SEO } from '../components/SEO';
import { Container } from '../components/ui/Container';
import { productRepository } from '../data';
import { useEffect, useState, useMemo } from 'react';
import { Product } from '../types/product';
import { formatPrice } from '../lib/money';
import { Link } from 'react-router';
import { useDebounce } from '../lib/hooks'; // we will create this

export default function Category() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchParams.set('q', debouncedSearchTerm);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams, { replace: true });
  }, [debouncedSearchTerm, setSearchParams, searchParams]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const results = await productRepository.list({ categoryId: id!, search: debouncedSearchTerm });
        setProducts(results.items);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [id, debouncedSearchTerm]);

  // Extract lines and generations for SINGLE_BRAND logic
  const lines = useMemo(() => {
    const uniqueLines = new Set<string>();
    products.forEach(p => {
      const lineAttr = { value: p.productLine };
      if (lineAttr && lineAttr.value) {
        uniqueLines.add(lineAttr.value.toString());
      }
    });
    return Array.from(uniqueLines);
  }, [products]);

  const generations = useMemo(() => {
    const uniqueGens = new Set<string>();
    products.forEach(p => {
      const genAttr = { value: p.generation };
      if (genAttr && genAttr.value) {
        uniqueGens.add(genAttr.value.toString());
      }
    });
    return Array.from(uniqueGens);
  }, [products]);

  const selectedLine = searchParams.get('line');
  const selectedGen = searchParams.get('gen');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let matches = true;
      if (selectedLine) {
        const lineAttr = { value: p.productLine };
        if (!lineAttr || lineAttr.value !== selectedLine) matches = false;
      }
      if (selectedGen) {
        const genAttr = { value: p.generation };
        if (!genAttr || genAttr.value !== selectedGen) matches = false;
      }
      return matches;
    });
  }, [products, selectedLine, selectedGen]);

  return (
    <div className="flex flex-col w-full min-h-[60vh] pb-12">
      <SEO title={`Acheter ${id}`} />
      <div className="bg-canvas-secondary py-12 border-b">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight capitalize mb-4">
            Acheter {id}
          </h1>
          <p className="text-xl text-fg-muted">
            Tous les modèles.
          </p>
        </Container>
      </div>
      
      <Container className="py-8 flex flex-col md:flex-row gap-8">
        {/* Facets Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0" aria-label="Filtres">
          <div className="mb-6">
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input 
              id="search-input"
              type="text" 
              placeholder="Rechercher..." 
              className="w-full rounded-xl border border-border/50 p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {lines.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Ligne</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      searchParams.delete('line');
                      setSearchParams(searchParams);
                    }}
                    className={`text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded ${!selectedLine ? 'font-bold text-black' : 'text-fg/80'}`}
                  >
                    Toutes les lignes
                  </button>
                </li>
                {lines.map(line => (
                  <li key={line}>
                    <button 
                      onClick={() => {
                        searchParams.set('line', line);
                        setSearchParams(searchParams);
                      }}
                      className={`text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded ${selectedLine === line ? 'font-bold text-black' : 'text-fg/80'}`}
                    >
                      {line}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Génération</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      searchParams.delete('gen');
                      setSearchParams(searchParams);
                    }}
                    className={`text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded ${!selectedGen ? 'font-bold text-black' : 'text-fg/80'}`}
                  >
                    Toutes les générations
                  </button>
                </li>
                {generations.map(gen => (
                  <li key={gen}>
                    <button 
                      onClick={() => {
                        searchParams.set('gen', gen);
                        setSearchParams(searchParams);
                      }}
                      className={`text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded ${selectedGen === gen ? 'font-bold text-black' : 'text-fg/80'}`}
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
              <p className="text-fg-muted">Chargement...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-canvas-secondary rounded-3xl">
              <p className="text-fg-muted text-lg">Aucun produit trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group block focus:outline-none focus:ring-2 focus:ring-accent rounded-2xl">
                  <div className="bg-canvas-secondary rounded-2xl p-6 transition-transform group-hover:scale-[1.02]">
                    <div className="aspect-square w-full mb-6 overflow-hidden rounded-3xl bg-canvas-secondary">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-canvas-secondary flex items-center justify-center text-gray-400">Image non disponible</div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-fg-muted line-clamp-2">{product.description}</p>
                    <p className="mt-4 font-medium text-fg">{formatPrice(product.price)}</p>
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
