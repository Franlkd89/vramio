import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/Cart.jsx'

export default function Header() {
  const { count } = useCart()
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link to="/" className="logo" aria-label="VRAMIO, inicio">VRAMIO</Link>
        <nav aria-label="Principal">
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/seguimiento">Seguí tu pedido</NavLink>
        </nav>
        <Link to="/checkout" className="cart">Carrito <b>{count}</b></Link>
      </div>
    </header>
  )
}
