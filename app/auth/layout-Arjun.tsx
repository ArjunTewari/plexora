import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/plexora/components/theme-provider"
import { Toaster } from "@/plexora/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <main className="flex-1">{children}</main>
    </div>
  )
} 