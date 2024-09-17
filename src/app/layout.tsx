import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Bio 生成器 | 轻松创建你的小红书个人介绍',
  description:
    '使用全新的 AI 技术，快速生成个性化的小红书个人介绍，让你的主页更吸引人。立即试用，提升你的社交媒体形象！',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="theme-xhs">{children}</body>
      <Toaster />
      <Analytics />
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-9VHJKHWEW8"
      />
      <Script id="google-tag">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);} gtag('js', new Date());gtag('config', 'G-9VHJKHWEW8');`}
      </Script>
    </html>
  )
}
