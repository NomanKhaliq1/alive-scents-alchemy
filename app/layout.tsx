
import "./globals.css";
import Link from 'next/link';

const NavLink = ({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) => (
  <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all">
    {icon}
    {children}
  </Link>
)

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex">

        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[var(--border)] h-screen sticky top-0 bg-[var(--card)] hidden md:flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold mr-3 dark:bg-white dark:text-black">AS</div>
            <span className="font-bold text-lg tracking-tight">Alive Scents</span>
          </div>

          <div className="flex-1 p-4 space-y-1">
            <NavLink href="/" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            }>Dashboard</NavLink>

            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Modules</div>

            <NavLink href="/formulas" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            }>Formulas</NavLink>

            <NavLink href="/calculator" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            }>Calculator</NavLink>

            <NavLink href="/inventory" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            }>Inventory</NavLink>

            <NavLink href="/batches" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }>Batches</NavLink>

            <NavLink href="/bonding" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }>Bonding</NavLink>

            <NavLink href="/stock" icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            }>Stock</NavLink>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[var(--background)] flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="md:hidden font-bold text-lg">Alive Scents</div>

            {/* Desktop Welcome / Breadcrumb Placeholder */}
            <div className="hidden md:block text-sm font-medium text-[var(--muted-foreground)]">
              Dashboard
            </div>

            {/* Right Side: Login / User Actions */}
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium hover:text-[var(--foreground)] transition-colors">
                Help
              </button>
              <div className="h-4 w-px bg-[var(--border)]"></div>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold leading-none">Admin</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Authenticated</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-xs font-bold border border-[var(--border)]">
                  A
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 w-full">
            {children}
          </div>
        </main>

      </body>
    </html>
  )
}
