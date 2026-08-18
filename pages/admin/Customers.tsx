import { useEffect, useState } from 'react';
import { auth } from '../../lib/auth';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch this from the backend.
    // For this UI, we can just show an empty state.
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="bg-canvas rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">No customers found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-canvas-secondary border-b">
              <tr>
                <th className="p-4 font-medium text-fg-muted text-sm">Customer</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Orders</th>
                <th className="p-4 font-medium text-fg-muted text-sm">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.orderCount}</td>
                  <td className="p-4">{c.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
