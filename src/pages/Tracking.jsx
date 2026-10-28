import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSEO from '../hooks/useSEO.js'

// Ruta de ejemplo (puntos del mapa). En producción: coordenadas reales del repartidor + mapa (Leaflet/Mapbox/Google Maps).
const ROUTE = [[30, 210], [90, 170], [150, 175], [210, 120], [280, 110], [340, 60], [400, 50]]

function Map({ progress }) {
  const total = ROUTE.length - 1
  const seg = Math.min(Math.floor(progress * total), total - 1)
  const t = progress * total - seg
  const [a, b] = [ROUTE[seg], ROUTE[seg + 1]]
  const pos = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const path = ROUTE.map((p) => p.join(',')).join(' ')
  return (
    <svg className="map" viewBox="0 0 430 250" role="img" aria-label={`Recorrido del repartidor, ${Math.round(progress * 100)}% completado`}>
      <polyline points={path} className="route" />
      <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r="6" className="origin" />
      <circle cx={ROUTE[total][0]} cy={ROUTE[total][1]} r="8" className="dest" />
      <circle cx={pos[0]} cy={pos[1]} r="9" className="courier" />
    </svg>
  )
}

export default function Tracking() {
  const { code } = useParams()
  const nav = useNavigate()
  const [input, setInput] = useState(code || '')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useSEO({ title: 'Seguimiento de pedido | VRAMIO', description: 'Ingresá tu código de envío y mirá el recorrido del repartidor.' })

  useEffect(() => {
    if (!code) return
    let alive = true
    const load = () => fetch(`/api/track/${encodeURIComponent(code)}`)
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d })
      .then((d) => { if (alive) { setData(d); setError('') } })
      .catch((e) => { if (alive) { setData(null); setError(e.message || 'No pudimos consultar el envío') } })
    load()
    const t = setInterval(load, 5000)
    return () => { alive = false; clearInterval(t) }
  }, [code])

  return (
    <section className="wrap pad">
      <h1>Seguimiento de pedido</h1>
      <form className="inline" onSubmit={(e) => { e.preventDefault(); input.trim() && nav(`/seguimiento/${input.trim()}`) }}>
        <label htmlFor="c">Código de envío</label>
        <input id="c" value={input} onChange={(e) => setInput(e.target.value)} placeholder="VR-20481" />
        <button className="btn">Buscar</button>
      </form>
      {error && <p className="err" role="alert">{error}</p>}
      {data && (
        <div className="trk">
          <Map progress={data.progress} />
          <div>
            <h2>{data.status}</h2>
            <p>Llegada estimada: {data.eta}</p>
            <ol className="steps">
              {data.steps.map((s) => <li key={s.label} className={s.done ? 'done' : ''}>{s.label}</li>)}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
