import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';

export default function Warranty() {
  return (
    <div className="flex flex-col w-full min-h-[60vh]">
      <SEO title="Warranty" />
      <div className="bg-canvas-secondary py-12 border-b">
        <Container>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Warranty
          </h1>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-2xl text-lg space-y-6">
          <p>Welcome to our Warranty page. Nova Telecom is dedicated to providing the best experience.</p>
          <p>For more information, please contact our support team or visit our store.</p>
        </div>
      </Container>
    </div>
  );
}
