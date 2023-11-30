import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  currentUser: null,
  loginUser: (user) => set(() => ({ currentUser: user })),
  logoutUser: () => set(() => ({ currentUser: null })),
}))