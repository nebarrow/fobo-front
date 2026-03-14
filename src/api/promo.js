import { api } from './client'

export const promoApi = {
  validate(code) {
    return api.post('/promo/validate', { code })
  },
}
