import { Link } from 'react-router';
import { SEO } from './SEO';
import { Container } from './ui/Container';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-canvas">
      <SEO title="Page Not Found - Apple" />
      <Container className="max-w-2xl py-24">
        <h1 className="text-8xl md:text-9xl font-semibold tracking-tighter text-fg mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-fg-muted mb-12">
          Page non trouvée / Page not found
        </h2>
        
        <p className="text-fg/80 mb-12 max-w-lg mx-auto leading-relaxed">
          The page you're looking for can't be found. It might have been removed, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto px-8 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-colors"
          >
            Return Home
          </Link>
          <Link 
            to="/search" 
            className="w-full sm:w-auto px-8 py-3 bg-canvas-secondary text-fg font-medium rounded-full hover:bg-border/50 transition-colors"
          >
            Search Products
          </Link>
        </div>
      </Container>
    </div>
  );
}
