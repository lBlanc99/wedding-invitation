'use server'

import { PrismaClient } from '@prisma/client' // <-- Manual import
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient() // <-- Manual new

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