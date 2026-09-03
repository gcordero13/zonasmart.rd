import { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RefCapture() {
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      localStorage.setItem('zs_ref', ref.trim().toUpperCase())
    }
  }, [searchParams])
  return null
}

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <RefCapture />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}