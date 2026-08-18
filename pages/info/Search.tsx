import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useProducts } from '../../hooks/useProducts';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { formatPrice } from '../../lib/money';
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../../types/i18n';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== query) {
        if (searchTerm.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        } else {
          navigate(`/search`);
        }
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, query, navigate]);

  const { data, isLoading, isError } = useProducts({ search: query, limit: 50 });
  const products = data?.items || [];

  return (
    <div className="flex flex-col w-full min-h-[60vh]">
      <SEO title="Search" />
      <div className="bg-canvas-secondary py-12 border-b">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Search
          </h1>
          <div className="max-w-2xl">
            <label htmlFor="search-input" className="sr-only">{t('search')}</label>
            <input 
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full text-lg p-4 rounded-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-accent"
              
            />
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-canvas-secondary rounded-2xl p-6">
                <div className="aspect-square w-full mb-6 rounded-3xl bg-border/30 animate-pulse"></div>
                <div className="h-6 bg-border/30 rounded-lg w-2/3 mb-3 animate-pulse"></div>
                <div className="h-4 bg-border/30 rounded-lg w-full mb-2 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 bg-canvas-secondary rounded-3xl">
            <p className="text-red-500 text-lg">{t('error_loading_search')}</p>
          </div>
        ) : !query ? (
          <div className="flex flex-col items-center justify-center h-64 bg-canvas-secondary rounded-3xl">
            <p className="text-fg-muted text-lg">{t('enter_search_term')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-canvas-secondary rounded-3xl">
            <p className="text-fg-muted text-lg">No products found for "{query}".</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-medium mb-8">Results for "{query}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group block focus:outline-none focus:ring-2 focus:ring-accent rounded-2xl">
                  <div className="bg-canvas-secondary rounded-2xl p-6 transition-transform group-hover:scale-[1.02]">
                    <div className="aspect-square w-full mb-6 overflow-hidden rounded-3xl bg-canvas-secondary">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={getLocalizedValue(product.name as any, i18n.language)} 
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-canvas-secondary flex items-center justify-center text-gray-400">{t('no_image')}</div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
                      {getLocalizedValue(product.name as any, i18n.language)}
                    </h3>
                    <p className="mt-4 font-medium text-fg">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
