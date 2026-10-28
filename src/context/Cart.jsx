import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vramio-cart')) || [] } catch { return [] }
  })
  useEffect(() => localStorage.setItem('vramio-cart', JSON.stringify(items)), [items])

  const api = useMemo(() => ({
    items,
    count: items.reduce((a, i) => a + i.qty, 0),
    total: items.reduce((a, i) => a + i.qty * i.price, 0),
    add: (p) => setItems((cur) => cur.some((i) => i.id === p.id)
      ? cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      : [...cur, { id: p.id, name: p.name, price: p.price, qty: 1 }]),
    setQty: (id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty } : i)).filter((i) => i.qty > 0)),
    clear: () => setItems([])
  }), [items])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
