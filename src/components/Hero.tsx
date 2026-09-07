import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import RevealLayer from './RevealLayer'
import {
  BG_IMAGE_1,
  BG_IMAGE_2,
  HERO_BASE_FILTER,
  HERO_REVEAL_FILTER,
} from '../lib/constants'

export default function Hero() {
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const loop = () => {
      const dx = mouse.current.x - smooth.current.x
      const dy = mouse.current.y - smooth.current.y
      // Il lerp è asintotico: senza soglia continuerebbe a ridisegnare la
      // maschera all'infinito anche a cursore fermo.
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        smooth.current.x += dx * 0.1
        smooth.current.y += dy * 0.1
        setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: '100dvh' }}
    >
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: BG_IMAGE_1, filter: HERO_BASE_FILTER }}
      />

      <RevealLayer
        image={BG_IMAGE_2}
        cursorX={cursorPos.x}
        cursorY={cursorPos.y}
        filter={HERO_REVEAL_FILTER}
      />

      {/* Scrim: tiene leggibili titolo e paragrafi anche quando lo spotlight
          illumina la foto a colori pieni sotto di essi. */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-black/70 via-black/20 to-black/80" />

      <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
        <h1 className="text-white leading-[0.95]">
          <span
            className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Il divertimento
          </span>
          <span
            className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
            style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
          >
            diventa competizione
          </span>
        </h1>
      </div>

      <div
        className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-sm text-white/80 leading-relaxed">
          Dal 2023 raccontiamo lo sport e la community di Grammichele: fantacalcio, tornei e giochi
          che uniscono il territorio, edizione dopo edizione.
        </p>
      </div>

      <div
        className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Fantacalcio al Listone, tornei di calcio, freccette, beer pong e cornhole: nella stagione
          2025-2026 sono 205 le squadre iscritte, con 20.000€ di montepremi in palio.
        </p>
        <Link
          to="/tornei-giochi"
          className="bg-[#E61A1A] hover:bg-[#C41414] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#E61A1A]/30"
        >
          Scopri i tornei
        </Link>
      </div>
    </section>
  )
}
