import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../api/cart'
import { getToken } from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [syncing, setSyncing] = useState(false)

  const isAuthed = !!user && !!getToken()

  const syncFromServer = useCallback(async () => {
    if (!isAuthed) return
    try {
      setSyncing(true)
      const data = await cartApi.get()
      setItems(data.items || [])
    } catch {} finally {
      setSyncing(false)
    }
  }, [isAuthed])

  useEffect(() => {
    if (isAuthed) {
      syncFromServer()
    } else {
      setItems([])
    }
  }, [isAuthed, syncFromServer])

  const addItem = async (product) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: (next[idx].qty || 1) + 1 }
        return next
      }
      return [...prev, { ...product, qty: 1 }]
    })

    if (isAuthed) {
      try {
        const data = await cartApi.addItem(product.id)
        if (data?.items) setItems(data.items)
      } catch {}
    }
  }

  const removeItem = async (id) => {
    setItems(prev => prev.filter(p => p.id !== id))

    if (isAuthed) {
      try {
        const data = await cartApi.removeItem(id)
        if (data?.items) setItems(data.items)
      } catch {}
    }
  }

  const clear = async () => {
    setItems([])

    if (isAuthed) {
      try {
        await cartApi.clear()
      } catch {}
    }
  }

  const updateQty = async (id, qty) => {
    if (qty <= 0) {
      return removeItem(id)
    }

    setItems(prev => prev.map(p => p.id === id ? { ...p, qty } : p))

    if (isAuthed) {
      try {
        const data = await cartApi.updateItem(id, qty)
        if (data?.items) setItems(data.items)
      } catch {}
    }
  }

  const increment = (id) => {
    const item = items.find(p => p.id === id)
    if (item) updateQty(id, (item.qty || 0) + 1)
  }

  const decrement = (id) => {
    const item = items.find(p => p.id === id)
    if (item) updateQty(id, (item.qty || 0) - 1)
  }

  const totalCount = items.reduce((s, it) => s + (it.qty || 0), 0)
  const totalSum = items.reduce((s, it) => s + ((it.price || 0) * (it.qty || 0)), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, updateQty, increment, decrement, totalCount, totalSum, syncing }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export default CartContext
