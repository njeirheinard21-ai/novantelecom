import { SEO } from '../components/SEO';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { ProductCategoryShowcase } from '../components/home/ProductCategoryShowcase';
import { PremiumProductStory } from '../components/home/PremiumProductStory';
import { AccessoriesSection } from '../components/home/AccessoriesSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { TradeInSection } from '../components/home/TradeInSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <SEO title="Accueil" />
      <HeroSection />
      <FeaturedProducts />
      <ProductCategoryShowcase />
      <PremiumProductStory />
      <AccessoriesSection />
      <ServicesSection />
      <TradeInSection />
      <NewsletterSection />
    </div>
  );
}
