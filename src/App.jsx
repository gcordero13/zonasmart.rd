import { Routes, Route } from 'react-router-dom'
import StoreLayout from './layouts/StoreLayout'
import AdminLayout from './layouts/AdminLayout'
import RequireAuth from './components/RequireAuth'
import Home from './pages/store/Home'
import Shop from './pages/store/Shop'
import ProductDetail from './pages/store/ProductDetail'
import Cart from './pages/store/Cart'
import Checkout from './pages/store/Checkout'
import Cotizador from './pages/store/Cotizador'
import OrderConfirmation from './pages/store/OrderConfirmation'
import Tracking from './pages/store/Tracking'
import MyOrders from './pages/store/MyOrders'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import SellerPortal from './pages/seller/SellerPortal'
import NotFound from './pages/store/NotFound'
import LegalPage from './pages/store/LegalPage'
import ServicePage from './pages/store/ServicePage'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminReviews from './pages/admin/AdminReviews'
import AdminSellers from './pages/admin/AdminSellers'
import AdminSettings from './pages/admin/AdminSettings'
import AdminServices from './pages/admin/AdminServices'

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cotizador" element={<Cotizador />} />
        <Route path="/servicios" element={<ServicePage />} />
        <Route path="/confirmacion" element={<OrderConfirmation />} />
        <Route path="/seguimiento" element={<Tracking />} />
        <Route path="/mis-pedidos" element={<MyOrders />} />
        <Route path="/portal-vendedor" element={<SellerPortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/privacidad" element={<LegalPage page="privacidad" />} />
        <Route path="/terminos" element={<LegalPage page="terminos" />} />
        <Route path="/devoluciones" element={<LegalPage page="devoluciones" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAuth adminOnly>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="resenas" element={<AdminReviews />} />
        <Route path="clientes" element={<AdminCustomers />} />
        <Route path="vendedores" element={<AdminSellers />} />
        <Route path="configuracion" element={<AdminSettings />} />
        <Route path="servicios" element={<AdminServices />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App