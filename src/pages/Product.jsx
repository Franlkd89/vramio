import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import useSEO from '../hooks/useSEO.js'
import { products, fmt } from '../data/products.js'
import { useCart } from '../context/Cart.jsx'
import Visual from '../components/Visual.jsx'

export default function Product() {
  const { id } = useParams()
  const p = products.find((x) => x.id === id)
  const { add } = useCart()
  const jsonLd = useMemo(() => p && ({
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, brand: { '@type': 'Brand', name: p.brand },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.price, availability: 'https://schema.org/InStock' }
  }), [p])
  useSEO({ title: p ? `${p.name} | VRAMIO` : 'Producto no encontrado | VRAMIO', description: p ? `${p.name}: ${p.specs.join(', ')}.` : 'Producto no encontrado', jsonLd })
  if (!p) return <section className="wrap pad"><h1>No encontramos este producto</h1><Link to="/catalogo">Volver al catálogo</Link></section>
  return (
    <section className="wrap pad pdp">
      <div className="pdp-img"><Visual cat={p.cat} label={p.name} /></div>
      <div>
        <p className="brand">{p.brand}</p>
        <h1>{p.name}</h1>
        <ul className="spec-list">{p.specs.map((s) => <li key={s}>{s}</li>)}</ul>
        <p className="price">{fmt(p.price)}</p>
        <button className="btn" onClick={() => add(p)}>Agregar al carrito</button>
      </div>
    </section>
  )
}
