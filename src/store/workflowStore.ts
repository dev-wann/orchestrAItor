import { create } from 'zustand'
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import type { Agent } from '../types/database'
import type { AgentNodeData } from '../components/workflow/AgentNode'

interface WorkflowStore {
  activeWorkflowId: string | null
  isRunning: boolean
  setActiveWorkflow: (id: string | null) => void
  setRunning: (running: boolean) => void

  nodes: Node<AgentNodeData>[]
  edges: Edge[]
  setNodes: (nodes: Node<AgentNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange<Node<AgentNodeData>>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addAgentNode: (agent: Agent, position: { x: number; y: number }) => void
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  activeWorkflowId: null,
  isRunning: false,

  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),

  setRunning: (running) => set({ isRunning: running }),

  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({ edges: addEdge(connection, get().edges) }),

  addAgentNode: (agent, position) => {
    const newNode: Node<AgentNodeData> = {
      id: `agent-${agent.id}`,
      type: 'agent',
      position,
      data: {
        label: agent.name,
        provider: agent.provider,
        model: agent.model,
        color: agent.color,
        status: agent.status,
      },
    }
    set({ nodes: [...get().nodes, newNode] })
  },
}))
