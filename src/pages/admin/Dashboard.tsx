import { useEffect, useState } from 'react';
import { formatPrice } from '../../lib/money';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth } from '../../lib/auth';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/admin/dashboard', {
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
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const currentRevenue = data.revenue.current;
  const prevRevenue = data.revenue.previous;
  const revDiff = currentRevenue - prevRevenue;
  const revDiffPercent = prevRevenue ? (revDiff / prevRevenue) * 100 : (currentRevenue ? 100 : 0);

  const currentSales = data.sales.current;
  const prevSales = data.sales.previous;
  const salesDiff = currentSales - prevSales;
  const salesDiffPercent = prevSales ? (salesDiff / prevSales) * 100 : (currentSales ? 100 : 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-canvas-secondary rounded-[2rem] border border-border/50 overflow-hidden">
          <h2 className="text-sm font-medium text-fg-muted">Revenue (This Month)</h2>
          <p className="text-4xl tracking-tight font-bold mt-2">{formatPrice(currentRevenue)}</p>
          <div className="mt-2 text-sm flex items-center">
            {revDiff >= 0 ? (
              <span className="text-emerald-500 font-medium">+{revDiffPercent.toFixed(1)}%</span>
            ) : (
              <span className="text-red-500 font-medium">{revDiffPercent.toFixed(1)}%</span>
            )}
            <span className="text-fg-muted ml-2">from last month</span>
          </div>
        </div>
        
        <div className="p-6 bg-canvas-secondary rounded-[2rem] border border-border/50 overflow-hidden">
          <h2 className="text-sm font-medium text-fg-muted">Sales (Today)</h2>
          <p className="text-4xl tracking-tight font-bold mt-2">{currentSales}</p>
          <div className="mt-2 text-sm flex items-center">
            {salesDiff >= 0 ? (
              <span className="text-emerald-500 font-medium">+{salesDiffPercent.toFixed(1)}%</span>
            ) : (
              <span className="text-red-500 font-medium">{salesDiffPercent.toFixed(1)}%</span>
            )}
            <span className="text-fg-muted ml-2">from yesterday</span>
          </div>
        </div>
      </div>

      {data.chartData.revenueByMonth.length === 0 ? (
        <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-2xl text-fg-muted bg-canvas-secondary">
          No revenue data available
        </div>
      ) : (
        <div className="p-6 bg-canvas-secondary rounded-[2rem] border border-border/50 overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Revenue by Month</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(val) => formatPrice(val)} />
                <Tooltip formatter={(val: number) => formatPrice(val)} />
                <Bar dataKey="value" fill="#0071E3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
