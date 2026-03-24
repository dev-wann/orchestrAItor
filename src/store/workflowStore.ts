import { create } from 'zustand'

interface WorkflowStore {
  activeWorkflowId: string | null
  isRunning: boolean
  setActiveWorkflow: (id: string | null) => void
  setRunning: (running: boolean) => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  activeWorkflowId: null,
  isRunning: false,

  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),

  setRunning: (running) => set({ isRunning: running }),
}))
