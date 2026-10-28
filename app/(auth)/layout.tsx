import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,oklch(0.93_0.05_285),transparent_38%),radial-gradient(circle_at_bottom_right,oklch(0.94_0.04_165),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,oklch(0.28_0.08_285),transparent_38%),radial-gradient(circle_at_bottom_right,oklch(0.24_0.05_165),transparent_35%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 -z-10 size-72 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 -z-10 size-72 rounded-full bg-emerald-500/15 blur-3xl"
      />

      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="flex size-11 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-indigo-500/30">
            <Image
              src="/logo.jpeg"
              alt="MY FL Logo"
              width={44}
              height={44}
              className="size-11 object-cover"
              priority
            />
          </span>
          <span>
            <span className="block text-xl font-semibold tracking-tight">
              MY FL
            </span>
            <span className="block text-xs text-muted-foreground">
              Catatan pengeluaran pribadi
            </span>
          </span>
        </Link>

        {children}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Data keuanganmu tersimpan aman dan hanya bisa diakses olehmu.
        </p>
      </div>
    </main>
  )
}
