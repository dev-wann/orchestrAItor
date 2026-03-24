import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDb } from '../lib/db'
import type { Agent, AppSetting, Provider, Workflow } from '../types/database'

// ── Query Keys ───────────────────────────────────────────────────────
const queryKeys = {
  agents: ['agents'] as const,
  appSetting: (key: string) => ['app_setting', key] as const,
  workflows: ['workflows'] as const,
}

// ── useAgents ────────────────────────────────────────────────────────
/** Fetches all agents ordered by creation date (newest first). */
export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: queryKeys.agents,
    queryFn: async () => {
      try {
        const db = await getDb()
        return await db.select<Agent[]>(
          'SELECT * FROM agents ORDER BY created_at DESC',
        )
      } catch (error) {
        console.error('[useAgents] Failed to fetch agents:', error)
        throw error
      }
    },
  })
}

// ── useAppSetting ────────────────────────────────────────────────────
/** Fetches a single app setting by key. Returns `null` when the key does not exist. */
export function useAppSetting(key: string) {
  return useQuery<string | null>({
    queryKey: queryKeys.appSetting(key),
    queryFn: async () => {
      try {
        const db = await getDb()
        const rows = await db.select<AppSetting[]>(
          'SELECT * FROM app_settings WHERE key = $1',
          [key],
        )
        return rows.length > 0 ? rows[0].value : null
      } catch (error) {
        console.error(`[useAppSetting] Failed to fetch setting "${key}":`, error)
        throw error
      }
    },
  })
}

// ── useSetAppSetting ─────────────────────────────────────────────────
interface SetAppSettingVars {
  key: string
  value: string
}

/** Upserts an app setting and invalidates the corresponding query cache. */
export function useSetAppSetting() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SetAppSettingVars>({
    mutationFn: async ({ key, value }: SetAppSettingVars) => {
      try {
        const db = await getDb()
        await db.execute(
          `INSERT INTO app_settings (key, value, updated_at)
           VALUES ($1, $2, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
          [key, value],
        )
      } catch (error) {
        console.error('[useSetAppSetting] Failed to save setting:', error)
        throw error
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.appSetting(variables.key),
      })
    },
  })
}

// ── useCreateAgent ──────────────────────────────────────────────────
interface CreateAgentVars {
  name: string
  provider: Provider
  model: string
  systemPrompt: string
  color: string
}

/** Creates a new agent and invalidates the agents query cache. */
export function useCreateAgent() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, CreateAgentVars>({
    mutationFn: async ({ name, provider, model, systemPrompt, color }: CreateAgentVars) => {
      try {
        const db = await getDb()
        const id = crypto.randomUUID()
        await db.execute(
          `INSERT INTO agents (id, name, provider, model, system_prompt, color)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, name, provider, model, systemPrompt, color],
        )
      } catch (error) {
        console.error('[useCreateAgent] Failed to create agent:', error)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.agents })
    },
  })
}

// ── useUpdateAgent ──────────────────────────────────────────────────
interface UpdateAgentVars {
  id: string
  name: string
  provider: Provider
  model: string
  systemPrompt: string
  color: string
}

/** Updates an existing agent and invalidates the agents query cache. */
export function useUpdateAgent() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateAgentVars>({
    mutationFn: async ({ id, name, provider, model, systemPrompt, color }: UpdateAgentVars) => {
      try {
        const db = await getDb()
        const result = await db.execute(
          `UPDATE agents SET name = $1, provider = $2, model = $3, system_prompt = $4, color = $5, updated_at = datetime('now')
           WHERE id = $6`,
          [name, provider, model, systemPrompt, color, id],
        )
        if (result.rowsAffected === 0) throw new Error(`Agent not found: ${id}`)
      } catch (error) {
        console.error('[useUpdateAgent] Failed to update agent:', error)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.agents })
    },
  })
}

// ── useDeleteAgent ──────────────────────────────────────────────────
interface DeleteAgentVars {
  id: string
}

/** Deletes an agent and invalidates the agents query cache. */
export function useDeleteAgent() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteAgentVars>({
    mutationFn: async ({ id }: DeleteAgentVars) => {
      try {
        const db = await getDb()
        const result = await db.execute('DELETE FROM agents WHERE id = $1', [id])
        if (result.rowsAffected === 0) throw new Error(`Agent not found: ${id}`)
      } catch (error) {
        console.error('[useDeleteAgent] Failed to delete agent:', error)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.agents })
    },
  })
}

// ── useWorkflows ─────────────────────────────────────────────────────
/** Fetches all workflows ordered by last update (newest first). */
export function useWorkflows() {
  return useQuery<Workflow[]>({
    queryKey: queryKeys.workflows,
    queryFn: async () => {
      try {
        const db = await getDb()
        return await db.select<Workflow[]>(
          'SELECT * FROM workflows ORDER BY updated_at DESC',
        )
      } catch (error) {
        console.error('[useWorkflows] Failed to fetch workflows:', error)
        throw error
      }
    },
  })
}

// ── useCreateWorkflow ────────────────────────────────────────────────
interface CreateWorkflowVars {
  name: string
}

/** Creates a new workflow with an empty graph and invalidates the workflows query cache. */
export function useCreateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation<string, Error, CreateWorkflowVars>({
    mutationFn: async ({ name }: CreateWorkflowVars) => {
      try {
        const db = await getDb()
        const id = crypto.randomUUID()
        const graph = '{"nodes":[],"edges":[]}'
        await db.execute(
          'INSERT INTO workflows (id, name, graph) VALUES ($1, $2, $3)',
          [id, name, graph],
        )
        return id
      } catch (error) {
        console.error('[useCreateWorkflow] Failed to create workflow:', error)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workflows })
    },
  })
}

// ── useSaveWorkflowGraph ─────────────────────────────────────────────
interface SaveWorkflowGraphVars {
  id: string
  graph: string
}

/** Saves the canvas graph JSON to an existing workflow. */
export function useSaveWorkflowGraph() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SaveWorkflowGraphVars>({
    mutationFn: async ({ id, graph }: SaveWorkflowGraphVars) => {
      try {
        const db = await getDb()
        const result = await db.execute(
          "UPDATE workflows SET graph = $1, updated_at = datetime('now') WHERE id = $2",
          [graph, id],
        )
        if (result.rowsAffected === 0) throw new Error(`Workflow not found: ${id}`)
      } catch (error) {
        console.error('[useSaveWorkflowGraph] Failed to save workflow graph:', error)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workflows })
    },
  })
}

// ── useDeleteWorkflow ────────────────────────────────────────────────
interface DeleteWorkflowVars {
  id: string
}

/** Deletes a workflow and invalidates the workflows query cache. */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteWorkflowVars>({
    mutationFn: async ({ id }: DeleteWorkflowVars) => {
      try {
        const db = await getDb()
        const result = await db.execute('DELETE FROM workflows WHERE id = $1', [id])
        if (result.rowsAffected === 0) throw new Error(`Workflow not found: ${id}`)
      } catch (error) {
        console.error('[useDeleteWorkflow] Failed to delete workflow:', error)
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workflows })
    },
  })
}
