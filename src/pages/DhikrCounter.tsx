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

  // ✨ premium animation states
  const [flash, setFlash] = useState(false)
  const [showVerse, setShowVerse] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  const startX = useRef(0)
  const startY = useRef(0)
  const dragging = useRef(false)
  const axis = useRef<'x' | 'y' | null>(null)

  // ─────────────────────────────
  // MILESTONE LOGIC
  // ─────────────────────────────
  useEffect(() => {
    const milestone = Math.floor(count / 20)

    // RESET
    if (count === 0) {
      setVerse(null)
      lastMilestone.current = 0
      setFocusMode(false)
      return
    }

    // NEW MILESTONE
    if (milestone > 0 && milestone !== lastMilestone.current) {
      lastMilestone.current = milestone

      // reset animation cycle
      setShowVerse(false)
      setFocusMode(true)

      // ✨ strong glow start
      setFlash(true)

      getRandomVerse()
        .then((v) => {
          setVerse(v)

          // anticipation delay (premium feel)
          setTimeout(() => {
            setShowVerse(true)
          }, 250)

          // glow lasts longer
          setTimeout(() => {
            setFlash(false)
          }, 1600)

          // remove focus mode after reveal
          setTimeout(() => {
            setFocusMode(false)
          }, 2200)
        })
        .catch(console.error)
    }
  }, [count])

  // ─────────────────────────────
  // POINTER DOWN
  // ─────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    axis.current = null

    startX.current = e.clientX
    startY.current = e.clientY

    e.currentTarget.setPointerCapture(e.pointerId)
  }

  // ─────────────────────────────
  // POINTER MOVE
  // ─────────────────────────────
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

  // ─────────────────────────────
  // POINTER UP
  // ─────────────────────────────
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    // RESET
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

    // INCREMENT
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
        background: focusMode ? '#e9e9e9' : '#f5f5f5',
        transition: 'background 0.5s ease',
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
            padding: 14,
            borderRadius: 12,
            fontSize: 14,
            color: '#001529',
            textAlign: 'center',
            width: 280,
            background: 'white',

            // ✨ PREMIUM GLOW
            boxShadow: flash
              ? '0 0 20px rgba(0,0,0,0.25), 0 0 70px rgba(0,0,0,0.12)'
              : '0 2px 10px rgba(0,0,0,0.05)',

            transition: 'box-shadow 0.6s ease',
          }}
        >
          {count === 0 && 'More Dhikr to Unlock Reward'}

          {count > 0 && !verse && 'Keep going...'}

          {verse && count > 0 && (
            <div
              style={{
                opacity: showVerse ? 1 : 0,
                transform: showVerse
                  ? 'translateY(0px) scale(1)'
                  : 'translateY(28px) scale(0.96)',
                transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div style={{ marginBottom: 8, fontSize: 15 }}>
                {verse.text}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                — {verse.ref}
              </div>
            </div>
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
            width: 115,
            height: 115,
            borderRadius: '50%',
            background: '#001529',
            color: 'white',
            fontSize: 42,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
            cursor: 'grab',
            touchAction: 'none',

            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            transition: animating
              ? 'transform 0.35s ease-in-out'
              : 'transform 0.15s ease',
          }}
        >
          {count}
        </div>
      </div>
    </div>
  )
}