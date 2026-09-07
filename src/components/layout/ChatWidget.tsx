import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

/**
 * Porta ai contatti invece di aprire una chat: il numero WhatsApp non e' ancora
 * stato definito. Quando ci sara', basta sostituire il Link con un anchor a
 * https://wa.me/<numero>.
 */
export default function ChatWidget() {
  const [shown, setShown] = useState(false)

  // Compare dopo la hero, non subito: all'apertura ruberebbe l'attenzione al
  // titolo e al richiamo principale.
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <Link
      to="/contatti"
      aria-label="Vai alla pagina contatti"
      // Piu' piccolo e piu' in basso su mobile: a 56px copriva l'angolo del
      // richiamo secondario nella testata. 48px resta sopra la soglia dei 44px
      // raccomandata per un bersaglio da toccare col dito.
      className={`press group fixed bottom-3 right-3 z-[90] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-brand-yellow to-brand-red text-black shadow-lg shadow-brand-red/40 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-brand-red/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{
        marginBottom: 'env(safe-area-inset-bottom)',
        marginRight: 'env(safe-area-inset-right)',
      }}
    >
      <MessageCircle
        size={24}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-rotate-12"
      />
    </Link>
  )
}
