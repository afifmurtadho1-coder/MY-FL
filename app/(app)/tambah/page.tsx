import type { Metadata } from "next"

import { TambahView } from "@/components/expenses/tambah-view"

export const metadata: Metadata = {
  title: "Tambah Pengeluaran",
}

export default function TambahPage() {
  return <TambahView />
}
