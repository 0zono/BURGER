import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/produtos': 'http://backend:5000',
      '/combos': 'http://backend:5000',
      '/pedidos': 'http://backend:5000',
      '/clientes': 'http://backend:5000'
    }
    
  }
})