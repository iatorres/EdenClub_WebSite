import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Seguir el mouse
    const move = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }

    // Usar event delegation en document para capturar TODOS los elementos
    // incluso los que se montan después (como el formulario de login)
    const handleOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, select, label')
      if (target) {
        cursor.style.transform = 'translate(-50%, -50%) scale(3.6)'
        cursor.style.opacity   = '0.6'
      }
    }

    const handleOut = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, select, label')
      if (target) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)'
        cursor.style.opacity   = '1'
      }
    }

    // Ocultar cursor cuando sale de la ventana
    const handleLeave = () => { cursor.style.opacity = '0' }
    const handleEnter = () => { cursor.style.opacity = '1' }

    document.addEventListener('mousemove',  move)
    document.addEventListener('mouseover',  handleOver)
    document.addEventListener('mouseout',   handleOut)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    return () => {
      document.removeEventListener('mousemove',  move)
      document.removeEventListener('mouseover',  handleOver)
      document.removeEventListener('mouseout',   handleOut)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed w-2.5 h-2.5 bg-off-white rounded-full pointer-events-none z-[9999]
                 mix-blend-difference"
      style={{
        left: '-20px',
        top:  '-20px',
        transform: 'translate(-50%, -50%) scale(1)',
        transition: 'transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
      }}
    />
  )
}
