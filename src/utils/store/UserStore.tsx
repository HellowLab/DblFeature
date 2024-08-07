// UserStore.tsx
import { create } from 'zustand';

interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string; 
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
