import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Agent } from '../../types/database'
import { useUpdateAgent, useDeleteAgent } from '../../hooks/useDatabase'
import AgentForm from './AgentForm'
import type { AgentFormData } from './AgentForm'

interface AgentDetailProps {
  agent: Agent
  onDeleted?: () => void
}

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  google: 'Google',
  ollama: 'Ollama',
}

export default function AgentDetail({ agent, onDeleted }: AgentDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const updateAgent = useUpdateAgent()
  const deleteAgent = useDeleteAgent()

  function handleUpdate(data: AgentFormData) {
    updateAgent.mutate(
      { id: agent.id, ...data },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  function handleDelete() {
    if (!window.confirm(`Delete agent "${agent.name}"? This action cannot be undone.`)) return
    deleteAgent.mutate(
      { id: agent.id },
      { onSuccess: () => onDeleted?.() },
    )
  }

  if (isEditing) {
    return (
      <AgentForm
        agent={agent}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
        isSubmitting={updateAgent.isPending}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 border border-neutral-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: agent.color }}
          />
          <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            aria-label="Edit agent"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteAgent.isPending}
            className="rounded-md p-1.5 text-red-400 bg-red-600/10 hover:bg-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Delete agent"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Info rows */}
      <dl className="flex flex-col gap-3 text-sm">
        <div>
          <dt className="text-xs font-medium text-neutral-500">Provider</dt>
          <dd className="mt-0.5 text-neutral-300">
            {PROVIDER_LABELS[agent.provider] ?? agent.provider}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium text-neutral-500">Model</dt>
          <dd className="mt-0.5 font-mono text-xs text-neutral-300">{agent.model}</dd>
        </div>

        {agent.system_prompt && (
          <div>
            <dt className="text-xs font-medium text-neutral-500">System Prompt</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-neutral-300">{agent.system_prompt}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
