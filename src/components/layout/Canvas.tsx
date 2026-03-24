import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type DefaultEdgeOptions,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import AgentNode from '../workflow/AgentNode'
import { useWorkflowStore } from '../../store/workflowStore'

const defaultEdgeOptions: DefaultEdgeOptions = {
  style: { stroke: '#737373' },
  animated: false,
}

export default function Canvas() {
  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange)
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange)
  const onConnect = useWorkflowStore((s) => s.onConnect)

  const nodeTypes = useMemo(() => ({ agent: AgentNode }), [])

  return (
    <section className="flex-1 bg-neutral-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#404040"
          gap={20}
          size={1}
        />
        <Controls
          position="bottom-left"
          className="!bg-neutral-800 !border-neutral-700 !shadow-lg [&>button]:!bg-neutral-800 [&>button]:!border-neutral-700 [&>button]:!text-neutral-300 [&>button:hover]:!bg-neutral-700"
        />
        <MiniMap
          position="bottom-right"
          nodeColor="#525252"
          maskColor="rgba(0, 0, 0, 0.6)"
          className="!bg-neutral-900 !border-neutral-700"
        />
      </ReactFlow>
    </section>
  )
}
