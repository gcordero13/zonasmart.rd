export default function OrderItems({ items }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
      <ul className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <li key={i} className="py-3 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Sin img
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
              <p className="text-sm text-gray-500">
                ${Number(item.price).toFixed(2)} × {item.quantity} ={' '}
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              {item.delivery_days ? (
                <>
                  <p className="text-xs text-gray-400">Entrega estimada</p>
                  <p className="text-sm font-medium text-green-600">
                    {item.delivery_days === 1 ? '1 día hábil' : `${item.delivery_days} días hábiles`}
                  </p>
                </>
              ) : (
                <span className="text-xs text-gray-400">Entrega por confirmar</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}