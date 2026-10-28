import { Link } from 'react-router-dom'
import { fmt } from '../data/products.js'
import { useCart } from '../context/Cart.jsx'
import Visual from './Visual.jsx'

export default function ProductCard({ p }) {
  const { add } = useCart()
  return (
    <article className="card">
      <Link to={`/producto/${p.id}`} className="card-img"><Visual cat={p.cat} label={p.name} /></Link>
      <div className="card-body">
        <p className="brand">{p.brand}</p>
        <h3><Link to={`/producto/${p.id}`}>{p.name}</Link></h3>
        <p className="specs">{p.specs.join(' · ')}</p>
        <div className="card-foot">
          <strong>{fmt(p.price)}</strong>
          <button className="btn sm" onClick={() => add(p)}>Agregar</button>
        </div>
      </div>
    </article>
  )
}
