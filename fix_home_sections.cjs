const fs = require('fs');

const write = (f, c) => fs.writeFileSync(f, c);

// 1. ProductCategoryShowcase.tsx
write('src/components/home/ProductCategoryShowcase.tsx', `
import { Link } from 'react-router';
import { Container } from '../ui/Container';

const CATEGORIES = [
  { id: 'mac', name: 'Mac', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'ipad', name: 'iPad', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'iphone', name: 'iPhone', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: 'watch', name: 'Watch', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=400&h=300' },
];

export function ProductCategoryShowcase() {
  return (
    <section className="py-12 md:py-24 bg-canvas border-t border-border/30">
      <Container>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-16">
          Which Apple is right for you?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {CATEGORIES.map(category => (
            <Link key={category.id} to={\`/category/\${category.id}\`} className="group flex flex-col items-center">
              <div className="w-full aspect-square bg-canvas-secondary rounded-full overflow-hidden mb-6 p-8 transition-transform duration-500 group-hover:scale-105">
                <img src={category.image} alt={category.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-medium group-hover:text-accent transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
`);

// 2. PremiumProductStory.tsx
write('src/components/home/PremiumProductStory.tsx', `
import { Container } from '../ui/Container';

export function PremiumProductStory() {
  return (
    <section className="py-24 md:py-40 bg-canvas-dark text-white">
      <Container className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
          Innovation that inspires.
        </h2>
        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
          We believe in creating products that empower you to do what you love. From the moment you hold our devices, you feel the dedication to craftsmanship and the passion for technology that pushes boundaries.
        </p>
      </Container>
    </section>
  );
}
`);

// 3. AccessoriesSection.tsx
write('src/components/home/AccessoriesSection.tsx', `
import { Link } from 'react-router';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function AccessoriesSection() {
  return (
    <section className="py-12 md:py-24 bg-canvas">
      <Container>
        <div className="bg-canvas-secondary rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center">
           <div className="flex-1 p-12 md:p-20 text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Magic in every detail.</h2>
             <p className="text-xl text-fg-muted mb-8 max-w-md mx-auto md:mx-0">
               Explore accessories designed specifically for your devices. 
             </p>
             <Link to="/category/accessories">
               <Button className="rounded-full px-6">Shop Accessories</Button>
             </Link>
           </div>
           <div className="flex-1 w-full min-h-[300px] md:min-h-[500px] bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center p-12">
             <div className="text-fg-muted font-medium">Accessories Collage</div>
           </div>
        </div>
      </Container>
    </section>
  );
}
`);

// 4. ServicesSection.tsx
write('src/components/home/ServicesSection.tsx', `
import { Container } from '../ui/Container';

export function ServicesSection() {
  const services = [
    { title: 'Free Delivery', description: 'On all orders above 100,000 FCFA.' },
    { title: 'Ways to Buy', description: 'Pay with Orange Money, MTN MoMo, or cash on delivery.' },
    { title: 'Get Help Buying', description: 'Have a question? Call a Specialist or chat online.' }
  ];

  return (
    <section className="py-12 bg-canvas border-t border-border/30">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
           {services.map((s, i) => (
             <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-canvas-secondary flex items-center justify-center mb-4">
                  <span className="text-accent text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-fg-muted text-sm">{s.description}</p>
             </div>
           ))}
        </div>
      </Container>
    </section>
  );
}
`);

// 5. TradeInSection.tsx
write('src/components/home/TradeInSection.tsx', `
import { Link } from 'react-router';
import { Container } from '../ui/Container';

export function TradeInSection() {
  return (
    <section className="py-12 md:py-24 bg-canvas-secondary">
      <Container className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Apple Trade In</h2>
        <p className="text-xl md:text-2xl font-normal text-fg-muted mb-8">
          Get credit toward a new device. Just trade in your eligible device for credit or recycle it for free. It’s good for you and the planet.
        </p>
        <Link to="/trade-in" className="text-accent hover:underline text-lg font-medium inline-flex items-center">
          Find your trade-in value <span className="ml-1">{'>'}</span>
        </Link>
      </Container>
    </section>
  );
}
`);

// 6. NewsletterSection.tsx
write('src/components/home/NewsletterSection.tsx', `
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function NewsletterSection() {
  return (
    <section className="py-24 bg-canvas border-t border-border/30">
      <Container className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Stay in the loop.</h2>
        <p className="text-fg-muted mb-8">Sign up to get the latest news on products, offers, and more.</p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="flex-1 bg-canvas-secondary border border-border/50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button type="submit" className="rounded-full px-8 bg-fg text-canvas hover:bg-fg/90 py-3 h-auto">Sign Up</Button>
        </form>
      </Container>
    </section>
  );
}
`);

