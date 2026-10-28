import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Daftar",
}

export default function RegisterPage() {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/85 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Buat akun baru</h1>
        <p className="text-sm text-muted-foreground">
          Mulai catat pengeluaran harian dengan lebih rapi.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
        >
          Masuk
        </Link>
      </p>
    </div>
  )
}
