import ProviderSettings from '../settings/ProviderSettings'

export default function Panel() {
  return (
    <aside className="w-80 flex flex-col bg-neutral-900 border-l border-neutral-800 overflow-y-auto p-3">
      <ProviderSettings />
    </aside>
  )
}
