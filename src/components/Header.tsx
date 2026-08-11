import { Link } from 'react-router';
import Search from 'lucide-react/dist/esm/icons/search';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import User from 'lucide-react/dist/esm/icons/user';
import { useState } from 'react';
import { useCartStore, selectTotalItems } from '../store/cartStore';

const NAV_LINKS = [
  { name: 'Mac', href: '/category/mac' },
  { name: 'iPhone', href: '/category/iphone' },
  { name: 'iPad', href: '/category/ipad' },
  { name: 'Apple Watch', href: '/category/watch' },
  { name: 'AirPods', href: '/category/airpods' },
  { name: 'Accessories', href: '/category/accessories' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            <Link to="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
              BestBuy
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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-canvas shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-lg">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-fg hover:text-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col space-y-6 text-lg font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-fg hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-border" />
              <Link
                to="/account"
                className="flex items-center space-x-3 text-fg hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
