import { MessageCircle } from 'lucide-react'

export default function ChatWidget() {
  return (
    <button
      type="button"
      aria-label="Chat"
      onClick={() =>
        alert('Widget chat/WhatsApp: collegare al numero definitivo di FantaEsagonale.')
      }
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-r from-brand-yellow to-brand-red text-black flex items-center justify-center shadow-lg shadow-brand-red/40 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle size={24} />
    </button>
  )
}
