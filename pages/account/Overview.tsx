import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import { Package, Heart, MapPin, User, ChevronRight, Shield } from 'lucide-react';
import { getCustomerOrders } from '../../lib/api/orders';
import { formatPrice } from '../../lib/money';

export default function Overview() {
  const user = useAuthStore(state => state.user);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getCustomerOrders();
        // Limit to 3 for overview
        setRecentOrders(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load recent orders", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const stats = [
    { name: 'Orders', icon: Package, link: '/account/orders', desc: 'View your order history' },
    { name: 'Addresses', icon: MapPin, link: '/account/addresses', desc: 'Manage delivery addresses' },
    { name: 'Profile', icon: User, link: '/account/profile', desc: 'Update your information' },
    { name: 'Security', icon: Shield, link: '/account/security', desc: 'Password and protection' },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold tracking-tight hidden lg:block">Overview</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            to={stat.link}
            className="group flex flex-col p-6 rounded-2xl bg-canvas border border-border/50 hover:border-accent/50 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-canvas-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <stat.icon className="w-5 h-5 text-fg-muted group-hover:text-accent transition-colors" />
              </div>
              <ChevronRight className="w-5 h-5 text-border group-hover:text-accent transition-colors" />
            </div>
            <h3 className="font-semibold text-lg">{stat.name}</h3>
            <p className="text-sm text-fg-muted mt-1">{stat.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold tracking-tight">Recent Orders</h3>
          <Link to="/account/orders" className="text-accent text-sm font-medium hover:underline">
            View All
          </Link>
        </div>

        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex flex-col sm:flex-row justify-between p-4 border border-border/30 rounded-xl bg-canvas-secondary/30 h-24"></div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl">
            <Package className="w-12 h-12 text-border mx-auto mb-4" />
            <p className="text-fg-muted font-medium mb-2">No orders yet.</p>
            <p className="text-sm text-fg-muted mb-6">Your next great Apple experience is waiting.</p>
            <Link to="/" className="inline-flex items-center justify-center rounded-full bg-accent text-white px-6 py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/50 rounded-2xl hover:border-border transition-colors">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-canvas-secondary text-fg-muted">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-fg-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                  
                  {order.items && order.items.length > 0 && (
                    <p className="text-sm mt-2 font-medium">
                      {order.items[0].name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <Link 
                    to={`/account/orders/${order.id}`}
                    className="text-accent text-sm font-medium hover:underline flex items-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
