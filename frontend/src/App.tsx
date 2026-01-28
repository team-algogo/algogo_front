import Header from "@components/header/Header";
import Footer from "@components/footer/Footer";
import ToastViewport from "@components/toast/ToastViewport";
import TopToastViewport from "@components/toast/TopToastViewport";
import useNotificationSSE from "@hooks/useNotificationSSE";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

// QueryClientProvider 내부에서 SSE와 Toast를 사용하는 컴포넌트
function AppContent() {
  // SSE 알림 연결 (전역)
  useNotificationSSE();
  const location = useLocation();

  return (
    <>

      <div className="flex flex-col min-h-[125dvh]">
        <Header />
        <main className="flex-1 w-full text-lg mt-16 flex flex-col">
          <Outlet />
        </main>
        {!location.pathname.startsWith("/code/") && <Footer />}
      </div>
      {/* Toast Viewports (Portal to document.body) */}
      <ToastViewport /> {/* 우하단 (남이 한 행동) */}
      <TopToastViewport /> {/* 상단 가운데 (내가 한 행동) */}
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
