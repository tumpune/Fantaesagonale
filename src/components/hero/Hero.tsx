import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import RevealLayer from './RevealLayer'
import { usePointerFine } from '../../hooks/useMediaQuery'
import { btnDanger } from '../ui/styles'
import {
  BG_IMAGE_1,
  BG_IMAGE_2,
  HERO_BASE_FILTER,
  HERO_REVEAL_FILTER,
  HERO_TOUCH_FILTER,
} from '../../lib/constants'

export default function Hero() {
  const pointerFine = usePointerFine()
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    // Su touch non c'e' nulla da inseguire: evita listener, ciclo di animazione
    // e la codifica della maschera a ogni frame.
    if (!pointerFine) return

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
  }, [pointerFine])

  return (
    <section
      className="relative w-full overflow-hidden bg-black min-h-[34rem] h-[100svh]"
      aria-label="FantaEsagonale"
    >
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{
          backgroundImage: BG_IMAGE_1,
          filter: pointerFine ? HERO_BASE_FILTER : HERO_TOUCH_FILTER,
        }}
      />

      {pointerFine && (
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
          filter={HERO_REVEAL_FILTER}
        />
      )}

      {/* Scrim: tiene leggibili titolo e paragrafi sopra la foto, sia nella
          versione desaturata sia dove lo spotlight la illumina a colori. */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-black/75 via-black/25 to-black/85" />

      {/* pb generoso da sm in su: li' la colonna destra e' allineata all'angolo
          inferiore destro, dove sta il pulsante fisso della chat. */}
      <div className="relative z-50 flex h-[100svh] min-h-[34rem] flex-col justify-between px-5 pb-8 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12">
        <h1 className="text-center text-white leading-[0.95] text-balance">
          <span
            className="block font-playfair italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl hero-anim hero-reveal"
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Il divertimento
          </span>
          <span
            className="block font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl -mt-1 hero-anim hero-reveal"
            style={{ letterSpacing: '-0.06em', animationDelay: '0.42s' }}
          >
            diventa competizione
          </span>
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 sm:items-end sm:gap-10">
          <p
            className="hidden sm:block max-w-[16rem] text-sm leading-relaxed text-white/80 hero-anim hero-fade"
            style={{ animationDelay: '0.7s' }}
          >
            Dal 2023 raccontiamo lo sport e la community di Grammichele: fantacalcio, tornei e giochi
            che uniscono il territorio, edizione dopo edizione.
          </p>

          <div
            className="flex flex-col items-start gap-4 sm:ml-auto sm:max-w-[18rem] sm:items-end sm:text-right hero-anim hero-fade"
            style={{ animationDelay: '0.85s' }}
          >
            <p className="text-sm leading-relaxed text-white/80">
              Fantacalcio al Listone, tornei di calcio, freccette, beer pong e cornhole: nella
              stagione 2025-2026 sono 205 le squadre iscritte, con 20.000€ di montepremi in palio.
            </p>
            <Link to="/tornei-giochi" className={btnDanger}>
              Scopri i tornei
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-3 left-1/2 z-50 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/60 hero-anim hero-fade lg:flex"
        style={{ animationDelay: '1.2s' }}
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scorri</span>
        <ChevronDown size={18} className="scroll-hint" />
      </div>
    </section>
  )
}
