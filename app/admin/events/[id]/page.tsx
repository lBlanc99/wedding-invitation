import { PrismaClient } from '@prisma/client'
import { updateEvent, uploadEventImage, deleteEventImage } from '../../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import GuestManager from './GuestManager'

const prisma = new PrismaClient()

// HELPER: Konversi UTC DB ke String Input datetime-local (WIB)
// Menambah 7 jam ke waktu UTC agar tampilan di input form sesuai jam WIB
function toWIBString(date: Date) {
  const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  return wibDate.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id)
  
  if (isNaN(eventId)) return <div>Error ID</div>

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { 
      images: { orderBy: { createdAt: 'desc' } }, 
      guests: { orderBy: { id: 'desc' }, include: { _count: { select: { messages: true } } } } 
    }
  })

  if (!event) return notFound()

  // Konversi tanggal DB ke format WIB untuk default value input form
  const defaultMatrimony = toWIBString(event.matrimonyDate)
  const defaultReception = toWIBString(event.receptionDate)

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Breadcrumb */}
      <div className="mb-8 mt-4 flex items-center gap-2 text-slate-500 text-sm font-medium">
        <Link href="/admin/events" className="hover:text-indigo-600 transition">Dashboard</Link> 
        <span className="text-slate-300">/</span> 
        <span className="text-slate-800">{event.name}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* === KOLOM KIRI (Edit & Galeri) === */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Form Edit Event */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h2 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Edit Detail Acara</h2>
             <form action={updateEvent} className="flex flex-col gap-5">
                <input type="hidden" name="id" value={event.id} />
                
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nama Acara</label>
                  <input name="name" defaultValue={event.name} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nama Event" />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Slug (URL)</label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg px-3 flex items-center text-xs text-slate-500">/</span>
                    <input name="slug" defaultValue={event.slug} className="w-full border border-slate-300 p-2.5 rounded-r-lg text-sm bg-slate-50 font-mono text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Lokasi</label>
                   <input name="location" defaultValue={event.location} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                     <label className="text-[10px] font-bold text-indigo-600 uppercase mb-1 block">Waktu Akad (WIB)</label>
                     <input 
                        type="datetime-local" 
                        name="matrimonyDate" 
                        defaultValue={defaultMatrimony} 
                        className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" 
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-pink-600 uppercase mb-1 block">Waktu Resepsi (WIB)</label>
                     <input 
                        type="datetime-local" 
                        name="receptionDate" 
                        defaultValue={defaultReception} 
                        className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" 
                     />
                  </div>
                </div>

                <button type="submit" className="bg-slate-800 text-white font-bold py-3 rounded-lg text-sm hover:bg-slate-900 transition mt-2 shadow-lg shadow-slate-500/20">Simpan Perubahan</button>
             </form>
          </div>

          {/* GALERI PREWED */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h2 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Galeri Prewed</h2>
             
             {/* Preview Grid */}
             <div className="grid grid-cols-3 gap-3 mb-6">
               {event.images.length > 0 ? (
                 event.images.map((img) => (
                   <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group shadow-sm hover:shadow-md transition">
                      <Image 
                        src={img.url} 
                        alt="Prewed" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw" 
                        unoptimized // Penting untuk menghindari error hostname Vercel Blob
                      />
                      
                      {/* Tombol Hapus */}
                      <form action={deleteEventImage.bind(null, img.id, img.url, event.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition duration-200 scale-90 group-hover:scale-100">
                        <button className="bg-white/90 text-red-500 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm hover:bg-red-500 hover:text-white border border-red-100 transition" title="Hapus Foto">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
                        </button>
                      </form>
                   </div>
                 ))
               ) : (
                 <div className="col-span-3 py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    <p className="text-xs">Belum ada foto.</p>
                 </div>
               )}
             </div>

             {/* Form Upload */}
             <form action={uploadEventImage} className="border-t border-slate-100 pt-5">
               <input type="hidden" name="eventId" value={event.id} />
               <input type="hidden" name="eventSlug" value={event.slug} />
               
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Upload Foto Baru</label>
               <input type="file" name="image" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-200 rounded-lg" required />
               <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20">
                 Upload Foto
               </button>
               <p className="text-[10px] text-slate-400 mt-2 text-center">*Otomatis dikompres & convert ke WebP.</p>
             </form>
          </div>
        </div>

        {/* === KOLOM KANAN: MANAGE TAMU (COMPONENT BARU) === */}
        <div className="xl:col-span-2">
            <GuestManager guests={event.guests} eventId={event.id} />
        </div>

      </div>
    </div>
  )
}