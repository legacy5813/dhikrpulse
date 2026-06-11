import { useRef, useState } from 'react'

export default function DhikrCounter() {
  const [count, setCount] = useState(0)
  const [y, setY] = useState(0)

  const startY = useRef(0)
  const dragging = useRef(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    startY.current = e.clientY
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return

    const diff = e.clientY - startY.current
    setY(diff)
  }

  const handleMouseUp = () => {
    if (!dragging.current) return

    dragging.current = false

    // bounce back + increment
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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

          transform: `translateY(${y}px)`,
          transition: dragging.current ? 'none' : '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {count}
      </div>
    </div>
  )
}