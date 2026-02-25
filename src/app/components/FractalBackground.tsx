'use client'

import { useEffect, useRef } from 'react'

const LENGTH_RATIO = 0.78
const MIN_LENGTH = 3
const MAX_SEGMENTS = 500
const DELETED_LEGS = 0
const FRACTAL_SIZE_RATIO = 1
const DRAGON_SIZE_RATIO = 1
const TRUNK_DIRECTION_DEG = 180
const SMOOTHING = 0.5
const SCROLL_PIXELS_TO_COMPLETE = 300

export type FractalVariant = 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch'

interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  lineWidth: number
}

function getDragonTurns (order: number): ('R' | 'L')[] {
  if (order <= 0) return []
  let turns: ('R' | 'L')[] = ['R']
  for (let n = 1; n < order; n++) {
    const flipped = turns.map(t => (t === 'R' ? 'L' : 'R')).reverse()
    turns = [...turns, 'R', ...flipped]
  }
  return turns
}

function buildDragonSegments (order: number): Segment[] {
  const turns = getDragonTurns(order)
  const segs: Segment[] = []
  let x = 0
  let y = 0
  let dx = 1
  let dy = 0
  for (let i = 0; i <= turns.length; i++) {
    const x2 = x + dx
    const y2 = y + dy
    segs.push({ x1: x, y1: y, x2, y2, lineWidth: 0.8 })
    x = x2
    y = y2
    if (i < turns.length) {
      if (turns[i] === 'R') {
        const nextDx = dy
        const nextDy = -dx
        dx = nextDx
        dy = nextDy
      } else {
        const nextDx = -dy
        const nextDy = dx
        dx = nextDx
        dy = nextDy
      }
    }
  }
  return segs
}

function getFibonacciWord (curveN: number): string {
  const len = curveN <= 0 ? 0 : curveN === 1 ? 1 : fibNum(curveN)
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

function fibNum (n: number): number {
  if (n <= 0) return 0
  if (n <= 2) return 1
  let a = 1
  let b = 1
  for (let i = 3; i <= n; i++) {
    const next = a + b
    a = b
    b = next
  }
  return b
}

function buildFibonacci10Segments (): Segment[] {
  const word = getFibonacciWord(10)
  const segs: Segment[] = []
  let x = 0
  let y = 0
  let dx = 1
  let dy = 0
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

function kochSplit (x1: number, y1: number, x2: number, y2: number): [number, number, number, number][] {
  const ax = x1 + (x2 - x1) / 3
  const ay = y1 + (y2 - y1) / 3
  const bx = x1 + (2 * (x2 - x1)) / 3
  const by = y1 + (2 * (y2 - y1)) / 3
  const perpX = -(y2 - y1)
  const perpY = x2 - x1
  const len = Math.hypot(perpX, perpY) || 1
  const h = (Math.sqrt(3) / 6) * Math.hypot(x2 - x1, y2 - y1)
  const px = (x1 + x2) / 2 - (perpX / len) * h
  const py = (y1 + y2) / 2 - (perpY / len) * h
  return [[x1, y1, ax, ay], [ax, ay, px, py], [px, py, bx, by], [bx, by, x2, y2]]
}

function buildKochSegments (depth: number): Segment[] {
  const segs: Segment[] = []
  function add (x1: number, y1: number, x2: number, y2: number, d: number) {
    if (d <= 0) {
      segs.push({ x1, y1, x2, y2, lineWidth: 0.8 })
      return
    }
    const parts = kochSplit(x1, y1, x2, y2)
    for (const [a, b, c, d_] of parts) {
      add(a, b, c, d_, d - 1)
    }
  }
  add(0, 0, 1, 0, depth)
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
  const scale = (size * DRAGON_SIZE_RATIO) / Math.max(boxW, boxH)
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

function collectSegments(
  segments: Segment[],
  x: number,
  y: number,
  length: number,
  directionRad: number,
  branchAngleDeg: number,
  maxCount: number,
  visitIndex: { next: number } = { next: 0 }
): void {
  if (length < MIN_LENGTH) return
  if (segments.length >= maxCount) return

  const endX = x + length * Math.sin(directionRad)
  const endY = y - length * Math.cos(directionRad)
  const idx = visitIndex.next++
  if (idx >= DELETED_LEGS) {
    segments.push({ x1: x, y1: y, x2: endX, y2: endY, lineWidth: 0.8 })
  }

  const newLength = length * LENGTH_RATIO
  const angleDeltaRad = (branchAngleDeg * Math.PI) / 180
  collectSegments(segments, endX, endY, newLength, directionRad - angleDeltaRad, branchAngleDeg, maxCount, visitIndex)
  collectSegments(segments, endX, endY, newLength, directionRad + angleDeltaRad, branchAngleDeg, maxCount, visitIndex)
}

const LEFT_ALIGN_MARGIN_RATIO = 0.02

type FractalBackgroundProps = {
  className?: string
  variant?: FractalVariant
  angleDeg?: number
  rotationDeg?: number
  align?: 'left' | 'center'
}

function dragonOrderFromVariant (v: FractalVariant): number | null {
  if (v === 'dragon3') return 3
  if (v === 'dragon4') return 4
  if (v === 'dragon5') return 5
  return null
}

export default function FractalBackground({ className, variant = 'tree', angleDeg = 60, rotationDeg = 0, align = 'center' }: FractalBackgroundProps) {
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
      const order = dragonOrderFromVariant(variant)
      if (order !== null) {
        return scaleAndCenterSegments(buildDragonSegments(order), size, w, h)
      }
      if (variant === 'fibonacci10') {
        return scaleAndCenterSegments(buildFibonacci10Segments(), size, w, h)
      }
      if (variant === 'koch') {
        return scaleAndCenterSegments(buildKochSegments(3), size, w, h)
      }
      const segs: Segment[] = []
      const cx = align === 'left' ? w * LEFT_ALIGN_MARGIN_RATIO : w / 2
      const startY = h / 2
      const startLength = size * FRACTAL_SIZE_RATIO
      const directionRad = (TRUNK_DIRECTION_DEG * Math.PI) / 180
      collectSegments(segs, cx, startY, startLength, directionRad, angleDeg, MAX_SEGMENTS)
      return segs
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
      const targetCount = Math.floor(drawProgress * totalSegments)

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
      for (let i = 0; i < targetCount && i < totalSegments; i++) {
        const seg = segs[i]
        ctx.lineWidth = seg.lineWidth
        ctx.beginPath()
        ctx.moveTo(seg.x1, seg.y1)
        ctx.lineTo(seg.x2, seg.y2)
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
  }, [variant, angleDeg, rotationDeg, align])

  const wrapperClass = className ? `fractal-wrapper ${className}` : 'fractal-wrapper'

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      <canvas ref={canvasRef} className="fractal-canvas" aria-hidden />
    </div>
  )
}
