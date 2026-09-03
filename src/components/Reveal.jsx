import { useEffect, useRef } from 'react'

export default function Reveal({ children, className = '', as: Tag = 'div', delay = 0, variant = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined

  return (
    <Tag ref={ref} className={`reveal ${variant} ${className}`} style={style}>
      {children}
    </Tag>
  )
}