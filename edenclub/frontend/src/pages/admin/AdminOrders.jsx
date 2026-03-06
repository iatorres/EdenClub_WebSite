import { useState } from 'react'
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useApi'
import clsx from 'clsx'

const STATUSES = ['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED']
const STATUS_CLS = {
  PENDING:    'text-yellow-400 border-yellow-400/30 bg-yellow-400/[0.07]',
  PROCESSING: 'text-blue-400  border-blue-400/30  bg-blue-400/[0.07]',
  SHIPPED:    'text-sand      border-sand/30      bg-sand/[0.07]',
  DELIVERED:  'text-green-400 border-green-400/30 bg-green-400/[0.07]',
  CANCELLED:  'text-red-400   border-red-400/30   bg-red-400/[0.07]',
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const { data, isLoading } = useAdminOrders({ status: statusFilter || undefined, page, size: 20 })
  const updateStatus = useUpdateOrderStatus()

  const orders = data?.content || data || []
  const totalPages = data?.totalPages || 1

  return (
    <div>
      <div className="flex items-center justify-between px-10 py-7 border-b border-white/[0.07]">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-sand-dark mb-1">Management</p>
          <h1 className="font-display text-[28px] tracking-[0.1em] text-off-white">ORDERS</h1>
        </div>
      </div>

      <div className="p-10">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }}
              className={clsx(
                'px-4 py-2 text-[10px] tracking-[0.16em] uppercase border transition-colors',
                statusFilter === s
                  ? 'border-sand text-sand bg-sand/[0.07]'
                  : 'border-white/[0.07] text-silver hover:border-white/20'
              )}>
              {s || 'All'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border border-sand/30 border-t-sand rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-card text-center py-20">
            <p className="text-[12px] tracking-[0.1em] uppercase text-sand-dark">No orders found</p>
          </div>
        ) : (
          <div className="admin-card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Order','Customer','Items','Total','Status','Date','Update Status'].map(h => (
                    <th key={h} className="text-left text-[9px] tracking-[0.22em] uppercase
                                           text-sand-dark font-normal px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.015]">
                    <td className="px-5 py-4 text-[12px] text-sand font-mono">#{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-light">{order.userName}</p>
                      <p className="text-[11px] text-sand-dark">{order.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-silver">{order.itemCount}</td>
                    <td className="px-5 py-4 text-[13px] text-sand">${order.total}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border
                                       ${STATUS_CLS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[11px] text-sand-dark">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        defaultValue={order.status}
                        onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        className="input-base py-1.5 w-auto pr-6 text-[11px] bg-[#0d0d0d]"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
