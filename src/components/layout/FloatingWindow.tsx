export default function FloatingWindow() {
  return (
    <div className="h-full flex flex-col bg-neutral-900/90 rounded-xl text-white overflow-hidden">
      <header
        data-tauri-drag-region
        className="h-8 flex items-center justify-center border-b border-neutral-700 select-none shrink-0"
      >
        <span
          data-tauri-drag-region
          className="text-xs font-semibold tracking-wide text-neutral-400"
        >
          orchestrAItor
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-neutral-500 select-none">
          No active agents
        </p>
      </div>
    </div>
  )
}
