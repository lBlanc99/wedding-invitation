import { PrismaClient } from '@prisma/client'
import { addEvent } from '../actions'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { guests: true } } }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      
      <div className="flex items-center justify-between mb-8 mt-4">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Acara</h1>
      </div>

      {/* === FORM BUAT ACARA BARU === */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <h2 className="font-bold text-lg text-slate-900 mb-6 border-b border-slate-100 pb-4">Buat Acara Baru</h2>
        
        <form action={addEvent} className="flex flex-col gap-5">
          
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Nama Acara</label>
            <input 
              name="name" 
              placeholder="Contoh: Ricky & Angela Wedding" 
              className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Link / Kode Event (Opsional)</label>
            <div className="flex">
              <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-xl px-4 flex items-center text-xs text-slate-500 font-medium">domain.com/</span>
              <input 
                name="slug" 
                placeholder="ricky-angela" 
                className="w-full border border-slate-300 p-3 rounded-r-xl text-sm text-indigo-700 bg-white placeholder:text-slate-400 font-mono focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">*Boleh dikosongi, nanti dibuatkan acak.</p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Lokasi</label>
            <input 
              name="location" 
              placeholder="Contoh: Hotel Majapahit, Surabaya" 
              className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block tracking-wider">Matrimony Time</label>
              <input 
                type="datetime-local" 
                name="matrimonyDate" 
                className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-pink-600 uppercase mb-1 block tracking-wider">Reception Time</label>
              <input 
                type="datetime-local" 
                name="receptionDate" 
                className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2">
            <span>+ Simpan Event</span>
          </button>
        </form>
      </div>

      {/* === LIST DAFTAR ACARA === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition group">
            
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition">{event.name}</h3>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-mono border border-indigo-100">
                  <span>/{event.slug}</span>
                </div>
              </div>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                {event._count.guests} Tamu
              </span>
            </div>

            {/* Lokasi (Dibuat Gelap) */}
            <div className="flex items-center gap-2 text-slate-700 text-sm mb-6 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.381 2.274 1.766.311.192.571.337.757.433a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              {event.location}
            </div>

            {/* Jadwal (Dibuat Gelap & Jelas) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wide">Matrimony</span>
                <span className="text-xs font-bold text-slate-900">
                  {event.matrimonyDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {event.matrimonyDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="w-full h-px bg-slate-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wide">Reception</span>
                <span className="text-xs font-bold text-slate-900">
                  {event.receptionDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {event.receptionDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <Link 
              href={`/admin/events/${event.id}`}
              className="mt-5 block w-full text-center bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-slate-900/10"
            >
              Kelola Tamu ({event._count.guests}) & Edit
            </Link>

          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 mb-2">Belum ada acara pernikahan.</p>
            <p className="text-sm text-slate-500">Silakan buat acara baru di atas.</p>
          </div>
        )}
      </div>

    </div>
  )
}