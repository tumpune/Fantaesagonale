import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { RECAPITI } from '../../content/navigazione'
import { focusRing } from '../ui/styles'

/**
 * Scorciatoia per scrivere all'associazione, sempre a portata di pollice.
 *
 * Se dal pannello e' stato inserito un numero di telefono porta direttamente
 * alla chat WhatsApp, altrimenti alla pagina Contatti: il pulsante non promette
 * una chat che non esiste. Sulla pagina Contatti non compare, perche' li' il
 * modulo e' gia' sotto agli occhi.
 */
export default function ChatWidget() {
  const { pathname } = useLocation()
  const [visibile, setVisibile] = useState(false)

  // Compare dopo la testata, non subito: all'apertura ruberebbe l'attenzione
  // al titolo e al richiamo principale.
  useEffect(() => {
    const attesa = setTimeout(() => setVisibile(true), 1200)
    return () => clearTimeout(attesa)
  }, [])

  if (pathname === '/contatti') return null

  const numero = RECAPITI.telefono.replace(/[^\d]/g, '')
  const whatsapp = numero.length >= 10 ? `https://wa.me/${numero}` : null

  const classi = `press group fixed bottom-3 right-3 z-[90] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-accento-1 to-accento-2 text-black shadow-lg shadow-accento-2/40 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-accento-2/50 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${focusRing} ${
    visibile ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
  }`

  const stile = { marginBottom: 'env(safe-area-inset-bottom)', marginRight: 'env(safe-area-inset-right)' }

  const icona = (
    <MessageCircle size={24} aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-12" />
  )

  return whatsapp ? (
    <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Scrivici su WhatsApp" className={classi} style={stile}>
      {icona}
    </a>
  ) : (
    <Link to="/contatti" aria-label="Vai alla pagina contatti" className={classi} style={stile}>
      {icona}
    </Link>
  )
}
