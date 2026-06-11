import { useEffect, useRef, useState } from 'react'

const BACKGROUNDS = [
  null,
  '/beachsunset.jpg',
  '/forest.jpg',
  '/mountains.jpg',
]

const STEP = 25

export default function DhikrCounter() {
  const [count, setCount] = useState<number>(0)

  // gesture state
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)
  const [scale, setScale] = useState<number>(1)
  const [animating, setAnimating] = useState<boolean>(false)

  // background state
  const [bgIndex, setBgIndex] = useState<number>(0)
  const [nextBgIndex, setNextBgIndex] = useState<number | null>(null)
  const [fading, setFading] = useState<boolean>(false)

  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const dragging = useRef<boolean>(false)
  const axis = useRef<'x' | 'y' | null>(null)

  // ─────────────────────────────
  // BACKGROUND LOGIC (FIXED)
  // ─────────────────────────────
  useEffect(() => {
    // ✅ RESET CASE (IMPORTANT FIX)
    if (count === 0) {
      setBgIndex(0)
      setNextBgIndex(null)
      setFading(false)
      return
    }

    const newIndex = Math.floor(count / STEP)

    if (newIndex !== bgIndex && BACKGROUNDS[newIndex]) {
      setNextBgIndex(newIndex)
      setFading(true)

      const timeoutId = setTimeout(() => {
        setBgIndex(newIndex)
        setFading(false)
        setNextBgIndex(null)
      }, 600)

      return () => clearTimeout(timeoutId)
    }
  }, [count, bgIndex])

  const currentBg = BACKGROUNDS[bgIndex]

  const nextBg =
    nextBgIndex !== null ? BACKGROUNDS[nextBgIndex] : null

  // ─────────────────────────────
  // GESTURE HANDLERS
  // ─────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    axis.current = null

    startX.current = e.clientX
    startY.current = e.clientY

    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || animating) return

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    if (!axis.current) {
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }

    if (axis.current === 'x') {
      setX(dx)
      setY(0)
    } else {
      setY(dy)
      setX(0)
    }
  }

  const resetPosition = () => {
    setX(0)
    setY(0)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    // ───── RESET (X swipe)
    if (axis.current === 'x' && absX > 60) {
      setAnimating(true)
      resetPosition()

      setScale(1.6)

      setTimeout(() => {
        setScale(0)

        setTimeout(() => {
          setCount(0)
          setScale(1)
          setAnimating(false)
        }, 300)
      }, 300)

      return
    }

    // ───── INCREMENT (Y swipe)
    if (axis.current === 'y' && absY > 50) {
      setCount((c) => c + 1)
    }

    resetPosition()
  }

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* BASE BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: currentBg ? `url(${currentBg})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.05)',
        }}
      />

      {/* FADE LAYER */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: nextBg ? `url(${nextBg})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: fading ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          transform: 'scale(1.05)',
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
        }}
      />

      {/* COUNTER UI */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: '#001529',
            color: 'white',
            fontSize: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
            cursor: 'grab',
            touchAction: 'none',

            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            transition: animating
              ? 'transform 0.3s ease-in-out'
              : 'transform 0.15s ease',
          }}
        >
          {count}
        </div>
      </div>
    </div>
  )
}