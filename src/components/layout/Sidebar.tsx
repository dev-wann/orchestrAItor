import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAgents, useCreateAgent } from '../../hooks/useDatabase'
import { useUIStore } from '../../store/uiStore'
import AgentCard from '../agent/AgentCard'
import AgentForm from '../agent/AgentForm'
import type { AgentFormData } from '../agent/AgentForm'

export default function Sidebar() {
  const { data: agents = [], isLoading } = useAgents()
  const selectedAgentId = useUIStore((s) => s.selectedAgentId)
  const selectAgent = useUIStore((s) => s.selectAgent)
  const [showForm, setShowForm] = useState(false)
  const createAgent = useCreateAgent()

  function handleCreate(data: AgentFormData) {
    createAgent.mutate(data, {
      onSuccess: () => setShowForm(false),
    })
  }

  return (
    <aside className="w-64 flex flex-col bg-neutral-900 border-r border-neutral-800">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Agents
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <p className="px-2 py-8 text-center text-sm text-neutral-500">
            Loading...
          </p>
        ) : agents.length === 0 && !showForm ? (
          <p className="px-2 py-8 text-center text-sm text-neutral-500">
            No agents yet
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                onSelect={selectAgent}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="border-t border-neutral-800 p-2">
          <AgentForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isSubmitting={createAgent.isPending}
          />
        </div>
      )}

      <div className="p-2 border-t border-neutral-800">
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <Plus size={14} />
          Add Agent
        </button>
      </div>
    </aside>
  )
}
