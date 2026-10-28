export function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase()

  if (normalized.includes("invalid login credentials")) {
    return "Email atau password salah."
  }

  if (normalized.includes("email not confirmed")) {
    return "Email belum diverifikasi. Cek inbox kamu terlebih dahulu."
  }

  if (normalized.includes("user already registered")) {
    return "Email sudah terdaftar. Silakan masuk."
  }

  if (normalized.includes("password should be at least")) {
    return "Password terlalu pendek."
  }

  if (normalized.includes("rate limit")) {
    return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi."
  }

  if (normalized.includes("unable to validate email")) {
    return "Format email tidak valid."
  }

  return "Terjadi kesalahan. Coba lagi."
}
