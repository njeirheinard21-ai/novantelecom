import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';

export default function Services() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col w-full min-h-[60vh]">
      <SEO title="Services" />
      <div className="bg-canvas-secondary py-12 border-b">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Services
          </h1>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-2xl text-lg space-y-6">
          <p>{t('welcome_to', { page: t('services', { ns: 'navigation' }) })}</p>
          <p>{t('more_info_contact')}</p>
        </div>
      </Container>
    </div>
  );
}
