'use client'

import { useState, useRef, useEffect } from 'react'
import { processCheckIn } from '../../../checkin-actions' // Sesuaikan path import
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const searchParams = useSearchParams()
  const session = searchParams.get('session') as 'matrimony' | 'reception' || 'matrimony'
  
  // Ambil ID event
  const [eventId, setEventId] = useState<number>(0)
  useEffect(() => {
    params.then(p => setEventId(parseInt(p.id)))
  }, [params])

  // Auto focus input biar admin gak perlu klik2 terus (enak buat scanner tool)
  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading, result])

  async function handleCheckIn(e?: React.FormEvent) {
    e?.preventDefault()
    if (!code || !eventId) return

    setLoading(true)
    setResult(null) 

    try {
      const res = await processCheckIn(code, eventId, session)
      
      if (res.success) {
        setResult(res)
        // Opsional: Bunyi 'Beep' sukses bisa ditambah disini
        setCode('') 
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: res.message,
          timer: 2000,
          showConfirmButton: false,
          background: '#ffebee'
        })
        setCode('')
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'System Error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center">
      
      {/* Header Sticky */}
      <div className={`w-full p-4 text-center font-bold uppercase tracking-[0.2em] text-sm shadow-xl sticky top-0 z-10 ${session === 'matrimony' ? 'bg-amber-700' : 'bg-indigo-600'}`}>
        GATE MODE: {session} SESSION
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-xl">
        
        {/* HASIL SCAN (CARD) */}
        {result ? (
          <div className={`w-full p-10 rounded-3xl text-center shadow-2xl mb-8 animate-fade-in-up border-4 border-white/20 relative overflow-hidden ${result.colorClass}`}>
            
            {/* Background Pattern Halus */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle,white,transparent)] pointer-events-none"></div>

            <p className="text-white/80 uppercase tracking-widest text-xs font-bold mb-4 bg-black/20 inline-block px-3 py-1 rounded-full">Access Granted</p>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 leading-tight">{result.guest.name}</h1>
            <p className="text-lg opacity-90 mb-6 font-medium">{result.guest.category || 'Guest'}</p>
            
            <div className="flex justify-center gap-3 mb-8">
               <span className="px-4 py-2 bg-black/20 rounded-xl text-sm font-mono border border-white/10">{result.guest.code}</span>
               <span className="px-4 py-2 bg-white/20 rounded-xl text-sm font-bold border border-white/10">{result.guest.pax} Pax</span>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl transform scale-105">
              <p className="text-[10px] uppercase tracking-widest mb-1 text-slate-500 font-bold">Guest Number</p>
              <p className="text-7xl font-bold font-mono tracking-tighter">#{result.guestNumber}</p>
            </div>

            <p className="mt-8 text-xl font-serif italic text-white/90">"Welcome to the Wedding!"</p>
            
            <button 
              onClick={() => setResult(null)} 
              className="mt-8 text-xs text-white/60 hover:text-white flex items-center justify-center gap-2 mx-auto transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
              Scan Next Guest (Enter)
            </button>
          </div>
        ) : (
          <div className="text-center mb-12 opacity-40">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75zM19.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
            </div>
            <p className="text-xl font-light tracking-wide">Waiting for Scan...</p>
          </div>
        )}

        {/* INPUT FORM (HIDDEN BUT FOCUSED) */}
        <form onSubmit={handleCheckIn} className="w-full relative">
          <input 
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-center text-2xl font-mono tracking-[0.3em] focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition placeholder:text-white/10 text-white"
            placeholder="SCAN HERE"
            autoComplete="off"
            // Penting: matikan auto correct biar kode masuk raw
            autoCorrect="off" 
            autoCapitalize="off"
            spellCheck="false"
          />
          <p className="text-[10px] text-center mt-4 text-white/30 uppercase tracking-wide">
            Ketik kode atau gunakan Barcode Scanner
          </p>
        </form>

      </div>

      <div className="p-6 w-full max-w-xl flex justify-between text-xs text-white/40">
        <Link href={`/admin/events/${eventId}`} className="hover:text-white transition">← Back to Dashboard</Link>
        <span>System Ready</span>
      </div>
    </div>
  )
}