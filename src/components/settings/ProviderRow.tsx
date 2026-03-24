import { useState } from 'react'
import { Key, Check, Trash2, Globe, Loader2 } from 'lucide-react'
import type { Provider } from '../../types/database'
import { useHasApiKey, useSetApiKey, useDeleteApiKey } from '../../hooks/useApiKey'

interface ProviderRowProps {
  provider: Provider
  displayName: string
  isOllama?: boolean
}

export default function ProviderRow({ provider, displayName, isOllama = false }: ProviderRowProps) {
  const [inputValue, setInputValue] = useState('')
  const { data: hasKey, isLoading: isChecking } = useHasApiKey(provider)
  const setApiKey = useSetApiKey()
  const deleteApiKey = useDeleteApiKey()

  const isSaving = setApiKey.isPending
  const isDeleting = deleteApiKey.isPending

  function handleSave() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setApiKey.mutate(
      { provider, key: trimmed },
      { onSuccess: () => setInputValue('') },
    )
  }

  function handleDelete() {
    deleteApiKey.mutate({ provider })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  // Ollama uses a local endpoint, no API key needed
  if (isOllama) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Globe size={16} className="shrink-0 text-neutral-400" />
          <span className="text-sm font-medium text-white">{displayName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-mono">http://localhost:11434</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-400">
            Local
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3">
      {/* Header: name + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key size={16} className="shrink-0 text-neutral-400" />
          <span className="text-sm font-medium text-white">{displayName}</span>
        </div>

        {isChecking ? (
          <Loader2 size={14} className="animate-spin text-neutral-500" />
        ) : hasKey ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2 py-0.5 text-xs font-medium text-green-400">
            <Check size={12} />
            Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-700/30 px-2 py-0.5 text-xs font-medium text-neutral-400">
            Not configured
          </span>
        )}
      </div>

      {/* Input + actions */}
      <div className="flex items-center gap-2">
        {hasKey && !inputValue ? (
          <div className="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-sm text-neutral-500 tracking-widest select-none">
            {'●'.repeat(16)}
          </div>
        ) : (
          <input
            type="password"
            placeholder="Enter API Key..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={!inputValue.trim() || isSaving}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        {hasKey && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md bg-red-600/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
