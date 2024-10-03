import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
    refreshToken: ''
  }),
  actions: {
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    setAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated
    },
    checkAuth() {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        this.isAuthenticated = true
      }
    }
  }
})
