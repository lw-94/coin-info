import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from './trpc-provider'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coin Info',
  description: 'Coin info',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Toaster richColors position="top-right" />
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
