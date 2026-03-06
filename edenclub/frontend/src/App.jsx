import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Cursor from '@/components/ui/Cursor'

// Layouts
import MainLayout  from '@/components/layout/MainLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Pages — public
import Home         from '@/pages/Home'
import Shop         from '@/pages/Shop'
import ProductPage  from '@/pages/ProductPage'
import CartPage     from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import LoginPage    from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

// Pages — admin
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts  from '@/pages/admin/AdminProducts'
import AdminOrders    from '@/pages/admin/AdminOrders'
import AdminUsers     from '@/pages/admin/AdminUsers'

// Guards
function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Cursor global — disponible en TODAS las páginas */}
      <Cursor />

      <Routes>
        {/* ── Public ── */}
        <Route element={<MainLayout />}>
          <Route index        element={<Home />} />
          <Route path="shop"  element={<Shop />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="cart"  element={<CartPage />} />
          <Route path="checkout" element={
            <PrivateRoute><CheckoutPage /></PrivateRoute>
          } />
        </Route>

        {/* ── Auth ── */}
        <Route path="login"    element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* ── Admin ── */}
        <Route path="admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index           element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders"   element={<AdminOrders />} />
          <Route path="users"    element={<AdminUsers />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
