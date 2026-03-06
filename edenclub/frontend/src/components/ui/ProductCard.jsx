import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const BADGE_MAP = {
  limited: { label: 'Limited', cls: 'border border-sand text-sand' },
  soldout: { label: 'Sold Out', cls: 'border border-white/20 text-silver' },
  new:     { label: 'New',      cls: 'bg-sand text-black' },
}

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)

  const badge = product.isNew
    ? BADGE_MAP.new
    : BADGE_MAP[product.status]

  const isSoldOut = product.status === 'soldout' || product.stock === 0

  function handleQuickAdd(e) {
    e.preventDefault()
    if (isSoldOut) return
    const defaultSize = product.sizes?.[1] || product.sizes?.[0] || 'M'
    addItem(product, defaultSize)
    toast.success(`${product.name} added`)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card group block bg-mid"
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {/* Main image */}
        <div className="product-main-img absolute inset-0 flex items-center justify-center
                        transition-opacity duration-500">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name}
                   className="w-full h-full object-cover" loading="lazy" />
            : <PlaceholderImg name={product.category} />
          }
        </div>

        {/* Hover image */}
        <div className="product-hover-img flex items-center justify-center">
          {product.hoverImageUrl
            ? <img src={product.hoverImageUrl} alt={product.name}
                   className="w-full h-full object-cover" loading="lazy" />
            : <PlaceholderImg name="Back" darker />
          }
        </div>

        {/* Badge */}
        {badge && (
          <span className={clsx(
            'absolute top-4 left-4 text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium',
            badge.cls
          )}>
            {badge.label}
          </span>
        )}

        {/* Quick add */}
        <button
          onClick={handleQuickAdd}
          disabled={isSoldOut}
          className="absolute bottom-0 left-0 right-0 bg-black/92 backdrop-blur-sm
                     py-3.5 text-[10px] tracking-[0.18em] uppercase text-off-white
                     opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-350 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSoldOut ? 'Sold Out' : '+ Quick Add'}
        </button>
      </div>

      {/* Info */}
      <div className="p-0 py-5 bg-black">
        <p className="text-[13px] font-light text-off-white tracking-wide mb-1.5">
          {product.name}
        </p>
        <p className="text-[12px] tracking-wide">
          {product.comparePrice && (
            <span className="text-silver line-through text-[11px] mr-2">
              ${product.comparePrice}
            </span>
          )}
          <span className="text-sand">${product.price}</span>
        </p>
      </div>
    </Link>
  )
}

function PlaceholderImg({ name, darker }) {
  return (
    <div className={clsx(
      'w-full h-full flex flex-col items-center justify-center gap-2',
      darker ? 'bg-[#161616]' : 'bg-surface'
    )}>
      <span className="font-display text-[44px] text-sand/[0.12] tracking-wide">EC</span>
      <span className="text-[9px] tracking-[0.2em] uppercase text-sand/20">{name}</span>
    </div>
  )
}
