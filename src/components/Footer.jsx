export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ZonaSmart. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm">Hecho con React, Supabase y ♥</p>
        </div>
      </div>
    </footer>
  )
}
