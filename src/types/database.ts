// ── Agent ────────────────────────────────────────────────────────────
export type AgentStatus =
  | 'idle'
  | 'running'
  | 'approval_required'
  | 'completed'
  | 'error'
  | 'paused'

export type Provider = 'anthropic' | 'openai' | 'google' | 'ollama'

export interface Agent {
  id: string
  name: string
  provider: Provider
  model: string
  system_prompt: string
  color: string
  status: AgentStatus
  current_output: string | null
  token_count: number
  created_at: string
  updated_at: string
}

// ── Workflow ─────────────────────────────────────────────────────────
export interface Workflow {
  id: string
  name: string
  /** JSON string: { nodes: [], edges: [] } */
  graph: string
  is_active: 0 | 1
  created_at: string
  updated_at: string
}

// ── Agent Log ────────────────────────────────────────────────────────
export type LogLevel = 'info' | 'warn' | 'error'

export interface AgentLog {
  id: number
  agent_id: string
  level: LogLevel
  message: string
  payload: string | null
  created_at: string
}

// ── UI ──────────────────────────────────────────────────────────────
export type UIMode = 'menubar' | 'floating' | 'both'

// ── App Setting ──────────────────────────────────────────────────────
export interface AppSetting {
  key: string
  value: string
  updated_at: string
}
