'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomBytes } from 'crypto'
import { put, del } from '@vercel/blob'
import sharp from 'sharp' // Library kompresi gambar

const prisma = new PrismaClient()

// Helper: Generate Code
function generateCode(length = 6) {
  return randomBytes(length).toString('hex').slice(0, length)
}

// === PUBLIC ACTIONS ===
export async function checkGuestCode(formData: FormData) {
  const code = formData.get('guestCode') as string
  if(!code) return
  const guest = await prisma.guest.findUnique({ where: { code } })
  if (guest) {
    redirect(`/${guest.code}`)
  }
}

export async function postMessage(formData: FormData) {
  const content = formData.get('content') as string
  const guestCode = formData.get('guestCode') as string
  if (!content || !guestCode) return
  const guest = await prisma.guest.findUnique({ where: { code: guestCode } })
  if (guest) {
    await prisma.message.create({
      data: { content, guestId: guest.id }
    })
    revalidatePath(`/${guestCode}`)
  }
}

// === EVENT ACTIONS ===
export async function addEvent(formData: FormData) {
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  // Tambahkan timezone WIB (+07:00) ke string input
  const matrimonyStr = formData.get('matrimonyDate') as string + ":00+07:00"
  const receptionStr = formData.get('receptionDate') as string + ":00+07:00"
  
  let slug = formData.get('slug') as string
  if (!slug || slug.trim() === '') {
    slug = generateCode(6)
  } else {
    slug = slug.trim().toLowerCase().replace(/\s+/g, '-')
  }
  const existing = await prisma.event.findUnique({ where: { slug } })
  if (existing) slug = generateCode(6)
  
  await prisma.event.create({
    data: { 
      name, slug, location, 
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
  // Tambahkan timezone WIB (+07:00) ke string input
  const matrimonyStr = formData.get('matrimonyDate') as string + ":00+07:00"
  const receptionStr = formData.get('receptionDate') as string + ":00+07:00"

  let slug = slugInput.trim().toLowerCase().replace(/\s+/g, '-')
  if (!slug) slug = generateCode(6)

  await prisma.event.update({
    where: { id },
    data: { 
      name, slug, location, 
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

// === IMAGE ACTIONS (VERCEL BLOB + SHARP) ===
export async function uploadEventImage(formData: FormData) {
  const eventId = parseInt(formData.get('eventId') as string)
  const file = formData.get('image') as File
  const eventSlug = formData.get('eventSlug') as string
  
  if (!file || file.size === 0) return

  // 1. Convert File ke Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 2. COMPRESS & RESIZE (Pakai Sharp)
  // Ubah jadi WebP, resize max width 1920px, quality 80%
  const processedImageBuffer = await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 }) 
    .toBuffer()

  // 3. Nama file baru (.webp)
  const filename = `${eventSlug}/${randomBytes(4).toString('hex')}.webp`

  // 4. Upload ke Vercel Blob
  const blob = await put(filename, processedImageBuffer, { 
    access: 'public',
    contentType: 'image/webp'
  })

  // 5. Simpan URL ke Database
  await prisma.eventImage.create({
    data: {
      url: blob.url,
      eventId: eventId
    }
  })

  revalidatePath(`/admin/events/${eventId}`)
  revalidatePath(`/${eventSlug}`) 
}

export async function deleteEventImage(imageId: number, imageUrl: string, eventId: number) {
  try {
    await del(imageUrl) // Hapus file fisik di cloud
    await prisma.eventImage.delete({ where: { id: imageId } }) // Hapus data di db
    revalidatePath(`/admin/events/${eventId}`)
  } catch (error) {
    console.error("Gagal hapus gambar:", error)
  }
}

// === GUEST ACTIONS ===
export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const inviteType = formData.get('inviteType') as string
  const eventId = parseInt(formData.get('eventId') as string)
  
  // Ambil data pax, kalau kosong default 1
  const pax = parseInt(formData.get('pax') as string) || 1 
  
  if(!name) return

  let code = generateCode()
  let isUnique = false
  while (!isUnique) {
    const check = await prisma.guest.findUnique({ where: { code } })
    if (!check) isUnique = true
    else code = generateCode()
  }

  await prisma.guest.create({ 
    data: { name, code, category, inviteType, eventId, pax } // <--- Simpan pax
  })
  revalidatePath(`/admin/events/${eventId}`)
}

export async function updateGuest(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const eventId = parseInt(formData.get('eventId') as string)
  
  const name = formData.get('name') as string
  const pax = parseInt(formData.get('pax') as string)
  const category = formData.get('category') as string
  const inviteType = formData.get('inviteType') as string

  if (!id || !name) return

  await prisma.guest.update({
    where: { id },
    data: { name, pax, category, inviteType }
  })

  revalidatePath(`/admin/events/${eventId}`)
}

export async function deleteGuest(id: number, eventId: number) {
  await prisma.guest.delete({ where: { id } })
  revalidatePath(`/admin/events/${eventId}`)
}