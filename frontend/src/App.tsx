import Header from "@components/header/Header";
import Footer from "@components/footer/Footer";
import ToastViewport from "@components/toast/ToastViewport";
import useNotificationSSE from "@hooks/useNotificationSSE";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

// QueryClientProvider 내부에서 SSE와 Toast를 사용하는 컴포넌트
function AppContent() {
  // SSE 알림 연결 (전역)
  useNotificationSSE();

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-gray-50/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full text-lg mt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
      {/* Toast Viewport (Portal to document.body) */}
      <ToastViewport />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
