import { PrismaClient } from '@prisma/client'
import { addGuest, deleteGuest } from '../actions'

const prisma = new PrismaClient()

export default async function GuestPage() {
  const guests = await prisma.guest.findMany({ 
    orderBy: { id: 'desc' }, 
    include: { _count: { select: { messages: true } } } 
  })

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Daftar Tamu Undangan</h1>

      {/* Form Tambah */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="font-semibold text-slate-700 mb-4 border-b pb-2">Tambah Tamu Baru</h2>
        <form action={addGuest} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="text-xs text-slate-500 font-bold uppercase">Nama Tamu</label>
            <input name="name" placeholder="Contoh: Budi Santoso" className="w-full border p-2 rounded mt-1" required />
          </div>
          <div className="md:col-span-3">
             <label className="text-xs text-slate-500 font-bold uppercase">Kode Unik (URL)</label>
            <input name="code" placeholder="Contoh: budi01" className="w-full border p-2 rounded mt-1" required />
          </div>
          <div className="md:col-span-3">
             <label className="text-xs text-slate-500 font-bold uppercase">Kategori</label>
            <select name="category" className="w-full border p-2 rounded mt-1 bg-white">
              <option value="Tamu">Umum</option>
              <option value="Keluarga">Keluarga</option>
              <option value="VIP">VIP</option>
              <option value="Kantor">Teman Kantor</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded transition">
              + Simpan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Tamu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 border-b">Nama</th>
              <th className="p-4 border-b">Kode Link</th>
              <th className="p-4 border-b">Kategori</th>
              <th className="p-4 border-b text-center">Jml Pesan</th>
              <th className="p-4 border-b text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-slate-50 group">
                <td className="p-4 font-medium text-slate-900">{guest.name}</td>
                <td className="p-4 text-slate-500 font-mono">
                  <a href={`/${guest.code}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                    /{guest.code} <span className="text-[10px]">↗</span>
                  </a>
                </td>
                <td className="p-4 text-slate-500">{guest.category || '-'}</td>
                <td className="p-4 text-center">
                  {guest._count.messages > 0 ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{guest._count.messages}</span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {/* <form action={deleteGuest.bind(null, guest.id)}>
                    <button className="text-slate-400 hover:text-red-600 font-medium transition">Hapus</button>
                  </form> */}
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Belum ada tamu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}