export default function TitleBar() {
  return (
    <header
      data-tauri-drag-region
      className="h-8 flex items-center justify-center bg-neutral-900 border-b border-neutral-800 select-none"
    >
      <span
        data-tauri-drag-region
        className="text-xs font-semibold tracking-wide text-neutral-400"
      >
        orchestrAItor
      </span>
    </header>
  )
}
