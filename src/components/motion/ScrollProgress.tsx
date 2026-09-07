import { m, useScroll, useSpring } from 'motion/react'

/**
 * Barra di avanzamento della lettura.
 *
 * Il valore grezzo dello scorrimento passa per una molla: senza, la barra
 * scatta a ogni impulso della rotellina invece di seguire il movimento.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const avanzamento = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX: avanzamento }}
      className="fixed left-0 right-0 top-0 z-[150] h-[3px] origin-left bg-gradient-to-r from-brand-yellow to-brand-red"
    />
  )
}
