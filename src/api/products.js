import { api } from './client'

export const productsApi = {
  getAll({ category, sort, page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', String(limit))
    return api.get(`/products?${params}`)
  },

  getById(id) {
    return api.get(`/products/${id}`)
  },

  getSuggestions() {
    return api.get('/products/suggestions')
  },
}
