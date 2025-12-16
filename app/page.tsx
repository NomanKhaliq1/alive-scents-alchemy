
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 text-transparent bg-clip-text">
          Alive Scents Alchemy
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Precision perfume formulation, inventory tracking, and batch management for the modern artisan.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/formulas/create">
            <Button className="rounded-full px-8 py-3 text-base">Create Formula</Button>
          </Link>
          <Link href="/calculator">
            <Button variant="secondary" className="rounded-full px-8 py-3 text-base">Open Calculator</Button>
          </Link>
        </div>
      </section>

      {/* Quick Access Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link href="/formulas" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 dark:bg-purple-900/20 dark:text-purple-300">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Formula Library</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Manage your scent recipes, view compositions, and refine creations.</p>
          </Card>
        </Link>

        <Link href="/calculator" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 dark:bg-blue-900/20 dark:text-blue-300">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Calculator</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Convert percentages to precise measurements for any batch size.</p>
          </Card>
        </Link>

        <Link href="/inventory" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1">
            <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4 dark:bg-green-900/20 dark:text-green-300">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Inventory</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Track raw materials, stock levels, and set reorder alerts.</p>
          </Card>
        </Link>

        <Link href="/batches" className="group">
          <Card className="h-full hover:border-[var(--foreground)]/20 transition-all cursor-pointer group-hover:-translate-y-1">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 dark:bg-amber-900/20 dark:text-amber-300">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Production Batches</h3>
            <p className="text-[var(--muted-foreground)] text-sm">Monitor bonding times, status, and production history.</p>
          </Card>
        </Link>

      </div>
    </div>
  );
}
