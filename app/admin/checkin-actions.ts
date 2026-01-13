'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function processCheckIn(
  code: string, 
  eventId: number, 
  session: 'matrimony' | 'reception'
) {
  // 1. Cari Tamu
  const guest = await prisma.guest.findFirst({
    where: { code: code.trim(), eventId }
  })

  if (!guest) {
    return { success: false, errorType: 'NOT_FOUND', message: 'Ticket Code Not Found!' }
  }

  // --- LOGIC WARNA TEMA UNDANGAN ---
  let colorClass = 'bg-slate-600'
  if (guest.inviteType === 'Full Event') {
      colorClass = 'bg-[#1A4D2E]'; // Hijau VVIP
  } else if (guest.inviteType === 'Matrimony') {
      colorClass = 'bg-[#C5A059]'; // Emas Matrimony
  } else if (guest.inviteType === 'Reception') {
      colorClass = 'bg-[#2D2D2D]'; // Hitam Resepsi
  }

  // --- HELPER BARU: HITUNG GLOBAL TICKET NUMBER ---
  // Menghitung urutan global berdasarkan waktu, menggabungkan antrian Matrimony & Reception
  const getGlobalTicketNumber = async (compareTime: Date) => {
    
    // Hitung semua check-in Matrimony yang terjadi SEBELUM atau BERSAMAAN dengan waktu ini
    const rankMatrimony = await prisma.guest.count({
      where: { 
        eventId, 
        checkInMatrimonyTime: { not: null, lte: compareTime } 
      }
    })

    // Hitung semua check-in Reception yang terjadi SEBELUM atau BERSAMAAN dengan waktu ini
    const rankReception = await prisma.guest.count({
      where: { 
        eventId, 
        checkInReceptionTime: { not: null, lte: compareTime } 
      }
    })

    // Global Queue = Gabungan keduanya
    return rankMatrimony + rankReception;
  }

  // 2. Cek Salah Sesi
  if (session === 'matrimony' && guest.inviteType === 'Reception') {
      return { success: false, errorType: 'WRONG_SESSION', message: 'No Access: Reception Invitation Only.' }
  }
  if (session === 'reception' && guest.inviteType === 'Matrimony') {
      return { success: false, errorType: 'WRONG_SESSION', message: 'No Access: Matrimony Invitation Only.' }
  }

  // 3. CEK DUPLIKASI (ALREADY SCANNED)
  let isDuplicate = false;
  let existingTime = null;

  if (session === 'matrimony' && guest.checkInMatrimonyTime) {
      isDuplicate = true;
      existingTime = guest.checkInMatrimonyTime;
  } else if (session === 'reception' && guest.checkInReceptionTime) {
      isDuplicate = true;
      existingTime = guest.checkInReceptionTime;
  }

  if (isDuplicate && existingTime) {
       // Hitung nomor tiket berdasarkan waktu check-in LAMANYA
       const existingTicket = await getGlobalTicketNumber(existingTime);
       
       return { 
         success: false, 
         errorType: 'ALREADY_SCANNED',
         message: `Guest checked in at ${existingTime.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}`,
         guest: guest,
         guestNumber: existingTicket, // <-- Ini sekarang akan return Global Queue yang benar
         colorClass: colorClass, 
       }
  }

  // 4. Proses Check-in Baru
  const now = new Date()
  const updatedGuest = await prisma.guest.update({
    where: { id: guest.id },
    data: session === 'matrimony' ? { checkInMatrimonyTime: now } : { checkInReceptionTime: now }
  })

  // Hitung nomor tiket BARU berdasarkan waktu SEKARANG
  const guestNumber = await getGlobalTicketNumber(now)

  revalidatePath(`/admin/events/${eventId}`)
  
  return { 
    success: true, 
    errorType: null,
    guest: updatedGuest, 
    guestNumber, 
    colorClass,
    message: 'Check-in Successful' 
  }
}
// To Invalidate/Undo Check-in (in Guest Book)
export async function invalidateCheckIn(guestId: number, eventId: number, type: 'matrimony' | 'reception') {
  await prisma.guest.update({
    where: { id: guestId },
    data: type === 'matrimony' ? { checkInMatrimonyTime: null } : { checkInReceptionTime: null }
  })
  revalidatePath(`/admin/events/${eventId}`)
}