import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div>
          <p className="logo">VRAMIO</p>
          <p>Vendemos hardware y periféricos de PC de marcas como NVIDIA, Redragon y Razer. Cada pedido sale con un código de seguimiento que podés abrir desde esta misma web para ver el recorrido del repartidor hasta tu puerta.</p>
          <p>Aceptamos tarjeta de crédito y débito, Mercado Pago por QR y USDT en red TRON. Los precios se muestran en pesos argentinos; el monto en USDT se calcula al momento de pagar y se informa antes de confirmar.</p>
        </div>
        <div>
          <p className="ftr-h">Tienda</p>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/seguimiento">Seguir un pedido</Link>
          <Link to="/checkout">Carrito</Link>
        </div>
        <div>
          <p className="ftr-h">Legal</p>
          <a href="#">Términos y condiciones</a>
          <a href="#">Garantía y cambios</a>
          <a href="#">Botón de arrepentimiento</a>
          <a href="#">Defensa del consumidor</a>
        </div>
      </div>
      <p className="wrap ftr-end">© {new Date().getFullYear()} VRAMIO. Los precios y productos de este sitio son datos de ejemplo.</p>
    </footer>
  )
}
