import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import MainPage from "@pages/main/MainPage";
import GroupMainPage from "@pages/group/GroupMainPage";
import LoginPage from "@pages/auth/LoginPage";
import GroupDetailPage from "@pages/group/GroupDetailPage"; // 나중에 만드는 페이지 상세조회
import GroupMembersPage from "@pages/group/GroupMembersPage";
import JoinPage from "@pages/auth/JoinPage";
import CodeSubmitPage from "@pages/code/CodeSubmitPage";
import CodeReviewPage from "@pages/code/CodeReviewPage";
import ProblemSetPage from "@pages/problemset/ProblemSetPage";
import ProblemSetDetailPage from "@pages/problemset/ProblemSetDetailPage";
import SearchPage from "@pages/search/SearchPage";
import MyPage from "@pages/mypage/MyPage";
import SettingsPage from "@pages/mypage/SettingsPage";
import ProblemStatisticsPage from "@pages/problemset/ProblemStatisticsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "group", element: <GroupMainPage /> },
      { path: "group/:groupId", element: <GroupDetailPage /> },
      { path: "group/:groupId/members", element: <GroupMembersPage /> },
      { path: "mypage/settings", element: <SettingsPage /> },
      { path: "code/:programProblemId", element: <CodeSubmitPage /> },
      { path: "review/:submissionId", element: <CodeReviewPage /> },
      { path: "problemset", element: <ProblemSetPage /> },
      { path: "problemset/:programId", element: <ProblemSetDetailPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "statistics/:programProblemId", element: <ProblemStatisticsPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
