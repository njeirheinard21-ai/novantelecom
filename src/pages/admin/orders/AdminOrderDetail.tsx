import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '../../../components/ui/LocalizedLink';
import { useEffect, useState } from 'react';
import { useParams, } from 'react-router';
import { getAdminOrder, updateOrderStatus } from '../../../lib/api/orders';
import { formatPrice } from '../../../lib/money';
import { Button } from '../../../components/ui/Button';

const STATUS_OPTIONS = [
  'pending', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
];

export default function AdminOrderDetail() {
  const { t } = useTranslation(['checkout', 'common']);
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrder(id!);
      setOrder(data);
      setNewStatus(data.status);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return;
    setUpdating(true);
    setError(null);
    try {
      await updateOrderStatus(id!, newStatus);
      await fetchOrder();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div><p>{t('loading', { ns: 'common' })}</p></div>;

  if (error && !order) return (
    <div>
      <div className="bg-red-50 text-red-600 p-4 rounded-xl">
        <p>{error}</p>
        <button onClick={fetchOrder} className="mt-2 text-sm underline">{t('retry', { ns: 'common' })}</button>
      </div>
    </div>
  );

  if (!order) return null;

  return (
    <div>
      <Link to="/admin/orders" className="text-accent hover:underline mb-6 inline-block">&larr; Back to Orders</Link>
      <div className="bg-canvas border border-border/50 rounded-[2rem] p-8 shadow-sm">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h1>
            <p className="text-fg-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4 bg-canvas-secondary p-4 rounded-2xl border">
            <div>
              <div data-for="orderStatus" className="block text-xs font-semibold text-fg-muted mb-1 uppercase tracking-wide">{t('status', { ns: 'common' })}</div>
              <select 
                className="border-border/50 rounded-xl text-sm p-1.5 bg-canvas"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updating}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <Button 
              size="sm" 
              onClick={handleStatusUpdate} 
              disabled={updating || newStatus === order.status}
            >
              Update
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-fg-muted">Quantity: {item.quantity}</p>
                    <p className="text-sm text-fg-muted">Unit Price: {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-canvas-secondary p-6 rounded-2xl border">
              <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-fg/80"><p>{t('subtotal', { ns: 'checkout' })}</p><p>{formatPrice(order.subtotal)}</p></div>
                <div className="flex justify-between text-fg/80"><p>{t('shipping', { ns: 'checkout' })}</p><p>{formatPrice(order.shipping)}</p></div>
                {order.taxContext.taxEnabled && (
                  <div className="flex justify-between text-fg/80"><p>{order.taxContext.taxLabel}</p><p>{formatPrice(order.tax)}</p></div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 mt-3">
                  <p>{t('total', { ns: 'common' })}</p><p>{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Customer Details</h2>
              <div className="text-sm text-fg/80 bg-canvas border rounded-2xl p-4 leading-relaxed">
                <p className="font-semibold text-gray-900 mb-1">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p className="mt-2">{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
