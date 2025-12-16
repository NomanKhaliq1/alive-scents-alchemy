
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b h-14 flex items-center px-6 gap-6 font-medium text-sm">
        <div className="font-bold text-lg mr-4">Alive Scents</div>
        <a href="/formulas" className="hover:text-gray-600">Formulas</a>
        <a href="/calculator" className="hover:text-gray-600">Calculator</a>
        <a href="/inventory" className="hover:text-gray-600">Inventory</a>
        <a href="/batches" className="hover:text-gray-600">Batches</a>
      </header>
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
