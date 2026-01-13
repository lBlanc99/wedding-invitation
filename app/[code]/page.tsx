import { PrismaClient } from '@prisma/client'
import { postMessage } from '../actions'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function InvitationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  
  const guest = await prisma.guest.findUnique({
    where: { code },
    include: { event: true } 
  })
  
  if (!guest) return notFound()

  // Logic pesan
  const messages = await prisma.message.findMany({ 
    where: { guest: { eventId: guest.eventId } }, 
    orderBy: { createdAt: 'desc' }, 
    include: { guest: true } 
  })

  // Format Tanggal
  const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* HEADER UNDANGAN */}
      <section className="bg-white shadow-sm pt-12 pb-10 px-6 text-center rounded-b-[40px] mb-8">
        <p className="text-indigo-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">The Wedding Of</p>
        <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6">{guest.event.name}</h1>
        
        <div className="inline-block bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
          <p className="text-slate-400 text-xs uppercase mb-1">Kepada Yth.</p>
          <h2 className="text-xl font-bold text-slate-900">{guest.name}</h2>
          <div className="flex justify-center gap-2 mt-2">
             {guest.category && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">{guest.category}</span>}
             <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-bold">{guest.inviteType}</span>
          </div>
        </div>
      </section>

      {/* JADWAL ACARA (DINAMIS SESUAI TIPE UNDANGAN) */}
      <div className="max-w-md mx-auto px-6 mb-10 space-y-4">
        
        {/* AKAD / MATRIMONY (Semua pasti dapat ini) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
            <h3 className="font-bold text-lg text-indigo-800 mb-1">Akad Nikah</h3>
            <p className="text-xs text-slate-400 uppercase mb-3 font-bold">Holy Matrimony</p>
            <div className="space-y-2 text-sm">
                <p>📅 {guest.event.matrimonyDate.toLocaleDateString('id-ID', optionsDate)}</p>
                <p>⏰ {guest.event.matrimonyDate.toLocaleTimeString('id-ID', optionsTime)} WIB</p>
                <p>📍 {guest.event.location}</p>
            </div>
        </div>

        {/* RESEPSI (Cuma muncul kalau tipe undangannya Reception) */}
        {guest.inviteType === 'Reception & Matrimony' && (
           <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-pink-500">
              <h3 className="font-bold text-lg text-pink-700 mb-1">Resepsi Pernikahan</h3>
              <p className="text-xs text-slate-400 uppercase mb-3 font-bold">Wedding Reception</p>
              <div className="space-y-2 text-sm">
                  <p>📅 {guest.event.receptionDate.toLocaleDateString('id-ID', optionsDate)}</p>
                  <p>⏰ {guest.event.receptionDate.toLocaleTimeString('id-ID', optionsTime)} WIB</p>
                  <p>📍 {guest.event.location}</p>
              </div>
           </div>
        )}

      </div>

      {/* GUESTBOOK (Sama seperti sebelumnya) */}
      <section className="max-w-md mx-auto px-4">
        {/* ... (Code Chat sama persis kayak sebelumnya) ... */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-4 text-white text-center">
            <h3 className="font-bold text-sm uppercase tracking-wide">Ucapan & Doa</h3>
          </div>
          
          <div className="h-[350px] overflow-y-auto p-4 bg-slate-50 space-y-4 flex flex-col-reverse">
            {messages.map((msg) => {
               const isMe = msg.guest.code === guest.code
               return (
                 <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm shadow-sm ${
                      isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                    }`}>
                      {!isMe && <p className="text-[10px] font-bold text-indigo-500 mb-0.5">{msg.guest.name}</p>}
                      <p>{msg.content}</p>
                    </div>
                 </div>
               )
            })}
             {messages.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">Belum ada ucapan.</p>}
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <form action={postMessage} className="relative">
              <input type="hidden" name="guestCode" value={code} />
              <textarea name="content" rows={2} className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 resize-none" placeholder="Tulis ucapan..." required />
              <button type="submit" className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">➤</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}