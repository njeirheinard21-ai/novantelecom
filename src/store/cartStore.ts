import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';

export interface CartItem {
  productId: string;
  variantId?: string;
  product: Product;
  quantity: number;
  priceAtAdded: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  priceWarning: { productName: string, oldPrice: number, newPrice: number } | null;
  addItem: (product: Product, quantity: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  clearPriceWarning: () => void;
  setPriceWarning: (warning: { productName: string, oldPrice: number, newPrice: number } | null) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      priceWarning: null,
      addItem: (product, quantity, variantId) => {
        const items = get().items;
        const existing = items.find(i => i.productId === product.id && i.variantId === variantId);
        
        let price = product.price;
        if (variantId && product.variants) {
           const v = product.variants.find(v => v.id === variantId);
           if (v) price = v.price;
        }

        if (existing) {
          set({
            items: items.map(i => (i.productId === product.id && i.variantId === variantId)
               ? { ...i, quantity: i.quantity + quantity }
              : i
            ),
            isOpen: true
          });
        } else {
          set({ 
            items: [...items, { productId: product.id, variantId, product, quantity, priceAtAdded: price }],
            isOpen: true
          });
        }
      },
      removeItem: (productId, variantId) => {
        set({ items: get().items.filter(i => !(i.productId === productId && i.variantId === variantId)) });
      },
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map(i => (i.productId === productId && i.variantId === variantId) ? { ...i, quantity } : i)
        });
      },
      setIsOpen: (isOpen) => set({ isOpen }),
      clearPriceWarning: () => set({ priceWarning: null }),
      setPriceWarning: (warning) => set({ priceWarning: warning }),
      setItems: (items) => set({ items }),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'shopping-cart',
    }
  )
);

// Selectors
export const selectTotalItems = (state: CartState) => state.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectSubtotal = (state: CartState) => state.items.reduce((acc, item) => acc + (item.quantity * item.priceAtAdded), 0);
