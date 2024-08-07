// UserStore.tsx
import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
