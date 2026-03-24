import Anthropic from '@anthropic-ai/sdk'
import { invoke } from '@tauri-apps/api/core'
import type { Agent, AgentStatus } from '../types/database'
import { logAgent } from './logAgent'
import { detectApprovalRequest } from './approvalDetector'
import { approvalManager } from './approvalManager'
import { notifyApprovalRequired } from './notifications'

interface RunAgentParams {
  agent: Agent
  input: string
  onToken: (text: string) => void
  onStatusChange: (status: AgentStatus) => void
  onComplete: (output: string, tokenCount: number) => void
  onError: (error: string) => void
  signal?: AbortSignal
  /** Unique node/agent ID used as the approval key. Defaults to agent.id. */
  nodeId?: string
}

export async function runAgent({
  agent,
  input,
  onToken,
  onStatusChange,
  onComplete,
  onError,
  signal,
  nodeId,
}: RunAgentParams): Promise<void> {
  const approvalKey = nodeId ?? agent.id

  try {
    const apiKey = await invoke<string>('get_api_key', {
      provider: agent.provider,
    })

    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    })

    // Conversation history for continuation after approval
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: input },
    ]

    let totalInputTokens = 0
    let totalOutputTokens = 0

    // Loop: run stream → check for approval → continue if approved
    // eslint-disable-next-line no-constant-condition
    while (true) {
      onStatusChange('running')

      const stream = client.messages.stream(
        {
          model: agent.model,
          system: agent.system_prompt,
          max_tokens: 4096,
          messages,
        },
        { signal },
      )

      // Buffer tokens and flush at intervals to reduce store updates
      let buffer = ''
      let accumulatedOutput = ''
      let approvalDetected = false
      let flushTimer: ReturnType<typeof setTimeout> | null = null

      const flush = () => {
        if (buffer) {
          onToken(buffer)
          buffer = ''
        }
        flushTimer = null
      }

      stream.on('text', (text) => {
        buffer += text
        accumulatedOutput += text

        // Check for approval pattern in accumulated output
        if (!approvalDetected && detectApprovalRequest(accumulatedOutput)) {
          approvalDetected = true
        }

        if (!flushTimer) {
          flushTimer = setTimeout(flush, 50)
        }
      })

      const finalMessage = await stream.finalMessage()

      // Flush any remaining buffer
      if (flushTimer) clearTimeout(flushTimer)
      flush()

      const fullOutput = finalMessage.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('')

      totalInputTokens += finalMessage.usage.input_tokens
      totalOutputTokens += finalMessage.usage.output_tokens

      // Append assistant message to conversation history
      messages.push({ role: 'assistant', content: fullOutput })

      // If approval is required, pause and wait for user decision
      if (approvalDetected) {
        onStatusChange('approval_required')
        await notifyApprovalRequired(agent.name)
        await logAgent(agent.id, 'warn', 'Approval required — waiting for user')

        const approved = await approvalManager.waitForApproval(approvalKey)

        if (!approved) {
          onError('Agent execution was rejected by user')
          onStatusChange('idle')
          await logAgent(agent.id, 'warn', 'Approval rejected by user')
          return
        }

        // User approved — continue the conversation
        await logAgent(agent.id, 'info', 'Approval granted — resuming')
        messages.push({
          role: 'user',
          content: 'Approved. Continue with the task.',
        })
        // Loop back to create a new stream with updated messages
        continue
      }

      // No approval needed — we are done
      const tokenCount = totalInputTokens + totalOutputTokens
      onComplete(fullOutput, tokenCount)

      await logAgent(
        agent.id,
        'info',
        `Completed: ${tokenCount} tokens (in: ${totalInputTokens}, out: ${totalOutputTokens})`,
        JSON.stringify({
          model: agent.model,
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
        }),
      )
      return
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown error occurred'

    if (signal?.aborted) {
      onError('Agent execution was cancelled')
      onStatusChange('idle')
      await logAgent(agent.id, 'warn', 'Execution cancelled by user')
    } else {
      onError(message)
      onStatusChange('error')
      await logAgent(agent.id, 'error', message)
    }
  }
}
