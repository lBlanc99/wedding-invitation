'use client'

import { useState, useMemo } from 'react'
import { invalidateCheckIn } from '../../checkin-actions' 
import Swal from 'sweetalert2'

type Guest = {
  id: number
  name: string
  pax: number
  category: string | null
  checkInMatrimonyTime: string | null 
  checkInReceptionTime: string | null
}

type SortOption = 'newest' | 'oldest' | 'name' | 'ticket'

export default function GuestBook({ guests, eventId }: { guests: Guest[], eventId: number }) {
  const [activeTab, setActiveTab] = useState<'matrimony' | 'reception'>('matrimony')
  // UPDATED: Default sort 'oldest' supaya Rank 1 muncul paling atas (sesuai request)
  const [sortBy, setSortBy] = useState<SortOption>('oldest')

  // ==========================================
  // 1. LOGIC: TICKET NUMBER (Global Queue)
  // ==========================================
  const globalRankMap = useMemo(() => {
    const allEvents = guests.flatMap(g => {
      const events = []
      if (g.checkInMatrimonyTime) {
        events.push({ guestId: g.id, type: 'matrimony', time: new Date(g.checkInMatrimonyTime).getTime() })
      }
      if (g.checkInReceptionTime) {
        events.push({ guestId: g.id, type: 'reception', time: new Date(g.checkInReceptionTime).getTime() })
      }
      return events
    })

    allEvents.sort((a, b) => a.time - b.time)

    const map = new Map<string, number>()
    allEvents.forEach((ev, index) => {
      map.set(`${ev.guestId}-${ev.type}`, index + 1)
    })
    return map
  }, [guests])


  // ==========================================
  // 2. LOGIC: SESSION RANK & PREPARE DATA
  // ==========================================
  const processedData = useMemo(() => {
    const filtered = guests.filter(g => 
      activeTab === 'matrimony' ? g.checkInMatrimonyTime : g.checkInReceptionTime
    )

    const sortedByTime = [...filtered].sort((a, b) => {
      const timeA = activeTab === 'matrimony' ? new Date(a.checkInMatrimonyTime!).getTime() : new Date(a.checkInReceptionTime!).getTime()
      const timeB = activeTab === 'matrimony' ? new Date(b.checkInMatrimonyTime!).getTime() : new Date(b.checkInReceptionTime!).getTime()
      return timeA - timeB 
    })

    return sortedByTime.map((g, index) => ({
      ...g,
      sessionRank: index + 1, 
      // Internal var tetap 'globalQueue', tapi di UI kita sebut 'Ticket Number'
      globalQueue: globalRankMap.get(`${g.id}-${activeTab}`) || 0
    }))

  }, [guests, activeTab, globalRankMap])


  // ==========================================
  // 3. LOGIC: DISPLAY SORTING
  // ==========================================
  const displayData = [...processedData].sort((a, b) => {
    const timeA = activeTab === 'matrimony' ? new Date(a.checkInMatrimonyTime!).getTime() : new Date(a.checkInReceptionTime!).getTime()
    const timeB = activeTab === 'matrimony' ? new Date(b.checkInMatrimonyTime!).getTime() : new Date(b.checkInReceptionTime!).getTime()

    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'oldest') return timeA - timeB // Ini Logic untuk Sort by Rank (1, 2, 3...)
    if (sortBy === 'ticket') return a.globalQueue - b.globalQueue
    
    // Default 'newest' (Rank besar di atas)
    return timeB - timeA 
  })

  const totalPax = displayData.reduce((sum, g) => sum + g.pax, 0)

  // --- Action Handler (English) ---
  async function handleInvalidate(guestId: number) {
    const result = await Swal.fire({
      title: 'Undo Check-in?',
      text: "The global ticket number sequence will shift.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Undo'
    })

    if (result.isConfirmed) {
      await invalidateCheckIn(guestId, eventId, activeTab)
      Swal.fire({ title: 'Undone', icon: 'success', timer: 1500, showConfirmButton: false })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* --- TABS --- */}
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('matrimony')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'matrimony' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600' : 'text-slate-400 hover:bg-slate-50'}`}>
          Matrimony
        </button>
        <button onClick={() => setActiveTab('reception')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'reception' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}>
          Reception
        </button>
      </div>

      {/* --- SUMMARY BAR (ENGLISH) --- */}
      <div className="p-4 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100">
        <div className="flex gap-4 text-xs font-bold text-slate-600">
          <div><span className="text-slate-400 text-[10px] block">CHECKED IN</span> <span className="text-lg">{displayData.length}</span></div>
          <div className="w-px bg-slate-300 h-full"></div>
          <div><span className="text-slate-400 text-[10px] block">TOTAL PAX</span> <span className="text-lg">{totalPax}</span></div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500">
            {/* Opsi Sort dalam Bahasa Inggris */}
            <option value="oldest">Rank (1-99)</option>
            <option value="newest">Time (Newest)</option>
            <option value="ticket">Ticket No.</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-slate-400 uppercase text-[10px] sticky top-0 z-10 shadow-sm">
            <tr>
              {/* UPDATED HEADER ORDER & ENGLISH TEXT */}
              <th className="p-3 w-16 text-center bg-slate-50">Rank</th>        {/* Col 1 */}
              <th className="p-3 w-20 text-center bg-slate-50">Ticket<br/>No.</th> {/* Col 2 */}
              <th className="p-3 bg-slate-50">Time</th>
              <th className="p-3 bg-slate-50">Guest Name</th>
              <th className="p-3 text-center bg-slate-50">Pax</th>
              <th className="p-3 bg-slate-50">Category</th>
              <th className="p-3 text-right bg-slate-50">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {displayData.map((g) => {
              const time = activeTab === 'matrimony' ? g.checkInMatrimonyTime : g.checkInReceptionTime
              
              return (
                <tr key={g.id} className="hover:bg-slate-50 transition group">
                  
                  {/* 1. Session Rank (Sekarang paling kiri) */}
                  <td className="p-3 text-center align-middle">
                     <span className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-full bg-white">
                       #{g.sessionRank}
                     </span>
                  </td>

                  {/* 2. Ticket Number (Global Queue) - Menonjol untuk Undian */}
                  <td className="p-3 text-center align-middle">
                     <span className="inline-block px-2 py-1 bg-slate-800 text-white font-mono font-bold rounded text-sm min-w-[30px] shadow-sm">
                       {g.globalQueue}
                     </span>
                  </td>
                  
                  <td className="p-3 font-mono text-xs text-slate-500 align-middle">
                    {time ? new Date(time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  
                  <td className="p-3 align-middle">
                    <p className="font-bold text-slate-900 leading-tight">{g.name}</p>
                    {sortBy === 'name' && (
                      <span className="text-[10px] text-slate-400">Ticket: {g.globalQueue}</span>
                    )}
                  </td>
                  
                  <td className="p-3 text-center align-middle">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{g.pax}</span>
                  </td>
                  
                  <td className="p-3 align-middle">
                     <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                      g.category === 'VIP' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {g.category || 'General'}
                    </span>
                  </td>
                  
                  <td className="p-3 text-right align-middle">
                    <button onClick={() => handleInvalidate(g.id)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition">
                      Undo
                    </button>
                  </td>
                </tr>
              )
            })}

            {displayData.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-slate-400 italic">No guests checked in yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}