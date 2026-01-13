import { logout } from '../login/action' // Import action logout

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* NAVBAR SEDERHANA */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg font-bold text-slate-900 tracking-tight">Admin<span className="text-indigo-600">Panel</span></span>
            </div>
            <div className="flex items-center">
              <form action={logout}>
                <button className="text-sm font-medium text-slate-500 hover:text-red-600 transition flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50">
                  <span>Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="py-10">
        {children}
      </main>
    </div>
  )
}