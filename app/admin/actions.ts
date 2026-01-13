'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function addGuest(formData: FormData) {
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const category = formData.get('category') as string
  
  if(!name || !code) return

  await prisma.guest.create({ data: { name, code, category } })
  revalidatePath('/admin/guests')
}

export async function deleteGuest(id: number) {
  await prisma.guest.delete({ where: { id } })
  revalidatePath('/admin/guests')
}

export async function addEvent(formData: FormData) {
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const dateStr = formData.get('date') as string
  
  await prisma.event.create({
    data: { name, location, date: new Date(dateStr) }
  })
  revalidatePath('/admin/events')
}

export async function deleteEvent(id: number) {
  await prisma.event.delete({ where: { id } })
  revalidatePath('/admin/events')
}