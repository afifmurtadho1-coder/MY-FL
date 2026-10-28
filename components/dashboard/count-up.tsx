"use client"

import { useEffect, useRef, useState } from "react"

import { formatRupiah } from "@/lib/utils"

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  const previous = useRef(0)

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0
    const start = previous.current
    const difference = safeTarget - start
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (reducedMotion || difference === 0) {
      previous.current = safeTarget
      setValue(safeTarget)
      return
    }

    let frame = 0
    const startedAt = window.performance.now()

    function tick(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(start + difference * eased)

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        previous.current = safeTarget
      }
    }

    frame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

export function CountUp({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const animated = useCountUp(value)

  return <span className={className}>{formatRupiah(animated)}</span>
}
