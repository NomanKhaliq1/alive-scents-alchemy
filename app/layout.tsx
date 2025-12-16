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
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Header - Fixed at Top */}
          <header className="h-16 flex-none border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
            <div className="md:hidden font-bold text-lg">Alive Scents</div>
            <div className="flex-1"></div>

            {/* Right Side User Profile */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold leading-none">Admin</div>
                <div className="text-[10px] text-[var(--muted-foreground)]">Authenticated</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold border border-white/10 shadow-lg text-white">
                A
              </div>
            </div>
          </header>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth will-change-transform">
            {children}
          </div>
        </main>

      </body>
    </html>
  )
}
