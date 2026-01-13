// app/admin/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto' // Bawaan Node.js buat bikin kode acak

const prisma = new PrismaClient()

// Fungsi bantu bikin kode unik 6 karakter (contoh: a7x9b2)
function generateCode(length = 6) {
  return randomBytes(length).toString('hex').slice(0, length)
}

// --- EVENT ACTIONS ---

export async function addEvent(formData: FormData) {
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const matrimonyStr = formData.get('matrimonyDate') as string
  const receptionStr = formData.get('receptionDate') as string
  
  await prisma.event.create({
    data: { 
      name, 
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
  const location = formData.get('location') as string
  const matrimonyStr = formData.get('matrimonyDate') as string
  const receptionStr = formData.get('receptionDate') as string

  await prisma.event.update({
    where: { id },
    data: { 
      name, 
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

// --- GUEST ACTIONS ---

export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string
  // Code GAK DIAMBIL dari form lagi, tapi kita generate
  const category = formData.get('category') as string
  const inviteType = formData.get('inviteType') as string
  const eventId = parseInt(formData.get('eventId') as string)
  
  if(!name) return

  // Generate kode unik, pastikan belum kepakai
  let code = generateCode()
  let isUnique = false
  while (!isUnique) {
    const check = await prisma.guest.findUnique({ where: { code } })
    if (!check) isUnique = true
    else code = generateCode() // Kalau kembar, generate lagi
  }

  try {
    await prisma.guest.create({ 
      data: { name, code, category, inviteType, eventId } 
    })
    revalidatePath(`/admin/events/${eventId}`)
  } catch (e) {
    console.error('Gagal tambah tamu', e)
  }
}

export async function deleteGuest(id: number, eventId: number) {
  await prisma.guest.delete({ where: { id } })
  revalidatePath(`/admin/events/${eventId}`)
}