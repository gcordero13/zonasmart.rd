const steps = [
  { key: 'pending', label: 'Pedido recibido', desc: 'Hemos recibido tu pedido' },
  { key: 'paid', label: 'Pago confirmado', desc: 'El pago ha sido procesado' },
  { key: 'completed', label: 'Enviado / entregado', desc: 'Tu pedido está en camino o entregado' },
  { key: 'cancelled', label: 'Cancelado', desc: 'Este pedido fue cancelado' },
]

export default function TrackingStatus({ status }) {
  const isCancelled = status === 'cancelled'

  return (
    <div className="py-6">
      {isCancelled ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-center">
          Este pedido fue cancelado.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          {steps
            .filter((s) => s.key !== 'cancelled')
            .map((step, index) => {
              const reached = getStepIndex(status) >= index
              return (
                <div key={step.key} className="flex-1 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        reached ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {reached ? '✓' : index + 1}
                    </div>
                    {index < 2 && (
                      <div
                        className={`flex-1 h-1 rounded ${reached && getStepIndex(status) > index ? 'bg-amber-500' : 'bg-gray-200'}`}
                      />
                    )}
                  </div>
                  <div className="mt-2 ml-1">
                    <p className={`text-sm font-medium ${reached ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

function getStepIndex(status) {
  const order = ['pending', 'paid', 'completed']
  const idx = order.indexOf(status)
  return idx === -1 ? 0 : idx
}