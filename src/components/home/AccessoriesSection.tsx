import { Link } from 'react-router';
import { Container } from '../ui/Container';

const ACCESSORIES = [
  { name: 'MagSafe Charger', price: '45 000 FCFA' },
  { name: 'iPhone 17 FineWoven Case', price: '65 000 FCFA' },
  { name: 'AirTag', price: '35 000 FCFA' },
  { name: 'Apple Pencil Pro', price: '149 000 FCFA' },
];

export function AccessoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-canvas border-t border-border">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Accessories. <span className="text-fg-muted">Essentials that pair perfectly.</span>
          </h2>
          <Link to="/category/accessories" className="text-accent hover:underline font-medium whitespace-nowrap">
            Shop all accessories {'>'}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCESSORIES.map((item, index) => (
            <div key={index} className="group flex flex-col bg-canvas-secondary rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-surface rounded-xl mb-6 flex items-center justify-center border border-border shadow-sm">
                <span className="text-fg-muted text-sm text-center px-4">[{item.name} Image]</span>
              </div>
              <div className="flex flex-col flex-grow justify-between">
                <div>
                   <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:text-accent transition-colors">{item.name}</h3>
                </div>
                <p className="text-sm text-fg-muted">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
