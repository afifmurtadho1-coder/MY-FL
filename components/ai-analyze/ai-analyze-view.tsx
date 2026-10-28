"use client"

import { Bot, Loader2, RefreshCw, Send, Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AIAnalyzeView() {
  const [autoAnalysis, setAutoAnalysis] = useState<string>("")
  const [autoLoading, setAutoLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [hasAutoRun, setHasAutoRun] = useState(false)

  const runAutoAnalysis = async () => {
    setAutoLoading(true)
    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "auto" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal analisis")
      setAutoAnalysis(data.answer)
      setHasAutoRun(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setAutoLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return
    const userMsg: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setChatLoading(true)
    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          message: userMsg.content,
          history: messages,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menjawab")
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              AI Analyze
            </h1>
            <p className="text-sm text-muted-foreground">
              Analisis otomatis & chat berbasis data pengeluaran, rekap, dan tabungan kamu
            </p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Bot className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Analisis Otomatis</p>
              <p className="text-xs text-muted-foreground">
                Saran langsung berdasarkan kondisi keuangan bulan ini
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={runAutoAnalysis}
            disabled={autoLoading}
            className="gap-2"
          >
            {autoLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : hasAutoRun ? (
              <RefreshCw className="size-4" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {autoLoading
              ? "Menganalisis..."
              : hasAutoRun
                ? "Analisis Ulang"
                : "Jalankan Analisis"}
          </Button>
        </div>
        <div className="px-5 py-4">
          {autoLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <Loader2 className="size-6 animate-spin text-violet-500" />
              <p className="text-sm text-muted-foreground">
                Mengumpulkan data & menganalisis...
              </p>
            </div>
          )}
          {!autoLoading && !autoAnalysis && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Sparkles className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Belum ada analisis</p>
              <p className="text-xs text-muted-foreground">
                Klik "Jalankan Analisis" untuk dapatkan saran otomatis
              </p>
            </div>
          )}
          {!autoLoading && autoAnalysis && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap leading-relaxed">
                {autoAnalysis}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden border-border/60">
        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Bot className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Chat dengan AI Analyze</p>
            <p className="text-xs text-muted-foreground">
              Tanya apa aja terkait kondisi keuangan kamu
            </p>
          </div>
        </div>
        <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Bot className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Mulai ngobrol</p>
              <p className="text-xs text-muted-foreground">
                Contoh: "Gimana caranya biar bisa nabung lebih banyak bulan ini?"
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  msg.role === "user"
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                    : "bg-muted",
                )}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm">
                <Loader2 className="size-4 animate-spin" />
                <span>AI sedang berpikir...</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-end gap-2 border-t border-border/60 px-4 py-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="min-h-[44px] max-h-32 flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim() || chatLoading}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
