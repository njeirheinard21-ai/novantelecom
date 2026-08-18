import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { formatPrice } from '../../lib/money';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth } from '../../lib/auth';

export default function Dashboard() {
  const { t } = useTranslation(['account']);
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

  if (loading) return (
    <div className="h-64 flex items-center justify-center text-fg-muted animate-pulse">
      Loading metrics...
    </div>
  );
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;

  const currentRevenue = data.revenue.current;
  const prevRevenue = data.revenue.previous;
  const revDiff = currentRevenue - prevRevenue;
  const revDiffPercent = prevRevenue ? (revDiff / prevRevenue) * 100 : (currentRevenue ? 100 : 0);

  const currentSales = data.sales.current;
  const prevSales = data.sales.previous;
  const salesDiff = currentSales - prevSales;
  const salesDiffPercent = prevSales ? (salesDiff / prevSales) * 100 : (currentSales ? 100 : 0);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-fg">{t('overview', { ns: 'account' })}</h1>
        <p className="text-fg-muted mt-2 text-sm">Monitor your store's performance and revenue.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-canvas rounded-[2rem] border border-border/40 shadow-sm relative overflow-hidden group">
          <h2 className="text-sm font-semibold tracking-wide text-fg-muted uppercase">Revenue (This Month)</h2>
          <p className="text-5xl tracking-tighter font-semibold mt-4 text-fg">{formatPrice(currentRevenue)}</p>
          <div className="mt-6 flex items-center text-sm font-medium">
            {revDiff >= 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                +{revDiffPercent.toFixed(1)}%
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600">
                {revDiffPercent.toFixed(1)}%
              </span>
            )}
            <span className="text-fg-muted ml-3">from last month</span>
          </div>
        </div>
        
        <div className="p-8 bg-canvas rounded-[2rem] border border-border/40 shadow-sm relative overflow-hidden group">
          <h2 className="text-sm font-semibold tracking-wide text-fg-muted uppercase">Sales (Today)</h2>
          <p className="text-5xl tracking-tighter font-semibold mt-4 text-fg">{currentSales}</p>
          <div className="mt-6 flex items-center text-sm font-medium">
            {salesDiff >= 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                +{salesDiffPercent.toFixed(1)}%
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600">
                {salesDiffPercent.toFixed(1)}%
              </span>
            )}
            <span className="text-fg-muted ml-3">from yesterday</span>
          </div>
        </div>
      </div>

      {data.chartData.revenueByMonth.length === 0 ? (
        <div className="h-72 flex items-center justify-center border border-dashed border-border/50 rounded-[2rem] text-fg-muted bg-canvas">
          No revenue data available
        </div>
      ) : (
        <div className="p-8 bg-canvas rounded-[2rem] border border-border/40 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-fg mb-8">Revenue by Month</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData.revenueByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(val) => formatPrice(val)} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(val: number) => [formatPrice(val), 'Revenue']}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
