import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { AppProviders } from "@/components/providers/app-providers"
import { PwaRegister } from "@/components/pwa-register"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

  export const metadata: Metadata = {
    title: {
      default: "MY FL",
      template: "%s | MY FL",
    },
    description: "Pencatat pengeluaran harian pribadi.",
    manifest: "/manifest.json",
    themeColor: "#4f46e5",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "MY FL",
    },
  }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider>
          <AppProviders>
            <PwaRegister />
            {children}
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
