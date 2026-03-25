// Patterns must appear at the start of a line to reduce false positives
const APPROVAL_PATTERNS = [
  /^APPROVAL_REQUIRED/m,
  /^HUMAN_REVIEW_NEEDED/m,
  /^\[APPROVAL\]/m,
] as const

export function detectApprovalRequest(text: string): boolean {
  return APPROVAL_PATTERNS.some((pattern) => pattern.test(text))
}
