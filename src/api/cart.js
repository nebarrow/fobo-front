import { api } from './client'

export const cartApi = {
  get() {
    return api.get('/cart')
  },

  addItem(productId, qty = 1) {
    return api.post('/cart/items', { productId, qty })
  },

  updateItem(productId, qty) {
    return api.patch(`/cart/items/${productId}`, { qty })
  },

  removeItem(productId) {
    return api.delete(`/cart/items/${productId}`)
  },

  clear() {
    return api.delete('/cart')
  },
}
