import Database from '@tauri-apps/plugin-sql'

/** Singleton DB instance backed by SQLite. */
let db: Database | null = null

/**
 * Returns the shared Database connection.
 * On the first call the connection is established via `Database.load`;
 * subsequent calls return the cached instance.
 */
export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load('sqlite:orchestraitor.db')
  }
  return db
}
