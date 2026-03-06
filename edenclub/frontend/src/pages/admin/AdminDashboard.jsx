import { useAdminDashboard } from '@/hooks/useApi'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from 'lucide-react'

const STATUS_COLORS = {
  PENDING:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  PROCESSING: 'text-blue-400  bg-blue-400/10  border-blue-400/20',
  SHIPPED:    'text-sand      bg-sand/10      border-sand/20',
  DELIVERED:  'text-green-400 bg-green-400/10 border-green-400/20',
  CANCELLED:  'text-red-400   bg-red-400/10   border-red-400/20',
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="admin-card flex items-start justify-between">
      <div>
        <p className="text-[9px] tracking-[0.22em] uppercase text-sand-dark mb-3">{label}</p>
        <p className="font-display text-[42px] leading-none tracking-[0.04em] text-off-white mb-2">
          {value}
        </p>
        {sub && <p className="text-[11px] text-sand tracking-wide">{sub}</p>}
      </div>
      <div className={`w-10 h-10 flex items-center justify-center border ${accent || 'border-white/[0.07] text-sand'}`}>
        <Icon size={16} />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) return (
    <div className="p-10 flex items-center justify-center h-64">
      <div className="w-8 h-8 border border-sand/30 border-t-sand rounded-full animate-spin" />
    </div>
  )

  const stats = data || {
    totalProducts: 0, activeProducts: 0,
    totalOrders: 0, pendingOrders: 0,
    totalUsers: 0, totalRevenue: 0,
    recentOrders: [],
  }

  return (
    <div>
      {/* Header */}
      <div className="px-10 py-7 border-b border-white/[0.07]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-sand-dark mb-1">Overview</p>
        <h1 className="font-display text-[28px] tracking-[0.1em] text-off-white">DASHBOARD</h1>
      </div>

      <div className="p-10 space-y-10">
        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Package}      label="Total Products"  value={stats.totalProducts}  sub={`${stats.activeProducts} active`} />
          <StatCard icon={ShoppingCart} label="Total Orders"    value={stats.totalOrders}    sub={`${stats.pendingOrders} pending`} />
          <StatCard icon={Users}        label="Total Users"     value={stats.totalUsers}      sub="Registered" />
          <StatCard icon={DollarSign}   label="Revenue"         value={`$${(stats.totalRevenue||0).toLocaleString()}`} sub="All time" />
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-silver flex items-center gap-2">
              <Clock size={13} /> Recent Orders
            </h2>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <div className="admin-card text-center py-16">
              <p className="text-[12px] tracking-[0.1em] uppercase text-sand-dark">No orders yet</p>
            </div>
          ) : (
            <div className="admin-card p-0 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Order','Customer','Items','Total','Status','Date'].map(h => (
                      <th key={h} className="text-left text-[9px] tracking-[0.22em] uppercase
                                             text-sand-dark font-normal px-5 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentOrders || []).map(order => (
                    <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                      <td className="px-5 py-4 text-[12px] text-sand font-mono">#{order.id}</td>
                      <td className="px-5 py-4 text-[13px] font-light">{order.userEmail}</td>
                      <td className="px-5 py-4 text-[12px] text-silver">{order.itemCount}</td>
                      <td className="px-5 py-4 text-[13px]">${order.total}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[9px] tracking-[0.18em] uppercase px-2.5 py-1
                                         border ${STATUS_COLORS[order.status] || STATUS_COLORS.PENDING}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[11px] text-sand-dark">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
