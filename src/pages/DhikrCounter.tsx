import { useEffect, useRef, useState } from 'react'
import { getRandomVerse } from '../modules/quran'

export default function DhikrCounter() {
  const [count, setCount] = useState(0)

  // gesture state
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [scale, setScale] = useState(1)
  const [animating, setAnimating] = useState(false)

  // reward state
  const [verse, setVerse] = useState<{ text: string; ref: string } | null>(null)
  const lastMilestone = useRef(0)

  const startX = useRef(0)
  const startY = useRef(0)
  const dragging = useRef(false)
  const axis = useRef<'x' | 'y' | null>(null)

  // ─────────────────────────────
  // MILESTONE LOGIC (20, 40, 60...)
  // ─────────────────────────────
  useEffect(() => {
    const milestone = Math.floor(count / 20)

    // RESET → default state
    if (count === 0) {
      setVerse(null)
      lastMilestone.current = 0
      return
    }

    // NEW MILESTONE → fetch verse
    if (milestone > 0 && milestone !== lastMilestone.current) {
      lastMilestone.current = milestone

      getRandomVerse()
        .then(setVerse)
        .catch(console.error)
    }
  }, [count])

  // ─────────────────────────────
  // POINTER DOWN
  // ─────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    axis.current = null

    startX.current = e.clientX
    startY.current = e.clientY

    e.currentTarget.setPointerCapture(e.pointerId)
  }

  // ─────────────────────────────
  // POINTER MOVE
  // ─────────────────────────────
  const handlePointerMove = (e: React.PointerEvent) => {
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

  // ─────────────────────────────
  // POINTER UP
  // ─────────────────────────────
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    // RESET (swipe X)
    if (axis.current === 'x' && absX > 60) {
      setAnimating(true)
      resetPosition()

      setScale(1.6)

      setTimeout(() => {
        setScale(0)

        setTimeout(() => {
          setCount(0)
          setVerse(null)
          lastMilestone.current = 0
          setScale(1)
          setAnimating(false)
        }, 300)
      }, 300)

      return
    }

    // INCREMENT (swipe Y)
    if (axis.current === 'y' && absY > 50) {
      setCount((c) => c + 1)
    }

    resetPosition()
  }

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
      }}
    >
      {/* 🔷 TOP BOX */}
      <div
        style={{
          paddingTop: 40,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: 12,
            border: '1px solid #001529',
            borderRadius: 10,
            fontSize: 14,
            color: '#001529',
            textAlign: 'center',
            width: 260,
            background: 'white',
          }}
        >
          {count === 0 && 'More Dhikr to Unlock Reward'}

          {count > 0 && !verse && 'Keep going...'}

          {verse && count > 0 && (
            <>
              <div style={{ marginBottom: 6 }}>{verse.text}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                — {verse.ref}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🔵 CENTER AREA */}
      <div
        style={{
          flex: 1,
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