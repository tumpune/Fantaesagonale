import { useEffect, useRef } from 'react'
import { usePointerFine, useReducedMotion } from '../../hooks/useMediaQuery'

const GIALLO = [252, 215, 12]
const ROSSO = [230, 26, 26]

/**
 * Campo di esagoni disegnato su canvas: e' la forma del logo e la pianta di
 * Grammichele, quindi il fondo dice gia' chi e' l'associazione.
 *
 * Le celle si accendono dove passa il cursore e lungo un'onda che attraversa
 * la griglia da sola, cosi' il fondo resta vivo anche su touch, dove un
 * puntatore da inseguire non esiste.
 *
 * Canvas e non elementi DOM: con qualche centinaio di celle da ridipingere a
 * ogni fotogramma, altrettanti nodi costringerebbero il browser a ricalcolare
 * stile e layout in continuazione.
 */
export default function HexField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    type Cella = { x: number; y: number; seed: number }
    let celle: Cella[] = []
    let lato = 26
    let larghezza = 0
    let altezza = 0
    const puntatore = { x: -9999, y: -9999 }
    let raf = 0

    const costruisci = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      larghezza = rect.width
      altezza = rect.height
      canvas.width = Math.floor(larghezza * dpr)
      canvas.height = Math.floor(altezza * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      lato = larghezza < 640 ? 20 : larghezza < 1100 ? 24 : 28
      const passoX = lato * 1.5
      const passoY = Math.sqrt(3) * lato

      celle = []
      let colonna = 0
      for (let x = -lato; x < larghezza + lato; x += passoX) {
        const offset = colonna % 2 === 0 ? 0 : passoY / 2
        for (let y = -lato + offset; y < altezza + lato; y += passoY) {
          celle.push({ x, y, seed: Math.random() * Math.PI * 2 })
        }
        colonna++
      }
    }

    const tracciaEsagono = (x: number, y: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i
        const px = x + r * Math.cos(a)
        const py = y + r * Math.sin(a)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    const disegna = (tempo: number) => {
      ctx.clearRect(0, 0, larghezza, altezza)
      const t = tempo / 1000

      // L'onda viaggia in diagonale: il fronte luminoso attraversa la griglia
      // e torna, dando movimento anche senza interazione.
      const ondaX = (Math.sin(t * 0.22) * 0.5 + 0.5) * larghezza
      const ondaY = (Math.cos(t * 0.17) * 0.5 + 0.5) * altezza
      const raggioPuntatore = 190
      const raggioOnda = 260

      for (const cella of celle) {
        const dxP = cella.x - puntatore.x
        const dyP = cella.y - puntatore.y
        const distP = Math.sqrt(dxP * dxP + dyP * dyP)
        const daPuntatore = reduced ? 0 : Math.max(0, 1 - distP / raggioPuntatore)

        const dxO = cella.x - ondaX
        const dyO = cella.y - ondaY
        const distO = Math.sqrt(dxO * dxO + dyO * dyO)
        const daOnda = reduced ? 0 : Math.max(0, 1 - distO / raggioOnda) * 0.55

        const respiro = reduced ? 0 : (Math.sin(t * 0.9 + cella.seed) * 0.5 + 0.5) * 0.07

        const intensita = Math.min(1, daPuntatore * 1.15 + daOnda + respiro)

        if (intensita < 0.02) {
          ctx.strokeStyle = 'rgba(255,255,255,0.12)'
          ctx.lineWidth = 1
          tracciaEsagono(cella.x, cella.y, lato * 0.86)
          ctx.stroke()
          continue
        }

        const m = Math.pow(intensita, 1.6)
        const r = Math.round(GIALLO[0] + (ROSSO[0] - GIALLO[0]) * m)
        const g = Math.round(GIALLO[1] + (ROSSO[1] - GIALLO[1]) * m)
        const bl = Math.round(GIALLO[2] + (ROSSO[2] - GIALLO[2]) * m)

        tracciaEsagono(cella.x, cella.y, lato * 0.86)
        ctx.fillStyle = `rgba(${r},${g},${bl},${(intensita * 0.32).toFixed(3)})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${r},${g},${bl},${(0.14 + intensita * 0.86).toFixed(3)})`
        ctx.lineWidth = 1 + intensita * 1.4
        // Alone attorno alle celle piu' accese: senza, il fronte luminoso
        // risulta piatto e la sorgente non si distingue dal reticolo.
        ctx.shadowColor = `rgba(${r},${g},${bl},${(intensita * 0.5).toFixed(3)})`
        ctx.shadowBlur = intensita * 18
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(disegna)
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      puntatore.x = e.clientX - rect.left
      puntatore.y = e.clientY - rect.top
    }

    costruisci()
    raf = requestAnimationFrame(disegna)

    const onResize = () => costruisci()
    window.addEventListener('resize', onResize)
    if (pointerFine) window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [pointerFine, reduced])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
