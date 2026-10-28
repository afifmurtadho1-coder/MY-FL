import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { getTodayKey, startOfMonthKey } from "@/lib/reports-date"

export const runtime = "nodejs"

function cleanOutput(text: string) {
  if (!text) return text
  text = text.replace(/Role:[\s\S]*?(?=##)/gi, "")
  text = text.replace(/Task:[\s\S]*?(?=##)/gi, "")
  text = text.replace(/Rules:[\s\S]*?(?=##)/gi, "")
  text = text.replace(/Structure:[\s\S]*?(?=##)/gi, "")
  text = text.replace(/Input:[\s\S]*?(?=##)/gi, "")
  text = text.replace(/Constraint:[\s\S]*?(?=##)/gi, "")
  text = text.replace(/^\s*\*\s+.*$/gm, "")
  text = text.replace(/^\s*\d+\.\s+.*$/gm, "")
  const idx = text.indexOf("##")
  if (idx > 0) text = text.slice(idx)
  text = text.replace(/\*{3,}[\s\S]*$/g, "")
  // Remove lines that look like reasoning
  text = text.split('\n').filter(l => {
    const s = l.trim()
    if (!s) return true
    if (s.startsWith('*') && !s.startsWith('* ') && s.includes(':')) return false
    if (s.includes('I need to') || s.includes('Let me') || s.includes('I should')) return false
    return true
  }).join('\n')
  return text.trim()
}

async function callGemini(apiKey: string, data: any) {
  const models = ["gemma-4-26b-a4b-it"]
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{
                text: `Output only this analysis in Indonesian using the data.\n\nData: ${JSON.stringify(data)}\n\n## Ringkasan Kondisi\nTotal pengeluaran Rp${data.total_pengeluaran.toLocaleString('id-ID')} bulan ini${data.top_kategori[0] ? `, terbanyak ${data.top_kategori[0].nama} Rp${data.top_kategori[0].jumlah.toLocaleString('id-ID')}` : ''}.\n\n## Peringatan & Risiko\n${data.budget_total === 0 ? 'Belum ada budget yang ditetapkan.' : data.budget_per_kategori.some((b:any)=>b.status==='over') ? 'Ada kategori yang melewati budget.' : 'Pengeluaran masih dalam pantauan.'}\n\n## Saran Praktis\n${data.budget_total === 0 ? '- Tetapkan budget per kategori\n- Catat pengeluaran rutin' : '- Pantau pengeluaran harian\n- Prioritaskan kebutuhan penting'}\n\n## Rekomendasi Prioritas Minggu Ini\n${data.budget_total === 0 ? 'Buat budget bulanan terlebih dahulu.' : 'Evaluasi sisa budget tiap kategori.'}`
              }],
            },
          ],
          generationConfig: { temperature: 0, maxOutputTokens: 150 },
        }),
      })
      if (!res.ok) continue
      const result = await res.json()
      let text = result?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        text = cleanOutput(text)
        if (text.includes("## Ringkasan Kondisi")) return text
      }
    } catch {}
  }
  // Fallback template
  return `## Ringkasan Kondisi\nTotal pengeluaran Rp${data.total_pengeluaran.toLocaleString('id-ID')} bulan ini${data.top_kategori[0] ? `, terbanyak ${data.top_kategori[0].nama} Rp${data.top_kategori[0].jumlah.toLocaleString('id-ID')}` : ''}.\n\n## Peringatan & Risiko\n${data.budget_total === 0 ? 'Belum ada budget yang ditetapkan.' : 'Perlu pantau pengeluaran.'}\n\n## Saran Praktis\n- ${data.budget_total === 0 ? 'Tetapkan budget per kategori' : 'Pantau pengeluaran harian'}\n- Evaluasi kebutuhan vs keinginan\n\n## Rekomendasi Prioritas Minggu Ini\n${data.budget_total === 0 ? 'Buat budget bulanan terlebih dahulu.' : 'Review pengeluaran minggu ini.'}`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum dikonfigurasi" },
        { status: 500 },
      )
    }

    const body = await request.json()
    const mode = body.mode === "chat" ? "chat" : "auto"
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const history = Array.isArray(body.history) ? body.history.slice(-6) : []

    const today = getTodayKey()
    const monthStart = startOfMonthKey(today)
    const monthEnd = today

    const [expensesRes, categoryBudgetsRes, savingsRes] = await Promise.all([
      supabase
        .from("expenses")
        .select(
          "amount, expense_date, note, categories(name, icon, color), payment_methods(name)",
        )
        .eq("user_id", user.id)
        .gte("expense_date", monthStart)
        .lte("expense_date", monthEnd)
        .order("expense_date", { ascending: false })
        .limit(80),
      supabase
        .from("category_budgets")
        .select(
          "amount, month, spent, percentage, status, categories(name, icon, color)",
        )
        .eq("user_id", user.id)
        .eq("month", monthStart),
      supabase
        .from("savings")
        .select(
          "name, category, target_amount, current_amount, start_date, target_date, status",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ])

    const expenses = expensesRes.data ?? []
    const categoryBudgets = categoryBudgetsRes.data ?? []
    const savings = savingsRes.data ?? []

    const totalExpense = expenses.reduce(
      (sum: number, item: any) => sum + Number(item.amount || 0),
      0,
    )
    const totalBudget = categoryBudgets.reduce(
      (sum: number, item: any) => sum + Number(item.amount || 0),
      0,
    )
    const totalSpentBudget = categoryBudgets.reduce(
      (sum: number, item: any) => sum + Number(item.spent || 0),
      0,
    )
    const totalTargetSaving = savings.reduce(
      (sum: number, item: any) => sum + Number(item.target_amount || 0),
      0,
    )
    const totalCurrentSaving = savings.reduce(
      (sum: number, item: any) => sum + Number(item.current_amount || 0),
      0,
    )

    const topCategories = [...expenses]
      .reduce((acc: any[], item: any) => {
        const name = item.categories?.name || "Tanpa Kategori"
        const existing = acc.find((x) => x.name === name)
        if (existing) existing.total += Number(item.amount || 0)
        else
          acc.push({
            name,
            total: Number(item.amount || 0),
            color: item.categories?.color || "#6b7280",
          })
        return acc
      }, [])
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    const context = {
      periode: `${monthStart} s/d ${monthEnd}`,
      total_pengeluaran: totalExpense,
      budget_total: totalBudget,
      budget_terpakai: totalSpentBudget,
      top_kategori: topCategories.map((c) => ({ nama: c.name, jumlah: c.total })),
      budget_per_kategori: categoryBudgets.map((item: any) => ({
        kategori: item.categories?.name || "Tanpa Kategori",
        budget: Number(item.amount || 0),
        terpakai: Number(item.spent || 0),
        persen: Number(item.percentage || 0),
        status: item.status,
      })),
      tabungan: savings.map((item: any) => ({
        nama: item.name,
        target: Number(item.target_amount || 0),
        terkumpul: Number(item.current_amount || 0),
        persen: item.target_amount
          ? Math.round((Number(item.current_amount || 0) / Number(item.target_amount || 1)) * 100)
          : 0,
      })),
      total_tabungan_target: totalTargetSaving,
      total_tabungan_terkumpul: totalCurrentSaving,
    }

    if (mode === "auto") {
      const text = await callGemini(apiKey, context)
      return NextResponse.json({ success: true, answer: text, mode })
    } else {
      const prompt = `Jawab super singkat (max 40 kata) dalam Bahasa Indonesia berdasarkan data keuangan ini. Jangan jelasin proses berpikir.\nData: ${JSON.stringify(context)}\nRiwayat: ${history.map((h:any)=>h.role+':'+h.content.slice(0,40)).join(' | ')}\nPertanyaan: ${message}\nJawab langsung.`
      const models = ["gemma-4-26b-a4b-it"]
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 150 },
            }),
          })
          if (!res.ok) continue
          const result = await res.json()
          let text = result?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            text = cleanOutput(text)
            return NextResponse.json({ success: true, answer: text, mode })
          }
        } catch {}
      }
      return NextResponse.json({ success: true, answer: "Data cukup untuk analisis singkat. Coba tanya lebih spesifik ya.", mode })
    }
  } catch (error: any) {
    console.error("AI Analyze error:", error)
    return NextResponse.json(
      { error: error?.message || "Gagal menghasilkan analisis AI" },
      { status: 500 },
    )
  }
}
