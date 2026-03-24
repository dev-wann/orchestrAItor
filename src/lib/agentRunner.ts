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
    // 1. Fetch API key from the OS keyring via Tauri
    const apiKey = await invoke<string>('get_api_key', {
      provider: agent.provider,
    })

    // 2. Create Anthropic client (dangerouslyAllowBrowser is safe in Tauri WebView)
    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    })

    // 3. Notify running state
    onStatusChange('running')

    // 4. Start streaming request
    const stream = client.messages.stream(
      {
        model: agent.model,
        system: agent.system_prompt,
        max_tokens: 4096,
        messages: [{ role: 'user', content: input }],
      },
      { signal },
    )

    // 5. Handle per-token streaming
    stream.on('text', (text) => {
      onToken(text)
    })

    // 6. Wait for stream to complete, then extract results
    const finalMessage = await stream.finalMessage()

    const fullOutput = finalMessage.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    const tokenCount =
      finalMessage.usage.input_tokens + finalMessage.usage.output_tokens

    onComplete(fullOutput, tokenCount)
    onStatusChange('completed')

    // 7. Log success
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

    // Distinguish abort from other errors
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
