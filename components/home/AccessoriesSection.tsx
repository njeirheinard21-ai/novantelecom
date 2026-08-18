import { Link } from 'react-router';
import { Container } from '../ui/Container';

const ACCESSORIES = [
  { name: 'MagSafe Charger', price: '45 000 FCFA', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2011%2C%202026%2C%2009_36_18%20AM.png?alt=media&token=ba40f67e-ec2e-46a6-bd69-9b84db2b3deb' },
  { name: 'iPhone 17 FineWoven Case', price: '65 000 FCFA', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2011%2C%202026%2C%2009_37_30%20AM.png?alt=media&token=c995fe2e-8a55-461b-8c4f-c0a5b0ace591' },
  { name: 'AirTag', price: '35 000 FCFA', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2011%2C%202026%2C%2009_44_53%20AM.png?alt=media&token=d3d36396-a7b2-4b76-a7c0-730782153293' },
  { name: 'Apple Pencil Pro', price: '149 000 FCFA', image: 'https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2011%2C%202026%2C%2009_45_49%20AM.png?alt=media&token=1aa01960-d963-4c36-8745-34598bc89b53' },
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
              <div className="aspect-square bg-surface rounded-xl mb-6 flex items-center justify-center border border-border shadow-sm overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-fg-muted text-sm text-center px-4">[{item.name} Image]</span>
                )}
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
