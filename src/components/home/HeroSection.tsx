import { Link } from 'react-router';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section className="relative w-full bg-canvas-dark text-white overflow-hidden py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="z-10 flex flex-col items-center lg:items-start text-center lg:text-left lg:w-[40%] min-w-[280px]">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
              iPhone 17 Pro
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
          <div className="w-full lg:w-[60%] relative z-0 flex justify-center">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Aug%207%2C%202026%2C%2012_53_42%20PM.png?alt=media&token=608eabdf-92b4-4620-8210-8f1cddd92c38"
              alt="iPhone 17 Pro"
              className="w-full rounded-2xl shadow-2xl object-cover object-[85%_center] lg:object-center min-h-[400px] md:min-h-[500px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
