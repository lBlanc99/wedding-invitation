// app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation' // Tambahan import

const prisma = new PrismaClient()

// 1. Action Kirim Pesan
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

// 2. Action Login Tamu (INI YANG HILANG TADI)
export async function checkGuestCode(formData: FormData) {
  const code = formData.get('guestCode') as string
  if(!code) return

  const guest = await prisma.guest.findUnique({ where: { code } })
  
  if (guest) {
    redirect(`/${guest.code}`) // Lempar ke halaman undangan dia
  } else {
    // Kalau kode salah, tidak ngapa-ngapain (atau bisa return error)
    return 
  }
}

