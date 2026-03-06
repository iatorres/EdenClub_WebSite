import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService, adminService, orderService, userService } from '@/services/endpoints'
import toast from 'react-hot-toast'

// ── Products ──────────────────────────────────────────────────
export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params).then(r => r.data),
  })
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id).then(r => r.data),
    enabled: !!id,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured().then(r => r.data),
  })
}

// ── Admin: product mutations ──────────────────────────────────
export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created')
    },
    onError: () => toast.error('Failed to create product'),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated')
    },
    onError: () => toast.error('Failed to update product'),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
    },
    onError: () => toast.error('Failed to delete product'),
  })
}

// ── Admin: dashboard ──────────────────────────────────────────
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard().then(r => r.data),
  })
}

// ── Admin: orders ─────────────────────────────────────────────
export function useAdminOrders(params) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => orderService.getAll(params).then(r => r.data),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      toast.success('Order status updated')
    },
  })
}

// ── Admin: users ──────────────────────────────────────────────
export function useAdminUsers(params) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => userService.getAll(params).then(r => r.data),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User deleted')
    },
  })
}
