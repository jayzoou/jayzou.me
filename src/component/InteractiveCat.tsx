import { useCallback, useEffect, useRef, useState } from 'react'

type InteractiveCatProps = {
  size?: number
  className?: string
}

const InteractiveCat = ({ size = 28, className = '' }: InteractiveCatProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState(false)
  const [pupils, setPupils] = useState({ lx: 22, ly: 32, rx: 42, ry: 32 })
  const [faceShift, setFaceShift] = useState({ x: 0, y: 0 })

  const LEX = 22
  const LEY = 32
  const REX = 42
  const REY = 32
  const maxPupilR = 3.2
  const maxRotate = 8
  const maxShift = 1.8
  const centerX = 32
  const centerY = 36

  const lookAt = useCallback((mx: number, my: number) => {
    const ldx = mx - LEX
    const ldy = my - LEY
    const ldist = Math.sqrt(ldx * ldx + ldy * ldy)
    const lc = Math.min(ldist, maxPupilR) / (ldist || 1)

    const rdx = mx - REX
    const rdy = my - REY
    const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
    const rc = Math.min(rdist, maxPupilR) / (rdist || 1)

    const hdx = mx - centerX
    const hdy = my - centerY
    const hDist = Math.sqrt(hdx * hdx + hdy * hdy)
    const factor = Math.min(hDist / 80, 1)
    const nx = (hdx / (hDist || 1)) * factor * maxShift
    const ny = (hdy / (hDist || 1)) * factor * maxShift

    const angle = Math.atan2(hdx, -hdy)
    const rotDeg = factor * maxRotate * Math.sin(angle)

    return {
      pupils: {
        lx: LEX + ldx * lc,
        ly: LEY + ldy * lc,
        rx: REX + rdx * rc,
        ry: REY + rdy * rc,
      },
      faceShift: { x: nx, y: ny },
      rotDeg,
    }
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return undefined

    let raf = 0

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = svg.getBoundingClientRect()
        if (!rect.width) return

        const scale = 64 / rect.width
        const mx = (event.clientX - rect.left) * scale
        const my = (event.clientY - rect.top) * scale
        const result = lookAt(mx, my)

        svg.style.transform = `rotate(${result.rotDeg.toFixed(2)}deg)`
        setPupils(result.pupils)
        setFaceShift(result.faceShift)
      })
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      svg.style.transform = ''
    }
  }, [lookAt])

  const eyeTransition = 'opacity 0.2s ease'
  const earTransition = 'opacity 0.3s ease'
  const lShineX = pupils.lx + 1.5
  const lShineY = pupils.ly - 1.5
  const rShineX = pupils.rx + 1.5
  const rShineY = pupils.ry - 1.5

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{
        display: 'block',
        overflow: 'visible',
        transition: 'transform 0.5s cubic-bezier(0.25, 1.4, 0.5, 1)',
        transformOrigin: 'center',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <g style={{ opacity: hovered ? 0 : 1, transition: earTransition }}>
        <path d="M 13,28 Q 6,20 10,9 Q 13,4 19,9 Q 24,16 26,23 Z" fill="#f5a623" />
        <path d="M 15,25 Q 10,18 13,11 Q 15,7 19,11 Q 22,16 24,22 Z" fill="#ffd5a0" />
      </g>
      <g style={{ opacity: hovered ? 1 : 0, transition: earTransition }}>
        <path d="M 13,28 Q 10,21 12,16 L 19,13 Q 24,16 26,23 Z" fill="#f5a623" />
        <polygon points="12,16 19,13 17,24" fill="#d4801a" />
        <line x1="12" y1="16" x2="19" y2="13" stroke="#c07015" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      <g style={{ opacity: hovered ? 0 : 1, transition: earTransition }}>
        <path d="M 51,28 Q 58,20 54,9 Q 51,4 45,9 Q 40,16 38,23 Z" fill="#f5a623" />
        <path d="M 49,25 Q 54,18 51,11 Q 49,7 45,11 Q 42,16 40,22 Z" fill="#ffd5a0" />
      </g>
      <g style={{ opacity: hovered ? 1 : 0, transition: earTransition }}>
        <path d="M 51,28 Q 54,21 52,16 L 45,13 Q 40,16 38,23 Z" fill="#f5a623" />
        <polygon points="52,16 45,13 47,24" fill="#d4801a" />
        <line x1="52" y1="16" x2="45" y2="13" stroke="#c07015" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      <ellipse cx="32" cy="36" rx="25" ry="22" fill="#f5a623" />
      <ellipse cx="32" cy="38" rx="18" ry="15" fill="#ffe0b2" />

      <g style={{ opacity: hovered ? 0 : 1, transition: eyeTransition }}>
        <ellipse cx="22" cy="32" rx="5.5" ry="6" fill="white" />
        <ellipse cx="42" cy="32" rx="5.5" ry="6" fill="white" />
        <circle cx={pupils.lx} cy={pupils.ly} r="3" fill="#1a1a2e" />
        <circle cx={pupils.rx} cy={pupils.ry} r="3" fill="#1a1a2e" />
        <circle cx={lShineX} cy={lShineY} r="1.2" fill="white" opacity="0.9" />
        <circle cx={rShineX} cy={rShineY} r="1.2" fill="white" opacity="0.9" />
      </g>
      <g style={{ opacity: hovered ? 1 : 0, transition: eyeTransition }}>
        <path d="M17 33 Q22 27 27 33" stroke="#1a1a2e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M37 33 Q42 27 47 33" stroke="#1a1a2e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>

      <g transform={`translate(${faceShift.x.toFixed(2)} ${faceShift.y.toFixed(2)})`}>
        <ellipse cx="32" cy="40" rx="2" ry="1.5" fill="#ff8a80" />
        <path d="M28 42 Q32 46 36 42" stroke="#c97a30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M32 40 L32 42" stroke="#c97a30" strokeWidth="1" strokeLinecap="round" />
        <line x1="14" y1="37" x2="4" y2="35" stroke="#c97a30" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="14" y1="40" x2="4" y2="41" stroke="#c97a30" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="50" y1="37" x2="60" y2="35" stroke="#c97a30" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="50" y1="40" x2="60" y2="41" stroke="#c97a30" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export default InteractiveCat