import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
      <h1 className="text-4xl font-serif mb-4">Wedding Platform</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        Platform undangan digital. Silakan akses halaman admin untuk mengelola tamu, atau gunakan link undangan khusus yang telah diberikan.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/admin/events" 
          className="bg-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-500 transition"
        >
          Masuk ke Admin Panel
        </Link>
      </div>
    </main>
  )
}