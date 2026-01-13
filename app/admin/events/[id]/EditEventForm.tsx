'use client'

import { updateEvent } from '../../actions'
import Swal from 'sweetalert2'

// Helper Date WIB
function toWIBString(date: Date) {
  const wibDate = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000)
  return wibDate.toISOString().slice(0, 16)
}

export default function EditEventForm({ event }: { event: any }) {
  
  // Custom Handler biar bisa munculin Modal
  async function handleSubmit(formData: FormData) {
    try {
      // Panggil Server Action
      await updateEvent(formData)
      
      // Munculin Modal Sukses
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data event berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#4F46E5', // Indigo
        timer: 2000
      })
    } catch (error) {
      // Munculin Modal Error
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan.',
        icon: 'error',
      })
    }
  }

  const defaultMatrimony = toWIBString(event.matrimonyDate)
  const defaultReception = toWIBString(event.receptionDate)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Edit Detail Acara</h2>
      
      <form action={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="id" value={event.id} />
        
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nama Acara</label>
          <input name="name" defaultValue={event.name} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Slug (URL)</label>
          <div className="flex">
            <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-3 flex items-center text-xs text-slate-500">/</span>
            <input name="slug" defaultValue={event.slug} className="w-full border border-slate-300 p-2.5 rounded-r-lg text-sm bg-slate-50 font-mono text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Lokasi</label>
            <input name="location" defaultValue={event.location} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
              {/* LABEL SUDAH DIGANTI */}
              <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Matrimony Time</label>
              <input 
                type="datetime-local" 
                name="matrimonyDate" 
                defaultValue={defaultMatrimony} 
                className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
          </div>
          <div>
              {/* LABEL SUDAH DIGANTI */}
              <label className="text-[10px] font-bold text-pink-600 uppercase mb-1 block">Reception Time</label>
              <input 
                type="datetime-local" 
                name="receptionDate" 
                defaultValue={defaultReception} 
                className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
          </div>
        </div>

        <button type="submit" className="bg-slate-800 text-white font-bold py-3 rounded-lg text-sm hover:bg-slate-900 transition mt-2 shadow-lg shadow-slate-500/20">
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}