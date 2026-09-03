import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <p className="text-6xl font-extrabold gradient-brand text-transparent bg-clip-text">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-8">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            to="/tienda"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Explorar la tienda
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
