import { ArrowLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

type PlaceholderPageProps = {
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({
  title,
  subtitle,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
      </div>

      <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/60 px-6 py-12 text-center shadow-sm">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 ring-1 ring-indigo-500/10 dark:text-indigo-400">
          <Icon className="size-8" />
        </span>
        <h2 className="mt-5 text-lg font-semibold tracking-tight">
          Segera hadir
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>
      </div>
    </div>
  )
}
