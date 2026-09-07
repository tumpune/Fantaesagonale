import { useState, type FormEvent } from 'react'
import { AtSign, Hash, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHero } from '../components/ui'

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-brand-soft border border-white/15 text-white text-sm outline-none transition-colors focus:border-brand-yellow'

type ContactItem = {
  Icon: LucideIcon
  title: string
  text: string
  todo?: boolean
}

const CONTACTS: ContactItem[] = [
  {
    Icon: AtSign,
    title: 'Email',
    text: 'Da definire — serve email aziendale collegata al dominio',
    todo: true,
  },
  { Icon: Phone, title: 'Telefono / WhatsApp', text: 'Da definire', todo: true },
  {
    Icon: Hash,
    title: 'Social',
    text: 'Instagram / Facebook / TikTok / YouTube — link da inserire',
    todo: true,
  },
  { Icon: Send, title: 'Canale Telegram', text: 'Foto delle attività — link da inserire', todo: true },
  {
    Icon: MessageCircle,
    title: 'Canale WhatsApp',
    text: 'Novità e informazioni — link da inserire',
    todo: true,
  },
  { Icon: MapPin, title: 'Sede', text: 'Grammichele' },
]

export default function Contatti() {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFeedback(
      'Grazie! Il tuo messaggio è stato preparato. Il form è collegato a un semplice invio locale: per la messa online serve collegarlo a un servizio email o backend.',
    )
    e.currentTarget.reset()
  }

  return (
    <>
      <PageHero eyebrow="Contatti" titleItalic="Parliamo" title="insieme">
        Hai domande su tornei, iscrizioni o vuoi diventare sponsor? Scrivici, ti rispondiamo il prima
        possibile.
      </PageHero>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div className="bg-brand-card border border-white/[0.08] rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="nome" className="block text-sm font-semibold text-white/60 mb-2">
                  Nome
                </label>
                <input id="nome" name="nome" type="text" required className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-semibold text-white/60 mb-2">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-semibold text-white/60 mb-2"
                  >
                    Telefono (opzionale)
                  </label>
                  <input id="telefono" name="telefono" type="tel" className={inputClass} />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="oggetto" className="block text-sm font-semibold text-white/60 mb-2">
                  Oggetto
                </label>
                <select id="oggetto" name="oggetto" className={inputClass}>
                  <option>Info generali</option>
                  <option>Iscrizione torneo</option>
                  <option>Sponsorizzazione</option>
                  <option>Altro</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="messaggio"
                  className="block text-sm font-semibold text-white/60 mb-2"
                >
                  Messaggio
                </label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  required
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full px-7 py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-brand-yellow to-brand-red transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-red/30"
              >
                Invia messaggio
              </button>

              {feedback && (
                <div className="mt-5 rounded-xl bg-brand-yellow/10 text-brand-yellow text-sm px-4 py-3.5">
                  {feedback}
                </div>
              )}

              <p className="text-xs text-white/35 mt-4 text-center">
                Form da collegare a un servizio email o backend prima della pubblicazione.
              </p>
            </form>
          </div>

          <div className="grid gap-4">
            {CONTACTS.map(({ Icon, title, text, todo }) => (
              <div
                key={title}
                className="flex gap-4 items-start bg-brand-card border border-white/[0.06] rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-brand-yellow to-brand-red text-black flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
                  <p className={`text-sm ${todo ? 'italic text-white/40' : 'text-white/60'}`}>
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
