import { api } from './client'

export const ordersApi = {
  create(data) {
    return api.post('/orders', data)
  },

  getAll() {
    return api.get('/orders')
  },

  getById(id) {
    return api.get(`/orders/${id}`)
  },
}
