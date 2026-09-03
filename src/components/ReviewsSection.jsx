import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchReviews, createReview } from '../services/reviews'

export default function ReviewsSection() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetchReviews()
      .then(setReviews)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Debes iniciar sesión para dejar una reseña.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createReview({
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email,
        rating: form.rating,
        comment: form.comment,
      })
      setForm({ rating: 5, comment: '' })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Opiniones de nuestros clientes</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-500">Cargando reseñas...</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-500 mb-8">Sé el primero en dejar una reseña.</p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">{review.name}</p>
                <span className="text-amber-500">{"★".repeat(review.rating)}</span>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-gray-900 mb-4">Escribe tu reseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Calificación:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-2xl ${star <= form.rating ? 'text-amber-500' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Cuéntanos qué opinas de nuestros productos..."
            rows="3"
            required
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-md bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Enviando...' : 'Publicar reseña'}
          </button>
        </form>
      </div>
    </section>
  )
}