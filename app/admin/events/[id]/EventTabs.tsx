'use client'

import { useState } from 'react'
import GuestManager from './GuestManager'
import GuestBook from './GuestBook'
import Link from 'next/link'

export default function EventTabs({ guests, eventId }: { guests: any[], eventId: number }) {
  const [tab, setTab] = useState<'manage' | 'book'>('manage')

  return (
    <div>
      {/* SCANNER LINKS (GATE SYSTEM) */}
      <div className="flex gap-3 mb-6">
        <Link 
          href={`/gate/${eventId}/checkin?session=matrimony`} 
          target="_blank" 
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl text-center font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75zM19.5 16.5h.75v.75h-.75v-.75z" /></svg>
          Open Matrimony Scanner
        </Link>
        <Link 
          href={`/gate/${eventId}/checkin?session=reception`} 
          target="_blank" 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-center font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75zM19.5 16.5h.75v.75h-.75v-.75z" /></svg>
          Open Reception Scanner
        </Link>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-200/50 rounded-xl inline-flex">
        <button 
          onClick={() => setTab('manage')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition ${tab === 'manage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Manage Guests
        </button>
        <button 
          onClick={() => setTab('book')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition ${tab === 'book' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Guest Book (Logs)
        </button>
      </div>

      {/* CONTENT */}
      {tab === 'manage' ? (
        <GuestManager guests={guests} eventId={eventId} />
      ) : (
        <GuestBook guests={guests} eventId={eventId} />
      )}
    </div>
  )
}