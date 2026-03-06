import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '@/hooks/useApi'
import ProductCard from '@/components/ui/ProductCard'

// ── Reveal hook ───────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ── Ticker ────────────────────────────────────────────────────
function Ticker() {
  const items = ['Free Shipping on Orders Over $150','New Drop — SS \'25 Collection','Premium Quality Garments','Secure Checkout','Easy 30-Day Returns','Limited Quantities Available']
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden bg-mid border-y border-white/[0.07] py-3.5">
      <div className="flex w-max animate-[ticker_28s_linear_infinite] whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center text-[10px] tracking-[0.22em] uppercase text-silver px-10
                                   after:content-['·'] after:ml-10 after:text-sand">
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#141414]">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(200,185,154,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(11,11,11,0) 50%, rgba(11,11,11,0.97) 100%)' }}
        />
        {/* Grid lines */}
        <div className="absolute top-0 bottom-0 left-[55%] w-px"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(200,185,154,0.15) 30%, rgba(200,185,154,0.15) 70%, transparent 100%)' }}
        />
        <div className="absolute left-0 right-0 top-[42%] h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,185,154,0.08) 30%, rgba(200,185,154,0.15) 55%, transparent 100%)' }}
        />
      </div>

      {/* Large ghost text */}
      <div className="absolute right-[12%] top-1/2 -translate-y-1/2 font-display
                      select-none pointer-events-none leading-none tracking-[-0.02em]
                      animate-fade-in"
        style={{ fontSize: 'clamp(120px,18vw,240px)', color: 'transparent', WebkitTextStroke: '1px rgba(200,185,154,0.12)' }}>
        EC
      </div>

      {/* Content */}
      <div className="relative z-10 px-10 pb-[72px] max-w-[580px] animate-fade-up">
        <div className="section-label mb-5">Spring / Summer 2025</div>
        <h1 className="font-display leading-[0.92] tracking-[0.03em] text-off-white mb-6"
          style={{ fontSize: 'clamp(72px,9vw,120px)' }}>
          EDEN<br />CLUB
        </h1>
        <p className="text-[13px] tracking-[0.08em] text-silver uppercase mb-11 font-light">
          Modern Streetwear — Timeless Silhouettes
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link to="/shop" className="btn-primary">Shop Now</Link>
          <Link to="/shop?collection=drop01" className="btn-outline">Explore Collection</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 right-10 flex items-center gap-3
                      text-[10px] tracking-[0.2em] uppercase text-sand-dark
                      [writing-mode:vertical-rl] rotate-180">
        Scroll
        <div className="w-px h-10 bg-gradient-to-b from-sand-dark to-transparent animate-pulse" />
      </div>
    </section>
  )
}

// ── Featured Products ─────────────────────────────────────────
function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts()

  return (
    <section className="px-10 py-24 bg-black">
      <div className="flex items-end justify-between mb-14 reveal">
        <div>
          <div className="section-label mb-4">Featured</div>
          <h2 className="font-display text-[clamp(42px,5vw,72px)] leading-none tracking-[0.04em]">
            THE COLLECTION
          </h2>
        </div>
        <Link to="/shop" className="btn-outline mb-1">View All</Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-mid animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 reveal reveal-delay-1">
          {(products || []).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Brand Statement ───────────────────────────────────────────
function BrandStatement() {
  return (
    <div className="relative py-36 px-10 text-center bg-mid border-y border-white/[0.07] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[30vw] leading-none"
          style={{ color: 'rgba(200,185,154,0.025)' }}>
          EDEN
        </span>
      </div>
      <div className="relative z-10 reveal">
        <p className="font-display leading-[1.3] tracking-[0.06em] text-off-white max-w-3xl mx-auto mb-8"
          style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
          EdenClub is a minimalist streetwear label built around timeless silhouettes and modern culture.
        </p>
        <p className="text-[13px] font-light text-sand-dark tracking-[0.1em] uppercase">
          Est. 2024 — A space between the pure and the urban
        </p>
      </div>
    </div>
  )
}

// ── New Drop ──────────────────────────────────────────────────
function NewDrop() {
  return (
    <section className="px-10 py-24 bg-black">
      <div className="section-label mb-4 reveal">Now Available</div>
      <h2 className="font-display text-[clamp(42px,5vw,72px)] leading-none tracking-[0.04em] mb-12 reveal">
        NEW DROP
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 reveal">
        {/* Main drop */}
        <div className="relative aspect-[4/5] overflow-hidden group cursor-none">
          <div className="w-full h-full bg-gradient-to-br from-[#1a1715] to-[#111]
                          flex items-center justify-center transition-transform duration-700
                          group-hover:scale-[1.03]">
            <span className="font-display text-[100px] text-sand/[0.06] tracking-[0.05em]">EC</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-10
                          bg-gradient-to-t from-black/92 to-transparent">
            <p className="text-[9px] tracking-[0.3em] uppercase text-sand mb-2.5">SS '25 — Drop 01</p>
            <p className="font-display text-[36px] tracking-[0.06em] text-off-white mb-5">THE VOID SERIES</p>
            <Link to="/shop?collection=drop01" className="btn-primary">Shop the Drop</Link>
          </div>
        </div>

        {/* Side items */}
        <div className="flex flex-col gap-0.5">
          {[
            { name: 'Void Hoodie — Slate', price: 155 },
            { name: 'Void Trouser — Sand', price: 175 },
          ].map((item, i) => (
            <div key={i} className="relative flex-1 min-h-[240px] overflow-hidden group cursor-none">
              <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.04]
                ${i === 0 ? 'bg-gradient-to-br from-[#1b1b1b] to-[#131313]' : 'bg-gradient-to-br from-[#191613] to-[#111]'}`}>
                <span className="font-display text-[60px] text-sand/[0.07] tracking-[0.05em]">EC</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-6 py-5
                              bg-gradient-to-t from-black/85 to-transparent">
                <p className="text-[13px] tracking-[0.06em] text-off-white mb-1">{item.name}</p>
                <p className="text-[12px] text-sand tracking-[0.06em]">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Trust Bar ─────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: '→', label: 'Free Shipping $150+' },
    { icon: '↺', label: '30-Day Returns' },
    { icon: '🔒', label: 'Secure Payment' },
    { icon: '◎', label: 'Customer Support' },
  ]
  return (
    <div className="bg-mid border-y border-white/[0.07] py-9 px-10">
      <div className="flex justify-center gap-16 flex-wrap">
        {items.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-[11px] tracking-[0.12em] uppercase text-silver">
            <div className="w-8 h-8 border border-white/[0.07] flex items-center justify-center text-sand text-sm">
              {icon}
            </div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Newsletter ────────────────────────────────────────────────
function Newsletter() {
  function handleSubmit(e) {
    e.preventDefault()
    e.target.reset()
    toast?.('Welcome to EdenClub — Check your inbox.')
  }
  return (
    <section className="py-32 px-10 text-center bg-black border-t border-white/[0.07]">
      <div className="section-label justify-center mb-3 reveal">Community</div>
      <h2 className="font-display leading-none tracking-[0.05em] text-off-white mb-4 reveal"
        style={{ fontSize: 'clamp(52px,7vw,90px)' }}>
        JOIN THE CLUB
      </h2>
      <p className="text-[13px] font-light text-sand-dark tracking-[0.1em] uppercase mb-12 reveal">
        Early access. Drops. Members only.
      </p>
      <form onSubmit={handleSubmit}
        className="flex max-w-md mx-auto border border-white/[0.12] focus-within:border-sand
                   transition-colors duration-300 reveal">
        <input
          type="email" required
          placeholder="Your email address"
          className="flex-1 bg-transparent border-none outline-none px-6 py-4
                     text-[12px] tracking-[0.08em] text-off-white font-light
                     placeholder:text-sand-dark"
        />
        <button type="submit"
          className="bg-off-white text-black px-7 py-4 text-[10px] tracking-[0.18em]
                     uppercase font-medium hover:bg-sand transition-colors duration-300 flex-shrink-0">
          Join
        </button>
      </form>
      <p className="mt-5 text-[11px] text-white/25 tracking-wide reveal">No spam. Unsubscribe anytime.</p>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  useReveal()
  return (
    <>
      <Hero />
      <Ticker />
      <FeaturedProducts />
      <BrandStatement />
      <NewDrop />
      <TrustBar />
      <Newsletter />
    </>
  )
}
