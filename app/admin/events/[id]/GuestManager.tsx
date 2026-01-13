'use client'

import { useState } from 'react'
import { addGuest, deleteGuest, updateGuest } from '../../actions' // <--- Import updateGuest
import Swal from 'sweetalert2'
import QRCode from 'qrcode'

type Guest = {
  id: number
  name: string
  code: string
  category: string | null
  inviteType: string
  pax: number 
  _count: { messages: number }
}

export default function GuestManager({ guests, eventId }: { guests: Guest[], eventId: number }) {
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterAccess, setFilterAccess] = useState('All')
  
  // State untuk menyimpan tamu yang sedang diedit (jika ada)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)

  // Logic Filtering
  const filteredGuests = guests.filter((g) => {
    const matchCat = filterCategory === 'All' || g.category === filterCategory
    const matchAcc = filterAccess === 'All' || g.inviteType === filterAccess
    return matchCat && matchAcc
  })

  // Helper Warna
  const getCategoryColor = (cat: string | null) => {
    switch (cat) {
      case 'VIP': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'Keluarga': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getAccessColor = (type: string) => {
    if (type === 'Full Event') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (type === 'Matrimony') return 'bg-amber-100 text-amber-700 border-amber-200'
    if (type === 'Reception') return 'bg-purple-100 text-purple-700 border-purple-200'
    return 'bg-gray-100 text-gray-600'
  }

  // === HANDLERS ===

  async function handleAddGuest(formData: FormData) {
    try {
      await addGuest(formData)
      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        timerProgressBar: true, didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer; }
      });
      Toast.fire({ icon: 'success', title: 'Tamu ditambahkan' })
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Gagal menambah tamu' })
    }
  }

  // Handler Update Guest (Edit)
  async function handleUpdateGuest(formData: FormData) {
    try {
      await updateGuest(formData)
      setEditingGuest(null) // Tutup Modal
      
      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
      });
      Toast.fire({ icon: 'success', title: 'Data tamu diperbarui' })
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Gagal update tamu' })
    }
  }

  async function handleDeleteGuest(guestId: number) {
    const result = await Swal.fire({
      title: 'Hapus tamu?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, Hapus'
    })
    if (result.isConfirmed) {
      await deleteGuest(guestId, eventId)
      Swal.fire('Terhapus!', 'Data tamu dihapus.', 'success')
    }
  }

  function handleCopyLink(code: string) {
    const fullUrl = `${window.location.origin}/${code}`
    navigator.clipboard.writeText(fullUrl)
    const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    Toast.fire({ icon: 'success', title: 'Link berhasil disalin!' })
  }

  async function handleDownloadQR(code: string, name: string) {
    try {
      const fullUrl = `${window.location.origin}/${code}`
      const qrDataUrl = await QRCode.toDataURL(fullUrl, { width: 400, margin: 2, color: { dark: '#000000', light: '#ffffff' } })
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `QR_${name.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      Toast.fire({ icon: 'success', title: 'QR Code diunduh!' })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal generate QR' })
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* HEADER & FORM TAMBAH */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <span>Kelola Tamu</span>
            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{guests.length} Total</span>
          </h2>
          
          <form action={handleAddGuest} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <input type="hidden" name="eventId" value={eventId} />
            
            <div className="md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nama Tamu</label>
              <input name="name" placeholder="Contoh: Budi Santoso" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Jml Pax</label>
              <input type="number" name="pax" defaultValue={2} min={1} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-center" required />
            </div>

            <div className="md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Kategori</label>
              <select name="category" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Umum">Umum</option><option value="VIP">VIP</option><option value="Keluarga">Keluarga</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Akses</label>
              <select name="inviteType" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Full Event">Full Event</option><option value="Matrimony">Matrimony</option><option value="Reception">Reception</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2"><span>+ Add</span></button>
            </div>
          </form>
        </div>

        {/* FILTER BAR */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-white">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
          <div className="flex gap-2">
            {['All', 'VIP', 'Keluarga', 'Umum'].map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filterCategory === cat ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>{cat}</button>
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)} className="border border-slate-200 rounded-lg text-xs py-1.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50">
            <option value="All">Semua Akses</option><option value="Full Event">Full Event</option><option value="Matrimony">Matrimony</option><option value="Reception">Reception</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 w-[25%]">Nama Tamu</th>
                <th className="p-4 w-[10%] text-center">Pax</th>
                <th className="p-4 w-[25%]">Link & QR</th>
                <th className="p-4 w-[15%]">Kategori</th>
                <th className="p-4 w-[15%]">Akses</th>
                <th className="p-4 w-[10%] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50 transition group">
                  <td className="p-4"><p className="font-bold text-base text-slate-900">{guest.name}</p></td>
                  <td className="p-4 text-center">
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded text-xs border border-slate-200">{guest.pax}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <a href={`/${guest.code}`} target="_blank" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition font-mono text-xs font-bold">/{guest.code}</a>
                      <button onClick={() => handleCopyLink(guest.code)} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" /></svg></button>
                      <button onClick={() => handleDownloadQR(guest.code, guest.name)} className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75zM19.5 16.5h.75v.75h-.75v-.75z" /></svg></button>
                    </div>
                  </td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getCategoryColor(guest.category)}`}>{guest.category || 'Umum'}</span></td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getAccessColor(guest.inviteType)}`}>{guest.inviteType}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      
                      {/* TOMBOL EDIT (BARU) */}
                      <button 
                        onClick={() => setEditingGuest(guest)} 
                        className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition" title="Edit Tamu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>

                      {/* TOMBOL DELETE */}
                      <button onClick={() => handleDeleteGuest(guest.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Hapus Tamu">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGuests.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic bg-slate-50/50">Tidak ada tamu yang sesuai filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* === MODAL EDIT TAMU === */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Edit Data Tamu</h3>
              <button onClick={() => setEditingGuest(null)} className="text-slate-400 hover:text-slate-600 transition">✕</button>
            </div>
            
            <form action={handleUpdateGuest} className="p-6 space-y-4">
              <input type="hidden" name="id" value={editingGuest.id} />
              <input type="hidden" name="eventId" value={eventId} />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nama Tamu</label>
                <input name="name" defaultValue={editingGuest.name} className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-900 bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Jumlah Pax</label>
                <input type="number" name="pax" defaultValue={editingGuest.pax} min={1} className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-900 bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Kategori</label>
                  <select name="category" defaultValue={editingGuest.category || 'Umum'} className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Umum">Umum</option><option value="VIP">VIP</option><option value="Keluarga">Keluarga</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Akses</label>
                  <select name="inviteType" defaultValue={editingGuest.inviteType} className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Full Event">Full Event</option><option value="Matrimony">Matrimony</option><option value="Reception">Reception</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingGuest(null)} className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Batal</button>
                <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-lg shadow-indigo-500/30">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}