import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate as useNavigate } from '../../hooks/useLocalizedNavigate';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { Outlet, NavLink } from 'react-router';
import { Container } from '../../components/ui/Container';
import { SEO } from '../../components/SEO';
import { useAuthStore } from '../../store/authStore';
import {
  User, Package, MapPin, Heart, Shield, Settings, LifeBuoy, LogOut, Search
} from 'lucide-react';
import { auth } from '../../lib/auth';
import { signOut } from 'firebase/auth';
import { ArrowRight } from 'lucide-react';

export default function AccountLayout() {
  const { t } = useTranslation(['auth']);
  const user = useAuthStore(state => state.user);
  const role = useAuthStore(state => state.role);
  const isAdmin = role === 'super_admin' || role === 'admin' || role === 'staff';
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/account', icon: User, end: true },
    { name: 'Orders', path: '/account/orders', icon: Package },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Profile', path: '/account/profile', icon: User },
    { name: 'Security', path: '/account/security', icon: Shield },
    { name: 'Preferences', path: '/account/preferences', icon: Settings },
    { name: 'Support', path: '/account/support', icon: LifeBuoy },
  ];

  return (
    <div className="min-h-[70vh] bg-canvas">
      <SEO title="Your Account" />
      
      {/* Account Hero */}
      <div className="bg-canvas-secondary/30 border-b border-border/50 py-12">
        <Container className="max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'Customer'}
          </h1>
          <p className="text-fg-muted mt-2 text-lg">
            Manage your orders, profile, and preferences.
          </p>
        </Container>
      </div>

      <Container className="max-w-6xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Mobile Navigation (Horizontal Scroll) */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-4 hide-scrollbar">
            <nav className="flex space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors \${
                      isActive 
                        ? 'bg-canvas-secondary text-fg shadow-sm border border-border/50' 
                        : 'text-fg-muted hover:text-fg hover:bg-canvas-secondary/50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors"
                >
                  <span>{t('admin_panel', { ns: 'account' })}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('sign_out', { ns: 'auth' })}</span>
              </button>
            </nav>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav className="space-y-1">
              <h3 className="px-4 text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">{t('account', { ns: 'account' })}</h3>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors \${
                      isActive 
                        ? 'bg-canvas-secondary text-fg shadow-sm border border-border/50' 
                        : 'text-fg-muted hover:text-fg hover:bg-canvas-secondary/50 border border-transparent'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              {isAdmin && (
                <div className="pt-8 mt-8 border-t border-border/50">
                  <h3 className="px-4 text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">{t('admin_access', { ns: 'account' })}</h3>
                  <Link 
                    to="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors w-full"
                  >
                    <span>{t('admin_panel', { ns: 'account' })}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
              
              <div className="pt-4 mt-4 border-t border-border/50">
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('sign_out', { ns: 'auth' })}</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </Container>
    </div>
  );
}
