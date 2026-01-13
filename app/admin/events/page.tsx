import { PrismaClient } from '@prisma/client'
import { addEvent, deleteEvent } from '../actions'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function EventListPage() {
  const events = await prisma.event.findMany({ 
    orderBy: { matrimonyDate: 'asc' }, // Urutkan berdasarkan tanggal Akad
    include: { _count: { select: { guests: true } } } 
  })

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Acara</h1>

      {/* Form Tambah Event */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="font-semibold text-slate-700 mb-4 pb-2 border-b">Buat Acara Baru</h2>
        <form action={addEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="md:col-span-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Nama Acara</label>
             <input name="name" placeholder="Misal: Pernikahan Romeo & Juliet" className="border p-2 rounded w-full mt-1" required />
          </div>
          <div className="md:col-span-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Lokasi</label>
             <input name="location" placeholder="Gedung / Hotel" className="border p-2 rounded w-full mt-1" required />
          </div>
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase text-indigo-600">Waktu Akad (Matrimony)</label>
             <input type="datetime-local" name="matrimonyDate" className="border p-2 rounded w-full mt-1 text-slate-600" required />
          </div>
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase text-pink-600">Waktu Resepsi (Reception)</label>
             <input type="datetime-local" name="receptionDate" className="border p-2 rounded w-full mt-1 text-slate-600" required />
          </div>
          
          <div className="md:col-span-2">
             <button type="submit" className="bg-indigo-600 w-full text-white font-bold py-3 px-4 rounded hover:bg-indigo-700 transition">
               + Simpan Event
             </button>
          </div>
        </form>
      </div>

      {/* List Event Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition relative group">
            <Link href={`/admin/events/${event.id}`} className="block p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-slate-800">{event.name}</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
                  {event._count.guests} Tamu
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-3">📍 {event.location}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg">
                <div>
                   <span className="block font-bold text-indigo-600">Akad</span>
                   {event.matrimonyDate.toLocaleDateString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                </div>
                <div>
                   <span className="block font-bold text-pink-600">Resepsi</span>
                   {event.receptionDate.toLocaleDateString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                </div>
              </div>
            </Link>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition">
               <form action={deleteEvent.bind(null, event.id)}>
                 <button className="text-red-400 hover:text-red-600 p-1" title="Hapus Event">🗑️</button>
               </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}