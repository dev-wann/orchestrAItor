import { AlertTriangle } from 'lucide-react'

interface ApprovalBannerProps {
  agentName: string
  onApprove: () => void
  onReject: () => void
}

export default function ApprovalBanner({
  agentName,
  onApprove,
  onReject,
}: ApprovalBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded border border-amber-600/30 bg-amber-600/10 px-3 py-2">
      <AlertTriangle className="size-4 shrink-0 text-amber-400" />

      <p className="flex-1 text-xs text-amber-400">
        Agent <span className="font-semibold">{agentName}</span> requires
        approval to continue
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-green-500"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="rounded bg-red-600/10 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-600/20"
        >
          Reject
        </button>
      </div>
    </div>
  )
}
