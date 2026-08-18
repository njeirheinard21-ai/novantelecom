import { useEffect, useState } from 'react';
import { auth } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../lib/permissions';
import { formatPrice } from '../../lib/money';

export default function Settings() {
  const role = useAuthStore(state => state.role);
  const canManageTax = hasPermission(role, 'settings:tax');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    vatEnabled: false,
    vatRate: 0,
    taxLabel: 'VAT',
    flatShippingRate: 0,
    freeDeliveryThreshold: 0,
    zones: [] as { name: string, rate: number }[]
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
          vatEnabled: json.vatEnabled || false,
          vatRate: json.vatRate || 0,
          taxLabel: json.taxLabel || 'VAT',
          flatShippingRate: json.flatShippingRate || 0,
          freeDeliveryThreshold: json.freeDeliveryThreshold || 0,
          zones: json.zones || []
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

  if (loading) return <div>Loading...</div>;

  const sampleSubtotal = 10000;
  const shippingCost = sampleSubtotal >= form.freeDeliveryThreshold && form.freeDeliveryThreshold > 0 
    ? 0 
    : form.flatShippingRate;
  const taxCost = form.vatEnabled ? (sampleSubtotal * form.vatRate) : 0;
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
                id="vatEnabled"
                checked={form.vatEnabled}
                disabled={!canManageTax}
                onChange={e => setForm({...form, vatEnabled: e.target.checked})}
                className="w-5 h-5"
              />
              <label htmlFor="vatEnabled" className="font-medium">Enable Tax Calculation</label>
              {!canManageTax && <span className="text-xs text-fg-muted">(Requires super_admin)</span>}
            </div>

            {form.vatEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Label</label>
                  <input 
                    type="text" 
                    value={form.taxLabel}
                    disabled={!canManageTax}
                    onChange={e => setForm({...form, taxLabel: e.target.value})}
                    className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Rate (Decimal e.g., 0.2 for 20%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="1"
                    value={form.vatRate}
                    disabled={!canManageTax}
                    onChange={e => setForm({...form, vatRate: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Shipping</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Flat Shipping Rate</label>
                <input 
                  type="number" 
                  value={form.flatShippingRate}
                  onChange={e => setForm({...form, flatShippingRate: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Free Delivery Threshold</label>
                <input 
                  type="number" 
                  value={form.freeDeliveryThreshold}
                  onChange={e => setForm({...form, freeDeliveryThreshold: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-xl border-border/50 border p-2"
                />
              </div>
            
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Per-Zone Delivery Fees</label>
              {form.zones.map((zone, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="Zone Name"
                    value={zone.name}
                    onChange={e => {
                      const newZones = [...form.zones];
                      newZones[idx].name = e.target.value;
                      setForm({...form, zones: newZones});
                    }}
                    className="flex-1 rounded-xl border-border/50 border p-2 text-sm"
                  />
                  <input 
                    type="number" 
                    placeholder="Rate"
                    value={zone.rate}
                    onChange={e => {
                      const newZones = [...form.zones];
                      newZones[idx].rate = parseInt(e.target.value) || 0;
                      setForm({...form, zones: newZones});
                    }}
                    className="w-32 rounded-xl border-border/50 border p-2 text-sm"
                  />
                  <button type="button" onClick={() => {
                    const newZones = [...form.zones];
                    newZones.splice(idx, 1);
                    setForm({...form, zones: newZones});
                  }} className="text-red-500 px-2 text-sm">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({...form, zones: [...form.zones, {name: '', rate: 0}]})} className="text-accent text-sm mt-1">+ Add Zone</button>
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
            {form.vatEnabled && (
              <div className="flex justify-between">
                <span className="text-fg/80">{form.taxLabel} ({(form.vatRate * 100).toFixed(1)}%):</span>
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
