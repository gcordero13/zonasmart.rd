import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import Reveal from '../../components/Reveal'

const sections = {
  privacidad: {
    title: 'Política de Privacidad',
    intro:
      'En tu tienda nos tomamos en serio la protección de tus datos personales. Esta política explica qué información recopilamos, cómo la usamos y los derechos que tienes.',
    blocks: [
      {
        h: '1. Información que recopilamos',
        p: [
          'Datos que nos proporcionas directamente: nombre, correo electrónico, número de WhatsApp, dirección de envío y ciudad al realizar una compra o crear una cuenta.',
          'Datos de uso: información sobre cómo navegas en nuestra tienda para mejorar tu experiencia.',
        ],
      },
      {
        h: '2. Uso de la información',
        p: [
          'Usamos tus datos para procesar pedidos, enviar confirmaciones y actualizaciones de envío, brindar soporte al cliente y mejorar nuestros productos y servicios.',
          'Nunca vendemos ni compartimos tus datos personales con terceros con fines comerciales.',
        ],
      },
      {
        h: '3. Seguridad',
        p: [
          'Aplicamos medidas técnicas y organizativas adecuadas para proteger tu información contra accesos no autorizados, alteración o divulgación.',
        ],
      },
      {
        h: '4. Tus derechos',
        p: [
          'Puedes solicitar el acceso, corrección o eliminación de tus datos personales en cualquier momento contactándonos por los canales de atención disponibles.',
        ],
      },
    ],
  },
  terminos: {
    title: 'Términos y Condiciones',
    intro:
      'Al utilizar esta tienda aceptas los siguientes términos y condiciones. Te recomendamos leerlos con atención antes de realizar una compra.',
    blocks: [
      {
        h: '1. Productos y precios',
        p: [
          'Los precios y descripciones de los productos pueden variar sin previo aviso. Nos reservamos el derecho de modificar o descontinuar productos.',
          'Los pedidos están sujetos a disponibilidad de inventario.',
        ],
      },
      {
        h: '2. Pedidos y pagos',
        p: [
          'Al realizar un pedido declaras que la información proporcionada es correcta y que cuentas con la autorización para completar la transacción.',
          'Nos reservamos el derecho de rechazar o cancelar pedidos por razones de seguridad o error en los datos.',
        ],
      },
      {
        h: '3. Envíos y entregas',
        p: [
          'Realizamos envíos a todo el país. Los plazos de entrega son estimados y pueden variar según la zona.',
          'El seguimiento de tu pedido está disponible en la sección de seguimiento de la tienda.',
        ],
      },
      {
        h: '4. Garantía',
        p: [
          'Todos nuestros productos cuentan con garantía cubriendo defectos de fabricación. Los detalles específicos dependen de cada producto.',
        ],
      },
    ],
  },
  devoluciones: {
    title: 'Política de Devoluciones',
    intro:
      'Queremos que estés 100% satisfecho con tu compra. Si necesitas devolver un producto, esta política te indica cómo hacerlo.',
    blocks: [
      {
        h: '1. Plazo de devolución',
        p: [
          'Aceptamos devoluciones dentro de los primeros 7 días calendario posteriores a la entrega del producto.',
          'El producto debe estar en su empaque original, sin señales de uso y con todos sus accesorios.',
        ],
      },
      {
        h: '2. Productos dañados o defectuosos',
        p: [
          'Si recibes un producto dañado o defectuoso, contáctanos dentro de las 48 horas posteriores a la entrega para coordinar el reemplazo o la solución correspondiente.',
        ],
      },
      {
        h: '3. Reembolsos',
        p: [
          'Una vez recibido y verificado el producto devuelto, procesaremos el reembolso a tu método de pago original en un plazo de 5 a 10 días hábiles.',
        ],
      },
      {
        h: '4. Cómo iniciar una devolución',
        p: [
          'Comunícate con nuestro equipo de soporte por WhatsApp o correo electrónico indicando tu número de pedido y el motivo de la devolución. Te guiaremos en el proceso.',
        ],
      },
    ],
  },
}

export default function LegalPage({ page }) {
  const { settings } = useStore()
  const content = sections[page]

  if (!content) return null

  return (
    <div className="bg-gray-50">
      <div className="bg-gray-950 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{content.title}</h1>
          <p className="text-gray-400 mt-3">{content.intro}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Reveal>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            {content.blocks.map((block) => (
              <div key={block.h}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{block.h}</h2>
                {block.p.map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-2">
                    {para}
                  </p>
                ))}
              </div>
            ))}

            <div className="border-t border-gray-200 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                ¿Tienes dudas? Contáctanos
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    className="text-brand-dark font-medium ml-1"
                  >
                    por WhatsApp
                  </a>
                )}
                .
              </p>
              <Link to="/" className="text-sm font-medium text-brand-dark hover:underline">
                Volver al inicio
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
