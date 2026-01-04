import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "@pages/main/MainPage";
import LoginPage from "@pages/auth/LoginPage";
import JoinPage from "@pages/auth/JoinPage";
import CodeSubmitPage from "@pages/code/CodeSubmitPage";
import CodeReviewPage from "@pages/code/CodeReviewPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "code/:programProblemId", element: <CodeSubmitPage /> },
      { path: "review/:submissionId", element: <CodeReviewPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
