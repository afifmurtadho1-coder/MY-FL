"use client"

import {
  ChevronRight,
  Loader2,
  LogOut,
  Mail,
  PiggyBank,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ThemeToggle } from "@/components/settings/theme-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function SettingsView() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState<string | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setEmail(data.user?.email ?? null)
      setLoadingEmail(false)
    })

    return () => {
      active = false
    }
  }, [supabase])

  async function handleLogout() {
    setLoggingOut(true)
    setError("")

    const { error: logoutError } = await supabase.auth.signOut()

    if (logoutError) {
      setError("Gagal keluar. Coba lagi.")
      setLoggingOut(false)
      return
    }

    router.replace("/login")
    router.refresh()
  }

  const initial = email?.charAt(0).toUpperCase() ?? "M"

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Preferensi aplikasi</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Pengaturan
        </h1>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {loadingEmail ? "Memuat akun..." : (email ?? "Pengguna MY FL")}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Akun aktif
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {email ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-muted-foreground">
              Data dilindungi dengan RLS Supabase
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Tampilan</h2>
          <p className="text-xs text-muted-foreground">
            Pilih tema terang, gelap, atau ikuti pengaturan sistem.
          </p>
        </div>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Wallet className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Preferensi pencatatan
            </h2>
            <p className="text-xs text-muted-foreground">
              Mata uang Rupiah dan zona waktu Asia/Jakarta.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/60 px-3.5 py-3">
            <p className="text-[11px] text-muted-foreground">Mata uang</p>
            <p className="mt-0.5 text-sm font-medium">IDR (Rupiah)</p>
          </div>
          <div className="rounded-xl bg-muted/60 px-3.5 py-3">
            <p className="text-[11px] text-muted-foreground">Zona waktu</p>
            <p className="mt-0.5 text-sm font-medium">Asia/Jakarta</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <PiggyBank className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Budget bulanan per kategori
              </h2>
              <p className="text-xs text-muted-foreground">
                Atur batas pengeluaran dan pantau progres
              </p>
            </div>
          </div>
          <Link href="/pengaturan/budget">
            <Button variant="ghost" size="sm" className="rounded-xl">
              Atur
              <ChevronRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold tracking-tight">Akun</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Keluar dari akun ini. Kamu perlu masuk kembali untuk melihat data
          pengeluaran.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="destructive"
          disabled={loggingOut}
          onClick={handleLogout}
          className="mt-4 h-10 w-full rounded-xl sm:w-auto"
        >
          {loggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          {loggingOut ? "Keluar..." : "Keluar dari akun"}
        </Button>
      </section>
    </div>
  )
}
