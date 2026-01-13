import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 text-xl font-bold tracking-wider">WEDDING ADMIN</div>
        <nav className="flex flex-col px-4 gap-2">
          <Link href="/admin/guests" className="p-3 hover:bg-slate-800 rounded transition">👥 Manage Tamu</Link>
          <Link href="/admin/events" className="p-3 hover:bg-slate-800 rounded transition">📅 Manage Event</Link>
          <div className="h-px bg-slate-700 my-2"></div>
          <Link href="/" target="_blank" className="p-3 hover:bg-slate-800 rounded text-slate-400 text-sm">↗️ Lihat Website</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}