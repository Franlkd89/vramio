import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Product from './pages/Product.jsx'
import Checkout from './pages/Checkout.jsx'
import Tracking from './pages/Tracking.jsx'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/seguimiento" element={<Tracking />} />
          <Route path="/seguimiento/:code" element={<Tracking />} />
          <Route path="*" element={<section className="wrap pad"><h1>Esta página no existe</h1></section>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
