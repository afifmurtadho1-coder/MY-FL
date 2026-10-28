import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  PieChart,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Wallet,
    title: "Catat Pengeluaran Mudah",
    description:
      "Tambah transaksi dalam hitungan detik. Cukup pilih kategori, nominal, dan catatan.",
  },
  {
    icon: PieChart,
    title: "Budget Per Kategori",
    description:
      "Atur batas pengeluaran per kategori dan pantau sisa budget secara real-time.",
  },
  {
    icon: BarChart3,
    title: "Rekap & Analisis",
    description:
      "Lihat tren pengeluaran mingguan & bulanan untuk ambil keputusan keuangan lebih bijak.",
  },
  {
    icon: CalendarClock,
    title: "Riwayat Lengkap",
    description:
      "Akses seluruh riwayat transaksi kamu kapan saja dengan filter yang praktis.",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Privat",
    description:
      "Data keuanganmu tersimpan aman hanya bisa diakses oleh akun kamu sendiri.",
  },
  {
    icon: Smartphone,
    title: "Bisa Diakses di Mana Saja",
    description:
      "Dibangun sebagai web app yang bisa dipakai di HP maupun desktop dengan nyaman.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl shadow-md shadow-indigo-500/20">
              <Image
                src="/logo.jpeg"
                alt="MY FL Logo"
                width={36}
                height={36}
                className="size-9 object-cover"
                priority
              />
            </span>
            <span className="text-sm font-semibold tracking-[0.18em]">MY FL</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="rounded-xl">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-1/2 h-80 w-[36rem] translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Catatan pengeluaran pribadi, simpel & praktis
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Atur Keuanganmu
                  <span className="block bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                    Lebih Bijak & Terarah
                  </span>
                </h1>
                <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                  MY FL membantu kamu mencatat pengeluaran harian, mengatur budget per kategori, dan melihat rekap keuangan dengan tampilan yang bersih & mudah dipahami.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700"
                  >
                    Mulai Gratis
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-xl">Sudah punya akun</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold tracking-tight">Cepat</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Catat dalam hitungan detik
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold tracking-tight">Rapi</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Laporan jelas & terstruktur
                  </p>
                </div>
                <div className="col-span-2 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur sm:col-span-1">
                  <p className="text-2xl font-semibold tracking-tight">Pribadi</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Khusus buat keuangan kamu
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -left-10 top-10 size-64 rounded-full bg-indigo-500/15 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-10 right-10 size-64 rounded-full bg-violet-500/15 blur-3xl"
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 shadow-2xl shadow-indigo-500/10 backdrop-blur">
                <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl">
                      <Image
                        src="/logo.jpeg"
                        alt="MY FL"
                        width={36}
                        height={36}
                        className="size-9 object-cover"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-medium">MY FL</p>
                      <p className="text-xs text-muted-foreground">
                        Ringkasan hari ini
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-600 dark:text-emerald-400">
                    Aktif
                  </span>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-white shadow-lg shadow-indigo-500/20">
                    <p className="text-sm text-indigo-100">Pengeluaran bulan ini</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">
                      Rp1.250.000
                    </p>
                    <p className="mt-4 text-xs text-indigo-100">
                      24 transaksi
                    </p>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-border/60 bg-background/80 p-5">
                    <p className="text-sm font-medium">Sisa Budget per Kategori</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Makan & Minum</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Sisa Rp450.000
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full w-[65%] rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Transport</span>
                        <span className="text-amber-600 dark:text-amber-400">
                          Sisa Rp150.000
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full w-[85%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Semua yang kamu butuhin, dalam satu aplikasi
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Fokus ke pencatatan, bukan ke laporan yang ribet. MY FL dirancang biar kamu bisa langsung pakai tanpa belajar lama.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div
                    aria-hidden
                    className="absolute -right-10 -top-10 size-32 rounded-full bg-indigo-500/5 blur-2xl transition group-hover:bg-indigo-500/10"
                  />
                  <div className="relative">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-violet-700 px-6 py-12 text-center text-white shadow-2xl shadow-indigo-500/20 sm:px-12">
            <div
              aria-hidden
              className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-32 right-1/4 size-72 rounded-full bg-emerald-400/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Mulai kendalikan pengeluaranmu hari ini
              </h2>
              <p className="text-base text-indigo-100 sm:text-lg">
                Gratis, simpel, dan langsung bisa dipakai. Cukup daftar, catat, dan pantau.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" className="rounded-xl bg-white text-indigo-700 shadow-xl hover:bg-white/90">
                    Daftar Sekarang
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-xl border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
                    Masuk ke Akun
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl">
              <Image
                src="/logo.jpeg"
                alt="MY FL"
                width={36}
                height={36}
                className="size-9 object-cover"
              />
            </span>
            <div>
              <p className="text-sm font-medium">MY FL</p>
              <p className="text-xs text-muted-foreground">
                Pencatat pengeluaran harian pribadi
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MY FL. Semua hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  )
}
