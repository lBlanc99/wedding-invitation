'use client'

import { useState } from 'react'
import { addGuest, deleteGuest } from '../../actions'
import Link from 'next/link'

type Guest = {
  id: number
  name: string
  code: string
  category: string | null
  inviteType: string
  _count: { messages: number }
}

export default function GuestManager({ 
  guests, 
  eventId 
}: { 
  guests: Guest[]
  eventId: number 
}) {
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterAccess, setFilterAccess] = useState('All')

  const filteredGuests = guests.filter((g) => {
    const matchCat = filterCategory === 'All' || g.category === filterCategory
    const matchAcc = filterAccess === 'All' || g.inviteType === filterAccess
    return matchCat && matchAcc
  })

  // Helper Warna Kategori
  const getCategoryColor = (cat: string | null) => {
    switch (cat) {
      case 'VIP': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'Keluarga': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  // Helper Warna Akses (Full Event = Hijau)
  const getAccessColor = (type: string) => {
    if (type === 'Full Event') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (type === 'Matrimony') return 'bg-amber-100 text-amber-700 border-amber-200'
    if (type === 'Reception') return 'bg-purple-100 text-purple-700 border-purple-200'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* HEADER & FORM TAMBAH */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <span>Kelola Tamu</span>
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{guests.length} Total</span>
        </h2>
        
        <form action={addGuest} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input type="hidden" name="eventId" value={eventId} />
          
          {/* Input Nama - FIX: text-slate-900 bg-white */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nama Tamu</label>
            <input 
              name="name" 
              placeholder="Contoh: Budi Santoso" 
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>

          {/* Select Kategori - FIX: text-slate-900 bg-white */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Kategori</label>
            <select 
              name="category" 
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Umum">Umum</option>
              <option value="VIP">VIP</option>
              <option value="Keluarga">Keluarga</option>
            </select>
          </div>

          {/* Select Akses - FIX: text-slate-900 bg-white */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Akses Undangan</label>
            <select 
              name="inviteType" 
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Full Event">Full Event</option>
              <option value="Matrimony">Matrimony</option>
              <option value="Reception">Reception</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2">
              <span>+ Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* FILTER BAR */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-white">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
        
        <div className="flex gap-2">
           {['All', 'VIP', 'Keluarga', 'Umum'].map(cat => (
             <button 
               key={cat}
               onClick={() => setFilterCategory(cat)}
               className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                 filterCategory === cat 
                   ? 'bg-slate-800 text-white border-slate-800' 
                   : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

        {/* Select Filter - FIX: text-slate-900 */}
        <select 
          value={filterAccess} 
          onChange={(e) => setFilterAccess(e.target.value)}
          className="border border-slate-200 rounded-lg text-xs py-1.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 bg-slate-50"
        >
          <option value="All">Semua Akses</option>
          <option value="Full Event">Full Event</option>
          <option value="Matrimony">Matrimony</option>
          <option value="Reception">Reception</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
            <tr>
              <th className="p-4 w-[30%]">Nama Tamu</th>
              <th className="p-4 w-[25%]">Link Undangan</th>
              <th className="p-4 w-[15%]">Kategori</th>
              <th className="p-4 w-[20%]">Akses</th>
              <th className="p-4 w-[10%] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-slate-50 transition group">
                
                {/* Nama Tamu */}
                <td className="p-4">
                  <p className="font-bold text-base text-slate-900">{guest.name}</p>
                </td>

                <td className="p-4">
                  <a 
                    href={`/${guest.code}`} 
                    target="_blank" 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition font-mono text-xs font-medium group-hover:shadow-sm"
                  >
                    <span>/{guest.code}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 19h-8.5A2.25 2.25 0 012 16.75v-8.5A2.25 2.25 0 014.25 6h4a.75.75 0 010 1.5h-4z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.81l-8.39 8.363a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                    </svg>
                  </a>
                </td>

                <td className="p-4">
                   <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getCategoryColor(guest.category)}`}>
                     {guest.category || 'Umum'}
                   </span>
                </td>

                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getAccessColor(guest.inviteType)}`}>
                    {guest.inviteType}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <form action={deleteGuest.bind(null, guest.id, eventId)}>
                    <button className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Hapus Tamu">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </form>
                </td>

              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic bg-slate-50/50">Tidak ada tamu yang sesuai filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}