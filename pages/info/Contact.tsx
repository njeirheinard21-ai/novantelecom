import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';
import { siteConfig } from '../../config/site';

export default function Contact() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col w-full min-h-[60vh]">
      <SEO title="Contact Us" />
      <div className="bg-canvas-secondary py-12 border-b">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-fg-muted max-w-2xl">
            Get in touch with the Novan Telecom team for sales, support, and inquiries.
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-2xl bg-canvas-secondary rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Store Location & Details</h2>
          <div className="space-y-4 text-lg">
            <p><strong>Address:</strong> {siteConfig.contact.address}</p>
            <p><strong>Email:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-accent hover:underline">{siteConfig.contact.email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="text-accent hover:underline">{siteConfig.contact.phone}</a></p>
            <p><strong>WhatsApp:</strong> <a href={siteConfig.contact.whatsapp} target="_blank" rel="noreferrer" className="text-accent hover:underline">{t('message_us_whatsapp')}</a></p>
          </div>
        </div>
      </Container>
    </div>
  );
}
