import { Link } from 'react-router';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section className="relative w-full bg-canvas-dark text-white overflow-hidden py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="z-10 flex flex-col items-center lg:items-start text-center lg:text-left lg:w-[30%] min-w-[280px]">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
              MacBook Pro
            </h2>
            <p className="text-xl md:text-2xl font-normal text-white/90 mb-4">
              Performances Pro. Magnifiquement raffiné.
            </p>
            <p className="text-sm md:text-base text-white/70 mb-8">
              À partir de 799 000 FCFA
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/product/iphone-17-pro">
                <Button size="lg" className="min-w-[120px]">Acheter</Button>
              </Link>
              <Link to="/product/iphone-17-pro">
                <Button variant="outline" size="lg" className="min-w-[120px] text-white border-white hover:bg-canvas/10 hover:text-white">Learn more</Button>
              </Link>
            </div>
          </div>
          
          {/* Product Image */}
          <div className="w-full lg:w-[70%] relative z-0 flex justify-center items-center">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/NOVA%2FChatGPT%20Image%20Aug%2013%2C%202026%2C%2006_09_56%20PM.png?alt=media&token=de678a42-90d0-4835-896b-cbbbd6e5a7c0"
              alt="MacBook Pro"
              className="w-full lg:w-[90%] rounded-2xl shadow-2xl object-contain h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
