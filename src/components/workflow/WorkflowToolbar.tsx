import { useCallback, useRef } from 'react'
import { Plus, Save, Trash2, ChevronDown } from 'lucide-react'
import { type Node, type Edge } from '@xyflow/react'
import { useWorkflowStore } from '../../store/workflowStore'
import { useAgentStore } from '../../store/agentStore'
import {
  useWorkflows,
  useCreateWorkflow,
  useSaveWorkflowGraph,
  useDeleteWorkflow,
} from '../../hooks/useDatabase'
import type { Agent, Workflow } from '../../types/database'
import type { AgentNodeData } from './AgentNode'
import RunButton from './RunButton'
import { executeWorkflow } from '../../lib/dagEngine'
import { approvalManager } from '../../lib/approvalManager'

interface WorkflowGraph {
  nodes: Node<AgentNodeData>[]
  edges: Edge[]
}

function parseGraph(workflow: Workflow): WorkflowGraph {
  try {
    const parsed: unknown = JSON.parse(workflow.graph)
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'nodes' in parsed &&
      'edges' in parsed
    ) {
      const obj = parsed as Record<string, unknown>
      const nodes = Array.isArray(obj.nodes) ? (obj.nodes as Node<AgentNodeData>[]) : []
      const edges = Array.isArray(obj.edges) ? (obj.edges as Edge[]) : []
      return { nodes, edges }
    }
  } catch {
    console.error(
      `[WorkflowToolbar] Failed to parse graph for workflow "${workflow.name}"`,
    )
  }
  return { nodes: [], edges: [] }
}

export default function WorkflowToolbar() {
  const activeWorkflowId = useWorkflowStore((s) => s.activeWorkflowId)
  const setActiveWorkflow = useWorkflowStore((s) => s.setActiveWorkflow)
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const setNodes = useWorkflowStore((s) => s.setNodes)
  const setEdges = useWorkflowStore((s) => s.setEdges)
  const isRunning = useWorkflowStore((s) => s.isRunning)
  const setRunning = useWorkflowStore((s) => s.setRunning)

  const agents = useAgentStore((s) => s.agents)
  const updateAgentStatus = useAgentStore((s) => s.updateAgentStatus)
  const appendOutput = useAgentStore((s) => s.appendOutput)
  const setTokenCount = useAgentStore((s) => s.setTokenCount)

  const abortRef = useRef<AbortController | null>(null)

  const { data: workflows = [] } = useWorkflows()
  const createWorkflow = useCreateWorkflow()
  const saveGraph = useSaveWorkflowGraph()
  const deleteWorkflow = useDeleteWorkflow()

  // ── Select workflow ────────────────────────────────────────────────
  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value || null
      if (activeWorkflowId && nodes.length > 0) {
        if (!window.confirm('Unsaved changes will be lost. Switch workflow?')) return
      }
      setActiveWorkflow(id)

      if (id) {
        const workflow = workflows.find((w) => w.id === id)
        if (workflow) {
          const { nodes: parsedNodes, edges: parsedEdges } =
            parseGraph(workflow)
          setNodes(parsedNodes)
          setEdges(parsedEdges)
        }
      } else {
        setNodes([])
        setEdges([])
      }
    },
    [activeWorkflowId, nodes.length, workflows, setActiveWorkflow, setNodes, setEdges],
  )

  // ── New workflow ───────────────────────────────────────────────────
  const handleNew = useCallback(() => {
    createWorkflow.mutate(
      { name: `Workflow ${workflows.length + 1}` },
      {
        onSuccess: (newId: string) => {
          setActiveWorkflow(newId)
          setNodes([])
          setEdges([])
        },
      },
    )
  }, [createWorkflow, workflows.length, setActiveWorkflow, setNodes, setEdges])

  // ── Save current graph ────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!activeWorkflowId) return
    const graph = JSON.stringify({ nodes, edges })
    saveGraph.mutate({ id: activeWorkflowId, graph })
  }, [activeWorkflowId, nodes, edges, saveGraph])

  // ── Delete current workflow ───────────────────────────────────────
  const handleDelete = useCallback(() => {
    if (!activeWorkflowId) return

    const workflow = workflows.find((w) => w.id === activeWorkflowId)
    const name = workflow?.name ?? 'this workflow'
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return

    deleteWorkflow.mutate(
      { id: activeWorkflowId },
      {
        onSuccess: () => {
          setActiveWorkflow(null)
          setNodes([])
          setEdges([])
        },
      },
    )
  }, [
    activeWorkflowId,
    workflows,
    deleteWorkflow,
    setActiveWorkflow,
    setNodes,
    setEdges,
  ])

  // ── Run workflow (DAG execution) ──────────────────────────────────
  const handleRun = useCallback(() => {
    if (nodes.length === 0) return

    const controller = new AbortController()
    abortRef.current = controller

    setRunning(true)

    // Build nodeId → Agent cache to avoid repeated O(n) lookups
    const agentByNode = new Map<string, Agent>()
    for (const node of nodes) {
      if (node.type !== 'agent') continue
      const data = node.data as AgentNodeData
      const agent = agents.find((a) => a.name === data.label)
      if (agent) agentByNode.set(node.id, agent)
    }

    void executeWorkflow(nodes, edges, {
      getAgentForNode: (nodeId) => agentByNode.get(nodeId),
      onNodeStart: (nodeId) => {
        const agent = agentByNode.get(nodeId)
        if (agent) updateAgentStatus(agent.id, 'running', '')
      },
      onNodeToken: (nodeId, text) => {
        const agent = agentByNode.get(nodeId)
        if (agent) appendOutput(agent.id, text)
      },
      onNodeComplete: (nodeId, output, tokenCount) => {
        const agent = agentByNode.get(nodeId)
        if (agent) {
          updateAgentStatus(agent.id, 'completed', output)
          setTokenCount(agent.id, tokenCount)
        }
      },
      onNodeError: (nodeId, error) => {
        const agent = agentByNode.get(nodeId)
        if (agent) updateAgentStatus(agent.id, 'error', error)
      },
      onWorkflowComplete: () => {},
      onWorkflowError: (error) => console.error('[Workflow]', error),
      signal: controller.signal,
    }).finally(() => {
      setRunning(false)
      abortRef.current = null
    })
  }, [nodes, edges, agents, setRunning, updateAgentStatus, appendOutput, setTokenCount])

  // ── Stop workflow ───────────────────────────────────────────────────
  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    approvalManager.cancelAll()
    setRunning(false)
  }, [setRunning])

  return (
    <div className="flex h-10 items-center border-b border-neutral-800 bg-neutral-900 px-3">
      {/* Left: workflow selector */}
      <div className="relative">
        <select
          value={activeWorkflowId ?? ''}
          onChange={handleSelect}
          className="appearance-none rounded border border-neutral-700 bg-neutral-800 py-1 pr-7 pl-2 text-xs text-neutral-200 outline-none focus:border-indigo-500"
        >
          <option value="">Select workflow...</option>
          {workflows.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
      </div>

      {/* Center: action buttons */}
      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleNew}
          disabled={createWorkflow.isPending}
          className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!activeWorkflowId || saveGraph.isPending}
          className="inline-flex items-center gap-1 rounded border border-neutral-600 bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!activeWorkflowId || deleteWorkflow.isPending}
          className="inline-flex items-center gap-1 rounded bg-red-600/10 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-600/20 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {/* Right: run / stop */}
      <div className="ml-auto">
        <RunButton
          onRun={handleRun}
          onStop={handleStop}
          isRunning={isRunning}
          disabled={!activeWorkflowId || nodes.length === 0}
        />
      </div>
    </div>
  )
}
