import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSEO from '../hooks/useSEO.js'
import { products, categories, fmt } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/Cart.jsx'

const targets = [
  { id: '1080p', fps: '144 FPS en esports' },
  { id: '1440p', fps: '100+ FPS en AAA con DLSS' },
  { id: '4K', fps: '60+ FPS con trazado de rayos' }
]

function Matcher() {
  const [res, setRes] = useState('1440p')
  const { add } = useCart()
  const gpu = products.find((p) => p.cat === 'gpu' && p.tier === res)
  const t = targets.find((x) => x.id === res)
  return (
    <div className="matcher">
      <p className="m-q">¿A qué resolución jugás?</p>
      <div className="seg" role="tablist" aria-label="Resolución">
        {targets.map((x) => (
          <button key={x.id} role="tab" aria-selected={res === x.id} className={res === x.id ? 'on' : ''} onClick={() => setRes(x.id)}>{x.id}</button>
        ))}
      </div>
      <div className="m-out" aria-live="polite">
        <p className="brand">{gpu.brand}</p>
        <h2>{gpu.name}</h2>
        <p>{t.fps}</p>
        <p className="specs">{gpu.specs.join(' · ')}</p>
        <div className="card-foot">
          <strong>{fmt(gpu.price)}</strong>
          <button className="btn" onClick={() => add(gpu)}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const nav = useNavigate()
  const [code, setCode] = useState('')
  useSEO({
    title: 'VRAMIO | Placas de video, periféricos y componentes para PC gamer',
    description: 'Comprá hardware NVIDIA, Redragon y Razer. Pagá con tarjeta, Mercado Pago QR o USDT y seguí el recorrido de tu envío en el mapa.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Store', name: 'VRAMIO', description: 'Tienda online de hardware y periféricos de PC', areaServed: 'AR' }
  })
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <h1>Elegí la placa por la resolución, no por el nombre.</h1>
            <p className="lead">Decinos en qué pantalla jugás y te mostramos la gráfica que la mueve sin sobrar ni faltar.</p>
          </div>
          <Matcher />
        </div>
      </section>

      <section className="wrap pad">
        <h2>Comprá por parte</h2>
        <div className="cats">
          {categories.map((c) => (
            <Link key={c.id} to={`/catalogo?cat=${c.id}`} className="cat">{c.name}<span>{products.filter((p) => p.cat === c.id).length} productos</span></Link>
          ))}
        </div>
      </section>

      <section className="wrap pad">
        <h2>Para sumar hoy</h2>
        <div className="grid">{products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="track-band">
        <div className="wrap track-in">
          <div>
            <h2>Mirá dónde está tu paquete</h2>
            <p>Con el código de envío abrís el mapa y ves al repartidor moverse hacia tu dirección.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) nav(`/seguimiento/${code.trim()}`) }}>
            <label htmlFor="code">Código de envío</label>
            <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="VR-20481" />
            <button className="btn">Abrir mapa</button>
          </form>
        </div>
      </section>

      <section className="wrap pad">
        <h2>Tres formas de pagar</h2>
        <div className="pay">
          <div><h3>Tarjeta</h3><p>Crédito o débito, en cuotas según tu banco.</p></div>
          <div><h3>Mercado Pago</h3><p>Escaneás el QR con la app y se acredita al instante.</p></div>
          <div><h3>USDT</h3><p>Transferís en red TRON. Te mostramos el monto exacto antes de pagar.</p></div>
        </div>
      </section>
    </>
  )
}
