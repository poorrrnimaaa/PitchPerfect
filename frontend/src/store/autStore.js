import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  
  setUser: (user) => set({ user }),
}));