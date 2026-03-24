import ProviderSettings from '../settings/ProviderSettings'
import AgentOutputPanel from '../workflow/AgentOutputPanel'
import { useUIStore } from '../../store/uiStore'

export default function Panel() {
  const selectedAgentId = useUIStore((s) => s.selectedAgentId)

  return (
    <aside className="w-80 flex flex-col bg-neutral-900 border-l border-neutral-800 overflow-y-auto p-3">
      {selectedAgentId ? (
        <AgentOutputPanel agentId={selectedAgentId} />
      ) : (
        <ProviderSettings />
      )}
    </aside>
  )
}
