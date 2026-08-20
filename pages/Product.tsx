import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../types/i18n';
import { LocalizedLink as Link } from '../components/ui/LocalizedLink';
import { useParams, } from 'react-router';
import { SEO } from '../components/SEO';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { productRepository } from '../data';
import { Product as ProductType, ProductVariant } from '../types/product';
import { formatPrice } from '../lib/money';
import { useCartStore } from '../store/cartStore';

export default function Product() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductVariant, setSelectedProductVariant] = useState<ProductVariant | null>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const p = await productRepository.getById(id);
        setProduct(p);
        if (p?.variants && p.variants.length > 0) {
          setSelectedProductVariant(p.variants[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">{t('loading')}</div>;
  }

  if (!product) {
    return <div className="p-12 text-center text-gray-500">{t('not_found')}</div>;
  }

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedProductVariant) {
      alert(t("select_variant_error", { ns: "products" }));
      return;
    }
    
    addItem(product, 1, selectedProductVariant?.id);
  };

  const displayPrice = selectedProductVariant ? selectedProductVariant.price : product.price;
  const stock = selectedProductVariant ? selectedProductVariant.stock : product.stock;

  return (
    <div className="flex flex-col w-full min-h-[60vh] pb-24">
      <SEO title={getLocalizedValue(product.name as any, i18n?.language || 'en')} />
      
      {/* Product sticky header */}
      <div className="sticky top-12 lg:top-14 z-40 bg-canvas/80 backdrop-blur-md border-b border-border/50 py-3"> 
         <Container className="flex items-center justify-between">
           <h2 className="text-sm font-semibold capitalize">{getLocalizedValue(product.name as any, i18n?.language || 'en')}</h2>
           <div className="flex items-center space-x-4">
              <span className="text-sm hidden sm:inline-block">{t('from_price', { price: formatPrice(product.price) })}</span>
              <Button size="sm" onClick={handleAddToCart} disabled={stock <= 0}>{t('buy')}</Button>
           </div>
         </Container>
      </div>

      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div className="aspect-square bg-canvas-secondary rounded-3xl flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={getLocalizedValue(product.name as any, i18n?.language || 'en')} 
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-fg-muted">{t('image_not_available')}</span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 capitalize">
              {getLocalizedValue(product.name as any, i18n?.language || 'en')}
            </h1>
            <p className="text-xl text-fg-muted mb-8">
              {getLocalizedValue(product.description as any, i18n?.language || 'en')}
            </p>
            
            <div className="space-y-6">
               {product.variants && product.variants.length > 0 && (
                 <div className="p-6 rounded-2xl bg-canvas-secondary">
                   <h3 className="font-semibold mb-4 text-lg">{t('models')}</h3>
                   <div className="grid grid-cols-1 gap-3">
                     {product.variants.map(variant => (
                       <button
                         key={variant.id}
                         onClick={() => setSelectedProductVariant(variant)}
                         className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                           selectedProductVariant?.id === variant.id 
                             ? 'border-accent bg-accent/10' 
                             : 'border-transparent bg-canvas hover:border-gray-200'
                         }`}
                       >
                         <span className="font-medium text-left">{variant.storage ? variant.storage + (variant.color ? ' ' + variant.color : '') : variant.sku}</span>
                         <span className="text-fg/80">{formatPrice(variant.price)}</span>
                       </button>
                     ))}
                   </div>
                 </div>
               )}
               
               <div className="pt-6">
                 <div className="flex items-center justify-between mb-4 text-2xl font-semibold">
                   <span>{formatPrice(displayPrice)}</span>
                   {stock <= 0 && <span className="text-red-500 text-base font-normal">{t('out_of_stock')}</span>}
                   {stock > 0 && stock < 5 && <span className="text-orange-500 text-base font-normal">{t('only_x_left', { count: stock })}</span>}
                 </div>
                 <Button 
                   size="lg" 
                   className="w-full text-lg py-6"
                   onClick={handleAddToCart}
                   disabled={stock <= 0}
                 >
                   {stock > 0 ? t('add_to_cart') : t('unavailable')}
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
