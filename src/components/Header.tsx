import { OptimizedImage } from './ui/OptimizedImage';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LocalizedLink as Link } from '../components/ui/LocalizedLink';
import Search from 'lucide-react/dist/esm/icons/search';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import User from 'lucide-react/dist/esm/icons/user';
import { useState } from 'react';
import { useCartStore, selectTotalItems } from '../store/cartStore';
import { useScrollLock } from '../hooks/useScrollLock';



export function Header() {

  const { t } = useTranslation(['navigation', 'common']);
  
  const NAV_LINKS = [
    { name: t('mac', { ns: 'navigation' }), href: '/category/mac' },
    { name: t('iphone', { ns: 'navigation' }), href: '/category/iphone' },
    { name: t('ipad', { ns: 'navigation' }), href: '/category/ipad' },
    { name: t('watch', { ns: 'navigation' }), href: '/category/watch' },
    { name: t('airpods', { ns: 'navigation' }), href: '/category/airpods' },
    { name: t('accessories', { ns: 'navigation' }), href: '/category/accessories' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useScrollLock(isMobileMenuOpen);
  const setIsCartOpen = useCartStore(state => state.setIsOpen);
  const totalItems = useCartStore(selectTotalItems);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-canvas/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between lg:h-14">
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 -ml-2 text-fg hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link to="/" className="hover:opacity-80 transition-opacity flex items-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Einort%2FChatGPT%20Image%20Aug%2013%2C%202026%2C%2003_13_57%20PM.png?alt=media&token=90237423-74ca-4647-ad32-18a89c0d7e64" alt="Nova Telecom Logo" className="h-[46px] md:h-[54px] w-auto object-contain" referrerPolicy="no-referrer" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-fg/80 hover:text-fg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="hidden lg:block"><LanguageSwitcher /></div>
              <Link to="/search" aria-label="Search" className="text-fg/80 hover:text-fg transition-colors">
                <Search className="h-4 w-4 lg:h-5 lg:w-5" />
              </Link>
              <Link to="/account" aria-label="Account" className="hidden lg:block text-fg/80 hover:text-fg transition-colors">
                <User className="h-5 w-5" />
              </Link>
              <button aria-label="Shopping Bag" onClick={() => setIsCartOpen(true)} className="text-fg/80 hover:text-fg transition-colors relative">
                <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
                {totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">{totalItems}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden pointer-events-none transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'opacity-0'
          }`} 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <div 
          className={`absolute inset-y-0 left-0 w-[85%] max-w-sm bg-canvas shadow-2xl flex flex-col transform transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMobileMenuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <span className="font-semibold text-lg tracking-tight">{t('menu', { ns: 'common' })}</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-fg-muted hover:text-fg transition-colors bg-canvas-secondary rounded-full"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col space-y-6 text-lg font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-fg/80 hover:text-fg hover:translate-x-1 transform transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-border/40 my-4" />
            <div className="pt-2 pb-4"><LanguageSwitcher /></div>
            <Link
              to="/account"
              className="flex items-center space-x-3 text-fg/80 hover:text-fg hover:translate-x-1 transform transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>{t('account', { ns: 'common' })}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
