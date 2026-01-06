import Header from "@components/header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="min-h-screen w-full text-lg">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}

export default App;
