import { PrismaClient } from '@prisma/client'
import { postMessage, checkGuestCode } from '../actions'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

// === KOMPONEN: UNDANGAN TAMU ===
function GuestInvitation({ guest, messages }: { guest: any, messages: any[] }) {
  const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
       {/* HEADER */}
       <section className="bg-white shadow-sm pt-12 pb-10 px-6 text-center rounded-b-[40px] mb-8 border-b border-slate-100">
        <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6">{guest.event.name}</h1>
        <div className="inline-block bg-slate-50 border border-slate-200 px-8 py-5 rounded-2xl shadow-sm">
          <p className="text-slate-400 text-xs uppercase mb-1 font-medium tracking-wide">Welcome,</p>
          <h2 className="text-xl font-bold text-slate-900">{guest.name}</h2>
          <div className="mt-2 flex gap-2 justify-center">
            {guest.category && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">{guest.category}</span>}
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-bold">{guest.inviteType}</span>
          </div>
        </div>
      </section>

       {/* JADWAL ACARA (DINAMIS) */}
       <div className="max-w-md mx-auto px-6 mb-10 space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
            <h3 className="font-bold text-lg text-indigo-800 mb-1">Akad Nikah</h3>
            <p className="text-xs text-slate-400 uppercase font-bold mb-3">Holy Matrimony</p>
            <div className="space-y-1 text-sm">
                <p>📅 {guest.event.matrimonyDate.toLocaleDateString('id-ID', optionsDate)}</p>
                <p>⏰ {guest.event.matrimonyDate.toLocaleTimeString('id-ID', optionsTime)} WIB</p>
                <p>📍 {guest.event.location}</p>
            </div>
        </div>

        {guest.inviteType === 'Reception & Matrimony' && (
           <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-pink-500">
              <h3 className="font-bold text-lg text-pink-700 mb-1">Resepsi Pernikahan</h3>
              <p className="text-xs text-slate-400 uppercase font-bold mb-3">Wedding Reception</p>
              <div className="space-y-1 text-sm">
                  <p>📅 {guest.event.receptionDate.toLocaleDateString('id-ID', optionsDate)}</p>
                  <p>⏰ {guest.event.receptionDate.toLocaleTimeString('id-ID', optionsTime)} WIB</p>
                  <p>📍 {guest.event.location}</p>
              </div>
           </div>
        )}
      </div>

       {/* GUESTBOOK */}
       <section className="max-w-md mx-auto px-4">
         <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
           <div className="bg-indigo-600 p-4 text-white text-center font-bold text-sm uppercase tracking-wider">Ucapan & Doa</div>
           <div className="h-[350px] overflow-y-auto p-4 bg-slate-50 space-y-3 flex flex-col-reverse">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex flex-col ${msg.guest.code === guest.code ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm shadow-sm ${msg.guest.code === guest.code ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
                    {msg.guest.code !== guest.code && <p className="text-[10px] font-bold text-indigo-500 mb-0.5">{msg.guest.name}</p>}
                    <p>{msg.content}</p>
                  </div>
               </div>
             ))}
             {messages.length === 0 && <p className="text-center text-slate-400 text-sm py-10">Belum ada ucapan.</p>}
           </div>
           <form action={postMessage} className="p-3 bg-white border-t border-slate-100 relative">
              <input type="hidden" name="guestCode" value={guest.code} />
              <textarea name="content" rows={2} className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 resize-none" placeholder="Tulis ucapan..." required />
              <button className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition">KIRIM</button>
           </form>
         </div>
       </section>
    </main>
  )
}

// === KOMPONEN: EVENT LOGIN (LOBI) ===
function EventLanding({ event }: { event: any }) {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center text-white shadow-2xl">
        <p className="text-indigo-300 uppercase tracking-[0.3em] text-[10px] font-bold mb-4">The Wedding Of</p>
        <h1 className="text-3xl font-serif mb-2">{event.name}</h1>
        <p className="text-slate-300 text-sm mb-8">📍 {event.location}</p>

        <form action={checkGuestCode} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="text-xs text-slate-400 ml-1 mb-1 block font-bold uppercase tracking-wide">Kode Akses Tamu</label>
            <input 
              name="guestCode" 
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-center text-xl tracking-[0.2em] font-mono text-white focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
              placeholder="XXXXXX"
              required 
              autoComplete="off"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-500/30 mt-2">
            Buka Undangan Saya
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-6 leading-relaxed">
          Silakan masukkan kode unik yang tertera pada undangan fisik atau pesan WhatsApp Anda untuk melihat detail acara.
        </p>
      </div>
    </main>
  )
}

// === PAGE UTAMA (ROUTER) ===
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  
  // 1. Cek: Apakah ini KODE TAMU?
  const guest = await prisma.guest.findUnique({
    where: { code },
    include: { event: true } 
  })

  // JIKA TAMU: Tampilkan Undangan Langsung
  if (guest) {
    const messages = await prisma.message.findMany({ 
      where: { guest: { eventId: guest.eventId } }, 
      orderBy: { createdAt: 'desc' }, 
      include: { guest: true } 
    })
    return <GuestInvitation guest={guest} messages={messages} />
  }

  // 2. Cek: Apakah ini KODE EVENT?
  const event = await prisma.event.findUnique({
    where: { slug: code } 
  })

  // JIKA EVENT: Tampilkan Lobi Login
  if (event) {
    return <EventLanding event={event} />
  }

  // 3. Gak ketemu -> 404
  return notFound()
}