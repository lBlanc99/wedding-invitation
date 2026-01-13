'use client'

import Link from 'next/link'
import { deleteEvent } from '../actions'
import Swal from 'sweetalert2'

type Event = {
  id: number
  name: string
  slug: string
  matrimonyLocation: string
  receptionLocation: string
  matrimonyDate: Date
  receptionDate: Date
  _count: { guests: number }
}

export default function EventList({ events }: { events: Event[] }) {

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Hapus Acara Ini?', text: "Semua data akan hilang!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!'
    })
    if (result.isConfirmed) {
      await deleteEvent(id)
      Swal.fire('Terhapus!', 'Acara telah dihapus.', 'success')
    }
  }

  if (events.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <p className="text-slate-400 mb-2">Belum ada acara pernikahan.</p>
        <p className="text-sm text-slate-500">Silakan buat acara baru di atas.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition group relative">
            
            <button onClick={() => handleDelete(event.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full" title="Hapus Event">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>

            <div className="flex justify-between items-start mb-4 pr-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition">{event.name}</h3>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-mono border border-indigo-100"><span>/{event.slug}</span></div>
              </div>
            </div>

            <div className="mb-4">
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{event._count.guests} Guest</span>
            </div>

            {/* JADWAL & LOKASI YANG DIPISAH */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
              
              {/* Matrimony Info */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wide">Matrimony</span>
                  <span className="text-xs font-bold text-slate-900">{new Date(event.matrimonyDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.381 2.274 1.766.311.192.571.337.757.433a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
                   {event.matrimonyLocation}
                </p>
              </div>

              <div className="w-full h-px bg-slate-200"></div>

              {/* Reception Info */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-pink-600 tracking-wide">Reception</span>
                  <span className="text-xs font-bold text-slate-900">{new Date(event.receptionDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.381 2.274 1.766.311.192.571.337.757.433a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
                   {event.receptionLocation}
                </p>
              </div>

            </div>

            <Link href={`/admin/events/${event.id}`} className="mt-5 block w-full text-center bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-slate-900/10">Kelola Tamu & Edit</Link>

          </div>
        ))}
    </div>
  )
}