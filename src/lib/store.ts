import { create } from 'zustand';

export type NavSection =
  | 'dashboard'
  | 'explore'
  | 'analytics'
  | 'platforms'
  | 'recommendations'
  | 'watchlist'
  | 'activity'
  | 'about';

interface AppState {
  activeSection: NavSection;
  setActiveSection: (s: NavSection) => void;
  selectedMovieId: string | null;
  setSelectedMovieId: (id: string | null) => void;
  userId: string;
  setUserId: (id: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'dashboard',
  setActiveSection: (s) => set({ activeSection: s }),
  selectedMovieId: null,
  setSelectedMovieId: (id) => set({ selectedMovieId: id }),
  userId: 'cmt7ech7d0040ngkzxi5iarq2', // default seeded user
  setUserId: (id) => set({ userId: id }),
  refreshKey: 0,
  triggerRefresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),
}));
