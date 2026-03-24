import { useEffect, useRef, useCallback } from 'react'
import { useAgentStore } from '../../store/agentStore'
import type { AgentStatus } from '../../types/database'
import { approvalManager } from '../../lib/approvalManager'
import ApprovalBanner from './ApprovalBanner'

interface AgentOutputPanelProps {
  agentId: string | null
}

const STATUS_BADGE: Record<AgentStatus, { label: string; className: string }> = {
  idle: { label: 'Idle', className: 'bg-neutral-700/30 text-neutral-400' },
  running: { label: 'Running', className: 'bg-green-600/20 text-green-400' },
  approval_required: { label: 'Approval', className: 'bg-amber-600/20 text-amber-400' },
  completed: { label: 'Done', className: 'bg-blue-600/20 text-blue-400' },
  error: { label: 'Error', className: 'bg-red-600/20 text-red-400' },
  paused: { label: 'Paused', className: 'bg-neutral-600/20 text-neutral-400' },
}

export default function AgentOutputPanel({ agentId }: AgentOutputPanelProps) {
  const agents = useAgentStore((s) => s.agents)
  const agent = agentId ? agents.find((a) => a.id === agentId) : undefined
  const outputRef = useRef<HTMLPreElement>(null)

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    const el = outputRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [agent?.current_output])

  const handleApprove = useCallback(() => {
    if (agent) {
      approvalManager.resolve(agent.id, true)
    }
  }, [agent])

  const handleReject = useCallback(() => {
    if (agent) {
      approvalManager.resolve(agent.id, false)
    }
  }, [agent])

  if (!agent) {
    return (
      <section className="flex flex-1 items-center justify-center">
        <p className="text-sm text-neutral-500">Select an agent to see output</p>
      </section>
    )
  }

  const badge = STATUS_BADGE[agent.status]

  return (
    <section className="flex flex-1 flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-xs font-semibold text-white">
            {agent.name}
          </h3>
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
        <span className="text-[10px] tabular-nums text-neutral-500">
          {agent.token_count.toLocaleString()} tokens
        </span>
      </div>

      {/* Approval Banner */}
      {agent.status === 'approval_required' && (
        <ApprovalBanner
          agentName={agent.name}
          nodeId={agent.id}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Output */}
      <pre
        ref={outputRef}
        className="flex-1 overflow-y-auto rounded bg-neutral-950 p-3 font-mono text-sm whitespace-pre-wrap text-neutral-300"
      >
        {agent.current_output ?? ''}
        {agent.status === 'running' && (
          <span className="animate-pulse text-green-400">{'\u258A'}</span>
        )}
      </pre>
    </section>
  )
}
