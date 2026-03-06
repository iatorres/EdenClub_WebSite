import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'

const navItems = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products',  icon: Package },
  { to: '/admin/orders',   label: 'Orders',    icon: ShoppingCart },
  { to: '/admin/users',    label: 'Users',     icon: Users },
]

export default function AdminLayout() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-off-white">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-black border-r border-white/[0.07] flex flex-col">
        {/* Logo */}
        <div className="px-7 py-7 border-b border-white/[0.07]">
          <div className="font-display text-xl tracking-[0.14em] text-off-white">EDENCLUB</div>
          <div className="text-[9px] tracking-[0.22em] uppercase text-sand-dark mt-1">Admin Panel</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-7 py-3 text-[12px] tracking-[0.1em] uppercase',
                'border-l-2 transition-all duration-200',
                isActive
                  ? 'text-off-white border-sand bg-sand/[0.04]'
                  : 'text-sand-dark border-transparent hover:text-off-white hover:bg-white/[0.02]'
              )}
            >
              <Icon size={14} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-7 border-t border-white/[0.07] space-y-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase
                       text-sand-dark hover:text-off-white transition-colors w-full"
          >
            <ArrowLeft size={13} /> Back to Store
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase
                       text-sand-dark hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={13} /> Log Out
          </button>
          <p className="text-[10px] text-white/20 tracking-wide truncate pt-1">{user?.email}</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
