import type { Metadata } from "next"

import { HomeView } from "@/components/dashboard/home-view"

export const metadata: Metadata = {
  title: "Beranda",
}

export default function HomePage() {
  return <HomeView />
}
