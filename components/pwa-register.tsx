"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" })
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" })
        }
      } catch (error) {
        console.error("SW registration failed", error)
      }
    }

    register()
  }, [])

  return null
}
