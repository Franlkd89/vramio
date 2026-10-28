# VRAMIO — Ecommerce de hardware y periféricos (React + Vite)

## Requisitos
Node.js 18 o superior.

## Puesta en marcha
```bash
npm install
cp .env.example .env     # completar credenciales
npm run server           # API en http://localhost:4000
npm run dev              # web en http://localhost:5173
```

## Subir a GitHub
```bash
git init && git add . && git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/USUARIO/vramio.git
git push -u origin main
```

## Qué está listo y qué falta
| Módulo | Estado |
|---|---|
| Landing, catálogo, ficha, carrito, checkout | Funcional con datos de ejemplo |
| SEO (meta dinámicas, canonical, JSON-LD, robots, sitemap) | Base lista |
| Tarjeta (Checkout Pro) | Listo; requiere `MP_ACCESS_TOKEN` |
| Mercado Pago QR | Listo; requiere sucursal y caja creadas en Mercado Pago |
| USDT (TRC-20) | Verificación por TronGrid; falta cotización en vivo y base de datos |
| Seguimiento | **Simulado.** Conectar la API/GPS del servicio de reparto |

## Pendiente antes de producción
1. Validar precios y stock en el servidor contra una base de datos (hoy el servidor confía en el monto del cliente).
2. Webhook de Mercado Pago para confirmar pagos.
3. Para SEO fuerte, pasar a prerender/SSR (Next.js) o usar prerender de rutas: una SPA pura indexa peor.
4. Reemplazar `Visual.jsx` por imágenes reales en WebP.
5. Reemplazar el mapa SVG por Leaflet, Mapbox o Google Maps.
6. Revisar con un contador/abogado los requisitos fiscales y regulatorios de cobrar en USDT.
