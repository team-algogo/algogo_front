import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "@pages/main/MainPage";
import GroupMainPage from "@pages/group/GroupMainPage";
import LoginPage from "@pages/auth/LoginPage";
// import JoinPage from "@pages/auth/JoinPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "group", element: <GroupMainPage /> },
      // { path: "join", element: <JoinPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
