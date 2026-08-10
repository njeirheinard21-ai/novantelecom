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

  if (loading) return <div>Loading...</div>;

  const lowStockProducts = data.products.flatMap(p => {
    if (p.variants?.length) {
      return p.variants.filter((v:any) => v.stock < 10).map((v:any) => ({ name: `${p.name} - ${v.name}`, stock: v.stock }));
    } else {
      if (p.stock < 10) return [{ name: p.name, stock: p.stock }];
      return [];
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      
      {error && <div className="text-red-500 bg-red-50 p-4 rounded">{error}</div>}

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <h2 className="text-yellow-800 font-semibold mb-2">Low Stock Alerts</h2>
          <ul className="list-disc pl-5 text-sm text-yellow-700">
            {lowStockProducts.map((p, i) => (
              <li key={i}>{p.name} (Current Stock: {p.stock})</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-canvas p-6 rounded-[2rem] border border-border/50 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Adjust Stock</h2>
          <form onSubmit={handleAdjust} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select 
                className="mt-1 block w-full rounded-xl border-border/50 border p-2"
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
                <label className="block text-sm font-medium text-gray-700">Variant</label>
                <select 
                  className="mt-1 block w-full rounded-xl border-border/50 border p-2"
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
              <div className="text-sm text-fg-muted">
                Current Stock: {selectedProduct.stock}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Adjustment (e.g. 5, -2)</label>
              <input 
                type="number"
                required
                value={adjustForm.quantity}
                onChange={e => setAdjustForm({...adjustForm, quantity: parseInt(e.target.value) || 0})}
                className="mt-1 block w-full rounded-xl border-border/50 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reason Code</label>
              <select 
                className="mt-1 block w-full rounded-xl border-border/50 border p-2"
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
              <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <input 
                type="text"
                value={adjustForm.notes}
                onChange={e => setAdjustForm({...adjustForm, notes: e.target.value})}
                className="mt-1 block w-full rounded-xl border-border/50 border p-2"
              />
            </div>

            <button type="submit" className="w-full bg-accent text-white px-4 py-2 rounded-xl font-medium hover:bg-accent/90">
              Apply Adjustment
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-canvas rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
            <h2 className="p-4 text-lg font-semibold border-b">Inventory Ledger</h2>
            {data.ledger.length === 0 ? (
              <div className="p-8 text-center text-fg-muted">No recent stock adjustments.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas-secondary border-b">
                  <tr>
                    <th className="p-4 font-medium text-fg-muted">Date</th>
                    <th className="p-4 font-medium text-fg-muted">Product</th>
                    <th className="p-4 font-medium text-fg-muted">Adjustment</th>
                    <th className="p-4 font-medium text-fg-muted">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ledger.map(entry => (
                    <tr key={entry.id} className="border-b last:border-0 hover:bg-canvas-secondary">
                      <td className="p-4 text-fg-muted">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-medium">{entry.productName}</td>
                      <td className="p-4">
                        <span className={`font-semibold ${entry.adjustment > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {entry.adjustment > 0 ? '+' : ''}{entry.adjustment}
                        </span>
                        <span className="text-gray-400 text-xs ml-2">({entry.previousStock} → {entry.newStock})</span>
                      </td>
                      <td className="p-4 capitalize">{entry.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
