import type { Metadata } from "next"

import { RekapView } from "@/components/reports/rekap-view"

export const metadata: Metadata = {
  title: "Rekap",
}

export default function RekapPage() {
  return <RekapView />
}
