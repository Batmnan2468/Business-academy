import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import NavBar from '@/components/NavBar'
import ProgressHydrator from '@/components/ProgressHydrator'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Business Academy',
  description: 'Free college business courses — accounting, finance, marketing, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={`${geist.variable} h-full`}>
        <body className="min-h-full bg-white text-gray-900 antialiased">
          <ProgressHydrator />
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
