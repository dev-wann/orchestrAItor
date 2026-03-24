import { Play, Square } from 'lucide-react'

interface RunButtonProps {
  onRun: () => void
  onStop: () => void
  isRunning: boolean
  disabled?: boolean
}

export default function RunButton({
  onRun,
  onStop,
  isRunning,
  disabled = false,
}: RunButtonProps) {
  return (
    <button
      type="button"
      onClick={isRunning ? onStop : onRun}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-white transition-colors disabled:opacity-50 ${
        isRunning
          ? 'bg-red-600 hover:bg-red-500'
          : 'bg-green-600 hover:bg-green-500'
      }`}
    >
      {isRunning ? (
        <>
          <Square className="h-3 w-3" />
          Stop
        </>
      ) : (
        <>
          <Play className="h-3 w-3" />
          Run
        </>
      )}
    </button>
  )
}
