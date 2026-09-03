import { useEffect, useState } from 'react'
import { fetchReviews, deleteReview } from '../../services/reviews'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    fetchReviews()
      .then(setReviews)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta reseña?')) return
    try {
      await deleteReview(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reseñas</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-500">Cargando reseñas...</p>}

      {!loading && reviews.length === 0 && <p className="text-gray-500">No hay reseñas.</p>}

      {!loading && reviews.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">{review.name}</p>
                <span className="text-brand">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="px-3 py-1 rounded text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}