import { create } from "zustand";

export interface LotStore {
  searchQuery: string;
  setSearchQuery(query: string): void;
}

export const useLotStore = create<LotStore>((set) => ({
  searchQuery: "",

  setSearchQuery: (newSearchQuery: string) =>
    set({ searchQuery: newSearchQuery }),
}));
