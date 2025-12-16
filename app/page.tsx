
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/db/supabase';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';

// Revalidate every 60 seconds to keep dashboard fresh
export const revalidate = 60;

export default async function Home() {

  // 1. Calculate Date Range (Last 30 Days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];

  // 2. Fetch Data
  const { data: sales } = await supabase
    .from('sales')
    .select('sale_date, total_amount, quantity_sold, product:finished_stock(product_name)')
    .gte('sale_date', startDate)
    .order('sale_date', { ascending: true });

  const { data: purchases } = await supabase
    .from('purchases')
    .select('cost')
    .gte('purchase_date', startDate);

  // 3. Process Data for Charts

  // A. Revenue Trend (Group by Date - Full 30 Day Timeline)
  const salesMap = new Map<string, number>();

  // 1. Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    salesMap.set(dateStr, 0);
  }

  // 2. Fill with actual data
  sales?.forEach(sale => {
    const date = sale.sale_date;
    const amount = sale.total_amount || 0;
    if (salesMap.has(date)) {
      salesMap.set(date, (salesMap.get(date) || 0) + amount);
    }
  });

  const salesTrend = Array.from(salesMap.entries()).map(([date, amount]) => ({
    date,
    amount
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // B. Top Products
  const productMap = new Map<string, number>();
  sales?.forEach(sale => {
    // @ts-ignore
    const name = sale.product?.product_name || 'Unknown';
    const qty = sale.quantity_sold || 0;
    productMap.set(name, (productMap.get(name) || 0) + qty);
  });

  let topProducts = Array.from(productMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Fallback for Empty State (to show Chart axes)
  if (topProducts.length === 0) {
    topProducts = [
      { name: "No Sales Yet", quantity: 0 },
    ];
  }

  // C. Headline Stats
  const recentRevenue = sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
  const recentExpenses = purchases?.reduce((sum, p) => sum + (p.cost || 0), 0) || 0;


  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 text-transparent bg-clip-text">
          Alive Scents Alchemy
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Precision perfume formulation, inventory tracking, and batch management.
        </p>
      </section>

      {/* Analytics Section - NEW */}
      <section>
        <h2 className="text-2xl font-bold mb-6 px-1">Performance Overview</h2>
        <AnalyticsCharts
          salesTrend={salesTrend}
          topProducts={topProducts}
          recentRevenue={recentRevenue}
          recentExpenses={recentExpenses}
        />
      </section>

      {/* Quick Access Grid */}
      <h2 className="text-2xl font-bold mt-12 mb-6 px-1">Quick Actions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link href="/formulas/create" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1 border-dashed bg-transparent">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-4 text-[var(--muted-foreground)]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h3 className="font-bold text-lg mb-2">New Formula</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Create a new scent composition from scratch.</p>
          </Card>
        </Link>

        <Link href="/batches" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 dark:bg-amber-900/20 dark:text-amber-300">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Batches & Production</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Monitor bonding times, status, and production history.</p>
          </Card>
        </Link>

        <Link href="/sales" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1">
            <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4 dark:bg-green-900/20 dark:text-green-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Record Sales</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Log new sales and update finished stock inventory.</p>
          </Card>
        </Link>

      </div>
    </div>
  );
}

