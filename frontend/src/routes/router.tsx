import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "@pages/main/MainPage";
import LoginPage from "@pages/auth/LoginPage";
import JoinPage from "@pages/auth/JoinPage";
import ProblemSetPage from "@pages/problemset/ProblemSetPage";
import ProblemSetDetailPage from "@pages/problemset/ProblemSetDetailPage";
import SearchPage from "@pages/search/SearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "problemset", element: <ProblemSetPage /> },
      { path: "problemset/:programId", element: <ProblemSetDetailPage /> },
      { path: "search", element: <SearchPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
