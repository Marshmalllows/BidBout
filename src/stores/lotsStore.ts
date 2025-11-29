import { create } from "zustand";

export interface LotFilters {
  searchQuery: string;
  categoryId: number | null;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
  status: number;
  sortBy: number;
}

interface LotStore extends LotFilters {
  setFilters: (filters: Partial<LotFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  searchQuery: "",
  categoryId: null,
  minPrice: "",
  maxPrice: "",
  startDate: "",
  endDate: "",
  status: 0,
  sortBy: 0,
};

export const useLotStore = create<LotStore>((set) => ({
  setFilters: (newFilters) => set((state) => ({ ...state, ...newFilters })),
  ...DEFAULT_FILTERS,
  resetFilters: () => set(DEFAULT_FILTERS),
}));
