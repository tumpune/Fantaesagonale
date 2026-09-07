import { useState, type FormEvent } from 'react'
import { AtSign, Hash, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHero, Section, btnPrimary } from '../components/ui'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-brand-soft px-4 py-3 text-sm text-white transition-colors focus:border-brand-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow'

const labelClass = 'mb-2 block text-sm font-semibold text-white/70'

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
  {
    Icon: Send,
    title: 'Canale Telegram',
    text: 'Foto delle attività — link da inserire',
    todo: true,
  },
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
      'Grazie! Il modulo non è ancora collegato a un servizio di invio, quindi il messaggio non parte: nel frattempo puoi scriverci sui canali social.',
    )
    e.currentTarget.reset()
  }

  return (
    <>
      <PageHero eyebrow="Contatti" titleItalic="Parliamo" title="insieme">
        Hai domande su tornei, iscrizioni o vuoi diventare sponsor? Scrivici, ti rispondiamo il prima
        possibile.
      </PageHero>

      <Section alt>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-2xl border border-white/[0.08] bg-brand-card p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} noValidate={false}>
              <div className="mb-5">
                <label htmlFor="nome" className={labelClass}>
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-x-5 sm:grid-cols-2">
                <div className="mb-5">
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className={inputClass}
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="telefono" className={labelClass}>
                    Telefono <span className="font-normal text-white/40">(opzionale)</span>
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="oggetto" className={labelClass}>
                  Oggetto
                </label>
                <select id="oggetto" name="oggetto" className={inputClass} defaultValue="Info generali">
                  <option>Info generali</option>
                  <option>Iscrizione torneo</option>
                  <option>Sponsorizzazione</option>
                  <option>Altro</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="messaggio" className={labelClass}>
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

              <button type="submit" className={`${btnPrimary} w-full text-center`}>
                Invia messaggio
              </button>

              {/* aria-live: chi usa uno screen reader deve sentire l'esito senza
                  doversi spostare manualmente sul messaggio. */}
              <div aria-live="polite">
                {feedback && (
                  <p className="mt-5 rounded-xl bg-brand-yellow/10 px-4 py-3.5 text-sm text-brand-yellow">
                    {feedback}
                  </p>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-white/40">
                Modulo da collegare a un servizio email o backend prima della pubblicazione.
              </p>
            </form>
          </div>

          <ul className="grid gap-4">
            {CONTACTS.map(({ Icon, title, text, todo }) => (
              <li
                key={title}
                className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-brand-card p-4 sm:p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brand-yellow to-brand-red text-black">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="mb-1 block text-sm font-semibold text-white">{title}</span>
                  <span
                    className={`block text-sm break-words ${todo ? 'italic text-white/40' : 'text-white/60'}`}
                  >
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
