import { getDb } from './db'
import type { LogLevel } from '../types/database'

/**
 * Inserts a log entry into the agent_logs table.
 * Silently catches DB errors to avoid breaking the caller flow.
 */
export async function logAgent(
  agentId: string,
  level: LogLevel,
  message: string,
  payload?: string,
): Promise<void> {
  try {
    const db = await getDb()
    await db.execute(
      'INSERT INTO agent_logs (agent_id, level, message, payload) VALUES ($1, $2, $3, $4)',
      [agentId, level, message, payload ?? null],
    )
  } catch (error) {
    console.error('[logAgent] Failed to write agent log:', error)
  }
}
