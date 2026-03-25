type ApprovalResolver = (approved: boolean) => void

class ApprovalManager {
  private pending = new Map<string, ApprovalResolver>()

  /**
   * Registers a pending approval for the given nodeId.
   * Returns a Promise that resolves to `true` (approved) or `false` (rejected)
   * when `resolve()` is called.
   */
  waitForApproval(nodeId: string): Promise<boolean> {
    // If there's already a pending approval for this node, reject it first
    const existing = this.pending.get(nodeId)
    if (existing) {
      existing(false)
      this.pending.delete(nodeId)
    }

    return new Promise<boolean>((resolve) => {
      this.pending.set(nodeId, resolve)
    })
  }

  /**
   * Resolves a pending approval for the given nodeId.
   * `approved` — true to approve, false to reject.
   */
  resolve(nodeId: string, approved: boolean): void {
    const resolver = this.pending.get(nodeId)
    if (resolver) {
      resolver(approved)
      this.pending.delete(nodeId)
    }
  }

  /** Returns the list of nodeIds currently awaiting approval. */
  getPending(): string[] {
    return Array.from(this.pending.keys())
  }

  /** Rejects all pending approvals and clears the map. */
  cancelAll(): void {
    for (const resolver of this.pending.values()) {
      resolver(false)
    }
    this.pending.clear()
  }
}

export const approvalManager = new ApprovalManager()
