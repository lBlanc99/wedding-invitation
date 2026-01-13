'use client'

import { useActionState } from 'react'
import { login } from './action'
import { useFormStatus } from 'react-dom'

// Komponen Tombol biar bisa loading state
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      disabled={pending}
      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
    >
      {pending ? 'Mengecek...' : 'Masuk Dashboard'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 font-sans relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#E5E0D8_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-2">Masukkan password untuk mengelola acara.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password Admin</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              required 
              autoFocus
            />
          </div>

          {/* Pesan Error (Muncul jika password salah) */}
          {state?.error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>

        <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest">
          Secure Admin Panel
        </div>
      </div>
    </div>
  )
}