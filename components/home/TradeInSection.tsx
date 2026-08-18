import { Link } from 'react-router';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function TradeInSection() {
  return (
    <section className="py-16 md:py-24 bg-canvas">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Trade-in Block */}
          <div className="flex flex-col items-center justify-center text-center bg-canvas-secondary rounded-3xl p-12 md:p-16 transition-transform duration-300 hover:scale-[1.01]">
            <h3 className="text-3xl font-semibold tracking-tight mb-4">Trade In</h3>
            <p className="text-lg text-fg-muted mb-8 max-w-sm">
              Upgrade and save. It's that easy. Trade in your old device and get credit toward your next purchase.
            </p>
            <Link to="/trade-in">
              <Button>See what your device is worth</Button>
            </Link>
          </div>

          {/* Financing Block */}
          <div className="flex flex-col items-center justify-center text-center bg-canvas-secondary rounded-3xl p-12 md:p-16 transition-transform duration-300 hover:scale-[1.01]">
            <h3 className="text-3xl font-semibold tracking-tight mb-4">Pay over time</h3>
            <p className="text-lg text-fg-muted mb-8 max-w-sm">
              Get the device you want with flexible payment options. Choose what works best for you.
            </p>
            <Link to="/financing">
              <Button variant="outline" className="border-fg text-fg hover:bg-fg hover:text-canvas">Learn about financing</Button>
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
}
