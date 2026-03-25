import { type Node, type Edge } from '@xyflow/react'
import type { Agent } from '../types/database'
import { runAgent } from './agentRunner'

interface DagExecutionCallbacks {
  onNodeStart: (nodeId: string) => void
  onNodeToken: (nodeId: string, text: string) => void
  onNodeComplete: (nodeId: string, output: string, tokenCount: number) => void
  onNodeError: (nodeId: string, error: string) => void
  onWorkflowComplete: () => void
  onWorkflowError: (error: string) => void
  getAgentForNode: (nodeId: string) => Agent | undefined
  signal?: AbortSignal
}

const DEFAULT_START_PROMPT =
  'You are starting a workflow. Begin your task.'

const INPUT_SEPARATOR = '\n---\n'

function topologicalSort(nodes: Node[], edges: Edge[]): string[][] {
  const nodeIds = new Set(nodes.map((n) => n.id))

  const inDegree = new Map<string, number>()
  const children = new Map<string, Set<string>>()

  for (const id of nodeIds) {
    inDegree.set(id, 0)
    children.set(id, new Set())
  }

  // Deduplicate edges by using Set for children
  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue
    const childSet = children.get(edge.source)!
    if (!childSet.has(edge.target)) {
      childSet.add(edge.target)
      inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
    }
  }

  const levels: string[][] = []
  let queue = Array.from(nodeIds).filter((id) => inDegree.get(id) === 0)
  let processedCount = 0

  while (queue.length > 0) {
    levels.push(queue)
    processedCount += queue.length

    const nextQueue: string[] = []
    for (const nodeId of queue) {
      for (const child of children.get(nodeId) ?? []) {
        const newDegree = (inDegree.get(child) ?? 1) - 1
        inDegree.set(child, newDegree)
        if (newDegree === 0) {
          nextQueue.push(child)
        }
      }
    }
    queue = nextQueue
  }

  if (processedCount !== nodeIds.size) {
    throw new Error(
      'Cycle detected in workflow graph: not all nodes could be processed',
    )
  }

  return levels
}

function getInputForNode(
  nodeId: string,
  edges: Edge[],
  outputMap: Map<string, string>,
): string {
  const incomingEdges = edges.filter((e) => e.target === nodeId)

  if (incomingEdges.length === 0) {
    return DEFAULT_START_PROMPT
  }

  const inputs = incomingEdges
    .map((e) => outputMap.get(e.source))
    .filter((output): output is string => output != null)

  if (inputs.length === 0) {
    return DEFAULT_START_PROMPT
  }

  return inputs.join(INPUT_SEPARATOR)
}

export async function executeWorkflow(
  nodes: Node[],
  edges: Edge[],
  callbacks: DagExecutionCallbacks,
): Promise<void> {
  if (nodes.length === 0) {
    callbacks.onWorkflowComplete()
    return
  }

  let levels: string[][]
  try {
    levels = topologicalSort(nodes, edges)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown topological sort error'
    callbacks.onWorkflowError(message)
    return
  }

  const outputMap = new Map<string, string>()
  const failedNodes = new Set<string>()

  // Build parent map for failure propagation
  const parentMap = new Map<string, string[]>()
  for (const edge of edges) {
    const parents = parentMap.get(edge.target) ?? []
    parents.push(edge.source)
    parentMap.set(edge.target, parents)
  }

  function hasFailedAncestor(nodeId: string): boolean {
    const parents = parentMap.get(nodeId) ?? []
    return parents.some((p) => failedNodes.has(p))
  }

  try {
    for (const level of levels) {
      if (callbacks.signal?.aborted) {
        callbacks.onWorkflowError('Workflow was cancelled')
        return
      }

      await Promise.all(
        level.map(async (nodeId) => {
          if (callbacks.signal?.aborted) return

          // Skip nodes whose parent failed
          if (hasFailedAncestor(nodeId)) {
            failedNodes.add(nodeId)
            callbacks.onNodeError(nodeId, 'Skipped: upstream node failed')
            return
          }

          const agent = callbacks.getAgentForNode(nodeId)
          if (!agent) {
            failedNodes.add(nodeId)
            callbacks.onNodeError(nodeId, 'Agent not found for this node')
            return
          }

          const input = getInputForNode(nodeId, edges, outputMap)
          callbacks.onNodeStart(nodeId)

          // Track whether this node errored via the onError callback
          let nodeErrored = false

          await runAgent({
            agent,
            input,
            onToken: (text) => callbacks.onNodeToken(nodeId, text),
            onStatusChange: () => {},
            onComplete: (output, tokenCount) => {
              outputMap.set(nodeId, output)
              callbacks.onNodeComplete(nodeId, output, tokenCount)
            },
            onError: (error) => {
              nodeErrored = true
              failedNodes.add(nodeId)
              callbacks.onNodeError(nodeId, error)
            },
            signal: callbacks.signal,
            nodeId,
          })

          // If runAgent completed without calling onComplete, mark as failed
          if (!nodeErrored && !outputMap.has(nodeId)) {
            failedNodes.add(nodeId)
          }
        }),
      )
    }

    if (!callbacks.signal?.aborted) {
      callbacks.onWorkflowComplete()
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown workflow error'
    callbacks.onWorkflowError(message)
  }
}

export { topologicalSort, getInputForNode }
export type { DagExecutionCallbacks }
