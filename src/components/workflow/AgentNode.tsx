import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { AgentStatus, Provider } from '../../types/database'

export type AgentNodeData = {
  label: string
  provider: Provider
  model: string
  color: string
  status: AgentStatus
  [key: string]: unknown
}

export type AgentNodeType = Node<AgentNodeData, 'agent'>

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; className: string }
> = {
  idle: {
    label: 'Idle',
    className: 'bg-neutral-700/30 text-neutral-400',
  },
  running: {
    label: 'Running',
    className: 'bg-green-600/10 text-green-400 animate-pulse',
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

export default function AgentNode({ data }: NodeProps<AgentNodeType>) {
  const status = STATUS_CONFIG[data.status]

  return (
    <div
      className="rounded-lg border border-neutral-700 border-l-4 bg-neutral-800 shadow-md"
      style={{ borderLeftColor: data.color, width: 160 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !rounded-full !border-none !bg-indigo-500"
      />

      <div className="px-3 py-2.5">
        <div className="truncate text-xs font-semibold text-white">
          {data.label}
        </div>
        <div className="mt-0.5 truncate text-[10px] text-neutral-400">
          {data.model}
        </div>
        <div className="mt-1.5">
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none ${status.className}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !rounded-full !border-none !bg-indigo-500"
      />
    </div>
  )
}
