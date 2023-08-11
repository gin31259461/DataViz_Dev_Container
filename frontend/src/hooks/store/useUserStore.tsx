import { create } from 'zustand';

interface UserState {
  mid: number;
  setMID: (mid: number) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  mid: 0,
  setMID: (mid: number) => set({ mid: mid }),
}));
