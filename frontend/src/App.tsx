import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center w-full min-h-svh text-lg">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}

export default App;
