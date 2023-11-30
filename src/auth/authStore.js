import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  loginUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    return set(() => ({ currentUser: user }))
  },
  logoutUser: () => {
    localStorage.removeItem('user')
    return set(() => ({ currentUser: null }))
  }
}))