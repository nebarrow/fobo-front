import { api, setTokens, clearTokens } from './client'

export const authApi = {
  sendCode(phone) {
    return api.post('/auth/send-code', { phone })
  },

  verify(phone, code) {
    return api.post('/auth/verify', { phone, code }).then((data) => {
      setTokens(data.accessToken, data.refreshToken)
      return data
    })
  },

  register(phone, code, name) {
    return api.post('/auth/register', { phone, code, name }).then((data) => {
      setTokens(data.accessToken, data.refreshToken)
      return data
    })
  },

  getProfile() {
    return api.get('/auth/profile')
  },

  updateProfile(updates) {
    return api.patch('/auth/profile', updates)
  },

  logout() {
    clearTokens()
  },
}
