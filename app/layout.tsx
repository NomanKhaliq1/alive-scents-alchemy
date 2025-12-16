import "./globals.css";
import { Navigation } from "@/components/Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex">

        <Navigation />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[var(--background)] flex flex-col pl-0 md:pl-0">
          {/* Top Header */}
          <header className="h-16 border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40 pl-16 md:pl-6">
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
