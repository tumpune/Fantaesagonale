import { Link } from 'react-router-dom'
import { Facebook, Instagram, MessageCircle, Music2, Send, Youtube } from 'lucide-react'
import { asset } from '../lib/constants'

const SOCIALS = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Facebook', Icon: Facebook },
  { label: 'TikTok', Icon: Music2 },
  { label: 'YouTube', Icon: Youtube },
  { label: 'Canale Telegram', Icon: Send },
  { label: 'Canale WhatsApp', Icon: MessageCircle },
]

export default function Footer() {
  return (
    <footer className="bg-brand-soft border-t border-white/[0.06] px-6 pt-14 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={asset('img/logo-trasparente.png')}
                alt=""
                className="w-11 h-11 object-contain"
              />
              <span className="text-2xl font-playfair italic text-white">FantaEsagonale</span>
            </div>
            <p className="text-white/60 text-sm mb-4 max-w-[280px]">
              Associazione di promozione sociale a Grammichele e dintorni. Dal 2023 trasmettiamo
              ottimismo attraverso sport, giochi e sfide vere.
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-brand-yellow hover:border-brand-yellow transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-4">Sito</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-white/60 hover:text-brand-yellow transition-colors">Home</Link></li>
              <li><Link to="/chi-siamo" className="text-white/60 hover:text-brand-yellow transition-colors">Chi Siamo</Link></li>
              <li><Link to="/tornei-giochi" className="text-white/60 hover:text-brand-yellow transition-colors">Tornei &amp; Giochi</Link></li>
              <li><Link to="/sponsor" className="text-white/60 hover:text-brand-yellow transition-colors">Sponsor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/blog" className="text-white/60 hover:text-brand-yellow transition-colors">Blog</Link></li>
              <li><Link to="/contatti" className="text-white/60 hover:text-brand-yellow transition-colors">Contatti</Link></li>
              <li><Link to="/area-soci" className="text-white/60 hover:text-brand-yellow transition-colors">Area Soci</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-4">Contatti</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="italic text-white/40">Email da definire</li>
              <li className="italic text-white/40">Tel/WhatsApp da definire</li>
              <li>Grammichele</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-5 flex flex-wrap justify-between gap-2 text-xs text-white/40">
          <span>&copy; 2026 FantaEsagonale. Tutti i diritti riservati.</span>
          <span>Sito in fase di sviluppo — contenuti in corso di definizione</span>
        </div>
      </div>
    </footer>
  )
}
