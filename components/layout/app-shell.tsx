"use client"

import {
  ChartNoAxesColumn,
  History,
  Home,
  PiggyBank,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useExpenseSheet } from "@/components/expenses/expense-sheet-provider"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

const mainNav: NavItem[] = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/tabungan", label: "Tabungan", icon: PiggyBank },
  { href: "/rekap", label: "Rekap", icon: ChartNoAxesColumn },
  { href: "/ai-analyze", label: "AI Analyze", icon: Sparkles },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === "/beranda") return pathname === "/beranda"
  return pathname.startsWith(href)
}

function Brand() {
  return (
    <Link href="/beranda" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-indigo-500/25">
        <Image
          src="/logo.jpeg"
          alt="MY FL Logo"
          width={40}
          height={40}
          className="size-10 object-cover"
          priority
        />
      </span>
      <span>
        <span className="block text-sm font-semibold tracking-[0.18em]">
          MY FL
        </span>
        <span className="block text-[11px] text-muted-foreground">
          Catatan pengeluaran
        </span>
      </span>
    </Link>
  )
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  const { openCreate } = useExpenseSheet()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-card/50 px-4 py-6 backdrop-blur-xl md:flex">
      <div className="px-2">
        <Brand />
      </div>

      <nav className="mt-8 space-y-1">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  active && "text-indigo-600 dark:text-indigo-400",
                )}
              />
              {item.label}
              {active && (
                <span className="ml-auto size-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Tambah Pengeluaran
        </button>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Kebiasaan baik
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Catat pengeluaran setiap hari agar rekap bulanan lebih akurat.
          </p>
        </div>
      </div>
    </aside>
  )
}

function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden">
      <Brand />
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
        Pribadi
      </span>
    </header>
  )
}

function MobileNav({ pathname }: { pathname: string }) {
  const { openCreate } = useExpenseSheet()
  const leftItems = mainNav.slice(0, 2)
  const rightItems = mainNav.slice(2)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="relative mx-auto flex h-16 max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {leftItems.map((item) => (
          <MobileNavItem key={item.href} item={item} pathname={pathname} />
        ))}

        <div aria-hidden className="w-14" />

        {rightItems.map((item) => (
          <MobileNavItem key={item.href} item={item} pathname={pathname} />
        ))}

        <button
          type="button"
          onClick={openCreate}
          aria-label="Tambah pengeluaran"
          className="absolute left-1/2 top-0 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30 ring-4 ring-background transition hover:scale-105 active:scale-95"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  )
}

function MobileNavItem({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const active = isActive(pathname, item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-14 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-medium transition",
        active
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
      {item.label}
    </Link>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh md:pl-64">
      <DesktopSidebar pathname={pathname} />
      <MobileHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-5 md:px-8 md:pb-12 md:pt-10">
        {children}
      </main>
      <MobileNav pathname={pathname} />
    </div>
  )
}
