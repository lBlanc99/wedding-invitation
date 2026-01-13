'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

// Helper: Bikin kode acak
function generateCode(length = 6) {
  return randomBytes(length).toString('hex').slice(0, length)
}

// === LOGIC LOGIN TAMU (Diakses dari Page Event) ===
export async function checkGuestCode(formData: FormData) {
  const code = formData.get('guestCode') as string
  if(!code) return

  const guest = await prisma.guest.findUnique({ where: { code } })
  
  if (guest) {
    redirect(`/${guest.code}`) // Redirect ke undangan dia
  } else {
    // Kalau salah, balikin aja (bisa ditambah error handling kalau mau)
    return 
  }
}

// === EVENT ACTIONS ===

export async function addEvent(formData: FormData) {
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const matrimonyStr = formData.get('matrimonyDate') as string
  const receptionStr = formData.get('receptionDate') as string
  
  // Ambil input kode event (slug)
  let slug = formData.get('slug') as string

  // Logic: Kalau kosong -> Generate Random. Kalau isi -> Format jadi url-friendly
  if (!slug || slug.trim() === '') {
    slug = generateCode(6)
  } else {
    slug = slug.trim().toLowerCase().replace(/\s+/g, '-')
  }

  // Cek kalau slug custom sudah dipake orang, fallback ke random
  const existing = await prisma.event.findUnique({ where: { slug } })
  if (existing) {
    slug = generateCode(6) 
  }
  
  await prisma.event.create({
    data: { 
      name, 
      slug,
      location, 
      matrimonyDate: new Date(matrimonyStr),
      receptionDate: new Date(receptionStr)
    }
  })
  revalidatePath('/admin/events')
}

export async function updateEvent(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const slugInput = formData.get('slug') as string
  const location = formData.get('location') as string
  const matrimonyStr = formData.get('matrimonyDate') as string
  const receptionStr = formData.get('receptionDate') as string

  let slug = slugInput.trim().toLowerCase().replace(/\s+/g, '-')
  // Kalau user hapus slugnya jadi kosong, generate baru
  if (!slug) slug = generateCode(6)

  await prisma.event.update({
    where: { id },
    data: { 
      name, 
      slug,
      location, 
      matrimonyDate: new Date(matrimonyStr),
      receptionDate: new Date(receptionStr)
    }
  })
  revalidatePath(`/admin/events/${id}`)
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({ where: { id } })
  revalidatePath('/admin/events')
}

// === GUEST ACTIONS ===

export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const inviteType = formData.get('inviteType') as string
  const eventId = parseInt(formData.get('eventId') as string)
  
  if(!name) return

  // Auto-generate code tamu, pastikan unik
  let code = generateCode()
  let isUnique = false
  while (!isUnique) {
    const check = await prisma.guest.findUnique({ where: { code } })
    if (!check) isUnique = true
    else code = generateCode()
  }

  await prisma.guest.create({ 
    data: { name, code, category, inviteType, eventId } 
  })
  revalidatePath(`/admin/events/${eventId}`)
}

export async function deleteGuest(id: number, eventId: number) {
  await prisma.guest.delete({ where: { id } })
  revalidatePath(`/admin/events/${eventId}`)
}