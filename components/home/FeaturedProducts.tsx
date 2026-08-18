import { OptimizedImage } from '../ui/OptimizedImage';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useProducts } from '../../hooks/useProducts';
import { getLocalizedValue } from '../../types/i18n';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/money';

export function FeaturedProducts() {
  const { t, i18n } = useTranslation(['home', 'common']);
  const { data, isLoading } = useProducts({ limit: 2, includeInactive: false });
  const products = data?.items || [];

  if (isLoading || products.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-canvas">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col items-center text-center bg-canvas-secondary rounded-3xl p-8 pt-12 overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
              <div className="z-10 flex flex-col items-center">
                <span className="text-[#bf4800] text-xs font-semibold tracking-wider uppercase mb-2">{t('featured', { ns: 'home' })}</span>
                <h3 className="text-3xl font-semibold tracking-tight mb-2">{getLocalizedValue(product.name as any, i18n.language)}</h3>
                <p className="text-lg text-fg-muted mb-4 line-clamp-1">{product.description}</p>
                <p className="text-sm text-fg-muted mb-6">From {formatPrice(product.price)}</p>
                <div className="flex gap-4">
                  <Link to={`/product/${product.id}`}>
                    <Button>{t('shop', { ns: 'home' })}</Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 w-full max-w-sm aspect-square flex items-center justify-center overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={getLocalizedValue(product.name as any, i18n.language)} className="w-full h-full object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-canvas border border-border/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-fg-muted text-sm">{t('image_not_available', { ns: 'common' })}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
