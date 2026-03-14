import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.scss'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)
