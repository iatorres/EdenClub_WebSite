import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct, useProducts } from '@/hooks/useApi'
import { useCartStore } from '@/store/cartStore'
import ProductCard from '@/components/ui/ProductCard'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-white/[0.07]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-[11px]
                   tracking-[0.18em] uppercase text-silver hover:text-off-white transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="pb-5 text-[13px] font-light text-sand-dark leading-relaxed tracking-wide">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError } = useProduct(id)
  const { data: relatedData } = useProducts({ category: product?.category, size: 4 })
  const addItem = useCartStore(s => s.addItem)

  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  function handleAddToCart() {
    if (!selectedSize) { toast.error('Please select a size'); return }
    addItem(product, selectedSize, qty)
    toast.success(`${product.name} added to cart`)
  }

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border border-sand/30 border-t-sand rounded-full animate-spin" />
    </div>
  )

  if (isError || !product) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <p className="font-display text-4xl tracking-widest text-sand/30">404</p>
      <Link to="/shop" className="btn-outline">Back to Shop</Link>
    </div>
  )

  const images = product.images || []
  const isSoldOut = product.status === 'soldout' || product.stock === 0

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 text-[10px] tracking-[0.18em] uppercase text-sand-dark">
          <Link to="/" className="hover:text-off-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-off-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-off-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 mb-24">
          {/* Gallery */}
          <div className="flex gap-0.5">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-0.5 w-20 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-[3/4] bg-surface overflow-hidden border
                      ${activeImg === i ? 'border-sand' : 'border-transparent hover:border-white/20'}
                      transition-colors`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 aspect-[3/4] bg-surface relative overflow-hidden">
              {images[activeImg]
                ? <img src={images[activeImg]} alt={product.name}
                       className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3
                                  bg-gradient-to-br from-[#1e1e1e] to-[#111]">
                    <span className="font-display text-[80px] text-sand/[0.08] tracking-wide">EC</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-sand/20">{product.category}</span>
                  </div>
                )
              }
              {product.status === 'new' && (
                <span className="absolute top-5 left-5 bg-sand text-black text-[8px]
                                 tracking-[0.2em] uppercase px-2.5 py-1 font-medium">New</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-mid px-8 md:px-12 py-12 flex flex-col">
            {/* Header */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.28em] uppercase text-sand mb-3">
                {product.category}
              </p>
              <h1 className="font-display text-[clamp(32px,4vw,52px)] leading-tight tracking-[0.04em]
                             text-off-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                {product.comparePrice && (
                  <span className="text-silver line-through text-[15px]">${product.comparePrice}</span>
                )}
                <span className="text-sand text-[22px] tracking-wide">${product.price}</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[13px] font-light text-sand-dark leading-relaxed tracking-wide mb-8 border-b border-white/[0.07] pb-8">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-[0.2em] uppercase text-silver">Size</span>
                <button className="text-[10px] tracking-[0.14em] uppercase text-sand-dark
                                   underline hover:text-sand transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || ['XS','S','M','L','XL']).map(size => {
                  const unavailable = product.unavailableSizes?.includes(size)
                  return (
                    <button
                      key={size}
                      disabled={unavailable || isSoldOut}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-11 text-[12px] tracking-[0.1em] border transition-all duration-200
                        ${selectedSize === size
                          ? 'border-off-white text-off-white bg-white/[0.04]'
                          : unavailable
                          ? 'border-white/[0.04] text-white/20 cursor-not-allowed line-through'
                          : 'border-white/[0.12] text-silver hover:border-white/40 hover:text-off-white'
                        }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Qty + Add */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-white/[0.12]">
                <button onClick={() => setQty(q => Math.max(1, q-1))}
                  className="w-11 h-12 flex items-center justify-center text-silver
                             hover:text-off-white transition-colors border-r border-white/[0.07]">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-[13px] text-off-white">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 10, q+1))}
                  className="w-11 h-12 flex items-center justify-center text-silver
                             hover:text-off-white transition-colors border-l border-white/[0.07]">
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="flex-1 btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            {/* Stock indicator */}
            {!isSoldOut && product.stock <= 5 && (
              <p className="text-[11px] tracking-[0.1em] text-sand mb-6">
                Only {product.stock} left
              </p>
            )}

            {/* Accordion details */}
            <div className="mt-auto pt-6 space-y-0">
              <AccordionItem title="Product Details">
                <ul className="space-y-2">
                  {product.material && <li>Material: {product.material}</li>}
                  {product.fit && <li>Fit: {product.fit}</li>}
                  {product.color && <li>Color: {product.color}</li>}
                </ul>
              </AccordionItem>
              <AccordionItem title="Care Instructions">
                Machine wash cold, inside out. Hang dry. Do not bleach.
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                Free shipping on orders over $150. Delivered in 3–5 business days.
                Returns accepted within 30 days of delivery.
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedData?.content?.length > 0 && (
          <div>
            <div className="section-label mb-4">You May Also Like</div>
            <h3 className="font-display text-[40px] tracking-[0.04em] mb-10">RELATED PRODUCTS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
              {relatedData.content
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map(p => <ProductCard key={p.id} product={p} />)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
