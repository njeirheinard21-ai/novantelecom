import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../lib/api/orders';
import { initializePayment } from '../lib/api/payments';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export default function Checkout() {
  const { items, setItems } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mtn_momo' | 'cash_on_delivery'>('orange_money');
  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: 'Douala',
    postalCode: '',
    country: 'Cameroon',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      const orderData = {
        items: items.map(item => {
          const orderItem: any = {
            productId: item.productId,
            quantity: item.quantity,
          };
          if (item.variantId) {
            orderItem.variantId = item.variantId;
          }
          return orderItem;
        }),
        shippingAddress: form
      };
      
      const newOrder = await createOrder(orderData);
      
      const paymentData = await initializePayment({
        orderId: newOrder.id,
        method: paymentMethod,
        phone: paymentMethod !== 'cash_on_delivery' ? form.phone : undefined
      });
      
      if (paymentData.redirectUrl) {
        navigate(paymentData.redirectUrl);
      } else {
        navigate(`/account/orders/${newOrder.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-24">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p>Your cart is empty.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Container className="py-24 max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input required type="text" className="w-full border rounded-xl p-2" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input required type="text" className="w-full border rounded-xl p-2" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input required type="text" className="w-full border rounded-xl p-2" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input required type="text" className="w-full border rounded-xl p-2" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input required type="text" className="w-full border rounded-xl p-2" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input required type="text" className="w-full border rounded-xl p-2 bg-canvas-secondary" readOnly value={form.country} />
        </div>
        
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Payment Method</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="orange_money" checked={paymentMethod === 'orange_money'} onChange={() => setPaymentMethod('orange_money')} />
              Orange Money
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="mtn_momo" checked={paymentMethod === 'mtn_momo'} onChange={() => setPaymentMethod('mtn_momo')} />
              MTN MoMo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} />
              Cash on Delivery
            </label>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-lg">
          Place Order
        </Button>

      </form>
    </Container>
  );
}
