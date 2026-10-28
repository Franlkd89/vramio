import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const app = express()
app.use(cors(), express.json())

const { PORT = 4000, SITE_URL, MP_ACCESS_TOKEN, MP_USER_ID, MP_EXTERNAL_POS_ID, USDT_WALLET, USDT_ARS_RATE = 1400, TRONGRID_API_KEY } = process.env
const need = (v, name) => { if (!v) throw new Error(`Falta configurar ${name} en .env`) }
const wrap = (fn) => (req, res) => fn(req, res).catch((e) => res.status(500).json({ error: e.message }))

// IMPORTANTE: los precios deben validarse contra tu base de datos. Nunca confiar en el monto que manda el navegador.

// Tarjeta crédito/débito: Checkout Pro de Mercado Pago
app.post('/api/mp/preference', wrap(async (req, res) => {
  need(MP_ACCESS_TOKEN, 'MP_ACCESS_TOKEN')
  const pref = await new Preference(new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })).create({
    body: {
      items: req.body.items.map((i) => ({ id: i.id, title: i.name, quantity: i.qty, unit_price: i.price, currency_id: 'ARS' })),
      payer: { name: req.body.buyer.name, email: req.body.buyer.email },
      back_urls: { success: `${SITE_URL}/seguimiento`, failure: `${SITE_URL}/checkout`, pending: `${SITE_URL}/checkout` },
      auto_return: 'approved'
    }
  })
  res.json({ url: pref.init_point })
}))

// QR dinámico de Mercado Pago (requiere sucursal y caja creadas en tu cuenta)
app.post('/api/mp/qr', wrap(async (req, res) => {
  need(MP_ACCESS_TOKEN, 'MP_ACCESS_TOKEN'); need(MP_USER_ID, 'MP_USER_ID'); need(MP_EXTERNAL_POS_ID, 'MP_EXTERNAL_POS_ID')
  const r = await fetch(`https://api.mercadopago.com/instore/orders/qr/seller/collectors/${MP_USER_ID}/pos/${MP_EXTERNAL_POS_ID}/qrs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      external_reference: crypto.randomUUID(),
      title: 'Compra VRAMIO',
      total_amount: req.body.total,
      description: 'Pedido VRAMIO',
      items: req.body.items.map((i) => ({ title: i.name, unit_price: i.price, quantity: i.qty, unit_measure: 'unit', total_amount: i.price * i.qty }))
    })
  })
  const d = await r.json()
  if (!r.ok) throw new Error(d.message || 'Mercado Pago rechazó la orden')
  res.json({ qr: d.qr_data })
}))

// USDT en red TRON (TRC-20). Se identifica cada pago con un monto único.
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const usdtOrders = new Map() // En producción: base de datos

app.post('/api/usdt/order', wrap(async (req, res) => {
  need(USDT_WALLET, 'USDT_WALLET')
  const base = req.body.totalArs / Number(USDT_ARS_RATE) // reemplazar por cotización en vivo
  const amount = (Math.ceil(base * 100) / 100 + Math.floor(Math.random() * 99 + 1) / 10000).toFixed(4)
  const id = crypto.randomUUID()
  usdtOrders.set(id, { amount, createdAt: Date.now(), paid: false })
  res.json({ id, amount, address: USDT_WALLET, network: 'TRON (TRC-20)' })
}))

app.get('/api/usdt/status/:id', wrap(async (req, res) => {
  const o = usdtOrders.get(req.params.id)
  if (!o) return res.status(404).json({ error: 'Orden inexistente' })
  if (!o.paid) {
    const url = `https://api.trongrid.io/v1/accounts/${USDT_WALLET}/transactions/trc20?only_to=true&limit=50&contract_address=${USDT_CONTRACT}&min_timestamp=${o.createdAt}`
    const r = await fetch(url, TRONGRID_API_KEY ? { headers: { 'TRON-PRO-API-KEY': TRONGRID_API_KEY } } : undefined)
    const d = await r.json()
    o.paid = (d.data || []).some((t) => (Number(t.value) / 1e6).toFixed(4) === o.amount)
  }
  res.json({ paid: o.paid })
}))

// Seguimiento: SIMULADO. Reemplazar por la API/GPS de tu servicio de reparto (webhook o websocket).
const STEPS = ['Pedido confirmado', 'Preparado en depósito', 'Salió a reparto', 'Entregado']
app.get('/api/track/:code', wrap(async (req, res) => {
  if (!/^VR-\d{4,8}$/.test(req.params.code)) return res.status(404).json({ error: 'Código inválido. Formato: VR-20481' })
  const progress = ((Date.now() / 1000) % 120) / 120
  const stage = progress > 0.98 ? 3 : 2
  res.json({
    progress, status: STEPS[stage], eta: 'Hoy, entre 14 y 16 h',
    steps: STEPS.map((label, i) => ({ label, done: i <= stage }))
  })
}))

app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`))
