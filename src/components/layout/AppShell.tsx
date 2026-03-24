import { useUIStore } from '../../store/uiStore'
import TitleBar from './TitleBar'
import Sidebar from './Sidebar'
import Canvas from './Canvas'
import Panel from './Panel'

export default function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const panelOpen = useUIStore((s) => s.panelOpen)

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white">
      <TitleBar />

      <div className="flex flex-1 min-h-0">
        <div className={sidebarOpen ? '' : 'hidden'}>
          <Sidebar />
        </div>
        <Canvas />
        <div className={panelOpen ? '' : 'hidden'}>
          <Panel />
        </div>
      </div>
    </div>
  )
}
