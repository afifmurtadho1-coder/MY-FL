export { cn } from "cn"

export const TIME_ZONE = "Asia/Jakarta"
export const LOCALE = "id-ID"

export function formatRupiah(value: number | string | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value

  if (amount == null || Number.isNaN(amount)) {
    return "Rp 0"
  }

  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRupiahCompact(value: number | null | undefined) {
  const amount = value ?? 0

  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1)} M`
  }

  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)} jt`
  }

  if (Math.abs(amount) >= 1_000) {
    return `${Math.round(amount / 1_000)} rb`
  }

  return String(amount)
}

export function parseRupiahInput(value: string | null | undefined) {
  const digits = (value ?? "").replace(/\D/g, "")
  return digits ? Number(digits) : 0
}

export function formatRupiahInput(value: string | number | null | undefined) {
  const amount =
    typeof value === "string" ? parseRupiahInput(value) : Number(value)

  if (!amount || Number.isNaN(amount)) {
    return ""
  }

  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getTodayInJakarta() {
  const now = new Date()
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day}`
}

export function getContrastText(hexColor: string | null | undefined) {
  if (!hexColor) {
    return "#ffffff"
  }

  const hex = hexColor.replace("#", "")

  if (hex.length !== 6) {
    return "#ffffff"
  }

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.62 ? "#111827" : "#ffffff"
}

export function formatTanggal(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
) {
  if (!value) {
    return "-"
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    ...options,
  }).format(date)
}
