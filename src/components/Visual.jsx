// Placeholder vectorial por categoría. Reemplazar por <img> reales (WebP, con width/height y alt).
export default function Visual({ cat, label }) {
  const shapes = {
    gpu: <><rect x="14" y="30" width="132" height="52" rx="4" /><circle cx="52" cy="56" r="17" /><circle cx="108" cy="56" r="17" /><path d="M24 82v10h40v-10" /></>,
    perifericos: <><rect x="40" y="14" width="80" height="84" rx="38" /><path d="M80 14v38M40 52h80" /></>,
    monitores: <><rect x="14" y="16" width="132" height="76" rx="4" /><path d="M64 108h32M80 92v16" /></>
  }
  return (
    <svg className="visual" viewBox="0 0 160 120" role="img" aria-label={label} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      {shapes[cat] || shapes.gpu}
    </svg>
  )
}
