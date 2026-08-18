import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAdminOrders } from '../../../lib/api/orders';
import { formatPrice } from '../../../lib/money';
import { ChevronRight, Search } from 'lucide-react';

export default function AdminOrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrders(statusFilter);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/50';
      case 'processing':
      case 'shipped':
        return 'bg-blue-50 text-blue-600 border border-blue-200/50';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-50 text-red-600 border border-red-200/50';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-fg">Orders</h1>
          <p className="text-fg-muted mt-2 text-sm">Manage and fulfill customer orders.</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-4 w-4 text-fg-muted" />
          </div>
          <select 
            className="pl-10 pr-10 py-2.5 bg-canvas rounded-xl border border-border/50 text-sm font-medium outline-none focus:ring-2 focus:ring-accent focus:border-accent appearance-none cursor-pointer transition-shadow"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">
          <p>{error}</p>
          <button onClick={fetchOrders} className="mt-2 font-semibold hover:underline">Retry</button>
        </div>
      )}

      <div className="bg-canvas border border-border/40 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-12 text-center text-fg-muted text-sm animate-pulse">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-canvas-secondary rounded-full flex items-center justify-center mb-4">
               <Search className="w-6 h-6 text-fg-muted" />
            </div>
            <h3 className="text-lg font-semibold text-fg">No orders found</h3>
            <p className="text-fg-muted text-sm mt-1">Adjust your filters to see more results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas-secondary/50 border-b border-border/40">
                  <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Order</th>
                  <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Date</th>
                  <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Customer</th>
                  <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Total</th>
                  <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {orders.map(order => (
                  <tr key={order.id} className="group hover:bg-canvas-secondary/50 transition-colors">
                    <td className="p-5 font-medium text-sm text-fg">{order.orderNumber}</td>
                    <td className="p-5 text-sm text-fg-muted">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="p-5 text-sm text-fg">{order.shippingAddress?.fullName}</td>
                    <td className="p-5 text-sm font-semibold">{formatPrice(order.total)}</td>
                    <td className="p-5 text-sm">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-right">
                      <Link 
                        to={`/admin/orders/${order.id}`} 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-canvas-secondary group-hover:bg-accent group-hover:text-white text-fg-muted transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
