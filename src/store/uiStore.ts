import { create } from 'zustand'

type UIMode = 'menubar' | 'floating' | 'both'

interface UIStore {
  uiMode: UIMode
  sidebarOpen: boolean
  panelOpen: boolean
  selectedAgentId: string | null
  setUIMode: (mode: UIMode) => void
  toggleSidebar: () => void
  togglePanel: () => void
  selectAgent: (id: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  uiMode: 'menubar',
  sidebarOpen: true,
  panelOpen: false,
  selectedAgentId: null,

  setUIMode: (mode) => set({ uiMode: mode }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),

  selectAgent: (id) => set({ selectedAgentId: id }),
}))
