import { defineStore } from 'pinia'
import { AuthState, LoginAction } from '~/lib/types/Stores'
import { User } from '~/server/modules/users/users.schema'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: {} as Omit<User, 'password' | 'rememberToken'>,
    access_token: '',
  }),
  getters: {
    getUser: (state) => state.user,
    getTokens: (state) => ({
      access_token: state.access_token,
    }),
  },
  actions: {
    login({ user, access_token }: LoginAction) {
      this.isAuthenticated = true
      this.user = user
      this.access_token = access_token
    },
    logout() {
      this.$reset()
    },
    setTokens({ access_token, user }: LoginAction) {
      this.access_token = access_token
      this.user = user
    },
    setUser(user: Omit<User, 'password' | 'rememberToken'>) {
      this.user = user
    },
  },
  persist: true,
})
