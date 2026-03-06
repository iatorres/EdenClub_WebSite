import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, qty = 1) => {
        const items = get().items
        const key = `${product.id}-${size}`
        const existing = items.find(i => i.key === key)

        if (existing) {
          set({
            items: items.map(i =>
              i.key === key ? { ...i, qty: i.qty + qty } : i
            ),
          })
        } else {
          set({
            items: [...items, { key, product, size, qty }],
          })
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter(i => i.key !== key) }),

      updateQty: (key, qty) => {
        if (qty <= 0) return get().removeItem(key)
        set({
          items: get().items.map(i => (i.key === key ? { ...i, qty } : i)),
        })
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'edenclub-cart' }
  )
)
