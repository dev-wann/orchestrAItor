import { invoke } from '@tauri-apps/api/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Provider } from '../types/database'

// ── Query Keys ───────────────────────────────────────────────────────
const apiKeyKeys = {
  hasKey: (provider: Provider) => ['api_key', provider] as const,
}

// ── useHasApiKey ─────────────────────────────────────────────────────
/** Checks whether an API key exists in the system keyring for the given provider. */
export function useHasApiKey(provider: Provider) {
  return useQuery<boolean>({
    queryKey: apiKeyKeys.hasKey(provider),
    queryFn: async () => {
      try {
        return await invoke<boolean>('has_api_key', { provider })
      } catch (error) {
        console.error(`[useHasApiKey] Failed to check key for "${provider}":`, error)
        throw error
      }
    },
  })
}

// ── useSetApiKey ─────────────────────────────────────────────────────
interface SetApiKeyVars {
  provider: Provider
  key: string
}

/** Saves an API key to the system keyring for the given provider. */
export function useSetApiKey() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SetApiKeyVars>({
    mutationFn: async ({ provider, key }: SetApiKeyVars) => {
      try {
        await invoke<void>('set_api_key', { provider, key })
      } catch (error) {
        console.error('[useSetApiKey] Failed to save API key:', error)
        throw error
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: apiKeyKeys.hasKey(variables.provider),
      })
    },
  })
}

// ── useDeleteApiKey ──────────────────────────────────────────────────
interface DeleteApiKeyVars {
  provider: Provider
}

/** Deletes an API key from the system keyring for the given provider. */
export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteApiKeyVars>({
    mutationFn: async ({ provider }: DeleteApiKeyVars) => {
      try {
        await invoke<void>('delete_api_key', { provider })
      } catch (error) {
        console.error('[useDeleteApiKey] Failed to delete API key:', error)
        throw error
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: apiKeyKeys.hasKey(variables.provider),
      })
    },
  })
}
