'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { processCheckIn } from '../../../admin/checkin-actions' 
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'
import { Html5Qrcode } from 'html5-qrcode'

const extractCode = (text: string) => {
  try {
    if (text.startsWith('http')) {
      const urlObj = new URL(text);
      const segments = urlObj.pathname.split('/').filter(Boolean);
      return segments[segments.length - 1] || text;
    }
    return text;
  } catch (e) {
    return text;
  }
};

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [scannerKey, setScannerKey] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const processingRef = useRef(false)
  
  const searchParams = useSearchParams()
  const session = searchParams.get('session') as 'matrimony' | 'reception' || 'matrimony'
  const [eventId, setEventId] = useState<number>(0)
  
  useEffect(() => {
    params.then(p => setEventId(parseInt(p.id)))
  }, [params])

  // --- HELPER: SAFE STOP ---
  const safeStopScanner = async () => {
    if (!scannerRef.current) return;
    try { await scannerRef.current.stop(); } catch (err) {}
    try { scannerRef.current.clear(); } catch (err) {}
    scannerRef.current = null; 
  };

  // --- CORE LOGIC ---
  const triggerCheckIn = useCallback(async (codeToProcess: string) => {
    if (processingRef.current || !codeToProcess || !eventId) return

    processingRef.current = true
    await safeStopScanner(); 
    setLoading(true)
    
    try {
      const res = await processCheckIn(codeToProcess, eventId, session)
      
      if (res.success || res.errorType === 'ALREADY_SCANNED') {
        setResult(res) 
        setCode('') 
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: res.message,
          timer: 3000,
          showConfirmButton: false,
          background: '#FDFCF8',
          color: '#2D2D2D',
          customClass: {
            title: 'font-serif'
          }
        })
        setResult(null) 
        setScannerKey(prev => prev + 1)
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'System Error' })
      setResult(null)
      setScannerKey(prev => prev + 1)
    } finally {
      setLoading(false)
      setTimeout(() => { processingRef.current = false }, 500) 
    }
  }, [eventId, session]) 

  async function handleManualSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    triggerCheckIn(code)
  }

  // --- AUTO START CAMERA ---
  useEffect(() => {
    if (result || loading || !eventId) return;

    const startScanner = async () => {
      // Guard: Cegah start jika sedang processing atau scanner belum mati sempurna
      if (processingRef.current) return;
      if (scannerRef.current?.isScanning) return;

      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" }, 
          { 
            fps: 10, 
            // HAPUS qrbox & aspectRatio agar dia scan FULL LAYAR
            // qrbox: { width: 250, height: 250 }, 
            // aspectRatio: 1.0 
          },
          (decodedText) => { 
             console.log("QR Code Detected:", decodedText); // Debugging
             triggerCheckIn(extractCode(decodedText)); 
          },
          (errorMessage) => { 
            // Scanning in progress... ignore errors
          }
        );
        setCameraError(false);
      } catch (err) {
        console.error("Scanner error:", err);
        setCameraError(true);
      }
    };

    // Beri waktu React me-render div baru
    const timer = setTimeout(() => {
        startScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      safeStopScanner(); 
    };
  }, [result, loading, eventId, triggerCheckIn, scannerKey]);

  useEffect(() => {
    if (!loading && !result) { setTimeout(() => inputRef.current?.focus(), 100); }
  }, [loading, result])

  // --- UI THEME SETTINGS ---
  const isMatrimony = session === 'matrimony';
  
  // Navbar Colors: Kalem / Pastel
  const headerClass = isMatrimony 
    ? 'bg-[#F3E5AB] text-[#5C4033] border-b border-[#D4C499]' // Soft Gold / Cream
    : 'bg-[#E5E7EB] text-[#374151] border-b border-[#D1D5DB]'; // Soft Grey / Silver

  const ringFocus = isMatrimony ? 'focus:ring-[#C5A059]' : 'focus:ring-slate-400';

  return (
    // Background Cream Hangat (#FDFCF8) agar selaras undangan
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-sans flex flex-col items-center">
      
      {/* NAVBAR: ELEGANT & SOFT */}
      <div className={`w-full py-4 px-6 text-center shadow-sm sticky top-0 z-30 transition-colors duration-500 ${headerClass}`}>
         <span className="font-serif tracking-[0.15em] font-bold text-sm uppercase">
            Gate: {session}
         </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mt-4">
        
        {/* --- RESULT CARD --- */}
        {result ? (
          <div className="w-full bg-white rounded-[2rem] shadow-2xl border border-[#F0EEE6] overflow-hidden animate-fade-in-up relative transform transition-all">
             
             {/* HEADER KARTU (Warna dari Backend: Gold/Black/Green) */}
             <div className={`py-10 flex flex-col items-center justify-center ${result.colorClass} relative`}>
                
                {/* Pattern Overlay Halus (Opsional, biar ada tekstur) */}
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>

                {!result.success && result.errorType === 'ALREADY_SCANNED' && (
                  <div className="absolute top-4 bg-red-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse tracking-wide border border-red-400">
                    ⚠️ ALREADY CHECKED IN
                  </div>
                )}

                <span className="text-white/70 text-[10px] uppercase tracking-[0.25em] font-medium mb-2 mt-2">Ticket No.</span>
                <h1 className="text-white font-serif font-bold text-7xl tracking-tighter leading-none drop-shadow-md">
                    #{result.guestNumber}
                </h1>
             </div>

             {/* BODY KARTU */}
             <div className="p-8 text-center bg-white">
                
                {/* Nama Tamu: Font Serif Elegant */}
                <h2 className="text-3xl font-serif font-bold text-[#2D2D2D] leading-tight mb-2 capitalize">
                  {result.guest.name}
                </h2>
                
                <p className="text-xs font-bold text-[#8C8C8C] uppercase tracking-[0.2em] mb-8">
                  {result.guest.category || 'Guest'}
                </p>

                {/* Info Chips */}
                <div className="flex justify-center gap-3 mb-10">
                   <div className="px-5 py-2.5 bg-[#F9F7F2] rounded-xl text-xs font-mono font-bold text-[#5C5C5C] border border-[#EBE8E0]">
                      {result.guest.code}
                   </div>
                   <div className="px-5 py-2.5 bg-[#F9F7F2] rounded-xl text-xs font-bold text-[#5C5C5C] border border-[#EBE8E0] tracking-wide">
                      {result.guest.pax} PAX
                   </div>
                </div>

                {/* Tombol Elegant */}
                <button 
                  onClick={() => {
                      setResult(null);
                      setScannerKey(prev => prev + 1);
                  }} 
                  className={`w-full py-4 rounded-xl font-medium tracking-widest text-white shadow-lg transition transform active:scale-95 text-xs uppercase ${
                    // Jika error, tombol gelap. Jika sukses, tombol hitam elegan (mirip kartu resepsi)
                    !result.success ? 'bg-red-800' : 'bg-[#1a1a1a] hover:bg-black'
                  }`}
                >
                  Scan Next Guest
                </button>
             </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            
            {/* --- SCANNER FRAME --- */}
            <div className="w-full aspect-square bg-white rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden relative group">
                 <div id="reader" key={scannerKey} className="w-full h-full object-cover bg-[#EBE8E0]"></div>
                 
                 {!cameraError && loading && (
                   <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 backdrop-blur-sm">
                      <span className="text-[#8C8C8C] text-xs font-bold animate-pulse tracking-widest">PROCESSING...</span>
                   </div>
                 )}

                 {cameraError && (
                    <div className="absolute inset-0 bg-[#F9F7F2] flex flex-col items-center justify-center p-4 text-center z-10">
                        <p className="text-[#8C8C8C] font-serif italic text-sm">Camera access needed</p>
                    </div>
                 )}

                 {/* Custom Frame Overlay (White Minimalist) */}
                 <div className="absolute inset-0 pointer-events-none z-10">
                    {/* Kotak Fokus Tengah */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-white/40 rounded-3xl"></div>
                    
                    {/* Pojokan (Corner Brackets) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-80">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white rounded-br-2xl"></div>
                    </div>
                 </div>
            </div>

            {/* Input Manual Minimalis */}
            <form onSubmit={handleManualSubmit} className="w-full">
              <input 
                ref={inputRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`block w-full text-center py-4 bg-white border border-[#EBE8E0] rounded-2xl text-xl font-serif font-bold text-[#2D2D2D] placeholder:text-[#D1D1D1] placeholder:font-sans shadow-sm focus:outline-none focus:ring-1 focus:border-[#C5A059] transition-all`}
                placeholder="Enter Code"
                autoComplete="off"
              />
            </form>

          </div>
        )}
      </div>
      
      {/* Footer Branding Kecil */}
      <div className="pb-6 text-center opacity-30">
        <p className="font-serif italic text-[10px]">Wedding Guest System</p>
      </div>

      <style jsx global>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  )
}