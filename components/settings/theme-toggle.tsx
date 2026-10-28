"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

const options = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  const current = theme ?? "system"

  return (
    <div
      role="group"
      aria-label="Pilih tema tampilan"
      className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/60 p-1.5"
    >
      {options.map((option) => {
        const Icon = option.icon
        const active = mounted && current === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-medium transition",
              active
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-5" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
