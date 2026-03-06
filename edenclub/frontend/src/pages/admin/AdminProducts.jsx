import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Search, Pencil, Trash2, EyeOff, Eye, X } from 'lucide-react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useApi'
import clsx from 'clsx'

const SIZES    = ['XS','S','M','L','XL','XXL']
const CATS     = ['Hoodies','T-Shirts','Pants','Jackets','Accessories']
const STATUSES = ['active','limited','soldout','hidden']
const COLS     = ['drop01','main','bestsellers','new']

const productSchema = z.object({
  name:         z.string().min(1, 'Name required'),
  price:        z.coerce.number().positive('Price required'),
  comparePrice: z.coerce.number().optional().or(z.literal('')),
  category:     z.string(),
  status:       z.enum(['active','limited','soldout','hidden']),
  description:  z.string().optional(),
  color:        z.string().optional(),
  material:     z.string().optional(),
  tags:         z.string().optional(),
  featured:     z.enum(['yes','no']),
  collection:   z.string(),
  stock:        z.coerce.number().min(0).default(0),
})

const BADGE_CLS = {
  active:  'text-green-400 border-green-400/30 bg-green-400/[0.07]',
  limited: 'text-sand border-sand/30 bg-sand/[0.07]',
  soldout: 'text-red-400 border-red-400/30 bg-red-400/[0.07]',
  hidden:  'text-silver border-white/15 bg-white/[0.04]',
}

// ── Product Form Modal ────────────────────────────────────────
function ProductFormModal({ product, onClose }) {
  const [sizes, setSizes] = useState(product?.sizes || ['M','L','XL'])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      comparePrice: product.comparePrice || '',
    } : {
      category: 'Hoodies', status: 'active',
      featured: 'no', collection: 'main', stock: 0,
    },
  })

  const create = useCreateProduct()
  const update = useUpdateProduct()
  const isPending = create.isPending || update.isPending

  function onSubmit(data) {
    const payload = { ...data, sizes,
      comparePrice: data.comparePrice || null,
      tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean) || []
    }
    if (product) {
      update.mutate({ id: product.id, data: payload }, { onSuccess: onClose })
    } else {
      create.mutate(payload, { onSuccess: onClose })
    }
  }

  function toggleSize(s) {
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[8500]
                    flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface
                      border border-white/[0.08] animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.07]">
          <h2 className="font-display text-[22px] tracking-[0.1em]">
            {product ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
          </h2>
          <button onClick={onClose} className="text-silver hover:text-off-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Product Name *</label>
            <input {...register('name')} placeholder="EC Heavy Hoodie" className="input-base" />
            {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>}
          </div>

          {/* Price row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Price * ($)</label>
              <input {...register('price')} type="number" step="0.01" placeholder="145" className="input-base" />
              {errors.price && <p className="mt-1 text-[11px] text-red-400">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Compare Price</label>
              <input {...register('comparePrice')} type="number" step="0.01" placeholder="190" className="input-base" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Stock</label>
              <input {...register('stock')} type="number" min="0" placeholder="20" className="input-base" />
            </div>
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Category</label>
              <select {...register('category')} className="input-base bg-surface">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Status</label>
              <select {...register('status')} className="input-base bg-surface">
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Short product description..."
              className="input-base resize-none" />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-3">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  className={clsx(
                    'w-12 h-10 text-[12px] tracking-[0.1em] border transition-all',
                    sizes.includes(s)
                      ? 'border-sand text-sand bg-sand/[0.07]'
                      : 'border-white/[0.12] text-silver hover:border-white/30'
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color + Material */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Color</label>
              <input {...register('color')} placeholder="Washed Black" className="input-base" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Material</label>
              <input {...register('material')} placeholder="400gsm Heavyweight Cotton" className="input-base" />
            </div>
          </div>

          {/* Tags + Featured + Collection */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Tags (comma separated)</label>
            <input {...register('tags')} placeholder="hoodie, heavy, premium" className="input-base" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Featured on Homepage</label>
              <select {...register('featured')} className="input-base bg-surface">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">Collection</label>
              <select {...register('collection')} className="input-base bg-surface">
                <option value="main">Main</option>
                <option value="drop01">Drop 01</option>
                <option value="bestsellers">Best Sellers</option>
                <option value="new">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.07]">
            <button type="button" onClick={onClose}
              className="btn-ghost border border-white/[0.07]">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-50">
              {isPending ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirm ────────────────────────────────────────────
function ConfirmDelete({ product, onConfirm, onCancel }) {
  const del = useDeleteProduct()
  return (
    <div className="fixed inset-0 bg-black/92 backdrop-blur-xl z-[9000]
                    flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-surface border border-white/[0.08] p-10 text-center animate-fade-up">
        <div className="text-red-400 text-3xl mb-4">⚠</div>
        <h3 className="font-display text-[22px] tracking-[0.1em] mb-3">DELETE PRODUCT</h3>
        <p className="text-[13px] font-light text-sand-dark leading-relaxed mb-8">
          "{product.name}" will be permanently removed.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn-ghost border border-white/[0.07]">Cancel</button>
          <button
            onClick={() => del.mutate(product.id, { onSuccess: onCancel })}
            disabled={del.isPending}
            className="px-6 py-2.5 bg-red-500 text-white text-[11px] tracking-[0.16em]
                       uppercase font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {del.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminProducts() {
  const [formProduct, setFormProduct] = useState(undefined) // undefined = closed, null = new
  const [delProduct,  setDelProduct]  = useState(null)
  const [search,  setSearch]  = useState('')
  const [cat,     setCat]     = useState('')
  const [status,  setStatus]  = useState('')
  const [page,    setPage]    = useState(0)

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: cat || undefined,
    status: status || undefined,
    page, size: 15,
  })

  const products = data?.content || data || []
  const totalPages = data?.totalPages || 1

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-7 border-b border-white/[0.07]">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-sand-dark mb-1">Catalog</p>
          <h1 className="font-display text-[28px] tracking-[0.1em] text-off-white">PRODUCTS</h1>
        </div>
        <button onClick={() => setFormProduct(null)} className="btn-primary flex items-center gap-2">
          <Plus size={13} /> New Product
        </button>
      </div>

      <div className="p-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-dark" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search products..."
              className="input-base pl-9 py-2.5"
            />
          </div>
          <select value={cat} onChange={e => { setCat(e.target.value); setPage(0) }}
            className="input-base py-2.5 w-auto pr-8 bg-surface">
            <option value="">All Categories</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}
            className="input-base py-2.5 w-auto pr-8 bg-surface">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border border-sand/30 border-t-sand rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="admin-card text-center py-20">
            <p className="font-display text-5xl text-sand/10 mb-4">○</p>
            <p className="text-[12px] tracking-[0.1em] uppercase text-sand-dark">No products found</p>
          </div>
        ) : (
          <div className="admin-card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Product','Price','Stock','Category','Status','Featured','Actions'].map(h => (
                    <th key={h} className="text-left text-[9px] tracking-[0.22em] uppercase
                                           text-sand-dark font-normal px-5 py-4 first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                          {p.imageUrl
                            ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                            : <span className="font-display text-sm text-sand/20">EC</span>
                          }
                        </div>
                        <div>
                          <p className="text-[13px] font-light text-off-white">{p.name}</p>
                          <p className="text-[11px] text-sand-dark tracking-wide mt-0.5">
                            {p.color} · {(p.sizes||[]).join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {p.comparePrice && (
                        <span className="text-silver line-through text-[11px] mr-2">${p.comparePrice}</span>
                      )}
                      <span className="text-sand text-[13px]">${p.price}</span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-silver">{p.stock ?? '—'}</td>
                    <td className="px-5 py-4 text-[12px] text-silver">{p.category}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border ${BADGE_CLS[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-silver">
                      {p.featured === 'yes' ? <span className="text-sand">Yes</span> : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setFormProduct(p)}
                          className="p-2 border border-white/[0.07] text-silver
                                     hover:border-sand hover:text-sand transition-all">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => setDelProduct(p)}
                          className="p-2 border border-white/[0.07] text-silver
                                     hover:border-red-400/50 hover:text-red-400 transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-white/[0.07]">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                    className={clsx(
                      'w-8 h-8 text-[11px] border transition-colors',
                      page === i
                        ? 'border-sand text-sand'
                        : 'border-white/[0.07] text-silver hover:border-white/20'
                    )}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {formProduct !== undefined && (
        <ProductFormModal
          product={formProduct}
          onClose={() => setFormProduct(undefined)}
        />
      )}
      {delProduct && (
        <ConfirmDelete
          product={delProduct}
          onCancel={() => setDelProduct(null)}
        />
      )}
    </div>
  )
}
