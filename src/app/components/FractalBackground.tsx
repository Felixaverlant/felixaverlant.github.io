'use client'

import { useEffect, useRef } from 'react'

const FRACTAL_SCALE_RATIO = 1
// Lower = the line keeps easing in over more frames (a slower, time-based reveal).
const SMOOTHING = 0.06
// How many pixels of scroll map to drawing the whole fractal.
const SCROLL_PIXELS_TO_COMPLETE = 550
const FIBONACCI_STEPS = 144

export type FractalVariant = 'fibonacci'

interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  lineWidth: number
}

function getFibonacciWord (len: number): string {
  if (len <= 0) return ''
  if (len === 1) return '0'
  let a = '0'
  let b = '01'
  while (b.length < len) {
    const next = b + a
    a = b
    b = next
  }
  return b.slice(0, len)
}

function buildFibonacciSegments (steps: number = FIBONACCI_STEPS): Segment[] {
  const word = getFibonacciWord(steps)
  const segs: Segment[] = []
  let x = 0
  let y = 0
  // Start heading downward so the curve's long axis lands horizontal after centering.
  let dx = 0
  let dy = 1
  for (let k = 0; k < word.length; k++) {
    const c = word[k]
    const x2 = x + dx
    const y2 = y + dy
    segs.push({ x1: x, y1: y, x2, y2, lineWidth: 0.8 })
    x = x2
    y = y2
    if (c === '0') {
      if (k % 2 === 0) {
        const nextDx = -dy
        const nextDy = dx
        dx = nextDx
        dy = nextDy
      } else {
        const nextDx = dy
        const nextDy = -dx
        dx = nextDx
        dy = nextDy
      }
    }
  }
  return segs
}

function scaleAndCenterSegments (raw: Segment[], size: number, w: number, h: number): Segment[] {
  let minX = raw[0].x1
  let maxX = raw[0].x1
  let minY = raw[0].y1
  let maxY = raw[0].y1
  for (const seg of raw) {
    minX = Math.min(minX, seg.x1, seg.x2)
    maxX = Math.max(maxX, seg.x1, seg.x2)
    minY = Math.min(minY, seg.y1, seg.y2)
    maxY = Math.max(maxY, seg.y1, seg.y2)
  }
  const boxW = maxX - minX || 1
  const boxH = maxY - minY || 1
  const scale = (size * FRACTAL_SCALE_RATIO) / Math.max(boxW, boxH)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  return raw.map(seg => ({
    x1: (seg.x1 - centerX) * scale + w / 2,
    y1: (seg.y1 - centerY) * scale + h / 2,
    x2: (seg.x2 - centerX) * scale + w / 2,
    y2: (seg.y2 - centerY) * scale + h / 2,
    lineWidth: 0.8
  }))
}

const LEFT_ALIGN_MARGIN_RATIO = 0.02

type FractalBackgroundProps = {
  className?: string
  variant?: FractalVariant
  rotationDeg?: number
  align?: 'left' | 'center'
  steps?: number
}

export default function FractalBackground({ className, variant = 'fibonacci', rotationDeg = 0, align = 'center', steps = FIBONACCI_STEPS }: FractalBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let rafId: number
    let isInView = false
    let currentProgress = 0

    const resize = () => {
      const width = wrapper.offsetWidth
      const height = wrapper.offsetHeight
      if (width === 0 || height === 0) return

      w = width
      h = height
      dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const buildSegments = (): Segment[] => {
      const size = Math.min(w, h)
      return scaleAndCenterSegments(buildFibonacciSegments(steps), size, w, h)
    }

    const getTargetProgress = (): number => {
      const rect = wrapper.getBoundingClientRect()
      const viewH = window.innerHeight ?? 0
      if (viewH <= 0 || SCROLL_PIXELS_TO_COMPLETE <= 0) return 0
      if (rect.top >= viewH) return 0
      if (rect.top <= viewH - SCROLL_PIXELS_TO_COMPLETE) return 1
      return (viewH - rect.top) / SCROLL_PIXELS_TO_COMPLETE
    }

    const drawFrame = (drawProgress: number) => {
      if (w <= 0 || h <= 0) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const segs = buildSegments()
      const totalSegments = segs.length
      const exactCount = drawProgress * totalSegments
      const fullCount = Math.min(Math.floor(exactCount), totalSegments)
      const partial = exactCount - fullCount

      if (segs.length > 0) {
        let minX = segs[0].x1
        let maxX = segs[0].x1
        let minY = segs[0].y1
        let maxY = segs[0].y1
        for (const seg of segs) {
          minX = Math.min(minX, seg.x1, seg.x2)
          maxX = Math.max(maxX, seg.x1, seg.x2)
          minY = Math.min(minY, seg.y1, seg.y2)
          maxY = Math.max(maxY, seg.y1, seg.y2)
        }
        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2
        const leftMargin = w * LEFT_ALIGN_MARGIN_RATIO
        const tx = align === 'left' ? leftMargin - minX : w / 2 - centerX
        ctx.translate(tx, h / 2 - centerY)
        if (rotationDeg !== 0) {
          ctx.translate(centerX, centerY)
          ctx.rotate((rotationDeg * Math.PI) / 180)
          ctx.translate(-centerX, -centerY)
        }
      }

      ctx.strokeStyle = 'rgba(201, 162, 39, 0.85)'
      for (let i = 0; i < fullCount; i++) {
        const seg = segs[i]
        ctx.lineWidth = seg.lineWidth
        ctx.beginPath()
        ctx.moveTo(seg.x1, seg.y1)
        ctx.lineTo(seg.x2, seg.y2)
        ctx.stroke()
      }

      // Grow the leading segment continuously instead of popping it in whole.
      if (partial > 0 && fullCount < totalSegments) {
        const seg = segs[fullCount]
        ctx.lineWidth = seg.lineWidth
        ctx.beginPath()
        ctx.moveTo(seg.x1, seg.y1)
        ctx.lineTo(seg.x1 + (seg.x2 - seg.x1) * partial, seg.y1 + (seg.y2 - seg.y1) * partial)
        ctx.stroke()
      }
    }

    const tick = () => {
      if (w <= 0 || h <= 0) {
        rafId = requestAnimationFrame(tick)
        return
      }
      const target = getTargetProgress()
      currentProgress += (target - currentProgress) * SMOOTHING
      drawFrame(currentProgress)
      rafId = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView) resize()
      },
      { threshold: 0, rootMargin: '50px' }
    )
    io.observe(wrapper)

    const ro = new ResizeObserver(() => resize())
    ro.observe(wrapper)

    resize()
    rafId = requestAnimationFrame(tick)

    return () => {
      io.disconnect()
      ro.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [variant, rotationDeg, align, steps])

  const wrapperClass = className ? `fractal-wrapper ${className}` : 'fractal-wrapper'

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      <canvas ref={canvasRef} className="fractal-canvas" aria-hidden />
    </div>
  )
}
