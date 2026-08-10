import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAdminOrders } from '../../../lib/api/orders';
import { formatPrice } from '../../../lib/money';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Manage Orders</h1>
        <select 
          className="border border-b border-border/50order/50 bg-canvas rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-accent"
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

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          <p>{error}</p>
          <button onClick={fetchOrders} className="mt-2 text-sm underline">Retry</button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-fg-muted">No orders found.</p>
      ) : (
        <div className="bg-canvas border rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-secondary border-b border-border/50">
                <th className="p-4 font-medium text-fg-muted text-sm">Order</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Date</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Customer</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Total</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Status</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-canvas-secondary">
                  <td className="p-4 font-medium">{order.orderNumber}</td>
                  <td className="p-4 text-sm text-fg-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">{order.shippingAddress?.fullName}</td>
                  <td className="p-4 text-sm font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4 text-sm capitalize">
                    <span className="px-2 py-1 bg-canvas-secondary rounded-full text-xs font-semibold">{order.status.replace('_', ' ')}</span>
                  </td>
                  <td className="p-4 text-sm">
                    <Link to={`/admin/orders/${order.id}`} className="text-accent hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
