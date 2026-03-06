// LoginPage.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/endpoints'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()
  const location    = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
      toast.success('Welcome back')
      navigate(data.user.role === 'ADMIN' ? '/admin' : from, { replace: true })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    },
  })

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] animate-fade-up">
        {/* Logo */}
        <Link to="/" className="block font-display text-[28px] tracking-[0.14em] text-off-white mb-2">
          EDENCLUB
        </Link>
        <p className="text-[10px] tracking-[0.22em] uppercase text-sand-dark mb-10">Sign In</p>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="input-base"
            />
            {errors.email && <p className="mt-1.5 text-[11px] text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="input-base"
            />
            {errors.password && <p className="mt-1.5 text-[11px] text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-primary justify-center mt-2 disabled:opacity-50"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-[12px] text-sand-dark tracking-wide text-center">
          No account?{' '}
          <Link to="/register" className="text-off-white hover:text-sand transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
