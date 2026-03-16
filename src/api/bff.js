import { api } from './client'
import { productsApi } from './products'

let hasBff = null

async function checkBff() {
  if (hasBff !== null) return hasBff
  try {
    await api.get('/bff/home')
    hasBff = true
  } catch {
    hasBff = false
  }
  return hasBff
}

export const bffApi = {
  async getHome() {
    if (await checkBff()) {
      return api.get('/bff/home')
    }
    const suggestions = await productsApi.getSuggestions()
    return { suggestions }
  },

  async getCatalog({ category, sort, page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams()
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', String(limit))

    if (await checkBff()) {
      return api.get(`/bff/catalog/${category}?${params}`)
    }
    return productsApi.getAll({ category, sort, page, limit })
  },

  async getCheckout() {
    if (await checkBff()) {
      return api.get('/bff/checkout')
    }
    return { items: [], subtotal: 0, count: 0 }
  },

  async getOrderDetails(id) {
    if (await checkBff()) {
      return api.get(`/bff/orders/${id}`)
    }
    return api.get(`/orders/${id}`)
  },
}
