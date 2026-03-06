import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 min
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#F5F0E8',
            color: '#0B0B0B',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
            borderRadius: 0,
            padding: '12px 24px',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
