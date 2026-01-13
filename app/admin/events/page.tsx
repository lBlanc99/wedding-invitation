import { PrismaClient } from '@prisma/client'
import CreateEventForm from './CreateEventForm'
import EventList from './EventList'

const prisma = new PrismaClient()

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { guests: true } } }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      
      <div className="flex items-center justify-between mb-8 mt-4">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Acara</h1>
      </div>

      {/* 1. Form Buat Acara (Client Component) */}
      <CreateEventForm />

      {/* 2. List Acara & Tombol Hapus (Client Component) */}
      <EventList events={events} />

    </div>
  )
}