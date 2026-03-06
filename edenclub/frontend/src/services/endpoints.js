import api from './api'

// ── Auth ──────────────────────────────────────────────────────
export const authService = {
  login:    (data)  => api.post('/auth/login', data),
  register: (data)  => api.post('/auth/register', data),
  refresh:  (token) => api.post('/auth/refresh', { refreshToken: token }),
  logout:   ()      => api.delete('/auth/logout'),
}

// ── Products ──────────────────────────────────────────────────
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  // params: { page, size, category, search, sort, minPrice, maxPrice }

  getById:   (id)   => api.get(`/products/${id}`),
  getFeatured: ()   => api.get('/products/featured'),

  // Admin
  create: (data)    => api.post('/products', data),
  update: (id, data)=> api.put(`/products/${id}`, data),
  delete: (id)      => api.delete(`/products/${id}`),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
}

// ── Categories ────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/categories'),
}

// ── Cart ──────────────────────────────────────────────────────
export const cartService = {
  get:         ()            => api.get('/cart'),
  addItem:     (data)        => api.post('/cart/items', data),
  // data: { productId, size, quantity }
  updateItem:  (id, data)    => api.put(`/cart/items/${id}`, data),
  removeItem:  (id)          => api.delete(`/cart/items/${id}`),
  clear:       ()            => api.delete('/cart'),
}

// ── Orders ────────────────────────────────────────────────────
export const orderService = {
  create:      (data)        => api.post('/orders', data),
  getMyOrders: (params)      => api.get('/orders', { params }),
  getById:     (id)          => api.get(`/orders/${id}`),

  // Admin
  getAll:      (params)      => api.get('/orders/admin/all', { params }),
  updateStatus:(id, status)  => api.put(`/orders/admin/${id}/status`, { status }),
}

// ── Users ─────────────────────────────────────────────────────
export const userService = {
  getMe:        ()     => api.get('/users/me'),
  updateMe:     (data) => api.put('/users/me', data),
  updatePassword:(data)=> api.put('/users/me/password', data),

  // Admin
  getAll:  (params)    => api.get('/users/admin/all', { params }),
  delete:  (id)        => api.delete(`/users/admin/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
}
