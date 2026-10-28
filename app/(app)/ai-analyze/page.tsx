import { AIAnalyzeView } from "@/components/ai-analyze/ai-analyze-view"
import { PageHeader } from "@/components/layout/page-header"

export const metadata = {
  title: "AI Analyze | MY FL",
  description: "Analisis otomatis dan asisten keuangan berbasis data pengeluaran, rekap, dan tabungan",
}

export default function AIAnalyzePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Analyze"
        description="Dapatkan insight & saran keuangan berbasis data kamu"
      />
      <AIAnalyzeView />
    </div>
  )
}
