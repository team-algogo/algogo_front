import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-logo font-bold">알고가자 algo-go</h1>
    </QueryClientProvider>
  );
}

export default App;
