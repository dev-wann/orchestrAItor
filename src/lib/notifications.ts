import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from '@tauri-apps/plugin-notification'

/**
 * Sends a macOS native notification when an agent requires approval.
 * Checks (and requests if needed) notification permission before sending.
 */
export async function notifyApprovalRequired(
  agentName: string,
): Promise<void> {
  try {
    let permitted = await isPermissionGranted()
    if (!permitted) {
      const result = await requestPermission()
      permitted = result === 'granted'
    }

    if (permitted) {
      sendNotification({
        title: 'orchestrAItor — Approval Required',
        body: `Agent ${agentName} needs your approval to continue`,
      })
    }
  } catch (error) {
    console.error('[notifications] Failed to send notification:', error)
  }
}
