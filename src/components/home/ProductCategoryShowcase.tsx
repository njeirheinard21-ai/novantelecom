import { OptimizedImage } from '../ui/OptimizedImage';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { Container } from '../ui/Container';

const CATEGORIES = [
  { id: 'mac', name: 'Mac', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2010_50_37%20AM.png?alt=media&token=cb70c6ed-52da-48db-bedb-ee1d4b55cb6e' },
  { id: 'iphone', name: 'iPhone', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%207%2C%202026%2C%2005_52_42%20PM.png?alt=media&token=1cbd87fb-a049-4c50-9945-6ad512316e11' },
  { id: 'ipad', name: 'iPad', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2011_06_34%20AM.png?alt=media&token=1717e132-d3ee-42a2-beea-471963dd0804' },
  { id: 'watch', name: 'Apple Watch', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2010_43_45%20AM.png?alt=media&token=acde0ee4-76c3-4c99-9ffd-40e0650c78ff' },
  { id: 'airpods', name: 'AirPods', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2011_15_50%20AM.png?alt=media&token=85ae69b0-5b27-4dd1-8080-a6a8113a7864' },
];

export function ProductCategoryShowcase() {
  return (
    <section className="py-16 md:py-24 bg-canvas border-t border-border">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Explore the line-up.</h2>
        </div>
        
        <div className="flex flex-nowrap overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="flex-none w-[280px] sm:w-[320px] group flex flex-col items-center snap-center"
            >
              <div className="w-full aspect-[4/3] bg-canvas-secondary rounded-2xl mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                {category.image.startsWith('http') ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className={['ipad', 'watch'].includes(category.id) ? 'w-[75%] h-[75%] object-contain' : 'w-full h-full object-cover'} 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <OptimizedImage 
                    baseName={category.image} 
                    alt={category.name} 
                    className={['ipad', 'watch'].includes(category.id) ? 'w-[75%] h-[75%] object-contain' : 'w-full h-full object-cover'} 
                    referrerPolicy="no-referrer" 
                  />
                )}
              </div>
              <h3 className="text-xl font-medium tracking-tight group-hover:text-accent transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
