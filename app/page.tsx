export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-6 text-center relative overflow-hidden font-sans">
      
      {/* Background Pattern (Konsisten dengan halaman Login) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#E5E0D8_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 max-w-md animate-fade-in-up">
        {/* Logo Icon */}
        <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10 rotate-3 transition hover:rotate-0 duration-500">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
             <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
           </svg>
        </div>

        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Wedding Platform</h1>
        
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          Selamat datang di platform undangan digital kami.
          <br/>
          Untuk melihat undangan, silakan akses melalui <b className="text-slate-700">Link Khusus</b> (QR Code / URL) yang tertera pada pesan undangan Anda.
        </p>
        
        <div className="w-12 h-1 bg-slate-200 mx-auto rounded-full mb-8"></div>
        
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
          © {new Date().getFullYear()} lBlanc
        </p>
      </div>
    </main>
  )
}