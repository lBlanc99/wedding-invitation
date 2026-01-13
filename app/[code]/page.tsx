import { PrismaClient } from '@prisma/client'
import { checkGuestCode } from '../actions'
import { notFound } from 'next/navigation'
import LiveChat from './LiveChat'
import GuestQRCode from './GuestQRCode'
import Image from 'next/image'

const prisma = new PrismaClient()

// --- KOMPONEN HIASAN ---
function FloralDivider() {
  return (
    <div className="flex justify-center my-6 opacity-40">
       <svg width="200" height="20" viewBox="0 0 200 20" fill="none">
         <path d="M100 10C60 10 40 0 0 10C40 20 60 10 100 10Z" fill="#D4AF37"/>
         <path d="M100 10C140 10 160 0 200 10C160 20 140 10 100 10Z" fill="#D4AF37"/>
         <circle cx="100" cy="10" r="3" fill="#D4AF37"/>
       </svg>
    </div>
  )
}

// --- KOMPONEN HALAMAN UNDANGAN (UNTUK TAMU) ---
function GuestInvitation({ guest, messages }: { guest: any, messages: any[] }) {
  const dateStr = guest.event.matrimonyDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = guest.event.matrimonyDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  // LOGIC FOTO HERO
  const hasImages = guest.event.images && guest.event.images.length > 0
  const heroPhotoUrl = hasImages 
    ? guest.event.images[0].url 
    : "https://images.unsplash.com/photo-1606102793784-26a16b451103?q=80&w=2070&auto=format&fit=crop"

  // LOGIC TAMPILAN KARTU
  const showMatrimony = guest.inviteType === 'Matrimony' || guest.inviteType === 'Full Event'
  const showReception = guest.inviteType === 'Reception' || guest.inviteType === 'Full Event'

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] overflow-hidden relative font-sans">
       
       {/* Texture Background */}
       <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")` }}></div>

       {/* FOTO HERO */}
       <div className="relative w-full h-[60vh] md:h-[70vh]">
          <Image 
            src={heroPhotoUrl}
            alt="Wedding Background"
            fill
            className="object-cover pointer-events-none object-center"
            priority
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/20 via-[#FDFBF7]/60 to-[#FDFBF7]"></div>
       </div>

       {/* HEADER & DATA TAMU */}
       <section className="relative z-10 -mt-60 md:-mt-80 pb-16 px-6 text-center">
          <p className="font-serif text-[#5C5C5C] tracking-[0.2em] text-xs uppercase mb-4 animate-fade-in-up font-semibold drop-shadow-sm">The Wedding Of</p>
          <h1 className="font-script text-7xl md:text-9xl text-[#2C2C2C] mb-6 leading-tight animate-fade-in drop-shadow-md">
            {guest.event.name}
          </h1>
          <FloralDivider />
          
          <div className="mt-8 mx-auto max-w-sm bg-white/40 backdrop-blur-md border border-white/50 p-8 rounded-t-[100px] rounded-b-[30px] shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none"></div>
             
             <p className="font-serif italic text-[#5C5C5C] text-sm mb-2 relative z-10">Dear,</p>
             <h2 className="font-serif text-3xl font-semibold text-[#2C2C2C] mb-2 relative z-10">{guest.name}</h2>
             
             {/* INFO PAX DI BAWAH NAMA */}
             <p className="font-sans text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-6 relative z-10">
               Admit {guest.pax} Person{guest.pax > 1 ? 's' : ''}
             </p>

             <div className="flex justify-center gap-2 relative z-10">
               {guest.category && <span className="text-[10px] bg-[#FDFBF7] text-[#5C5C5C] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-[#E5E0D8]">{guest.category}</span>}
               <span className="text-[10px] bg-[#D4AF37] text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm font-bold flex items-center gap-1">
                  {guest.inviteType}
               </span>
            </div>
          </div>
       </section>

       {/* KARTU JADWAL ACARA */}
       <div className="max-w-2xl mx-auto px-6 mb-20 space-y-8 relative z-10">
           
           {/* KARTU AKAD */}
           {showMatrimony && (
             <div className="bg-white border border-[#F0EAE0] p-10 text-center rounded-[30px] shadow-sm hover:shadow-md transition-shadow duration-500 relative group overflow-hidden">
                 <div className="absolute inset-0 bg-[#FDFBF7] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 <h3 className="font-serif text-3xl text-[#2C2C2C] mb-2 relative z-10">Holy Matrimony</h3>
                 <p className="font-sans text-xs text-[#D4AF37] uppercase tracking-[0.2em] mb-8 relative z-10 font-bold">Save The Date</p>
                 <div className="space-y-4 font-serif text-lg text-[#5C5C5C] relative z-10">
                    <p className="border-b border-[#F0EAE0] pb-4 mx-12 tracking-wide">{dateStr}</p>
                    <p className="text-4xl my-6 font-script text-[#2C2C2C] drop-shadow-sm">{timeStr} <span className="text-base font-sans font-bold text-[#D4AF37]">WIB</span></p>
                    <p className="text-sm font-sans uppercase tracking-widest text-[#8A8A8A] font-semibold">{guest.event.location}</p>
                 </div>
             </div>
           )}
           
           {/* KARTU RESEPSI */}
           {showReception && (
             <div className="bg-[#2C2C2C] text-[#FDFBF7] p-10 text-center rounded-[30px] shadow-xl relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 border-[2px] border-[#D4AF37] rounded-full opacity-10 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 border-[2px] border-[#D4AF37] rounded-full opacity-10 animate-[spin_15s_linear_infinite_reverse]"></div>
                <h3 className="font-serif text-3xl text-[#FDFBF7] mb-2 relative z-10">Wedding Reception</h3>
                <p className="font-sans text-xs text-[#D4AF37] uppercase tracking-[0.2em] mb-8 relative z-10 font-bold">Celebrate With Us</p>
                 <div className="space-y-4 font-serif text-lg text-[#DCDCDC] relative z-10">
                     <p className="border-b border-[#555] pb-4 mx-12 tracking-wide">{guest.event.receptionDate.toLocaleDateString('en-US')}</p>
                     <p className="text-4xl my-6 font-script text-[#D4AF37] drop-shadow-sm">{guest.event.receptionDate.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB</p>
                     <p className="text-sm font-sans uppercase tracking-widest text-[#999] font-semibold">{guest.event.location}</p>
                 </div>
             </div>
           )}
       </div>

       {/* QR CODE SECTION (DENGAN DATA PAX) */}
       <section className="max-w-md mx-auto px-6 mb-20 relative z-10">
         <GuestQRCode 
            guestName={guest.name} 
            guestCode={guest.code} 
            guestPax={guest.pax} // <-- Data Pax Dioper Kesini
         />
       </section>

       {/* LIVE CHAT */}
       <section className="max-w-md mx-auto px-4 pb-24 relative z-10">
         <LiveChat messages={messages} guestCode={guest.code} />
       </section>

       {/* FOOTER */}
       <footer className="text-center pb-8 text-[#8A8A8A] text-[10px] font-sans tracking-widest uppercase opacity-60 mix-blend-multiply">
          © {new Date().getFullYear()} {guest.event.name}.
       </footer>

    </main>
  )
}

// --- KOMPONEN HALAMAN LOGIN (UNTUK PENGUNJUNG UMUM) ---
function EventLanding({ event }: { event: any }) {
  const loginPhotoUrl = "https://images.unsplash.com/photo-1520854221250-8c1295951371?q=80&w=1974&auto=format&fit=crop"
  
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <Image 
        src={loginPhotoUrl} 
        alt="Wedding Background" 
        fill 
        className="object-cover pointer-events-none opacity-20 filter blur-sm scale-105" 
        priority 
        sizes="100vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-[#FDFBF7]/50"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 p-10 rounded-[40px] text-center shadow-2xl">
        <p className="font-serif text-[#8A8A8A] tracking-[0.3em] text-xs uppercase mb-4 font-bold">You Are Invited To</p>
        <h1 className="font-script text-6xl text-[#2C2C2C] mb-6 drop-shadow-sm">{event.name}</h1>
        <p className="font-sans text-[#5C5C5C] text-sm mb-10 border-b border-[#E5E0D8] pb-6 mx-10 tracking-wide uppercase font-semibold">{event.location}</p>
        
        <form action={checkGuestCode} className="flex flex-col gap-5">
          <input 
            name="guestCode" 
            className="w-full bg-white/80 border-2 border-[#E5E0D8] rounded-2xl p-4 text-center text-2xl tracking-[0.4em] font-serif text-[#2C2C2C] focus:outline-none focus:border-[#D4AF37] shadow-inner uppercase" 
            placeholder="XXXXXX" 
            required 
            autoComplete="off" 
          />
          <button className="bg-gradient-to-r from-[#2C2C2C] to-[#4a4a4a] hover:from-[#1a1a1a] hover:to-[#333] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-2xl transition shadow-xl mt-2 border-b-4 border-[#D4AF37]/30 active:border-b-0 active:translate-y-1">
            Open Invitation
          </button>
        </form>
      </div>

    </main>
  )
}

// --- ROUTER UTAMA (SERVER COMPONENT) ---
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  
  // 1. Cek apakah ini KODE TAMU?
  const guest = await prisma.guest.findUnique({
    where: { code },
    include: { 
      event: {
        include: { images: { orderBy: { createdAt: 'desc' } } } 
      }
    } 
  })

  // Jika Tamu ditemukan -> Tampilkan Undangan
  if (guest) {
    const messages = await prisma.message.findMany({ 
      where: { guest: { eventId: guest.eventId } }, 
      orderBy: { createdAt: 'desc' }, 
      include: { guest: true } 
    })
    return <GuestInvitation guest={guest} messages={messages} />
  }

  // 2. Jika bukan tamu, cek apakah ini SLUG EVENT?
  const event = await prisma.event.findUnique({ where: { slug: code } })
  
  // Jika Event ditemukan -> Tampilkan Halaman Login
  if (event) return <EventLanding event={event} />

  // 3. Jika tidak keduanya -> 404
  return notFound()
}