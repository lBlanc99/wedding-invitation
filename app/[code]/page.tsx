import { PrismaClient } from '@prisma/client'
import { checkGuestCode } from '../actions'
import { notFound } from 'next/navigation'
import LiveChat from './LiveChat'

const prisma = new PrismaClient()

// --- COMPONENT: ORNAMEN BUNGA (SVG SEDERHANA) ---
function FloralDivider() {
  return (
    <div className="flex justify-center my-6 opacity-40">
       <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M100 10C60 10 40 0 0 10C40 20 60 10 100 10Z" fill="#D4AF37"/>
         <path d="M100 10C140 10 160 0 200 10C160 20 140 10 100 10Z" fill="#D4AF37"/>
         <circle cx="100" cy="10" r="3" fill="#D4AF37"/>
       </svg>
    </div>
  )
}

// --- COMPONENT: GUEST INVITATION ---
function GuestInvitation({ guest, messages }: { guest: any, messages: any[] }) {
  // Format Tanggal Estetik
  const dateStr = guest.event.matrimonyDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = guest.event.matrimonyDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] overflow-hidden relative">
       
       {/* Background Noise Texture (Optional) */}
       <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")` }}></div>

       {/* HEADER SECTION */}
       <section className="relative pt-20 pb-16 px-6 text-center z-10">
          <p className="font-serif text-[#8A8A8A] tracking-[0.2em] text-xs uppercase mb-4 animate-fade-in-up">The Wedding Of</p>
          
          <h1 className="font-script text-6xl md:text-8xl text-[#2C2C2C] mb-6 leading-tight animate-fade-in">
            {guest.event.name}
          </h1>

          <FloralDivider />

          <div className="mt-10 mx-auto max-w-sm bg-white/50 backdrop-blur-sm border border-[#E5E0D8] p-8 rounded-t-[100px] rounded-b-[20px] shadow-sm">
            <p className="font-serif italic text-[#8A8A8A] text-sm mb-2">Dear,</p>
            <h2 className="font-serif text-2xl font-semibold text-[#2C2C2C] mb-3">{guest.name}</h2>
            <div className="flex justify-center gap-2">
               {guest.category && <span className="text-[10px] bg-[#EBEBEB] text-[#5C5C5C] px-3 py-1 rounded-full uppercase tracking-wider">{guest.category}</span>}
               <span className="text-[10px] bg-[#F3EFE0] text-[#8E7F48] px-3 py-1 rounded-full uppercase tracking-wider border border-[#D4AF37]/20">{guest.inviteType}</span>
            </div>
          </div>
       </section>

       {/* EVENT DETAILS */}
       <div className="max-w-2xl mx-auto px-6 mb-16 space-y-6 relative z-10">
          
          {/* Card Matrimony */}
          <div className="bg-white border border-[#F0EAE0] p-8 text-center rounded-lg shadow-sm hover:shadow-md transition-shadow duration-500">
              <h3 className="font-serif text-3xl text-[#2C2C2C] mb-2">Holy Matrimony</h3>
              <p className="font-sans text-xs text-[#D4AF37] uppercase tracking-[0.2em] mb-6">Save The Date</p>
              
              <div className="space-y-3 font-serif text-lg text-[#5C5C5C]">
                  <p className="border-b border-[#F0EAE0] pb-3 mx-10">{dateStr}</p>
                  <p className="text-3xl my-4 font-script text-[#2C2C2C]">{timeStr} <span className="text-base font-sans">WIB</span></p>
                  <p className="text-sm font-sans uppercase tracking-wide text-[#8A8A8A]">{guest.event.location}</p>
              </div>
          </div>

          {/* Card Reception (Kondisional) */}
          {guest.inviteType === 'Reception & Matrimony' && (
             <div className="bg-[#2C2C2C] text-[#FDFBF7] p-8 text-center rounded-lg shadow-lg relative overflow-hidden">
                {/* Dekorasi lingkaran emas */}
                <div className="absolute -top-10 -left-10 w-20 h-20 border border-[#D4AF37] rounded-full opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 border border-[#D4AF37] rounded-full opacity-20"></div>

                <h3 className="font-serif text-3xl text-[#FDFBF7] mb-2">Wedding Reception</h3>
                <p className="font-sans text-xs text-[#D4AF37] uppercase tracking-[0.2em] mb-6">Celebrate With Us</p>
                
                <div className="space-y-3 font-serif text-lg text-[#DCDCDC]">
                    <p className="border-b border-[#555] pb-3 mx-10">
                      {guest.event.receptionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-3xl my-4 font-script text-[#D4AF37]">
                      {guest.event.receptionDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} <span className="text-base font-sans">WIB</span>
                    </p>
                    <p className="text-sm font-sans uppercase tracking-wide text-[#999]">{guest.event.location}</p>
                </div>
             </div>
          )}
       </div>

       {/* CHAT SECTION */}
       <section className="max-w-md mx-auto px-4 pb-20 relative z-10">
         <LiveChat messages={messages} guestCode={guest.code} />
       </section>

       {/* Footer Simple */}
       <footer className="text-center pb-8 text-[#8A8A8A] text-[10px] font-sans tracking-widest uppercase opacity-50">
          Created with Love for {guest.event.name}
       </footer>

    </main>
  )
}

// --- COMPONENT: EVENT LANDING (LOGIN) ---
function EventLanding({ event }: { event: any }) {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Abstract */}
      <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#F3EFE0] rounded-full blur-[80px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#EAE0D5] rounded-full blur-[80px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-md border border-[#E5E0D8] p-10 rounded-2xl text-center shadow-xl">
        <p className="font-serif text-[#8A8A8A] tracking-[0.2em] text-xs uppercase mb-4">You Are Invited To</p>
        <h1 className="font-script text-5xl text-[#2C2C2C] mb-6">{event.name}</h1>
        <p className="font-sans text-[#5C5C5C] text-sm mb-10 border-b border-[#E5E0D8] pb-6 mx-10 tracking-wide uppercase">
          {event.location}
        </p>

        <form action={checkGuestCode} className="flex flex-col gap-5">
          <div className="text-left">
            <label className="text-[10px] text-[#8A8A8A] ml-1 mb-1 block font-bold uppercase tracking-widest">Invitation Code</label>
            <input 
              name="guestCode" 
              className="w-full bg-[#FAFAFA] border border-[#E5E0D8] rounded-lg p-4 text-center text-xl tracking-[0.3em] font-serif text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition placeholder:text-gray-200 uppercase"
              placeholder="CODE"
              required 
              autoComplete="off"
            />
          </div>
          <button className="bg-[#2C2C2C] hover:bg-[#1a1a1a] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-widest py-4 rounded-lg transition shadow-lg mt-2 border border-[#D4AF37]/20">
            Open Invitation
          </button>
        </form>

        <p className="text-[10px] text-[#8A8A8A] mt-8 font-serif italic">
          Please enter the access code provided in your physical invitation or message.
        </p>
      </div>
    </main>
  )
}

// --- ROUTER UTAMA ---
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  
  const guest = await prisma.guest.findUnique({
    where: { code },
    include: { event: true } 
  })

  if (guest) {
    const messages = await prisma.message.findMany({ 
      where: { guest: { eventId: guest.eventId } }, 
      orderBy: { createdAt: 'desc' }, 
      include: { guest: true } 
    })
    return <GuestInvitation guest={guest} messages={messages} />
  }

  const event = await prisma.event.findUnique({ where: { slug: code } })

  if (event) return <EventLanding event={event} />

  return notFound()
}