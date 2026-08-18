import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';

export default function Wishlist() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col w-full min-h-[60vh]">
      <SEO title="Wishlist" />
      <div className="bg-canvas-secondary py-12 border-b">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Your Wishlist
          </h1>
        </Container>
      </div>

      <Container className="py-12">
        <div className="flex flex-col items-center justify-center h-64 bg-canvas-secondary rounded-3xl">
          <p className="text-fg-muted text-lg">{t('wishlist_empty')}</p>
        </div>
      </Container>
    </div>
  );
}
