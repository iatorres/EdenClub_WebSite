import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/endpoints'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Min 8 characters'),
  confirm:   z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

export default function RegisterPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
      toast.success('Welcome to EdenClub')
      navigate('/')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed')
    },
  })

  const fields = [
    [['firstName','First Name','John'],  ['lastName','Last Name','Doe']],
    [['email','Email','you@example.com',{type:'email'}]],
    [['password','Password','••••••••',{type:'password'}]],
    [['confirm','Confirm Password','••••••••',{type:'password'}]],
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px] animate-fade-up">
        <Link to="/" className="block font-display text-[28px] tracking-[0.14em] text-off-white mb-2">
          EDENCLUB
        </Link>
        <p className="text-[10px] tracking-[0.22em] uppercase text-sand-dark mb-10">Create Account</p>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {['firstName','lastName'].map((name, i) => (
              <div key={name}>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">
                  {i === 0 ? 'First Name' : 'Last Name'}
                </label>
                <input {...register(name)} placeholder={i === 0 ? 'John' : 'Doe'} className="input-base" />
                {errors[name] && <p className="mt-1.5 text-[11px] text-red-400">{errors[name].message}</p>}
              </div>
            ))}
          </div>

          {[
            { name:'email', label:'Email', type:'email', ph:'you@example.com' },
            { name:'password', label:'Password', type:'password', ph:'Min 8 characters' },
            { name:'confirm', label:'Confirm Password', type:'password', ph:'Repeat password' },
          ].map(({ name, label, type, ph }) => (
            <div key={name}>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-sand-dark mb-2">{label}</label>
              <input {...register(name)} type={type} placeholder={ph} className="input-base" />
              {errors[name] && <p className="mt-1.5 text-[11px] text-red-400">{errors[name].message}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-primary justify-center mt-2 disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-[12px] text-sand-dark tracking-wide text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-off-white hover:text-sand transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
