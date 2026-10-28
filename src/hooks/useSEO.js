import { useEffect } from 'react'

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}

export default function useSEO({ title, description, jsonLd }) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = window.location.origin + window.location.pathname
    let ld = document.getElementById('ld-json')
    if (jsonLd) {
      if (!ld) { ld = document.createElement('script'); ld.id = 'ld-json'; ld.type = 'application/ld+json'; document.head.appendChild(ld) }
      ld.textContent = JSON.stringify(jsonLd)
    } else if (ld) ld.remove()
  }, [title, description, jsonLd])
}
