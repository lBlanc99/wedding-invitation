import { PrismaClient } from '@prisma/client'
import { addGuest, deleteGuest, updateEvent } from '../../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id)
  
  // Validasi ID biar gak error kalau user iseng ketik huruf
  if (isNaN(eventId)) return <div>Error ID</div>

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { 
      guests: { orderBy: { id: 'desc' }, include: { _count: { select: { messages: true } } } } 
    }
  })

  if (!event) return notFound()

  // Format tanggal untuk input form datetime-local
  const defaultMatrimony = event.matrimonyDate.toISOString().slice(0, 16)
  const defaultReception = event.receptionDate.toISOString().slice(0, 16)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-slate-500 text-sm">
        <Link href="/admin/events" className="hover:underline">Dashboard</Link> / <span>{event.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: EDIT EVENT */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h2 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Edit Detail Acara</h2>
            
            <form action={updateEvent} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={event.id} />
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Acara</label>
                <input name="name" defaultValue={event.name} className="w-full border p-2 rounded text-sm mt-1" />
              </div>

              {/* INPUT BARU: EDIT KODE EVENT */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Link / Kode Event</label>
                <div className="flex items-center mt-1">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 p-2 rounded-l text-slate-500 text-xs">domain.com/</span>
                  <input name="slug" defaultValue={event.slug} className="w-full border p-2 rounded-r text-sm font-mono text-indigo-600 bg-indigo-50/50" />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Lokasi</label>
                <input name="location" defaultValue={event.location} className="w-full border p-2 rounded text-sm mt-1" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-indigo-600 uppercase">Waktu Akad</label>
                <input type="datetime-local" name="matrimonyDate" defaultValue={defaultMatrimony} className="w-full border p-2 rounded text-sm mt-1 text-slate-600" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-pink-600 uppercase">Waktu Resepsi</label>
                <input type="datetime-local" name="receptionDate" defaultValue={defaultReception} className="w-full border p-2 rounded text-sm mt-1 text-slate-600" />
              </div>

              <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-4 rounded hover:bg-slate-900 transition mt-2 text-sm">
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: MANAGE TAMU */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-800 mb-4">Tambah Tamu ({event.name})</h2>
              
              <form action={addGuest} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <input type="hidden" name="eventId" value={event.id} />
                
                <div className="md:col-span-4">
                  <input name="name" placeholder="Nama Tamu" className="w-full border p-2 rounded text-sm" required />
                </div>
                
                <div className="md:col-span-3">
                  <select name="category" className="w-full border p-2 rounded bg-white text-sm">
                    <option value="Umum">Umum</option>
                    <option value="VIP">VIP</option>
                    <option value="Keluarga">Keluarga</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select name="inviteType" className="w-full border p-2 rounded bg-white font-medium text-slate-700 text-sm">
                    <option value="Reception & Matrimony">Semua (Akad & Resepsi)</option>
                    <option value="Matrimony Only">Akad Saja</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 text-sm">
                    + Add
                  </button>
                </div>
              </form>
            </div>

            {/* TABEL TAMU */}
            <table className="w-full text-left">
              <thead className="bg-white text-slate-500 uppercase text-xs border-b">
                <tr>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Kode / Link</th>
                  <th className="p-4">Akses</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {event.guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">
                      {guest.name}
                      <span className="block text-xs text-slate-400 font-normal">{guest.category}</span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      <a href={`/${guest.code}`} target="_blank" className="text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded text-xs">
                        {guest.code} ↗
                      </a>
                    </td>
                    <td className="p-4">
                       {guest.inviteType === 'Matrimony Only' ? (
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">Akad Only</span>
                      ) : (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">All Access</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <form action={deleteGuest.bind(null, guest.id, event.id)}>
                        <button className="text-red-400 hover:text-red-600 font-medium text-xs">Hapus</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {event.guests.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">Belum ada tamu di event ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}