"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage } from "@/lib/auth-errors"
import { createClient } from "@/lib/supabase/client"

const registerSchema = z
  .object({
    email: z.email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")
  const [successEmail, setSuccessEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: RegisterValues) {
    setFormError("")

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setFormError(getAuthErrorMessage(error.message))
      return
    }

    if (data.session) {
      router.replace("/")
      router.refresh()
      return
    }

    setSuccessEmail(values.email)
  }

  if (successEmail) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Cek email kamu</h2>
          <p className="text-sm text-muted-foreground">
            Kami mengirim link verifikasi ke{" "}
            <span className="font-medium text-foreground">{successEmail}</span>.
            Buka link tersebut untuk mengaktifkan akun.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
        >
          Kembali ke halaman masuk
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          aria-invalid={Boolean(errors.email)}
          className="h-11 rounded-xl bg-background/60 px-3.5"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="register-password">Password</Label>
          <span className="text-xs text-muted-foreground">Min. 8 karakter</span>
        </div>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Buat password"
            aria-invalid={Boolean(errors.password)}
            className="h-11 rounded-xl bg-background/60 px-3.5 pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm-password">Konfirmasi password</Label>
        <Input
          id="register-confirm-password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Ulangi password"
          aria-invalid={Boolean(errors.confirmPassword)}
          className="h-11 rounded-xl bg-background/60 px-3.5"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <Button
        type="submit"
        variant="ghost"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 hover:bg-transparent hover:text-white"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {isSubmitting ? "Membuat akun..." : "Daftar"}
      </Button>
    </form>
  )
}
