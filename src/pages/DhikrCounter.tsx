import { useRef, useState } from 'react'

export default function DhikrCounter() {
  const [count, setCount] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [spinning, setSpinning] = useState(false)

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
    if (!dragging.current || spinning) return

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    // 🔥 decide axis once
    if (!axis.current) {
      if (Math.abs(dx) > Math.abs(dy)) {
        axis.current = 'x'
      } else {
        axis.current = 'y'
      }
    }

    // 🔒 LOCKED TO X
    if (axis.current === 'x') {
      setX(dx)
      setY(0)
      return
    }

    // 🔒 LOCKED TO Y
    if (axis.current === 'y') {
      setY(dy)
      setX(0)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return

    dragging.current = false

    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    // 🔄 X gesture → spin reset
    if (axis.current === 'x' && Math.abs(dx) > 60) {
      setSpinning(true)
      setX(0)
      setY(0)

      setTimeout(() => {
        setCount(0)
        setSpinning(false)
      }, 2000)

      return
    }

    // 🔽 Y gesture → increment
    if (axis.current === 'y' && Math.abs(dy) > 50) {
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
          touchAction: 'none',

          transform: spinning
            ? 'rotateY(1080deg)'
            : `translate(${x}px, ${y}px)`,

          transition: spinning
            ? '2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : '0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {count}
      </div>
    </div>
  )
}