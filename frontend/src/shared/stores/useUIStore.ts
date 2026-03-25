import { create } from 'zustand';

interface UIState {
  isDrawerOpen: boolean;
  selectedSpotId: number | null;
  selectedPostId: number | null;
  setDrawerOpen: (isOpen: boolean) => void;
  setSelectedSpotId: (id: number | null) => void;
  setSelectedPostId: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDrawerOpen: false,
  selectedSpotId: null,
  selectedPostId: null,
  setDrawerOpen: (isOpen) => set((state) => ({ 
    isDrawerOpen: isOpen,
    selectedSpotId: isOpen ? state.selectedSpotId : null,
    selectedPostId: isOpen ? state.selectedPostId : null
  })),
  setSelectedSpotId: (id) => set({ selectedSpotId: id }),
  setSelectedPostId: (id) => set({ selectedPostId: id }),
}));
