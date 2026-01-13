'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password') as string

  // Cek password sesuai .env
  if (password === process.env.ADMIN_PASSWORD) {
    
    // Set Cookie (Tiket Masuk)
    // httpOnly: true artinya cookie tidak bisa diakses via JavaScript browser (Anti XSS)
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // Login valid 1 hari
      path: '/',
    })

    redirect('/admin/events')
  } else {
    return { error: 'Password salah! Coba lagi.' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/login')
}