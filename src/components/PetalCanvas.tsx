import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const COLOURS: [string, string][] = [
  ['#f7e1dc', '#e9b8b4'],
  ['#fbeee9', '#f2d0c8'],
  ['#f4c9c6', '#c97b84'],
  ['#fff8f4', '#f1d8cf'],
  ['#ead6dc', '#c9a0ad'],
]

interface Petal {
  x: number
  y: number
  size: number
  depth: number // 0.4 (far) … 1 (near): scales speed, size and mouse parallax
  rot: number
  rotSpeed: number
  flip: number
  flipSpeed: number
  sway: number
  swaySpeed: number
  fall: number
  colour: [string, string]
}

function makePetal(w: number, h: number, anywhere: boolean): Petal {
  const depth = 0.4 + Math.random() * 0.6
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : -30 - Math.random() * 80,
    size: (9 + Math.random() * 10) * depth,
    depth,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 0.01 + Math.random() * 0.025,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.005 + Math.random() * 0.01,
    fall: (0.25 + Math.random() * 0.45) * depth,
    colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal, ox: number, oy: number) {
  const s = p.size
  ctx.save()
  ctx.translate(p.x + ox * p.depth, p.y + oy * p.depth)
  ctx.rotate(p.rot)
  // Squash horizontally over time to fake a 3D tumble.
  ctx.scale(Math.max(0.15, Math.abs(Math.cos(p.flip))), 1)
  ctx.globalAlpha = 0.55 + p.depth * 0.4

  const grad = ctx.createLinearGradient(0, -s, 0, s)
  grad.addColorStop(0, p.colour[0])
  grad.addColorStop(1, p.colour[1])
  ctx.fillStyle = grad

  ctx.beginPath()
  ctx.moveTo(0, s)
  ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.75, -s * 0.8, 0, -s)
  ctx.bezierCurveTo(-s * 0.75, -s * 0.8, -s * 0.9, s * 0.4, 0, s)
  ctx.fill()
  ctx.restore()
}

/**
 * Drifting rose petals rendered on a canvas. Petals react gently to the mouse
 * with depth-based parallax. The animation pauses when offscreen or when the tab is
 * hidden, and is not rendered at all for users who prefer reduced motion.
 */
export function PetalCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduce) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let petals: Petal[] = []
    let frame = 0
    let visible = true
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(38, Math.max(14, w / 38)))
      while (petals.length < count) petals.push(makePetal(w, h, true))
      petals = petals.slice(0, count)
    }

    const tick = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        p.sway += p.swaySpeed
        p.flip += p.flipSpeed
        p.rot += p.rotSpeed
        p.y += p.fall
        p.x += Math.sin(p.sway) * 0.6 * p.depth + 0.15
        if (p.y > h + 40 || p.x > w + 40) Object.assign(p, makePetal(w, h, false))
        drawPetal(ctx, p, mouse.x, mouse.y)
      }
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * -40
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * -25
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    const ro = new ResizeObserver(resize)

    resize()
    io.observe(canvas)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', start)
    start()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', start)
    }
  }, [reduce])

  if (reduce) return null
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
