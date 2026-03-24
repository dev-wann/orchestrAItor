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

/**
 * Topological sort using Kahn's algorithm.
 * Returns an array of levels, where each level is an array of node IDs
 * that can be executed in parallel.
 *
 * Throws if a cycle is detected.
 */
function topologicalSort(nodes: Node[], edges: Edge[]): string[][] {
  const nodeIds = new Set(nodes.map((n) => n.id))

  // Build adjacency list and in-degree map
  const inDegree = new Map<string, number>()
  const children = new Map<string, string[]>()

  for (const id of nodeIds) {
    inDegree.set(id, 0)
    children.set(id, [])
  }

  for (const edge of edges) {
    // Only consider edges whose endpoints are in the node set
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue

    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
    children.get(edge.source)!.push(edge.target)
  }

  // BFS — level by level
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

/**
 * Build the input text for a node by collecting the outputs of all
 * source nodes connected by incoming edges.
 *
 * If there are no incoming edges (start node), returns the default prompt.
 * Multiple inputs are joined with a separator.
 */
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

/**
 * Execute a DAG-based workflow.
 *
 * Nodes are sorted topologically into levels. All nodes within a level
 * run in parallel via Promise.all. Each node's output is chained as input
 * to downstream nodes.
 *
 * - A single node failure marks that node as error but does not abort sibling nodes.
 * - An AbortSignal abort stops the entire workflow.
 * - A cycle in the graph throws immediately.
 */
export async function executeWorkflow(
  nodes: Node[],
  edges: Edge[],
  callbacks: DagExecutionCallbacks,
): Promise<void> {
  // Validate inputs
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

  try {
    for (const level of levels) {
      // Check abort before starting each level
      if (callbacks.signal?.aborted) {
        callbacks.onWorkflowError('Workflow was cancelled')
        return
      }

      await Promise.all(
        level.map(async (nodeId) => {
          // Check abort before each individual node
          if (callbacks.signal?.aborted) return

          const agent = callbacks.getAgentForNode(nodeId)
          if (!agent) {
            callbacks.onNodeError(nodeId, 'Agent not found for this node')
            return
          }

          const input = getInputForNode(nodeId, edges, outputMap)
          callbacks.onNodeStart(nodeId)

          try {
            await runAgent({
              agent,
              input,
              onToken: (text) => callbacks.onNodeToken(nodeId, text),
              onStatusChange: () => {
                // Status is managed externally via callbacks
              },
              onComplete: (output, tokenCount) => {
                outputMap.set(nodeId, output)
                callbacks.onNodeComplete(nodeId, output, tokenCount)
              },
              onError: (error) => callbacks.onNodeError(nodeId, error),
              signal: callbacks.signal,
            })
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : 'Unknown execution error'
            callbacks.onNodeError(nodeId, message)
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
