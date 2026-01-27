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
import CreateProblemSetPage from "@pages/problemset/CreateProblemSetPage";
import EditProblemSetPage from "@pages/problemset/EditProblemSetPage";
import SearchPage from "@pages/search/SearchPage";
import MyPage from "@pages/mypage/MyPage";
import SettingsPage from "@pages/mypage/SettingsPage";
import ProblemStatisticsPage from "@pages/problemset/ProblemStatisticsPage";

import IntroPage from "@pages/intro/IntroPage";
import PrivacyPage from "@pages/policy/PrivacyPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        ),
      },
      { path: "intro", element: <IntroPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      {
        path: "mypage",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "group",
        element: (
          <ProtectedRoute>
            <GroupMainPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "group/:groupId",
        element: (
          <ProtectedRoute>
            <GroupDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "group/:groupId/members",
        element: (
          <ProtectedRoute>
            <GroupMembersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "mypage/settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "code/:programProblemId",
        element: (
          <ProtectedRoute>
            <CodeSubmitPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "review/:submissionId",
        element: (
          <ProtectedRoute>
            <CodeReviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "problemset",
        element: (
          <ProtectedRoute>
            <ProblemSetPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "problemset/create",
        element: (
          <ProtectedRoute>
            <CreateProblemSetPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "problemset/:programId/edit",
        element: (
          <ProtectedRoute>
            <EditProblemSetPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "problemset/:programId",
        element: (
          <ProtectedRoute>
            <ProblemSetDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "statistics/:programProblemId",
        element: (
          <ProtectedRoute>
            <ProblemStatisticsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
