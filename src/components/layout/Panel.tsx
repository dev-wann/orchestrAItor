export default function Panel() {
  return (
    <aside className="w-72 flex flex-col bg-neutral-900 border-l border-neutral-800">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Status Panel
      </div>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-neutral-500 select-none">
          No active workflow
        </p>
      </div>
    </aside>
  )
}
