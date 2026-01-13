import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 text-xl font-bold tracking-wider border-b border-slate-800">
          ADMIN PANEL
        </div>
        <nav className="flex flex-col p-4 gap-2">
          <Link href="/admin/events" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded transition text-white font-bold bg-slate-800">
             <span>📅</span> Dashboard Event
          </Link>
          <div className="h-px bg-slate-800 my-4"></div>
          <Link href="/" target="_blank" className="flex items-center gap-3 p-3 text-sm text-slate-500 hover:text-slate-300">
            <span>↗️</span> Buka Website
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}