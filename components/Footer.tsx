import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '../components/ui/LocalizedLink';



export function Footer() {
  const { t } = useTranslation();

  const FOOTER_LINKS = {
    [t('shop_and_learn')]: [
      { name: 'Mac', href: '/category/mac' },
      { name: 'iPhone', href: '/category/iphone' },
      { name: 'iPad', href: '/category/ipad' },
      { name: 'Apple Watch', href: '/category/watch' },
      { name: 'AirPods', href: '/category/airpods' },
      { name: t('accessories'), href: '/category/accessories' },
    ],
    [t('account')]: [
      { name: t('manage_apple_account'), href: '/account' },
      { name: t('nova_account'), href: '/account' },
    ],
    [t('about')]: [
      { name: t('support'), href: '/support' },
      { name: t('services'), href: '/services' },
      { name: t('faq'), href: '/faq' },
      { name: t('contact_nova'), href: '/contact' },
    ]
  };


  return (
    <footer className="bg-canvas-secondary pt-12 pb-8 text-xs text-fg-muted border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footnotes / Trust elements */}
        <div className="pb-8 border-b border-border">
          <p className="mb-2">{t('footer_note_1')}</p>
          <p>{t('footer_note_2')}</p>
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
          <p>&copy; {new Date().getFullYear()} Nova Telecom. {t('all_rights_reserved')}</p>
          <div className="flex space-x-4">
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">{t('privacy_policy')}</Link>
            <span className="hidden md:inline border-l border-border h-3" />
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">{t('terms_of_use')}</Link>
            <span className="hidden md:inline border-l border-border h-3" />
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">{t('sales_policy')}</Link>
            <span className="hidden md:inline border-l border-border h-3" />
            <Link to="/legal" className="hover:text-fg hover:underline transition-colors">{t('legal_info')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
