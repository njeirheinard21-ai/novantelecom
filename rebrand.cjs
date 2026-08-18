const fs = require('fs');

// Helper to write file
const write = (file, content) => {
  fs.writeFileSync(file, content);
};

// 1. HEADER
write('src/components/Header.tsx', `
import { Link } from 'react-router';
import { useCartStore, selectTotalItems } from '../store/cartStore';
import { useAuth } from './auth/AuthProvider';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, profile } = useAuth();
  const setIsCartOpen = useCartStore(state => state.setIsOpen);
  const totalItems = useCartStore(selectTotalItems);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/80 backdrop-blur-md border-b border-border/50 text-fg">
      <div className="max-w-[980px] mx-auto px-4">
        <div className="flex h-12 items-center justify-between text-xs tracking-wide">
          
          <div className="flex items-center gap-2">
            <button className="md:hidden p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
               {/* Apple-like icon or just logo text */}
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.59-.72 1.55.03 2.85.74 3.63 1.9-3.22 1.86-2.65 6.13.56 7.37-.73 1.77-1.7 3.55-2.86 3.62zm-3.7-14.1c.7-1.06 1.14-2.43.95-3.8-1.2.07-2.67.87-3.46 1.93-.65.86-1.18 2.27-.92 3.63 1.34.1 2.65-.73 3.43-1.76z"/></svg>
               <span className="font-semibold text-sm hidden sm:inline-block">iStore</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 justify-center flex-1">
            <Link to="/category/mac" className="hover:text-accent transition-colors">Mac</Link>
            <Link to="/category/ipad" className="hover:text-accent transition-colors">iPad</Link>
            <Link to="/category/iphone" className="hover:text-accent transition-colors">iPhone</Link>
            <Link to="/category/watch" className="hover:text-accent transition-colors">Watch</Link>
            <Link to="/category/airpods" className="hover:text-accent transition-colors">AirPods</Link>
            <Link to="/category/accessories" className="hover:text-accent transition-colors">Accessories</Link>
            <Link to="/support" className="hover:text-accent transition-colors">Support</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hover:text-accent transition-colors">
              <Search size={18} />
            </button>
            <Link to={user ? "/account" : "/login"} className="hover:text-accent transition-colors">
              <User size={18} />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-accent transition-colors">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {isAdmin && (
               <Link to="/admin" className="hidden sm:block hover:text-accent transition-colors">Admin</Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-12 left-0 w-full h-[calc(100vh-48px)] bg-canvas flex flex-col pt-8 px-8 gap-6 text-xl font-medium z-40 overflow-y-auto">
           <Link to="/category/mac" onClick={() => setIsMobileMenuOpen(false)}>Mac</Link>
           <Link to="/category/ipad" onClick={() => setIsMobileMenuOpen(false)}>iPad</Link>
           <Link to="/category/iphone" onClick={() => setIsMobileMenuOpen(false)}>iPhone</Link>
           <Link to="/category/watch" onClick={() => setIsMobileMenuOpen(false)}>Watch</Link>
           <Link to="/category/airpods" onClick={() => setIsMobileMenuOpen(false)}>AirPods</Link>
           <Link to="/category/accessories" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
           <Link to="/support" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
           {isAdmin && (
             <Link to="/admin" className="text-accent" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
           )}
        </div>
      )}
    </header>
  );
}
`);

// 2. HERO SECTION
write('src/components/home/HeroSection.tsx', `
import { Link } from 'react-router';
import { Button } from '../ui/Button';
import { useFeaturedProducts } from '../../hooks/useProducts';

export function HeroSection() {
  const { data: products } = useFeaturedProducts(1);
  const heroProduct = products?.[0];

  return (
    <section className="relative w-full bg-canvas-dark text-white pt-12 pb-24 md:pt-20 md:pb-32 flex flex-col items-center text-center">
      <div className="z-10 flex flex-col items-center px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          {heroProduct ? heroProduct.name : 'iPhone 17 Pro'}
        </h2>
        <p className="text-xl md:text-2xl font-normal text-white/90 mb-4">
          {heroProduct ? heroProduct.shortDescription || heroProduct.description : 'Pro. Beyond.'}
        </p>
        {heroProduct && (
          <p className="text-sm md:text-base text-white/70 mb-8">
            From {heroProduct.price.toLocaleString()} {heroProduct.currency || 'FCFA'}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={heroProduct ? \`/product/\${heroProduct.id}\` : '#'}>
            <Button size="lg" className="min-w-[140px] rounded-full text-base bg-white text-black hover:bg-gray-200">Buy Now</Button>
          </Link>
          <Link to={heroProduct ? \`/product/\${heroProduct.id}\` : '#'}>
            <Button variant="outline" size="lg" className="min-w-[140px] rounded-full text-base text-white border-white hover:bg-white/10 hover:text-white">Learn more</Button>
          </Link>
        </div>
      </div>
      
      {heroProduct?.images?.[0] ? (
        <div className="mt-12 w-full max-w-4xl px-4 relative z-0 flex justify-center">
          <img src={heroProduct.images[0]} alt={heroProduct.name} className="max-h-[500px] object-contain" />
        </div>
      ) : (
        <div className="mt-12 w-full max-w-5xl px-4 relative z-0">
          <div className="aspect-video w-full rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-600 border border-gray-700 shadow-2xl flex items-center justify-center">
             <span className="text-gray-400 font-medium">Hero Image</span>
          </div>
        </div>
      )}
    </section>
  );
}
`);

// 3. FEATURED PRODUCTS
write('src/components/home/FeaturedProducts.tsx', `
import { Link } from 'react-router';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useFeaturedProducts } from '../../hooks/useProducts';

export function FeaturedProducts() {
  const { data: products } = useFeaturedProducts(4);

  // Skip the first one if we assume it's in the hero (optional, let's just show up to 4)
  const displayProducts = products?.slice(0, 4) || [];

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-4 md:py-8 bg-canvas">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col items-center text-center bg-canvas-secondary rounded-3xl p-8 pt-12 overflow-hidden transition-transform duration-300">
              <div className="z-10 flex flex-col items-center h-full w-full">
                {product.isFeatured && (
                  <span className="text-[#bf4800] text-xs font-semibold tracking-wider uppercase mb-2">New</span>
                )}
                <h3 className="text-3xl font-semibold tracking-tight mb-2">{product.name}</h3>
                <p className="text-lg text-fg-muted mb-4 max-w-[280px] line-clamp-2">{product.shortDescription || product.description}</p>
                <div className="flex gap-4 mb-8">
                  <Link to={\`/product/\${product.id}\`}>
                    <Button className="rounded-full px-5 bg-accent hover:bg-accent/90">Buy</Button>
                  </Link>
                  <Link to={\`/product/\${product.id}\`}>
                    <Button variant="link" className="h-10 text-accent hover:text-accent/80 font-medium px-0">Learn more {'>'}</Button>
                  </Link>
                </div>
                
                {product.images?.[0] ? (
                  <div className="mt-auto w-full max-w-[280px] flex-1 flex items-end justify-center">
                     <img src={product.images[0]} alt={product.name} className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="mt-auto w-full max-w-xs aspect-square bg-white border border-border/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-fg-muted text-sm">No Image</span>
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
`);

// 4. PRODUCT DETAIL PAGE
write('src/pages/Product.tsx', `
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SEO } from '../components/SEO';
import { ProductVariant } from '../types/product';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const addItem = useCartStore(state => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        const defaultVariant = product.variants[0];
        setSelectedVariant(defaultVariant);
      }
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  if (error || !product) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>;
  }

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    addItem(product, 1, selectedVariant?.id);
  };

  // Extract unique colors and storages
  const colors = Array.from(new Set(product.variants?.map(v => v.color).filter(Boolean)));
  const storages = Array.from(new Set(product.variants?.map(v => v.storage).filter(Boolean)));

  return (
    <div className="bg-canvas min-h-screen pb-24">
      <SEO title={product.name} description={product.description} />
      
      {/* Sticky Product Header */}
      <div className="sticky top-12 z-40 bg-canvas/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold text-lg">{product.name}</h1>
          <div className="flex items-center gap-4">
             <span className="font-medium text-sm hidden sm:inline-block">
               {displayPrice.toLocaleString()} {product.currency || 'FCFA'}
             </span>
             <Button 
               size="sm" 
               className="rounded-full px-4"
               disabled={isOutOfStock}
               onClick={handleAddToCart}
             >
               Add to Bag
             </Button>
          </div>
        </div>
      </div>

      <Container className="pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Images */}
          <div className="flex flex-col gap-4">
             <div className="bg-canvas-secondary rounded-3xl p-8 flex items-center justify-center aspect-square overflow-hidden relative">
               {selectedImage ? (
                  <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
               ) : (
                  <div className="text-fg-muted">No Image Available</div>
               )}
             </div>
             {product.images && product.images.length > 1 && (
               <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                 {product.images.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setSelectedImage(img)}
                     className={\`w-20 h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 \${selectedImage === img ? 'border-accent' : 'border-transparent bg-canvas-secondary hover:border-border'}\`}
                   >
                     <img src={img} alt={\`\${product.name} \${idx}\`} className="w-full h-full object-contain p-2" />
                   </button>
                 ))}
               </div>
             )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Buy {product.name}</h1>
            <p className="text-lg text-fg-muted mb-8">From {displayPrice.toLocaleString()} {product.currency || 'FCFA'}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-8 mb-12">
                {/* Colors */}
                {colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Choose a color.</h3>
                    <div className="flex flex-wrap gap-4">
                      {colors.map(color => {
                        // Find first variant with this color to check if it's selected
                        const variantWithColor = product.variants!.find(v => v.color === color);
                        const isSelected = selectedVariant?.color === color;
                        const hex = variantWithColor?.colorHex || '#ccc';
                        
                        return (
                          <button
                            key={color as string}
                            onClick={() => {
                               // when selecting color, try to preserve storage if possible
                               const newVar = product.variants!.find(v => v.color === color && v.storage === selectedVariant?.storage) 
                                           || variantWithColor;
                               if(newVar) setSelectedVariant(newVar);
                            }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className={\`w-10 h-10 rounded-full border-2 p-0.5 \${isSelected ? 'border-accent' : 'border-transparent hover:border-border'}\`}>
                              <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: hex }}></div>
                            </div>
                            <span className="text-xs text-fg-muted">{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Storage */}
                {storages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Choose storage capacity.</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {storages.map(storage => {
                        const isSelected = selectedVariant?.storage === storage;
                        return (
                          <button
                            key={storage as string}
                            onClick={() => {
                               const newVar = product.variants!.find(v => v.storage === storage && v.color === selectedVariant?.color)
                                           || product.variants!.find(v => v.storage === storage);
                               if(newVar) setSelectedVariant(newVar);
                            }}
                            className={\`border-2 rounded-xl p-4 flex items-center justify-center transition-all \${isSelected ? 'border-accent bg-canvas' : 'border-border/50 bg-canvas-secondary hover:border-border'}\`}
                          >
                            <span className="font-medium text-lg">{storage}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-canvas-secondary rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-xl mb-4">Summary</h3>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-medium">{product.name} {selectedVariant?.storage} {selectedVariant?.color}</div>
                  <div className="text-sm text-fg-muted">{stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                </div>
                <div className="font-semibold text-lg">{displayPrice.toLocaleString()} {product.currency || 'FCFA'}</div>
              </div>
              <Button 
                className="w-full rounded-xl py-6 text-lg" 
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                Add to Bag
              </Button>
            </div>

            <div className="prose prose-sm max-w-none text-fg-muted">
              <p>{product.description}</p>
            </div>
            
          </div>
        </div>
      </Container>
    </div>
  );
}
`);

// 5. UPDATE CART DRAWER UI
let cartDrawerCode = fs.readFileSync('src/components/storefront/CartDrawer.tsx', 'utf8');
cartDrawerCode = cartDrawerCode.replace(/bg-white shadow-xl/g, 'bg-canvas shadow-2xl border-l border-border/30');
cartDrawerCode = cartDrawerCode.replace(/text-gray-900/g, 'text-fg font-semibold');
cartDrawerCode = cartDrawerCode.replace(/text-gray-500/g, 'text-fg-muted');
cartDrawerCode = cartDrawerCode.replace(/bg-gray-100 hover:bg-gray-200/g, 'bg-canvas-secondary hover:bg-border/50 rounded-full');
cartDrawerCode = cartDrawerCode.replace(/checkout/g, 'checkout text-lg font-medium rounded-xl py-6');
cartDrawerCode = cartDrawerCode.replace(/className="flex items-center border rounded-md"/g, 'className="flex items-center border border-border/50 rounded-full overflow-hidden"');
fs.writeFileSync('src/components/storefront/CartDrawer.tsx', cartDrawerCode);

