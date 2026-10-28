import { useSearchParams } from 'react-router-dom'
import useSEO from '../hooks/useSEO.js'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat')
  const list = cat ? products.filter((p) => p.cat === cat) : products
  const name = categories.find((c) => c.id === cat)?.name
  useSEO({
    title: `${name || 'Catálogo'} | VRAMIO`,
    description: `Comprá ${name ? name.toLowerCase() : 'hardware y periféricos de PC'} de marcas líderes con envío a todo el país.`
  })
  return (
    <section className="wrap pad">
      <h1>{name || 'Catálogo'}</h1>
      <div className="seg left" role="group" aria-label="Filtrar por categoría">
        <button className={!cat ? 'on' : ''} onClick={() => setParams({})}>Todo</button>
        {categories.map((c) => <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setParams({ cat: c.id })}>{c.name}</button>)}
      </div>
      <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </section>
  )
}
