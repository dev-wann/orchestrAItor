import { useId, useState } from 'react'
import type { Agent, Provider } from '../../types/database'

// ── Types ──────────────────────────────────────────────────────────────
export interface AgentFormData {
  name: string
  provider: Provider
  model: string
  systemPrompt: string
  color: string
}

interface AgentFormProps {
  agent?: Agent
  onSubmit: (data: AgentFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

// ── Constants ──────────────────────────────────────────────────────────
const PROVIDER_OPTIONS: { value: Provider; label: string }[] = [
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'google', label: 'Google' },
  { value: 'ollama', label: 'Ollama' },
]

const COLOR_PRESETS: { hex: string; name: string }[] = [
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#ef4444', name: 'Red' },
]

const VALID_PROVIDERS = new Set<string>(PROVIDER_OPTIONS.map((o) => o.value))

// ── Component ──────────────────────────────────────────────────────────
export default function AgentForm({ agent, onSubmit, onCancel, isSubmitting = false }: AgentFormProps) {
  const formId = useId()
  const [name, setName] = useState(agent?.name ?? '')
  const [provider, setProvider] = useState<Provider>(agent?.provider ?? 'anthropic')
  const [model, setModel] = useState(agent?.model ?? '')
  const [systemPrompt, setSystemPrompt] = useState(agent?.system_prompt ?? '')
  const [color, setColor] = useState(agent?.color ?? COLOR_PRESETS[0].hex)

  const isEditing = !!agent

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedModel = model.trim()
    if (!trimmedName || !trimmedModel) return

    onSubmit({
      name: trimmedName,
      provider,
      model: trimmedModel,
      systemPrompt: systemPrompt.trim(),
      color,
    })
  }

  const inputClassName =
    'w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors'

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg bg-neutral-900 border border-neutral-800 p-4"
    >
      <h3 className="text-sm font-semibold text-white">
        {isEditing ? 'Edit Agent' : 'New Agent'}
      </h3>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-name`} className="text-xs font-medium text-neutral-400">
          Name
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          placeholder="Agent name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClassName}
          required
        />
      </div>

      {/* Provider */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-provider`} className="text-xs font-medium text-neutral-400">
          Provider
        </label>
        <select
          id={`${formId}-provider`}
          value={provider}
          onChange={(e) => {
            const val = e.target.value
            if (VALID_PROVIDERS.has(val)) setProvider(val as Provider)
          }}
          className={inputClassName}
        >
          {PROVIDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-model`} className="text-xs font-medium text-neutral-400">
          Model
        </label>
        <input
          id={`${formId}-model`}
          type="text"
          placeholder="e.g. claude-sonnet-4-20250514"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className={inputClassName}
          required
        />
      </div>

      {/* System Prompt */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-system-prompt`} className="text-xs font-medium text-neutral-400">
          System Prompt
        </label>
        <textarea
          id={`${formId}-system-prompt`}
          placeholder="Instructions for the agent..."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={4}
          className={`${inputClassName} resize-none`}
        />
      </div>

      {/* Color */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-neutral-400">Color</span>
        <div className="flex gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => setColor(preset.hex)}
              aria-label={`Select ${preset.name}`}
              className={`h-6 w-6 rounded-full transition-all ${
                color === preset.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''
              }`}
              style={{ backgroundColor: preset.hex }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !model.trim()}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
