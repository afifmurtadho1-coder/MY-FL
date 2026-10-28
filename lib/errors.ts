export function getReadErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : ""

  if (message.includes("jwt") || message.includes("session")) {
    return "Sesi kamu berakhir. Silakan masuk kembali."
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Koneksi bermasalah. Periksa internet lalu coba lagi."
  }

  return "Gagal memuat data. Coba lagi beberapa saat."
}

export function getWriteErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : ""

  if (message.includes("jwt") || message.includes("session")) {
    return "Sesi kamu berakhir. Silakan masuk kembali."
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Koneksi bermasalah. Periksa internet lalu coba lagi."
  }

  return "Terjadi kesalahan. Coba lagi."
}
