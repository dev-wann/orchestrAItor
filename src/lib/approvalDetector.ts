const APPROVAL_PATTERNS = [
  'APPROVAL_REQUIRED',
  'HUMAN_REVIEW_NEEDED',
  '[APPROVAL]',
] as const

/**
 * Detects whether the given text contains any approval-request pattern.
 * Returns true if at least one pattern is found.
 */
export function detectApprovalRequest(text: string): boolean {
  return APPROVAL_PATTERNS.some((pattern) => text.includes(pattern))
}
