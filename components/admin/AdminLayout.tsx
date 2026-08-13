import { Link, useLocation, Outlet } from 'react-router';
import { Container } from '../ui/Container';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../lib/permissions';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PackageSearch, 
  Users, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();
  const role = useAuthStore(state => state.role);

  const links = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, permission: 'orders:read' as const },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, permission: 'orders:read' as const },
    { name: 'Products', path: '/admin/products', icon: PackageSearch, permission: 'products:read' as const },
    { name: 'Inventory', path: '/admin/inventory', icon: PackageSearch, permission: 'inventory:read' as const },
    { name: 'Customers', path: '/admin/customers', icon: Users, permission: 'customers:read' as const },
    { name: 'Staff', path: '/admin/staff', icon: ShieldCheck, permission: 'users:manage' as const },
    { name: 'Settings', path: '/admin/settings', icon: Settings, permission: 'settings:manage' as const },
  ];

  const visibleLinks = links.filter(link => hasPermission(role, link.permission));

  return (
    <div className="min-h-dvh bg-canvas">
      <Container className="py-12 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-4 px-3">
                Management
              </h2>
              <nav className="flex flex-col space-y-1">
                {visibleLinks.map(link => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-accent text-white shadow-sm' 
                          : 'text-fg-muted hover:bg-canvas-secondary hover:text-fg'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-fg-muted'}`} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-canvas-secondary/30 rounded-3xl p-6 md:p-10 border border-border/40 shadow-sm min-h-[70vh]">
              <Outlet />
            </div>
          </main>

        </div>
      </Container>
    </div>
  );
}
