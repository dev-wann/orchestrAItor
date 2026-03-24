import { invoke } from '@tauri-apps/api/core'
import { useQuery } from '@tanstack/react-query'
import type { Provider } from '../types/database'

// ── Types ─────────────────────────────────────────────────────────────
export interface ModelInfo {
  id: string
  name: string
}

// ── Query Keys ────────────────────────────────────────────────────────
const modelKeys = {
  list: (provider: Provider) => ['models', provider] as const,
}

// ── useModels ─────────────────────────────────────────────────────────
/**
 * Fetches the list of available models for a given provider.
 *
 * - For providers that require an API key (openai), the key is resolved
 *   internally from the system keyring via `get_api_key`.
 * - For providers with hardcoded endpoints (anthropic, google, ollama),
 *   the API key is not needed.
 * - If the provider is empty, the query is disabled.
 * - staleTime is set to 5 minutes since model lists rarely change.
 */
export function useModels(provider: Provider | '') {
  return useQuery<ModelInfo[]>({
    queryKey: modelKeys.list(provider as Provider),
    queryFn: async () => {
      if (!provider) return []

      let apiKey: string | null = null
      if (provider === 'openai') {
        try {
          apiKey = await invoke<string>('get_api_key', { provider })
        } catch {
          // No API key stored — cannot fetch models
          return []
        }
      }

      return invoke<ModelInfo[]>('fetch_models', { provider, apiKey })
    },
    enabled: provider !== '',
    staleTime: 5 * 60 * 1000,
  })
}
