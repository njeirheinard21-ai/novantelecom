import { useEffect, useState } from 'react';
import { useCartStore, selectTotalItems, selectSubtotal } from '../../store/cartStore';
import { ProductVariant } from "../../types/product";
import { productRepository } from '../../data';
import X from 'lucide-react/dist/esm/icons/x';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/money';
import { useNavigate } from 'react-router';

export function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, priceWarning, setPriceWarning, setItems } = useCartStore();
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      verifyPrices();
    }
  }, [isOpen]);

  const verifyPrices = async () => {
    if (items.length === 0) return;
    setIsVerifying(true);
    let warning = null;
    
    for (const item of items) {
      try {
        const freshProduct = await productRepository.getById(item.product.id);
        if (freshProduct && freshProduct.price !== item.priceAtAdded) {
          warning = {
            productName: freshProduct.name,
            oldPrice: item.priceAtAdded,
            newPrice: freshProduct.price
          };
          break;
        }
      } catch (error) {
        console.error('Failed to verify price for', item.product.id);
      }
    }
    setPriceWarning(warning);
    setIsVerifying(false);
  };

  
        
  const acceptNewPrices = async () => {
    const updatedItems = await Promise.all(items.map(async (item) => {
      try {
        const freshProduct = await productRepository.getById(item.product.id);
        if (freshProduct) {
          return { ...item, product: freshProduct, priceAtAdded: freshProduct.price };
        }
      } catch (e) { console.error('Failed to verify price', e); }
      return item;
    }));
    setItems(updatedItems);
    setPriceWarning(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div 
        className="fixed inset-y-0 right-0 w-full md:w-96 bg-canvas/90 backdrop-blur-xl border-l border-border/50 z-50 shadow-xl flex flex-col transform transition-transform"
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Votre panier ({totalItems})</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Fermer le panier" className="p-2 hover:bg-canvas-secondary rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" aria-live="polite">
          {priceWarning && (
            <div className="bg-yellow-100 p-4 rounded-2xl mb-4 text-sm text-yellow-800">
              <p className="font-semibold mb-1">Le prix d'un article a changé.</p>
              <p>{priceWarning.productName} est passé de {formatPrice(priceWarning.oldPrice)} à {formatPrice(priceWarning.newPrice)}.</p>
              <Button onClick={acceptNewPrices} className="mt-2 text-xs py-1" variant="outline">Accepter le nouveau prix</Button>
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId || 'base'}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-canvas-secondary rounded-2xl overflow-hidden flex-shrink-0">
                    {item.product.images && item.product.images[0] ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-canvas-secondary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-fg">
                      {item.product.name}
                      {item.variantId && item.product.variants?.find((v: ProductVariant) => v.id === item.variantId) && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({item.product.variants.find((v: ProductVariant) => v.id === item.variantId)?.storage} {item.product.variants.find((v: ProductVariant) => v.id === item.variantId)?.color})
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{formatPrice(item.priceAtAdded)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded-2xl">
                        <button 
                          className="px-2 py-1 text-fg/80 hover:bg-canvas-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          aria-label="Diminuer la quantité"
                        >-</button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 text-fg/80 hover:bg-canvas-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          aria-label="Augmenter la quantité"
                        >+</button>
                      </div>
                      <button 
                        className="text-sm text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-canvas border-t border-border/50">
            <div className="flex justify-between items-center mb-4 text-lg font-semibold">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
                        <Button className="w-full py-3 text-lg" disabled={!!priceWarning || isVerifying} onClick={() => { setIsOpen(false); navigate('/checkout'); }}>
              Passer la commande
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
