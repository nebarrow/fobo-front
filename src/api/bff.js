import { api } from './client'

export const bffApi = {
  getHome() {
    return api.get('/bff/home')
  },

  getCatalog({ category, sort, page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams()
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', String(limit))
    return api.get(`/bff/catalog/${category}?${params}`)
  },

  getCheckout() {
    return api.get('/bff/checkout')
  },

  getOrderDetails(id) {
    return api.get(`/bff/orders/${id}`)
  },
}
