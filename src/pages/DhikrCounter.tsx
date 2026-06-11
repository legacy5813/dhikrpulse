import { useRef, useState } from 'react'

export default function DhikrCounter() {
  const [count, setCount] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [scale, setScale] = useState(1)

  const startX = useRef(0)
  const startY = useRef(0)

  const dragging = useRef(false)
  const axis = useRef<'x' | 'y' | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    axis.current = null

    startX.current = e.clientX
    startY.current = e.clientY

    e.currentTarget.setPointerCapture(e.pointerId)
  }

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

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return

    dragging.current = false

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    // 🔄 X gesture → EXPAND + IMPLODE + RESET
    if (axis.current === 'x' && absX > 60) {
      setAnimating(true)
      setX(0)
      setY(0)

      // expand
      setScale(1.6)

      setTimeout(() => {
        // implode
        setScale(0)

        setTimeout(() => {
          setCount(0)
          setScale(1)
          setAnimating(false)
        }, 300)
      }, 300)

      return
    }

    // 🔽 Y gesture → increment
    if (axis.current === 'y' && absY > 50) {
      setCount((c) => c + 1)
    }

    setX(0)
    setY(0)
  }

  return (
    <div
      style={{
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
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: '#f262ff',
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
            : 'transform 0.2s ease',
        }}
      >
        {count}
      </div>
    </div>
  )
}