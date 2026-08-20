import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate as useNavigate } from '../hooks/useLocalizedNavigate';
import { useState, useEffect, useMemo } from 'react';
import { useCartStore, selectSubtotal } from '../store/cartStore';
import { createOrder } from '../lib/api/orders';
import { initializePayment } from '../lib/api/payments';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { StoreSettings } from '../types/settings';
import { calculateTotals } from '../lib/pricing';
import { formatPrice } from '../lib/money';

export default function Checkout() {
  const { t, i18n } = useTranslation(['checkout', 'common']);
  const { items, setItems } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    fetch('/api/store/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load store settings', err));
  }, []);

  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mtn_momo' | 'cash_on_delivery'>('orange_money');
  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: 'Douala',
    postalCode: '',
    country: 'Cameroon',
    phone: ''
  });

  const totals = useMemo(() => {
    if (!settings) return null;
    const zone = settings.deliveryZones?.find(z => z.city.toLowerCase() === form.city.toLowerCase()) || null;
    return calculateTotals(subtotal, zone, settings);
  }, [subtotal, form.city, settings]);

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
    <Container className="py-12 md:py-24 max-w-6xl">
      <h1 className="text-4xl font-semibold tracking-tight mb-8">{t('checkout', { ns: 'checkout' })}</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="checkout-fullname" className="block text-sm font-medium mb-1">{t('full_name', { ns: 'checkout' })}</label>
              <input id="checkout-fullname" required type="text" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-shadow" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-sm font-medium mb-1">{t('phone', { ns: 'checkout' })}</label>
              <input id="checkout-phone" required type="tel" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-shadow" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label htmlFor="checkout-street" className="block text-sm font-medium mb-1">{t('street_address', { ns: 'checkout' })}</label>
              <input id="checkout-street" required type="text" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-shadow" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-city" className="block text-sm font-medium mb-1">{t('city', { ns: 'checkout' })}</label>
                <input id="checkout-city" required type="text" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-shadow" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              </div>
              <div>
                <label htmlFor="checkout-postal" className="block text-sm font-medium mb-1">{t('postal_code', { ns: 'checkout' })}</label>
                <input id="checkout-postal" required type="text" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-shadow" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
              </div>
            </div>
            <div>
              <label htmlFor="checkout-country" className="block text-sm font-medium mb-1">{t('country', { ns: 'checkout' })}</label>
              <input id="checkout-country" required type="text" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-3 cursor-not-allowed opacity-80" readOnly value={form.country} />
            </div>
            
            <fieldset className="space-y-4 pt-6 mt-6 border-t border-border/50">
              <legend className="text-xl font-semibold mb-4">{t('payment_method', { ns: 'checkout' })}</legend>
              <div className="flex flex-col sm:flex-row gap-4">
                <label htmlFor="payment-orange" className="flex items-center gap-3 cursor-pointer p-4 border border-border/50 rounded-xl hover:bg-canvas-secondary/50 transition-colors">
                  <input id="payment-orange" type="radio" name="payment" value="orange_money" className="w-4 h-4 text-accent focus:ring-accent" checked={paymentMethod === 'orange_money'} onChange={() => setPaymentMethod('orange_money')} />
                  <span className="font-medium">Orange Money</span>
                </label>
                <label htmlFor="payment-mtn" className="flex items-center gap-3 cursor-pointer p-4 border border-border/50 rounded-xl hover:bg-canvas-secondary/50 transition-colors">
                  <input id="payment-mtn" type="radio" name="payment" value="mtn_momo" className="w-4 h-4 text-accent focus:ring-accent" checked={paymentMethod === 'mtn_momo'} onChange={() => setPaymentMethod('mtn_momo')} />
                  <span className="font-medium">MTN MoMo</span>
                </label>
                <label htmlFor="payment-cod" className="flex items-center gap-3 cursor-pointer p-4 border border-border/50 rounded-xl hover:bg-canvas-secondary/50 transition-colors">
                  <input id="payment-cod" type="radio" name="payment" value="cash_on_delivery" className="w-4 h-4 text-accent focus:ring-accent" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>
            </fieldset>
          </form>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-canvas-secondary border border-border/50 rounded-[2rem] p-6 lg:p-8 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">{t('order_summary', { ns: 'checkout' })}</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map(item => {
                const isFrench = i18n.language === 'fr';
                const name = (item.product.name as any)?.[isFrench ? 'fr' : 'en'] || item.product.name;
                return (
                  <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-fg truncate">{name}</p>
                      <p className="text-xs text-fg-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm whitespace-nowrap">{formatPrice(item.priceAtAdded * item.quantity)}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border/50 text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>{t('subtotal', { ns: 'checkout' })}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {totals && (
                <>
                  <div className="flex justify-between text-fg-muted">
                    <span>{t('shipping', { ns: 'checkout' })}</span>
                    <span>{totals.shipping === 0 ? t('free', { ns: 'checkout' }) : formatPrice(totals.shipping)}</span>
                  </div>
                  {settings?.taxEnabled && (
                    <div className="flex justify-between text-fg-muted">
                      <span>{settings.taxLabel || t('taxes', { ns: 'checkout' })}</span>
                      <span>{formatPrice(totals.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg text-fg pt-4 mt-4 border-t border-border/50">
                    <span>{t('total', { ns: 'checkout' })}</span>
                    <span>{formatPrice(totals.total)}</span>
                  </div>
                </>
              )}
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting || !settings} 
              className="w-full mt-8 py-4 text-base font-medium rounded-full"
            >
              {isSubmitting ? t('processing', { ns: 'checkout' }) : t('place_order', { ns: 'checkout' })}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
