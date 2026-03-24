import type { Agent, AgentStatus } from '../../types/database'

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: (id: string) => void
}

const STATUS_STYLES: Record<AgentStatus, { label: string; className: string }> = {
  idle: {
    label: 'Idle',
    className: 'bg-neutral-700/30 text-neutral-400',
  },
  running: {
    label: 'Running',
    className: 'bg-green-600/10 text-green-400',
  },
  approval_required: {
    label: 'Approval',
    className: 'bg-amber-600/10 text-amber-400',
  },
  completed: {
    label: 'Done',
    className: 'bg-blue-600/10 text-blue-400',
  },
  error: {
    label: 'Error',
    className: 'bg-red-600/10 text-red-400',
  },
  paused: {
    label: 'Paused',
    className: 'bg-neutral-600/10 text-neutral-400',
  },
}

export default function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const status = STATUS_STYLES[agent.status]

  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
        isSelected
          ? 'bg-neutral-800'
          : 'hover:bg-neutral-800/50'
      }`}
    >
      {/* Color dot */}
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: agent.color }}
      />

      {/* Name */}
      <span className="flex-1 truncate text-sm text-white">{agent.name}</span>

      {/* Status badge */}
      <span
        className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${status.className}`}
      >
        {status.label}
      </span>
    </button>
  )
}
