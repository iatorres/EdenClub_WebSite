import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const count    = useCartStore(s => s.count())
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { to: '/shop',    label: 'Shop' },
    { to: '/shop?new=true', label: 'New Drop' },
    { to: '/lookbook', label: 'Lookbook' },
    { to: '/about',    label: 'About' },
  ]

  return (
    <>
      <nav className={clsx(
        'fixed top-0 left-0 right-0 h-[68px] flex items-center justify-between px-10 z-[1000]',
        'border-b transition-all duration-400',
        scrolled
          ? 'bg-black/88 backdrop-blur-xl border-white/[0.07]'
          : 'bg-transparent border-transparent'
      )}>
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-[26px] tracking-[0.12em] text-off-white
                     relative after:absolute after:bottom-[-2px] after:left-0
                     after:w-0 after:h-px after:bg-sand after:transition-all
                     after:duration-400 hover:after:w-full"
        >
          EDENCLUB
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-9 list-none">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => clsx(
                  'text-[12px] tracking-[0.14em] uppercase transition-colors duration-300',
                  'relative after:absolute after:bottom-[-3px] after:left-0',
                  'after:h-px after:bg-off-white after:transition-all after:duration-300',
                  isActive
                    ? 'text-off-white after:w-full'
                    : 'text-silver after:w-0 hover:text-off-white hover:after:w-full'
                )}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link to="/cart" className="relative text-silver hover:text-off-white transition-colors duration-300">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-sand text-black
                               w-4 h-4 rounded-full text-[9px] font-medium
                               flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {/* User */}
          {token ? (
            <div className="relative group">
              <button className="text-silver hover:text-off-white transition-colors duration-300">
                <User size={18} strokeWidth={1.5} />
              </button>
              <div className="absolute right-0 top-8 w-44 bg-mid border border-white/[0.07]
                              opacity-0 pointer-events-none group-hover:opacity-100
                              group-hover:pointer-events-auto transition-opacity duration-300">
                <div className="px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-[10px] tracking-[0.14em] uppercase text-sand-dark truncate">
                    {user?.email}
                  </p>
                </div>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="block px-4 py-2.5 text-[11px] tracking-[0.1em]
                    uppercase text-sand hover:text-off-white transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2.5 text-[11px] tracking-[0.1em]
                  uppercase text-silver hover:text-off-white transition-colors">
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="w-full text-left px-4 py-2.5 text-[11px] tracking-[0.1em]
                    uppercase text-silver hover:text-red-400 transition-colors
                    border-t border-white/[0.07]"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-silver hover:text-off-white transition-colors duration-300">
              <User size={18} strokeWidth={1.5} />
            </Link>
          )}

          {/* Mobile menu btn */}
          <button
            className="md:hidden text-off-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-xl z-[1500]
                        flex flex-col items-center justify-center gap-10 animate-fade-in">
          <button
            className="absolute top-6 right-6 text-silver hover:text-off-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </button>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="font-display text-5xl tracking-[0.06em] text-off-white
                         hover:text-sand transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
