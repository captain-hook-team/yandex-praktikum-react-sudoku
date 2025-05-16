import {
  SignupPage,
  GamePage,
  LeaderPage,
  LoginPage,
  MainPage,
  ProfilePage,
  TopicCreatePage,
  TopicPage,
  NotFoundPage,
  InternalServerErrorPage,
} from './pages';
import { ForumPageWrapper } from './components';
import ROUTES from './constants/constants';
import { AppDispatch, RootState } from './store';
import { initMainPage } from './pages/main-page/MainPage';
import { initNotFoundPage } from './pages/not-found-page/NotFoundPage';
import { initLoginPage } from './pages/login-page/LoginPage';
import { initSignupPage } from './pages/signup-page/SignupPage';
import { initProfilePage } from './pages/profile-page/ProfilePage';
import { initTopicPage } from './pages/topic-page/TopicPage';
import { initForumPageWrapper } from './components/forum-wrapper/ForumPageWrapper';
import { initGamePage } from './pages/game-page/GamePage';
import { initLeaderPage } from './pages/leader-page/LeaderPage';
import { initTopicCreatePage } from './pages/topic-create-page/TopicCreatePage';
import { initInternalServerErrorPage } from './pages/internal-server-error-page/InternalServerErrorPage';
import ProtectedRoute from './components/route/ProtectedRoute';
import UnauthOnlyRoute from './components/route/UnauthOnlyRoute';
import { IReqData } from './utils/Api/AuthApi';

export type PageInitContext = {
  clientToken?: string;
}

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: IReqData;
}

const routesObject = [
  {
    path: ROUTES.LOGIN,
    element: (
      <UnauthOnlyRoute>
        <LoginPage />
      </UnauthOnlyRoute>
    ),
    fetchData: initLoginPage,
  },
  {
    path: ROUTES.SIGN_UP,
    element: (
      <UnauthOnlyRoute>
        <SignupPage />
      </UnauthOnlyRoute>
    ),
    fetchData: initSignupPage,
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    fetchData: initProfilePage,
  },
  {
    path: ROUTES.TOPIC,
    Component: TopicPage,
    fetchData: initTopicPage,
  },
  {
    path: ROUTES.TOPICS_LIST,
    Component: ForumPageWrapper,
    fetchData: initForumPageWrapper,
  },
  {
    path: ROUTES.TOPICS,
    Component: ForumPageWrapper,
    fetchData: initForumPageWrapper,
  },
  {
    path: ROUTES.GAME,
    Component: GamePage,
    fetchData: initGamePage,
  },
  {
    path: ROUTES.LEADERBOARD,
    Component: LeaderPage,
    fetchData: initLeaderPage,
  },
  {
    path: ROUTES.MAIN,
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: ROUTES.CREATE_TOPIC,
    Component: TopicCreatePage,
    fetchData: initTopicCreatePage,
  },
  {
    path: ROUTES.INTERNAL_SERVER_ERROR,
    Component: InternalServerErrorPage,
    fetchData: initInternalServerErrorPage,
  },
  {
    path: ROUTES.NOT_FOUND_404,
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
  {
    path: ROUTES.UNDEFINED,
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];

export default routesObject;
