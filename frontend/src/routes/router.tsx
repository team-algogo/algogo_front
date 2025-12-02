import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "../pages/main/MainPage";
import LoginPage from "../pages/login/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
