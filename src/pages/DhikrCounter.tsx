import { useRef, useState } from 'react'

export default function DhikrCounter() {
  const [count, setCount] = useState(0)
  const [y, setY] = useState(0)

  const startY = useRef(0)
  const dragging = useRef(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startY.current = e.clientY

    // ensures element keeps receiving move events
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return

    const diff = e.clientY - startY.current
    setY(diff)
  }

  const handlePointerUp = () => {
    if (!dragging.current) return

    dragging.current = false

    setY(0)
    setCount((c) => c + 1)
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
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: '#1677ff',
          color: 'white',
          fontSize: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          userSelect: 'none',
          cursor: 'grab',
          touchAction: 'none', // 🔥 CRITICAL for mobile drag

          transform: `translateY(${y}px)`,
          transition: dragging.current
            ? 'none'
            : '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {count}
      </div>
    </div>
  )
}