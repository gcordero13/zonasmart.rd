import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { searchLocation, reverseGeocode, parseGoogleMapsUrl } from '../services/geo'

const pinIcon = L.divIcon({
  html: `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>`,
  className: '',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
})

function ClickHandler({ onPlace }) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapPicker({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [mapsLink, setMapsLink] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [gmError, setGmError] = useState('')
  const [center, setCenter] = useState(
    value ? [value.lat, value.lng] : [18.4861, -69.9312] // Santo Domingo por defecto
  )
  const markerRef = useRef(null)

  const applyLocation = async (lat, lng, label = '') => {
    const geo = await reverseGeocode(lat, lng).catch(() => ({
      city: '',
      province: '',
    }))
    onChange({ lat, lng, city: geo.city, province: geo.province, label })
    setCenter([lat, lng])
  }

  useEffect(() => {
    if (value) {
      setCenter([value.lat, value.lng])
    }
  }, [value])

  const runSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await searchLocation(query)
      setResults(res)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  const applyMapsLink = async () => {
    setGmError('')
    const coords = parseGoogleMapsUrl(mapsLink)
    if (!coords) {
      setGmError('No se pudo leer la ubicación. Pega el enlace completo del mapa (debe contener las coordenadas, ejemplo: @18.59,-68.41).')
      return
    }
    await applyLocation(coords.lat, coords.lng)
    setMapsLink('')
  }

  return (
    <div className="space-y-3">
      {/* Búsqueda */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), runSearch())}
            placeholder="Buscar ciudad, calle o lugar..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={runSearch}
            disabled={searching}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-auto">
            {results.map((r, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    applyLocation(r.lat, r.lng, r.label)
                    setResults([])
                    setQuery('')
                  }}
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pegar link de Google Maps */}
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={mapsLink}
            onChange={(e) => setMapsLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyMapsLink())}
            placeholder="O pega el enlace de Google Maps (ej. https://www.google.com/maps/@18.59,-68.41)"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {gmError && <p className="mt-1 text-xs text-red-600">{gmError}</p>}
        </div>
        <button
          type="button"
          onClick={applyMapsLink}
          className="px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          Usar
        </button>
      </div>

      {/* Mapa */}
      <div className="rounded-xl overflow-hidden border border-gray-200 h-64">
        <MapContainer
          center={center}
          zoom={value ? 15 : 11}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler
            onPlace={(lat, lng) => {
              applyLocation(lat, lng)
            }}
          />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon}
              ref={markerRef}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng()
                  applyLocation(pos.lat, pos.lng)
                },
              }}
            >
              <></>
            </Marker>
          )}
        </MapContainer>
      </div>

      {value && (
        <p className="text-xs text-gray-500">
          Ubicación seleccionada en el mapa. Haz clic sobre el mapa o arrastra el marcador para ajustar.
          {value.label ? ` (${value.label})` : ''}
        </p>
      )}
    </div>
  )
}