import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Masuk",
}

export default function LoginPage() {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/85 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8">
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Selamat datang kembali
        </h1>
        <p className="text-sm text-muted-foreground">
          Masuk untuk melanjutkan mencatat pengeluaran.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
        >
          Daftar
        </Link>
      </p>
    </div>
  )
}
