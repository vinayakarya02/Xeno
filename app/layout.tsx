import type { Metadata } from 'next'
import './globals.css'
import SessionProviderWrapper from "@/components/SessionProviderWrapper"

export const metadata: Metadata = {
  title: 'Xenocrm',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>Xenocrm</title>
      </head>
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
