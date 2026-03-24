import Anthropic from '@anthropic-ai/sdk'
import { invoke } from '@tauri-apps/api/core'
import type { Agent, AgentStatus } from '../types/database'
import { logAgent } from './logAgent'

interface RunAgentParams {
  agent: Agent
  input: string
  onToken: (text: string) => void
  onStatusChange: (status: AgentStatus) => void
  onComplete: (output: string, tokenCount: number) => void
  onError: (error: string) => void
  signal?: AbortSignal
}

export async function runAgent({
  agent,
  input,
  onToken,
  onStatusChange,
  onComplete,
  onError,
  signal,
}: RunAgentParams): Promise<void> {
  try {
    const apiKey = await invoke<string>('get_api_key', {
      provider: agent.provider,
    })

    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    })

    onStatusChange('running')

    const stream = client.messages.stream(
      {
        model: agent.model,
        system: agent.system_prompt,
        max_tokens: 4096,
        messages: [{ role: 'user', content: input }],
      },
      { signal },
    )

    // Buffer tokens and flush at intervals to reduce store updates
    let buffer = ''
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

    const tokenCount =
      finalMessage.usage.input_tokens + finalMessage.usage.output_tokens

    onComplete(fullOutput, tokenCount)

    await logAgent(
      agent.id,
      'info',
      `Completed: ${tokenCount} tokens (in: ${finalMessage.usage.input_tokens}, out: ${finalMessage.usage.output_tokens})`,
      JSON.stringify({
        model: agent.model,
        input_tokens: finalMessage.usage.input_tokens,
        output_tokens: finalMessage.usage.output_tokens,
      }),
    )
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
