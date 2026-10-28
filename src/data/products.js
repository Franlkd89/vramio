// Datos de ejemplo: reemplazar por API / CMS. Precios en ARS (ficticios).
export const categories = [
  { id: 'gpu', name: 'Placas de video' },
  { id: 'perifericos', name: 'Periféricos' },
  { id: 'monitores', name: 'Monitores' }
]

export const products = [
  { id: 'rtx-4060', name: 'GeForce RTX 4060 8GB', brand: 'NVIDIA', cat: 'gpu', price: 689000, tier: '1080p', specs: ['8 GB GDDR6', 'DLSS 3', '115 W'] },
  { id: 'rtx-4070s', name: 'GeForce RTX 4070 SUPER 12GB', brand: 'NVIDIA', cat: 'gpu', price: 1390000, tier: '1440p', specs: ['12 GB GDDR6X', 'DLSS 3', '220 W'] },
  { id: 'rtx-4080s', name: 'GeForce RTX 4080 SUPER 16GB', brand: 'NVIDIA', cat: 'gpu', price: 2350000, tier: '4K', specs: ['16 GB GDDR6X', 'DLSS 3', '320 W'] },
  { id: 'rd-kumara', name: 'Teclado Kumara K552', brand: 'Redragon', cat: 'perifericos', price: 58000, specs: ['Switch rojo', 'TKL', 'RGB'] },
  { id: 'rd-cobra', name: 'Mouse Cobra M711', brand: 'Redragon', cat: 'perifericos', price: 34000, specs: ['12400 DPI', '7 botones', '60 g'] },
  { id: 'rz-viper', name: 'Viper V3 Pro', brand: 'Razer', cat: 'perifericos', price: 319000, specs: ['Inalámbrico', '54 g', '35K DPI'] },
  { id: 'rz-blackshark', name: 'BlackShark V2 X', brand: 'Razer', cat: 'perifericos', price: 98000, specs: ['Drivers 50 mm', '7.1', 'Micrófono HyperClear'] },
  { id: 'mon-27-165', name: 'Monitor 27" QHD 165 Hz', brand: 'Demo', cat: 'monitores', price: 430000, specs: ['IPS', '1 ms', 'G-Sync Compatible'] }
]

export const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
