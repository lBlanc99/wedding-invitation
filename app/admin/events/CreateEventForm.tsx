'use client'

import { addEvent } from '../actions'
import Swal from 'sweetalert2'
import { useRef } from 'react'

export default function CreateEventForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    try {
      Swal.fire({ title: 'Menyimpan...', didOpen: () => Swal.showLoading() })
      
      await addEvent(formData)
      
      formRef.current?.reset() // Reset form setelah sukses
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Acara baru telah dibuat.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({ title: 'Gagal!', text: 'Terjadi kesalahan.', icon: 'error' })
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <h2 className="font-bold text-lg text-slate-900 mb-6 border-b border-slate-100 pb-4">Buat Acara Baru</h2>
        
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Nama Acara</label>
            <input name="name" placeholder="Contoh: Ricky & Angela Wedding" className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" required />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Link / Kode Event (Opsional)</label>
            <div className="flex">
              <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-xl px-4 flex items-center text-xs text-slate-500 font-medium">domain.com/</span>
              <input name="slug" placeholder="ricky-angela" className="w-full border border-slate-300 p-3 rounded-r-xl text-sm text-indigo-700 bg-white placeholder:text-slate-400 font-mono focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">*Boleh dikosongi, nanti dibuatkan acak.</p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Lokasi</label>
            <input name="location" placeholder="Contoh: Hotel Majapahit, Surabaya" className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block tracking-wider">Matrimony Time</label>
              <input type="datetime-local" name="matrimonyDate" className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-pink-600 uppercase mb-1 block tracking-wider">Reception Time</label>
              <input type="datetime-local" name="receptionDate" className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
          </div>

          <button type="submit" className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2">
            <span>+ Simpan Event</span>
          </button>
        </form>
      </div>
  )
}