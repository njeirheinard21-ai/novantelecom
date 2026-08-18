import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getCustomerOrder } from '../../lib/api/orders';
import { formatPrice } from '../../lib/money';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getCustomerOrder(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-canvas border border-border/50 rounded w-1/3"></div>
        <div className="h-64 bg-canvas border border-border/50 rounded-[2rem]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
        <button onClick={() => navigate('/account/orders')} className="text-accent hover:underline">
          Back to Orders
        </button>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'paid', label: 'Payment Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }
  ];

  let currentStepIndex = 0;
  if (order.status === 'paid' || order.status === 'payment_pending') currentStepIndex = 1;
  if (order.status === 'processing') currentStepIndex = 2;
  if (order.status === 'shipped') currentStepIndex = 3;
  if (order.status === 'delivered') currentStepIndex = 4;
  if (order.status === 'cancelled' || order.status === 'refunded' || order.status === 'amount_mismatch') currentStepIndex = -1;

  return (
    <div className="space-y-8">
      <div>
        <Link to="/account/orders" className="inline-flex items-center text-sm text-fg-muted hover:text-accent mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Order {order.orderNumber}</h2>
            <p className="text-fg-muted mt-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-canvas-secondary text-fg self-start sm:self-auto border border-border/50">
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Progress Timeline (Desktop Horizontal, Mobile Vertical handled by flex-col/row) */}
      {currentStepIndex >= 0 && (
        <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm overflow-hidden">
          <div className="relative">
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0 relative z-10">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex sm:flex-col items-center gap-4 sm:gap-3 bg-canvas sm:px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors \${
                      isCompleted ? 'bg-accent border-accent text-white' : 'bg-canvas-secondary border-border text-border'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium \${isCompleted ? 'text-fg' : 'text-fg-muted'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Items</h3>
            <div className="space-y-6">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between pb-6 border-b border-border/50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-fg-muted mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-border/50 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-fg-muted" /> Delivery
            </h3>
            <div className="text-sm text-fg/80 space-y-1">
              <p className="font-medium text-fg">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-2 text-fg-muted">{order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
