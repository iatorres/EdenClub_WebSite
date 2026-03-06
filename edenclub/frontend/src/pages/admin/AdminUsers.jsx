import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { useAdminUsers, useDeleteUser } from '@/hooks/useApi'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminUsers({ search: search || undefined })
  const deleteUser = useDeleteUser()
  const users = data?.content || data || []

  return (
    <div>
      <div className="px-10 py-7 border-b border-white/[0.07]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-sand-dark mb-1">Management</p>
        <h1 className="font-display text-[28px] tracking-[0.1em] text-off-white">USERS</h1>
      </div>

      <div className="p-10">
        <div className="relative max-w-xs mb-6">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-dark" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..." className="input-base pl-9 py-2.5" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border border-sand/30 border-t-sand rounded-full animate-spin" />
          </div>
        ) : (
          <div className="admin-card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['User','Role','Joined','Orders','Actions'].map(h => (
                    <th key={h} className="text-left text-[9px] tracking-[0.22em] uppercase
                                           text-sand-dark font-normal px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.015]">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-light">{u.firstName} {u.lastName}</p>
                      <p className="text-[11px] text-sand-dark">{u.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border
                        ${u.role === 'ADMIN'
                          ? 'text-sand border-sand/30 bg-sand/[0.07]'
                          : 'text-silver border-white/15'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-sand-dark">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-silver">{u.orderCount ?? 0}</td>
                    <td className="px-5 py-4">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => deleteUser.mutate(u.id)}
                          className="p-2 border border-white/[0.07] text-silver
                                     hover:border-red-400/50 hover:text-red-400 transition-all">
                          <Trash2 size={12} />
                        </button>
                      )}
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
