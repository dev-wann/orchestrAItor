import { Plus } from 'lucide-react'
import type { Agent } from '../../types/database'

export default function Sidebar() {
  const agents: Agent[] = []

  return (
    <aside className="w-64 flex flex-col bg-neutral-900 border-r border-neutral-800">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Agents
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {agents.length === 0 && (
          <p className="px-2 py-8 text-center text-sm text-neutral-500">
            No agents yet
          </p>
        )}
      </div>

      <div className="p-2 border-t border-neutral-800">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <Plus size={14} />
          Add Agent
        </button>
      </div>
    </aside>
  )
}
