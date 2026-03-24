import { create } from 'zustand'
import type { Agent, AgentStatus } from '../types/database'

interface AgentStore {
  agents: Agent[]
  setAgents: (agents: Agent[]) => void
  updateAgentStatus: (id: string, status: AgentStatus, output?: string) => void
  addAgent: (agent: Agent) => void
  removeAgent: (id: string) => void
  appendOutput: (id: string, text: string) => void
  setTokenCount: (id: string, count: number) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],

  setAgents: (agents) => set({ agents }),

  updateAgentStatus: (id, status, output) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id
          ? { ...agent, status, current_output: output ?? agent.current_output }
          : agent,
      ),
    })),

  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),

  removeAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== id),
    })),

  appendOutput: (id, text) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id
          ? { ...agent, current_output: (agent.current_output ?? '') + text }
          : agent,
      ),
    })),

  setTokenCount: (id, count) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, token_count: count } : agent,
      ),
    })),
}))
