import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: 'Sakhilend - Financial Freedom for Women',
  description: 'A community-powered lending and savings platform designed to empower women with accessible credit and meaningful returns.',
  generator: 'v0.app',
  icons: {
    icon: '/logo-sakhilend.png',
    apple: '/logo-sakhilend.png',
  },
}

import { Toaster } from 'sonner'
import { WalletProviderWrapper } from '@/components/providers/algorand-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <WalletProviderWrapper>
          {children}
          <Toaster position="top-center" richColors />
        </WalletProviderWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}


