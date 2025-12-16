import "./globals.css";
import { Navigation } from "@/components/Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex relative overflow-hidden">

        {/* Alchemy Background Mesh */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
          <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        </div>

        <Navigation />

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto h-screen">
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
