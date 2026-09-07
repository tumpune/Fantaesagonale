import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { asset } from '../lib/constants'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Chi Siamo', to: '/chi-siamo' },
  { label: 'Tornei & Giochi', to: '/tornei-giochi' },
  { label: 'Sponsor', to: '/sponsor' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contatti', to: '/contatti' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
        <img
          src={asset('img/logo-trasparente.png')}
          alt="FantaEsagonale"
          className="w-9 h-9 object-contain"
        />
        <span className="text-white text-xl sm:text-2xl font-playfair italic whitespace-nowrap">
          FantaEsagonale
        </span>
      </Link>

      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active ? 'text-white' : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/area-soci"
          className="hidden sm:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          Area Soci
        </Link>
        <button
          type="button"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-white p-2 rounded-full hover:bg-white/15 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full left-4 right-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.to ? 'text-white bg-white/10' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/area-soci"
            onClick={() => setOpen(false)}
            className="sm:hidden mt-1 px-4 py-3 rounded-xl text-sm font-semibold bg-white text-gray-900 text-center"
          >
            Area Soci
          </Link>
        </div>
      )}
    </nav>
  )
}
