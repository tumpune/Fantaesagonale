import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

/**
 * Porta ai contatti invece di aprire una chat: il numero WhatsApp non e' ancora
 * stato definito. Quando ci sara', basta sostituire il Link con un anchor a
 * https://wa.me/<numero>.
 */
export default function ChatWidget() {
  return (
    <Link
      to="/contatti"
      aria-label="Vai alla pagina contatti"
      className="fixed bottom-5 right-5 z-[90] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-r from-brand-yellow to-brand-red text-black shadow-lg shadow-brand-red/40 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-6 sm:right-6"
      style={{
        marginBottom: 'env(safe-area-inset-bottom)',
        marginRight: 'env(safe-area-inset-right)',
      }}
    >
      <MessageCircle size={24} aria-hidden="true" />
    </Link>
  )
}
