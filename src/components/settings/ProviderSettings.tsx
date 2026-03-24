import type { Provider } from '../../types/database'
import ProviderRow from './ProviderRow'

interface ProviderConfig {
  provider: Provider
  displayName: string
  isOllama?: boolean
}

const providers: ProviderConfig[] = [
  { provider: 'anthropic', displayName: 'Anthropic' },
  { provider: 'openai', displayName: 'OpenAI' },
  { provider: 'google', displayName: 'Google' },
  { provider: 'ollama', displayName: 'Ollama', isOllama: true },
]

export default function ProviderSettings() {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Provider Settings
      </h2>

      <div className="space-y-2">
        {providers.map(({ provider, displayName, isOllama }) => (
          <ProviderRow
            key={provider}
            provider={provider}
            displayName={displayName}
            isOllama={isOllama}
          />
        ))}
      </div>
    </section>
  )
}
