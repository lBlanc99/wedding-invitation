'use client'

import Image from 'next/image'
import { uploadEventImage, deleteEventImage } from '../../actions'
import Swal from 'sweetalert2'

export default function GalleryManager({ event }: { event: any }) {

  // Handler Upload
  async function handleUpload(formData: FormData) {
    try {
      // Validasi kecil di client
      const file = formData.get('image') as File
      if(file.size === 0) return

      // Loading State (Opsional, pakai Swal Loading)
      Swal.fire({ title: 'Uploading...', didOpen: () => Swal.showLoading() })

      await uploadEventImage(formData)
      
      Swal.fire({ icon: 'success', title: 'Uploaded!', timer: 1500, showConfirmButton: false })
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Gagal Upload', text: 'Coba lagi nanti.' })
    }
  }

  // Handler Hapus (Dengan Konfirmasi)
  async function handleDelete(imageId: number, imageUrl: string) {
    // Tanya dulu yakin gak?
    const result = await Swal.fire({
      title: 'Hapus foto ini?',
      text: "Tidak bisa dikembalikan loh!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    })

    if (result.isConfirmed) {
      try {
        await deleteEventImage(imageId, imageUrl, event.id)
        Swal.fire('Deleted!', 'Foto berhasil dihapus.', 'success')
      } catch (e) {
        Swal.fire('Error', 'Gagal menghapus.', 'error')
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Galeri Prewed</h2>
        
        {/* Preview Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {event.images.length > 0 ? (
            event.images.map((img: any) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group shadow-sm hover:shadow-md transition">
                <Image 
                  src={img.url} 
                  alt="Prewed" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  unoptimized 
                />
                
                {/* Tombol Hapus pakai onClick biar bisa munculin Modal Konfirmasi */}
                <button 
                  onClick={() => handleDelete(img.id, img.url)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition duration-200 scale-90 group-hover:scale-100 bg-white/90 text-red-500 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm hover:bg-red-500 hover:text-white border border-red-100 cursor-pointer z-10"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              <p className="text-xs">Belum ada foto.</p>
            </div>
          )}
        </div>

        {/* Form Upload */}
        <form action={handleUpload} className="border-t border-slate-100 pt-5">
          <input type="hidden" name="eventId" value={event.id} />
          <input type="hidden" name="eventSlug" value={event.slug} />
          
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Upload Foto Baru</label>
          <input type="file" name="image" accept="image/*" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-200 rounded-lg" required />
          <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20">
            Upload Foto
          </button>
          <p className="text-[10px] text-slate-400 mt-2 text-center">*Otomatis dikompres & convert ke WebP.</p>
        </form>
    </div>
  )
}