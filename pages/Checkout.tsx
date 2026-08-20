import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate as useNavigate } from '../hooks/useLocalizedNavigate';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../lib/api/orders';
import { initializePayment } from '../lib/api/payments';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export default function Checkout() {
  const { t } = useTranslation(['checkout']);
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
        <h1 className="text-2xl font-bold mb-4">{t('checkout', { ns: 'checkout' })}</h1>
        <p>{t('cart_empty', { ns: 'common' })}</p>
        <Button onClick={() => navigate('/')} className="mt-4">{t('continue_shopping', { ns: 'checkout' })}</Button>
      </Container>
    );
  }

  return (
    <Container className="py-24 max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight mb-8">{t('checkout', { ns: 'checkout' })}</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="checkout-fullname" className="block text-sm font-medium mb-1">{t('full_name', { ns: 'checkout' })}</label>
          <input id="checkout-fullname" required type="text" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-primary focus:outline-none" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
        </div>
        <div>
          <label htmlFor="checkout-phone" className="block text-sm font-medium mb-1">{t('phone', { ns: 'checkout' })}</label>
          <input id="checkout-phone" required type="tel" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-primary focus:outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div>
          <label htmlFor="checkout-street" className="block text-sm font-medium mb-1">{t('street_address', { ns: 'checkout' })}</label>
          <input id="checkout-street" required type="text" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-primary focus:outline-none" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkout-city" className="block text-sm font-medium mb-1">{t('city', { ns: 'checkout' })}</label>
            <input id="checkout-city" required type="text" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-primary focus:outline-none" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          </div>
          <div>
            <label htmlFor="checkout-postal" className="block text-sm font-medium mb-1">{t('postal_code', { ns: 'checkout' })}</label>
            <input id="checkout-postal" required type="text" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-primary focus:outline-none" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
          </div>
        </div>
        <div>
          <label htmlFor="checkout-country" className="block text-sm font-medium mb-1">{t('country', { ns: 'checkout' })}</label>
          <input id="checkout-country" required type="text" className="w-full border rounded-xl p-2 bg-canvas-secondary cursor-not-allowed opacity-80" readOnly value={form.country} />
        </div>
        
        <fieldset className="space-y-4 pt-4 border-t">
          <legend className="text-xl font-semibold mb-4 px-1">{t('payment_method', { ns: 'checkout' })}</legend>
          <div className="flex flex-col sm:flex-row gap-4">
            <label htmlFor="payment-orange" className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-canvas-secondary/50 transition-colors">
              <input id="payment-orange" type="radio" name="payment" value="orange_money" className="w-4 h-4 text-primary focus:ring-primary" checked={paymentMethod === 'orange_money'} onChange={() => setPaymentMethod('orange_money')} />
              Orange Money
            </label>
            <label htmlFor="payment-mtn" className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-canvas-secondary/50 transition-colors">
              <input id="payment-mtn" type="radio" name="payment" value="mtn_momo" className="w-4 h-4 text-primary focus:ring-primary" checked={paymentMethod === 'mtn_momo'} onChange={() => setPaymentMethod('mtn_momo')} />
              MTN MoMo
            </label>
            <label htmlFor="payment-cod" className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-canvas-secondary/50 transition-colors">
              <input id="payment-cod" type="radio" name="payment" value="cash_on_delivery" className="w-4 h-4 text-primary focus:ring-primary" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} />
              Cash on Delivery
            </label>
          </div>
        </fieldset>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-lg">
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
