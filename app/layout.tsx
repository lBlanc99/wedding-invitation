import type { Metadata } from 'next'
import { Cormorant_Garamond, Great_Vibes, Montserrat } from 'next/font/google' // Import Font
import './globals.css'

// 1. Font untuk Judul (Elegan/Mewah)
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '600'],
  variable: '--font-serif'
})

// 2. Font untuk Tanda Tangan/Aksen (Romantis)
const greatVibes = Great_Vibes({ 
  subsets: ['latin'], 
  weight: ['400'],
  variable: '--font-script'
})

// 3. Font untuk Teks Biasa (Bisa dibaca jelas)
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'The Wedding Invitation',
  description: 'You are invited',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${greatVibes.variable} ${montserrat.variable} bg-[#FDFBF7]`}>
        {children}
      </body>
    </html>
  )
}