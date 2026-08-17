import { OptimizedImage } from '../ui/OptimizedImage';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function PremiumProductStory() {
  return (
    <section className="py-24 bg-canvas-dark text-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 flex items-center justify-center w-full">
             <div className="w-full aspect-square md:aspect-[4/5] flex items-center justify-center rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-white/15">
               <img src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%2010%2C%202026%2C%2012_54_18%20PM.png?alt=media&token=e98f87d1-3bdd-4e51-b5bf-8c9213003ad7" alt="Apple Vision Pro" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
             </div>
          </div>
          
          <div className="order-1 lg:order-2 flex flex-col items-start max-w-xl mx-auto lg:mx-0">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 leading-tight">
              Mind-blowing. Head-turning.
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Experience the absolute pinnacle of technology with our pro-level devices. Designed for those who demand the impossible.
            </p>
            <Link to="/product/apple-vision-pro">
              <Button size="lg" className="bg-canvas text-black hover:bg-canvas/90">
                Explore Apple Vision Pro
              </Button>
            </Link>
          </div>
          
        </div>
      </Container>
    </section>
  );
}
