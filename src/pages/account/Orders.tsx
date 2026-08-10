import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getCustomerOrders } from '../../lib/api/orders';
import { formatPrice } from '../../lib/money';
import { Package } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomerOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold tracking-tight">Order History</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-canvas border border-border/50 rounded-2xl h-32"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl text-center">
          <p>{error}</p>
          <button onClick={fetchOrders} className="mt-4 px-4 py-2 bg-white rounded-full text-sm font-medium border border-red-100 hover:bg-red-50 transition-colors">
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/50 rounded-[2rem] bg-canvas">
          <Package className="w-12 h-12 text-border mx-auto mb-4" />
          <p className="text-fg-muted font-medium mb-2">No orders yet.</p>
          <p className="text-sm text-fg-muted mb-8">Your next great Apple experience is waiting.</p>
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-accent text-white px-8 py-3 text-sm font-medium hover:bg-accent/90 transition-colors">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-border/50 rounded-[2rem] p-6 sm:p-8 bg-canvas shadow-sm flex flex-col sm:flex-row justify-between sm:items-center hover:border-border transition-colors">
              <div className="mb-6 sm:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-lg">{order.orderNumber}</p>
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-canvas-secondary text-fg-muted">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-fg-muted mb-3">{new Date(order.createdAt).toLocaleDateString()}</p>
                
                <div className="space-y-1">
                  {order.items?.map((item: any, i: number) => (
                    <p key={i} className="text-sm font-medium text-fg/80">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4 sm:gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <p className="font-bold text-xl">{formatPrice(order.total)}</p>
                <Link 
                  to={`/account/orders/${order.id}`} 
                  className="inline-flex items-center justify-center rounded-full bg-canvas-secondary px-6 py-2 text-sm font-medium text-fg hover:bg-border/50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
