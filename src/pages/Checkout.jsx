import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import useSEO from '../hooks/useSEO.js'
import { useCart } from '../context/Cart.jsx'
import { fmt } from '../data/products.js'

const api = (path, body) =>
  fetch(`/api${path}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined)
    .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Error del servidor'); return d })

export default function Checkout() {
  useSEO({ title: 'Finalizar compra | VRAMIO', description: 'Pagá con tarjeta, Mercado Pago QR o USDT.' })
  const { items, total, setQty, clear } = useCart()
  const [method, setMethod] = useState('card')
  const [buyer, setBuyer] = useState({ name: '', email: '', address: '' })
  const [state, setState] = useState({ loading: false, error: '', qr: '', usdt: null, paid: false })
  const ready = items.length > 0 && buyer.name && buyer.email && buyer.address

  // Polling del pago en USDT
  useEffect(() => {
    if (!state.usdt || state.paid) return
    const t = setInterval(async () => {
      try { const s = await api(`/usdt/status/${state.usdt.id}`); if (s.paid) { setState((x) => ({ ...x, paid: true })); clear() } } catch {}
    }, 8000)
    return () => clearInterval(t)
  }, [state.usdt, state.paid, clear])

  async function pay() {
    setState({ loading: true, error: '', qr: '', usdt: null, paid: false })
    try {
      if (method === 'card') {
        const { url } = await api('/mp/preference', { items, buyer })
        window.location.href = url
      } else if (method === 'qr') {
        const { qr } = await api('/mp/qr', { items, buyer, total })
        setState((x) => ({ ...x, loading: false, qr }))
      } else {
        const usdt = await api('/usdt/order', { totalArs: total, buyer })
        setState((x) => ({ ...x, loading: false, usdt }))
      }
    } catch (e) { setState((x) => ({ ...x, loading: false, error: e.message })) }
  }

  if (!items.length && !state.paid) return <section className="wrap pad"><h1>Tu carrito está vacío</h1><p>Agregá productos desde el catálogo.</p></section>
  if (state.paid) return <section className="wrap pad"><h1>Pago recibido</h1><p>Te enviamos el código de seguimiento a {buyer.email}.</p></section>

  return (
    <section className="wrap pad co">
      <div>
        <h1>Finalizar compra</h1>
        <ul className="lines">
          {items.map((i) => (
            <li key={i.id}><span>{i.name}</span>
              <input type="number" min="0" value={i.qty} aria-label={`Cantidad de ${i.name}`} onChange={(e) => setQty(i.id, Number(e.target.value))} />
              <b>{fmt(i.price * i.qty)}</b></li>
          ))}
        </ul>
        <p className="total">Total <b>{fmt(total)}</b></p>
        {['name:Nombre y apellido', 'email:Email', 'address:Dirección de entrega'].map((f) => {
          const [k, l] = f.split(':')
          return <label key={k} className="field">{l}<input value={buyer[k]} onChange={(e) => setBuyer({ ...buyer, [k]: e.target.value })} /></label>
        })}
      </div>
      <div className="paybox">
        <div className="seg" role="tablist" aria-label="Medio de pago">
          {[['card', 'Tarjeta'], ['qr', 'Mercado Pago QR'], ['usdt', 'USDT']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={method === k} className={method === k ? 'on' : ''} onClick={() => setMethod(k)}>{l}</button>
          ))}
        </div>
        {method === 'card' && <p>Te llevamos a Mercado Pago para cargar tu tarjeta de crédito o débito.</p>}
        {method === 'qr' && <p>Generá el QR y escanealo desde la app de Mercado Pago.</p>}
        {method === 'usdt' && <p>Pagás en red TRON (TRC-20). Enviar por otra red implica perder los fondos.</p>}
        <button className="btn" disabled={!ready || state.loading} onClick={pay}>
          {state.loading ? 'Procesando…' : method === 'card' ? 'Ir a pagar' : method === 'qr' ? 'Generar QR' : 'Ver monto y dirección'}
        </button>
        {state.error && <p className="err" role="alert">{state.error}</p>}
        {state.qr && <div className="qr"><QRCodeSVG value={state.qr} size={200} /><p>Esperando el pago…</p></div>}
        {state.usdt && (
          <div className="usdt">
            <p>Enviá exactamente</p>
            <p className="amt">{state.usdt.amount} USDT</p>
            <p>a la dirección</p>
            <code>{state.usdt.address}</code>
            <QRCodeSVG value={state.usdt.address} size={140} />
            <p>El monto incluye decimales únicos para identificar tu pago. Confirmamos solos cuando llega.</p>
          </div>
        )}
      </div>
    </section>
  )
}
