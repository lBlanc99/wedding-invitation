import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EditEventForm from './EditEventForm' // <--- Import Baru
import GalleryManager from './GalleryManager' // <--- Import Baru
import GuestManager from './GuestManager'

const prisma = new PrismaClient()

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
          
          {/* COMPONENT 1: Form Edit Event (Dengan Modal & Label Baru) */}
          <EditEventForm event={event} />

          {/* COMPONENT 2: Galeri Manager (Dengan Modal Upload/Delete) */}
          <GalleryManager event={event} />

        </div>

        {/* === KOLOM KANAN: MANAGE TAMU === */}
        <div className="xl:col-span-2">
            {/* COMPONENT 3: Guest Manager (Sudah ada Modal Add/Delete) */}
            <GuestManager guests={event.guests} eventId={event.id} />
        </div>

      </div>
    </div>
  )
}