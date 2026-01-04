import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "@pages/main/MainPage";
import GroupMainPage from "@pages/group/GroupMainPage";
import LoginPage from "@pages/auth/LoginPage";
import GroupDetailPage from "@pages/group/GroupDetailPage"; // 나중에 만드는 페이지 상세조회
import GroupMembersPage from "@pages/group/GroupMembersPage";
import JoinPage from "@pages/auth/JoinPage";
import ProblemSetPage from "@pages/problemset/ProblemSetPage";
import ProblemSetDetailPage from "@pages/problemset/ProblemSetDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "group", element: <GroupMainPage /> },
      { path: "group/:groupId", element: <GroupDetailPage /> },
      { path: "group/:groupId/members", element: <GroupMembersPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "problemset", element: <ProblemSetPage /> },
      { path: "problemset/:programId", element: <ProblemSetDetailPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
