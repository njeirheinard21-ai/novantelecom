import { Container } from '../ui/Container';
import Truck from 'lucide-react/dist/esm/icons/truck';
import Shield from 'lucide-react/dist/esm/icons/shield';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Headphones from 'lucide-react/dist/esm/icons/headphones';

const SERVICES = [
  {
    title: 'Livraison Gratuite',
    description: 'Sur les commandes de plus de 50 000 FCFA dans les zones éligibles.',
    icon: Truck,
  },
  {
    title: 'Garantie Officielle',
    description: 'Tous les produits sont couverts par une garantie officielle Apple.',
    icon: Shield,
  },
  {
    title: 'Financement Flexible',
    description: 'Payez en plusieurs fois grâce à nos options de financement.',
    icon: CreditCard,
  },
  {
    title: 'Assistance Expert',
    description: "Obtenez de l'aide de nos professionnels certifiés Apple.",
    icon: Headphones,
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-surface border-t border-border">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            L'expérience Nova Telecom
          </h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour tirer le meilleur parti de vos appareils Apple, en un seul endroit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-canvas-secondary/50">
                <div className="w-12 h-12 rounded-full bg-surface shadow-sm flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-fg" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
