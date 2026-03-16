import { api } from './client'
import { productsApi } from './products'

export const bffApi = {
  async getHome() {
    try {
      return await api.get('/bff/home')
    } catch {
      const suggestions = await productsApi.getSuggestions()
      return { suggestions }
    }
  },

  async getCatalog({ category, sort, page = 1, limit = 12 } = {}) {
    try {
      const params = new URLSearchParams()
      if (sort) params.set('sort', sort)
      params.set('page', String(page))
      params.set('limit', String(limit))
      return await api.get(`/bff/catalog/${category}?${params}`)
    } catch {
      const data = await productsApi.getAll({ category, sort, page, limit })
      return data
    }
  },

  async getCheckout() {
    try {
      return await api.get('/bff/checkout')
    } catch {
      return { items: [], subtotal: 0, count: 0 }
    }
  },

  async getOrderDetails(id) {
    try {
      return await api.get(`/bff/orders/${id}`)
    } catch {
      return api.get(`/orders/${id}`)
    }
  },
}
