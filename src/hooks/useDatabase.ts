import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDb } from '../lib/db'
import type { Agent, AppSetting } from '../types/database'

// ── Query Keys ───────────────────────────────────────────────────────
const queryKeys = {
  agents: ['agents'] as const,
  appSetting: (key: string) => ['app_setting', key] as const,
}

// ── useAgents ────────────────────────────────────────────────────────
/** Fetches all agents ordered by creation date (newest first). */
export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: queryKeys.agents,
    queryFn: async () => {
      try {
        const db = await getDb()
        return await db.select<Agent[]>(
          'SELECT * FROM agents ORDER BY created_at DESC',
        )
      } catch (error) {
        console.error('[useAgents] Failed to fetch agents:', error)
        throw error
      }
    },
  })
}

// ── useAppSetting ────────────────────────────────────────────────────
/** Fetches a single app setting by key. Returns `null` when the key does not exist. */
export function useAppSetting(key: string) {
  return useQuery<string | null>({
    queryKey: queryKeys.appSetting(key),
    queryFn: async () => {
      try {
        const db = await getDb()
        const rows = await db.select<AppSetting[]>(
          'SELECT * FROM app_settings WHERE key = $1',
          [key],
        )
        return rows.length > 0 ? rows[0].value : null
      } catch (error) {
        console.error(`[useAppSetting] Failed to fetch setting "${key}":`, error)
        throw error
      }
    },
  })
}

// ── useSetAppSetting ─────────────────────────────────────────────────
interface SetAppSettingVars {
  key: string
  value: string
}

/** Upserts an app setting and invalidates the corresponding query cache. */
export function useSetAppSetting() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SetAppSettingVars>({
    mutationFn: async ({ key, value }: SetAppSettingVars) => {
      try {
        const db = await getDb()
        await db.execute(
          `INSERT INTO app_settings (key, value, updated_at)
           VALUES ($1, $2, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = datetime('now')`,
          [key, value],
        )
      } catch (error) {
        console.error('[useSetAppSetting] Failed to save setting:', error)
        throw error
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.appSetting(variables.key),
      })
    },
  })
}
