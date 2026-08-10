import { Link, useLocation, Outlet } from 'react-router';
import { Container } from '../ui/Container';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../lib/permissions';

export function AdminLayout() {
  const location = useLocation();
  const role = useAuthStore(state => state.role);

  const links = [
    { name: 'Dashboard', path: '/admin', permission: 'orders:read' as const },
    { name: 'Orders', path: '/admin/orders', permission: 'orders:read' as const },
    { name: 'Products', path: '/admin/products', permission: 'products:read' as const },
    { name: 'Inventory', path: '/admin/inventory', permission: 'inventory:read' as const },
    { name: 'Customers', path: '/admin/customers', permission: 'customers:read' as const },
    { name: 'Staff', path: '/admin/staff', permission: 'users:manage' as const },
    { name: 'Settings', path: '/admin/settings', permission: 'settings:manage' as const },
  ];

  const visibleLinks = links.filter(link => hasPermission(role, link.permission));

  return (
    <Container className="py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {visibleLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-canvas-secondary text-accent font-semibold' 
                      : 'text-fg-muted hover:bg-canvas-secondary hover:text-fg'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </Container>
  );
}
