'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

// Tambahkan prop guestCode
export default function GuestQRCode({ guestName, guestCode }: { guestName: string, guestCode: string }) {
  const [qrSrc, setQrSrc] = useState('')

  useEffect(() => {
    // Generate QR Code untuk ditampilkan di layar (Web UI)
    QRCode.toDataURL(window.location.href, { 
      width: 400, 
      margin: 2, 
      color: { dark: '#2C2C2C', light: '#FFFFFF' } 
    })
    .then((url) => setQrSrc(url))
    .catch((err) => console.error(err))
  }, [])

  // --- LOGIC DOWNLOAD CARD (CANVAS) ---
  const handleDownload = () => {
    if (!qrSrc) return

    // 1. Bikin Canvas di memori (semacam kertas gambar virtual)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = 600
    const height = 800
    
    canvas.width = width
    canvas.height = height

    if (!ctx) return

    // 2. Gambar Background Putih (Kartu)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    // 3. Tambah Hiasan Border/Frame (Opsional)
    ctx.strokeStyle = '#D4AF37' // Warna Emas
    ctx.lineWidth = 10
    ctx.strokeRect(20, 20, width - 40, height - 40)

    // 4. Tulis Header "Guest Access"
    ctx.fillStyle = '#2C2C2C'
    ctx.font = 'bold 40px serif' // Font mirip web
    ctx.textAlign = 'center'
    ctx.fillText('Guest Access', width / 2, 100)

    // 5. Tulis Sub-header "SCAN AT VENUE"
    ctx.fillStyle = '#D4AF37'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText('SCAN AT VENUE', width / 2, 140)

    // 6. Gambar QR Code ke dalam Canvas
    const img = new Image()
    img.src = qrSrc
    img.onload = () => {
      // Posisi QR Code di tengah
      const qrSize = 350
      const x = (width - qrSize) / 2
      const y = 180
      ctx.drawImage(img, x, y, qrSize, qrSize)

      // 7. Tulis Nama Tamu (Besar)
      ctx.fillStyle = '#2C2C2C'
      ctx.font = 'bold 36px serif'
      ctx.fillText(guestName, width / 2, 600)

      // 8. Tulis Kode Tamu (Kecil)
      ctx.fillStyle = '#5C5C5C'
      ctx.font = '20px monospace'
      ctx.fillText(`CODE: ${guestCode}`, width / 2, 650)

      // 9. Footer Text
      ctx.fillStyle = '#8A8A8A'
      ctx.font = 'italic 16px serif'
      ctx.fillText('Please show this at the reception desk.', width / 2, 720)

      // 10. TRIGGER DOWNLOAD
      const link = document.createElement('a')
      link.download = `Access_Pass_${guestName.replace(/\s+/g, '_')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  if (!qrSrc) return null

  return (
    <div className="bg-white p-8 rounded-[30px] border border-[#F0EAE0] shadow-xl text-center max-w-sm mx-auto relative overflow-hidden group">
      {/* Hiasan Sudut Visual Web */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-[#FDFBF7] rounded-br-[40px] z-10"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#FDFBF7] rounded-bl-[40px] z-10"></div>
      
      <h3 className="font-serif text-2xl text-[#2C2C2C] mb-2 relative z-20">Guest Access</h3>
      <p className="font-sans text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] mb-6 font-bold relative z-20">Scan at Venue</p>
      
      <div className="relative mx-auto w-48 h-48 mb-6 p-2 bg-white border-2 border-dashed border-[#E5E0D8] rounded-xl">
        <img src={qrSrc} alt="Guest QR Code" className="w-full h-full object-contain rounded-lg" />
      </div>

      <div className="mb-6 px-4">
        <p className="text-lg font-serif font-bold text-[#2C2C2C]">{guestName}</p>
        <p className="text-xs font-mono text-[#8A8A8A] mt-1 bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">Code: {guestCode}</p>
      </div>

      <p className="text-[10px] text-[#5C5C5C] mb-6 leading-relaxed opacity-70">
        Please show this QR code at the reception desk to check-in.
      </p>

      <button 
        onClick={handleDownload}
        className="w-full bg-[#2C2C2C] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-black transition shadow-lg flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download Access Pass
      </button>
    </div>
  )
}