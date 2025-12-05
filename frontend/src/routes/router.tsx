import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "@pages/main/MainPage";
import LoginPage from "@pages/login/LoginPage";
import JoinPage from "@pages/login/JoinPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
