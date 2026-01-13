'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { postMessage } from '../actions'

type Message = {
  id: number
  content: string
  guest: { code: string; name: string }
}

export default function LiveChat({ messages, guestCode }: { messages: Message[], guestCode: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)
    return () => clearInterval(interval)
  }, [router])

  async function handleSubmit(formData: FormData) {
    formRef.current?.reset()
    await postMessage(formData)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-[#E5E0D8] overflow-hidden font-sans">
      <div className="bg-[#5C5C5C] p-4 text-[#FDFBF7] text-center flex justify-between items-center">
        <h3 className="font-serif tracking-widest uppercase text-sm flex-1">Wishes & Prayers</h3>
        <span className="text-[10px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full animate-pulse">Live</span>
      </div>
      
      <div className="h-[350px] overflow-y-auto p-6 bg-[#F9F9F9] space-y-4 flex flex-col-reverse scroll-smooth">
        {messages.map((msg) => {
           const isMe = msg.guest.code === guestCode
           return (
             <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  isMe ? 'bg-[#5C5C5C] text-white rounded-br-none' : 'bg-white text-[#5C5C5C] border border-[#E5E0D8] rounded-bl-none'
                }`}>
                  {!isMe && <p className="text-[10px] font-bold text-[#D4AF37] mb-1 font-serif tracking-wide uppercase">{msg.guest.name}</p>}
                  <p>{msg.content}</p>
                </div>
             </div>
           )
        })}
        {messages.length === 0 && <p className="text-center text-gray-400 text-sm py-10 italic font-serif">Be the first to send your love.</p>}
      </div>

      <div className="p-4 bg-white border-t border-[#E5E0D8] relative">
        <form ref={formRef} action={handleSubmit} className="relative">
          <input type="hidden" name="guestCode" value={guestCode} />
          <textarea name="content" rows={2} className="w-full bg-[#F5F5F0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] pr-12 resize-none text-[#5C5C5C] placeholder:text-gray-400 placeholder:italic" placeholder="Write a message..." required onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); formRef.current?.requestSubmit(); } }} />
          <button type="submit" className="absolute right-3 bottom-4 text-[#D4AF37] hover:text-[#B59020] transition p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
          </button>
        </form>
      </div>
    </div>
  )
}