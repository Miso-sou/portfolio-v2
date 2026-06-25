import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  techFilter: null,
  setTechFilter: (tech) => set({ techFilter: tech }),
}));
