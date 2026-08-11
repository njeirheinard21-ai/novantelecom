import { Link } from 'react-router';

const FOOTER_LINKS = {
  'Acheter et découvrir': [
    { name: 'Mac', href: '/category/mac' },
    { name: 'iPhone', href: '/category/iphone' },
    { name: 'iPad', href: '/category/ipad' },
    { name: 'Apple Watch', href: '/category/watch' },
    { name: 'AirPods', href: '/category/airpods' },
    { name: 'Accessories', href: '/category/accessories' },
  ],
  'Compte': [
    { name: 'Gérer votre compte Apple', href: '/account' },
    { name: 'Compte BestBuy', href: '/account' },
  ],
  'À propos': [
    { name: 'Support', href: '/support' },
    { name: 'Services', href: '/services' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contacter BestBuy', href: '/contact' },
  ]
};

export function Footer() {
  return (
    <footer className="bg-canvas-secondary pt-12 pb-8 text-xs text-fg-muted border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footnotes / Trust elements */}
        <div className="pb-8 border-b border-border">
          <p className="mb-2">1. Les valeurs de reprise varient selon l'état, l'année et la configuration de votre appareil éligible.</p>
          <p>2. Les mensualités sont disponibles lors du choix d'une offre de financement éligible.</p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-fg mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-fg hover:underline transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border">
          <p>&copy; {new Date().getFullYear()} BestBuy. Tous droits réservés.</p>
          <div className="flex space-x-4">
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">Politique de confidentialité</Link>
            <span className="hidden md:inline border-l border-border h-3" />
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">Conditions d'utilisation</Link>
            <span className="hidden md:inline border-l border-border h-3" />
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">Politique de vente</Link>
            <span className="hidden md:inline border-l border-border h-3" />
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
