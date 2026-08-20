import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../lib/permissions';
import { formatPrice } from '../../lib/money';

export default function Settings() {
  const { t } = useTranslation(['checkout', 'common']);
  const role = useAuthStore(state => state.role);
  const canManageTax = hasPermission(role, 'settings:tax');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    taxEnabled: false,
    taxRatePercent: 0,
    taxLabel: 'VAT',
    shippingFlatRate: 0,
    freeShippingThreshold: 0,
    deliveryZones: [] as { city: string; quarter: string; fee: number }[]
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/admin/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setForm({
          taxEnabled: json.taxEnabled || false,
          taxRatePercent: json.taxRatePercent || 0,
          taxLabel: json.taxLabel || 'VAT',
          shippingFlatRate: json.shippingFlatRate || 0,
          freeShippingThreshold: json.freeShippingThreshold || 0,
          deliveryZones: json.deliveryZones || []
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      alert('Settings saved successfully');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>{t('loading', { ns: 'common' })}</div>;

  const sampleSubtotal = 10000;
  const shippingCost = sampleSubtotal >= form.freeShippingThreshold && form.freeShippingThreshold > 0 
    ? 0 
    : form.shippingFlatRate;
  const taxCost = form.taxEnabled ? (sampleSubtotal * (form.taxRatePercent / 100)) : 0;
  const sampleTotal = sampleSubtotal + shippingCost + taxCost;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Store Settings</h1>
      {error && <div className="text-red-500 bg-red-50 p-4 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6 bg-canvas p-6 rounded-[2rem] border border-border/50 shadow-sm">
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Tax Configuration</h2>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="taxEnabled"
                checked={form.taxEnabled}
                disabled={!canManageTax}
                onChange={e => setForm({...form, taxEnabled: e.target.checked})}
                className="w-5 h-5"
              />
              <div data-for="taxEnabled" className="font-medium">Enable Tax Calculation</div>
              {!canManageTax && <span className="text-xs text-fg-muted">(Requires super_admin)</span>}
            </div>

            {form.taxEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div data-for="taxLabel" className="block text-sm font-medium text-gray-700">Tax Label</div>
                  <input 
                    type="text" 
                    value={form.taxLabel}
                    disabled={!canManageTax}
                    onChange={e => setForm({...form, taxLabel: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                  />
                </div>
                <div>
                  <div data-for="taxRatePercent" className="block text-sm font-medium text-gray-700">Tax Rate (%)</div>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="100"
                    value={form.taxRatePercent}
                    disabled={!canManageTax}
                    onChange={e => setForm({...form, taxRatePercent: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">{t('shipping', { ns: 'checkout' })}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div data-for="shippingFlatRate" className="block text-sm font-medium text-gray-700">Flat Shipping Rate</div>
                <input 
                  type="number" 
                  value={form.shippingFlatRate}
                  onChange={e => setForm({...form, shippingFlatRate: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                />
              </div>
              <div>
                <div data-for="freeShippingThreshold" className="block text-sm font-medium text-gray-700">Free Delivery Threshold</div>
                <input 
                  type="number" 
                  value={form.freeShippingThreshold}
                  onChange={e => setForm({...form, freeShippingThreshold: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                />
              </div>
            
            </div>
            
            <div className="mt-4">
              <div className="block text-sm font-medium text-gray-700 mb-2">Per-Zone Delivery Fees</div>
              {form.deliveryZones.map((zone, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input 
                    type="text" 
                    placeholder="City"
                    value={zone.city}
                    onChange={e => {
                      const newZones = [...form.deliveryZones];
                      newZones[idx].city = e.target.value;
                      setForm({...form, deliveryZones: newZones});
                    }}
                    className="flex-1 rounded-xl border-border/50 border p-2 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Quarter"
                    value={zone.quarter}
                    onChange={e => {
                      const newZones = [...form.deliveryZones];
                      newZones[idx].quarter = e.target.value;
                      setForm({...form, deliveryZones: newZones});
                    }}
                    className="flex-1 rounded-xl border-border/50 border p-2 text-sm"
                  />
                  <input 
                    type="number" 
                    placeholder="Rate"
                    value={zone.fee}
                    onChange={e => {
                      const newZones = [...form.deliveryZones];
                      newZones[idx].fee = parseInt(e.target.value) || 0;
                      setForm({...form, deliveryZones: newZones});
                    }}
                    className="w-24 rounded-xl border-border/50 border p-2 text-sm"
                  />
                  <button type="button" onClick={() => {
                    const newZones = [...form.deliveryZones];
                    newZones.splice(idx, 1);
                    setForm({...form, deliveryZones: newZones});
                  }} className="text-red-500 px-2 text-sm">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({...form, deliveryZones: [...form.deliveryZones, {city: '', quarter: '', fee: 0}]})} className="text-accent text-sm mt-1">+ Add Zone</button>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-accent text-white py-2 rounded-xl hover:bg-accent/90 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        <div className="bg-canvas-secondary p-6 rounded-2xl border h-fit">
          <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-fg/80">Sample Subtotal:</span>
              <span className="font-medium">{formatPrice(sampleSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg/80">Shipping:</span>
              <span className="font-medium">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
            </div>
            {form.taxEnabled && (
              <div className="flex justify-between">
                <span className="text-fg/80">{form.taxLabel} ({form.taxRatePercent.toFixed(2)}%):</span>
                <span className="font-medium">{formatPrice(taxCost)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total:</span>
              <span>{formatPrice(sampleTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
