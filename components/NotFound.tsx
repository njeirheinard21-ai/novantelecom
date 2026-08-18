import { LocalizedLink as Link } from '../components/ui/LocalizedLink';
import { SEO } from './SEO';
import { Container } from './ui/Container';
import { useTranslation } from 'react-i18next';

export function NotFound() {
  const { t } = useTranslation(['common']);
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-canvas">
      <SEO title={t('page_not_found')} />
      <Container className="max-w-2xl py-24">
        <h1 className="text-8xl md:text-9xl font-semibold tracking-tighter text-fg mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-fg-muted mb-12">
          {t('page_not_found')}
        </h2>
        
        <p className="text-fg/80 mb-12 max-w-lg mx-auto leading-relaxed">
          {t('page_not_found_desc')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto px-8 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-colors"
          >
            {t('return_home')}
          </Link>
          <Link 
            to="/search" 
            className="w-full sm:w-auto px-8 py-3 bg-canvas-secondary text-fg font-medium rounded-full hover:bg-border/50 transition-colors"
          >
            {t('search')}
          </Link>
        </div>
      </Container>
    </div>
  );
}
