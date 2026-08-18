import { useEffect, useState } from 'react';
import { auth } from '../../lib/auth';

export default function Inventory() {
  const [data, setData] = useState<{ products: any[], ledger: any[] }>({ products: [], ledger: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [adjustForm, setAdjustForm] = useState({
    productId: '',
    variantId: '',
    quantity: 0,
    reason: 'restock',
    notes: ''
  });

  const fetchInventory = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustForm.productId) return alert('Select a product');
    if (adjustForm.quantity === 0) return alert('Quantity cannot be zero');
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adjustForm)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      
      setAdjustForm({ productId: '', variantId: '', quantity: 0, reason: 'restock', notes: '' });
      fetchInventory();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const selectedProduct = data.products.find(p => p.id === adjustForm.productId);

  if (loading) return <div className="h-64 flex items-center justify-center text-fg-muted animate-pulse">Loading inventory...</div>;

  const lowStockProducts = data.products.flatMap(p => {
    if (p.variants?.length) {
      return p.variants.filter((v:any) => v.stock < 10).map((v:any) => ({ name: `${p.name} - ${v.name}`, stock: v.stock }));
    } else {
      if (p.stock < 10) return [{ name: p.name, stock: p.stock }];
      return [];
    }
  });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Inventory</h1>
        <p className="text-fg-muted mt-2 text-sm">Manage stock levels and view recent adjustments.</p>
      </header>
      
      {error && <div className="text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl text-sm">{error}</div>}

      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 shadow-sm">
          <h2 className="text-amber-900 text-sm font-bold uppercase tracking-wider mb-3">Low Stock Alerts</h2>
          <ul className="space-y-1 text-sm text-amber-800 font-medium">
            {lowStockProducts.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {p.name} <span className="opacity-70 font-normal ml-1">(Current Stock: {p.stock})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-canvas p-8 rounded-[2rem] border border-border/40 shadow-sm h-fit">
          <h2 className="text-lg font-semibold tracking-tight mb-6">Adjust Stock</h2>
          <form onSubmit={handleAdjust} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Product</label>
              <select 
                className="block w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all appearance-none"
                value={adjustForm.productId}
                onChange={e => setAdjustForm({...adjustForm, productId: e.target.value, variantId: ''})}
              >
                <option value="">Select a product...</option>
                {data.products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            {selectedProduct?.variants?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Variant</label>
                <select 
                  className="block w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all appearance-none"
                  value={adjustForm.variantId}
                  onChange={e => setAdjustForm({...adjustForm, variantId: e.target.value})}
                  required
                >
                  <option value="">Select a variant...</option>
                  {selectedProduct.variants.map((v:any) => (
                    <option key={v.id} value={v.id}>{v.name} (Stock: {v.stock})</option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedProduct && !selectedProduct.variants?.length && (
              <div className="text-sm font-medium text-fg-muted bg-canvas-secondary px-3 py-2 rounded-lg inline-block">
                Current Stock: <span className="text-fg">{selectedProduct.stock}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Adjustment</label>
              <input 
                type="number"
                required
                placeholder="e.g. 5 or -2"
                value={adjustForm.quantity || ''}
                onChange={e => setAdjustForm({...adjustForm, quantity: parseInt(e.target.value) || 0})}
                className="block w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Reason Code</label>
              <select 
                className="block w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all appearance-none"
                value={adjustForm.reason}
                onChange={e => setAdjustForm({...adjustForm, reason: e.target.value})}
              >
                <option value="restock">Restock</option>
                <option value="damage">Damage / Loss</option>
                <option value="return">Customer Return</option>
                <option value="correction">Inventory Correction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Notes <span className="opacity-50">(Optional)</span></label>
              <input 
                type="text"
                placeholder="Add details..."
                value={adjustForm.notes}
                onChange={e => setAdjustForm({...adjustForm, notes: e.target.value})}
                className="block w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            <button type="submit" className="w-full bg-accent text-white px-4 py-3.5 rounded-xl font-semibold hover:bg-accent/90 transition-colors mt-2">
              Apply Adjustment
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-canvas rounded-[2rem] border border-border/40 shadow-sm overflow-hidden min-h-[400px]">
            <h2 className="p-6 text-lg font-semibold tracking-tight border-b border-border/40">Inventory Ledger</h2>
            {data.ledger.length === 0 ? (
              <div className="p-16 text-center text-fg-muted text-sm">No recent stock adjustments.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-canvas-secondary/50 border-b border-border/40">
                      <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Date</th>
                      <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Product</th>
                      <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Adjustment</th>
                      <th className="p-5 font-semibold text-fg-muted text-xs uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {data.ledger.map(entry => (
                      <tr key={entry.id} className="group hover:bg-canvas-secondary/50 transition-colors">
                        <td className="p-5 text-fg-muted">{new Date(entry.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="p-5 font-medium text-fg">{entry.productName}</td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${entry.adjustment > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {entry.adjustment > 0 ? '+' : ''}{entry.adjustment}
                          </span>
                          <span className="text-fg-muted text-xs ml-2 font-medium">({entry.previousStock} &rarr; {entry.newStock})</span>
                        </td>
                        <td className="p-5 capitalize text-fg-muted font-medium">{entry.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
