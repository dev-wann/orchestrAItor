import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import AppShell from "./components/layout/AppShell";
import FloatingWindow from "./components/layout/FloatingWindow";
import "./App.css";

const queryClient = new QueryClient();

const windowLabel = getCurrentWebviewWindow().label;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {windowLabel === "floating" ? <FloatingWindow /> : <AppShell />}
    </QueryClientProvider>
  );
}

export default App;
