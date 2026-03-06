import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'

const footerLinks = {
  Shop:  [['New Arrivals','/shop?new=true'],['Hoodies','/shop?cat=Hoodies'],['T-Shirts','/shop?cat=T-Shirts'],['Pants','/shop?cat=Pants'],['Jackets','/shop?cat=Jackets'],['Sale','/shop?sale=true']],
  Brand: [['About EdenClub','/about'],['Lookbook','/lookbook'],['Drops','/drops'],['Contact','/contact']],
  Help:  [['Size Guide','/size-guide'],['Shipping Info','/shipping'],['Returns','/returns'],['Track Order','/track'],['FAQs','/faqs']],
}

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.07] pt-18 pb-10 px-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <div className="font-display text-[28px] tracking-[0.12em] text-off-white mb-4">
            EDENCLUB
          </div>
          <p className="text-[12px] font-light text-sand-dark leading-relaxed tracking-wide max-w-[260px] mb-7">
            A minimalist streetwear label built around timeless silhouettes and modern culture. Est. 2024.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
               className="w-9 h-9 border border-white/[0.07] flex items-center justify-center
                          text-silver hover:border-sand hover:text-sand transition-all duration-300">
              <Instagram size={14} />
            </a>
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-off-white font-medium mb-6">
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to}
                    className="text-[12px] font-light text-sand-dark tracking-wide
                               hover:text-off-white transition-colors duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4
                      pt-8 border-t border-white/[0.07]">
        <p className="text-[11px] text-white/30 tracking-wide">
          © {new Date().getFullYear()} EdenClub. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy Policy','Terms of Service','Cookie Policy'].map(p => (
            <Link key={p} to="#"
              className="text-[11px] text-white/30 hover:text-silver tracking-wide transition-colors">
              {p}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
