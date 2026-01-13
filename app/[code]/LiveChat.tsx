// app/[code]/LiveChat.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { postMessage } from '../actions' // Import server action

type Message = {
  id: number
  content: string
  guest: {
    code: string
    name: string
  }
}

export default function LiveChat({ 
  messages, 
  guestCode 
}: { 
  messages: Message[] 
  guestCode: string 
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  // MAGIC 1: Auto Refresh tiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh() // Minta data terbaru ke server tanpa reload page
    }, 5000)

    return () => clearInterval(interval)
  }, [router])

  // MAGIC 2: Handle Submit biar form langsung reset
  async function handleSubmit(formData: FormData) {
    // Reset form dulu biar cepet berasa responnya
    formRef.current?.reset()
    
    // Kirim ke server
    await postMessage(formData)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white text-center flex justify-between items-center">
        <h3 className="font-bold text-sm uppercase tracking-wide flex-1">Ucapan & Doa</h3>
        <span className="text-[10px] bg-indigo-500 px-2 py-1 rounded animate-pulse">Live</span>
      </div>
      
      {/* Area Chat */}
      <div className="h-[350px] overflow-y-auto p-4 bg-slate-50 space-y-3 flex flex-col-reverse scroll-smooth">
        {messages.map((msg) => {
           const isMe = msg.guest.code === guestCode
           return (
             <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm shadow-sm ${
                  isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                }`}>
                  {!isMe && <p className="text-[10px] font-bold text-indigo-500 mb-0.5">{msg.guest.name}</p>}
                  <p>{msg.content}</p>
                </div>
             </div>
           )
        })}
        {messages.length === 0 && <p className="text-center text-slate-400 text-sm py-10">Belum ada ucapan. Jadilah yang pertama!</p>}
      </div>

      {/* Form Input */}
      <div className="p-3 bg-white border-t border-slate-100 relative">
        <form ref={formRef} action={handleSubmit} className="relative">
          <input type="hidden" name="guestCode" value={guestCode} />
          <textarea 
            name="content" 
            rows={2} 
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 resize-none" 
            placeholder="Tulis ucapan..." 
            required 
            onKeyDown={(e) => {
              // Biar tekan Enter langsung kirim (tanpa Shift)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
          />
          <button type="submit" className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition">
            ➤
          </button>
        </form>
      </div>
    </div>
  )
}