import { Link } from 'react-router';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

const PRODUCTS = [
  {
    id: 'macbook-pro-14',
    name: 'MacBook Pro 14"',
    description: 'M3 Pro or M3 Max chip',
    price: '1 299 000 FCFA',
    isNew: true,
    image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2010_50_37%20AM.png?alt=media&token=cb70c6ed-52da-48db-bedb-ee1d4b55cb6e'
  },
  {
    id: 'apple-watch-s9',
    name: 'Apple Watch Series 9',
    description: 'Smarter. Brighter. Mightier.',
    price: '299 000 FCFA',
    isNew: false,
    image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2010_43_45%20AM.png?alt=media&token=acde0ee4-76c3-4c99-9ffd-40e0650c78ff'
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-12 md:py-24 bg-canvas">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group relative flex flex-col items-center text-center bg-canvas-secondary rounded-3xl p-8 pt-12 overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
              <div className="z-10 flex flex-col items-center">
                {product.isNew && (
                  <span className="text-[#bf4800] text-xs font-semibold tracking-wider uppercase mb-2">New</span>
                )}
                <h3 className="text-3xl font-semibold tracking-tight mb-2">{product.name}</h3>
                <p className="text-lg text-fg-muted mb-4">{product.description}</p>
                <p className="text-sm text-fg-muted mb-6">From {product.price}</p>
                <div className="flex gap-4">
                  <Link to={`/product/${product.id}`}>
                    <Button>Shop</Button>
                  </Link>
                  <Link to={`/product/${product.id}`}>
                    <Button variant="link" className="h-10">Learn more {'>'}</Button>
                  </Link>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="mt-12 w-full max-w-sm aspect-square flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-canvas border border-border/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-fg-muted text-sm">[{product.name} Image]</span>
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
