import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectAuth } from '../store/slices/userSlice';
import { fetchUserByCode, fetchUserData } from '../store/slices/userExtraReducers';
import { AppDispatch } from '../store';
import ProtectedRoute from '../components/route/ProtectedRoute';
import { useAppSelector } from '../store/hooks';
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
} from '../pages/index';
import { AppHeader, ForumPageWrapper } from '../components';
import ROUTES from '../constants/constants';

function App() {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const loggedIn = useAppSelector((state) => selectAuth(state));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    const handleAuth = async () => {
      if (code) {
        const result = await dispatch(fetchUserByCode({ code }));

        if (fetchUserByCode.fulfilled.match(result)) {
          dispatch(fetchUserData());
        }
      } else {
        dispatch(fetchUserData());
      }
    };

    handleAuth();
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            !loggedIn ? (<LoginPage />) : (<Navigate to={ROUTES.PROFILE} />)
          }
        />
        <Route
          path={ROUTES.SIGN_UP}
          element={
            !loggedIn ? (<SignupPage />) : (<Navigate to={ROUTES.PROFILE} />)
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute loggedIn={loggedIn} element={ProfilePage} />
          }
        />

        <Route path={ROUTES.TOPIC} element={<TopicPage />} />
        <Route path={ROUTES.TOPICS_LIST} element={<ForumPageWrapper />} />
        <Route path={ROUTES.TOPICS} element={<ForumPageWrapper />} />
        <Route path={ROUTES.GAME} element={<GamePage />} />
        <Route path={ROUTES.LEADERBOARD} element={<LeaderPage />} />
        <Route path={ROUTES.MAIN} element={<MainPage />} />
        <Route path={ROUTES.CREATE_TOPIC} element={<TopicCreatePage />} />
        <Route path={ROUTES.INTERNAL_SERVER_ERROR} element={<InternalServerErrorPage />} />
        <Route path={ROUTES.NOT_FOUND_404} element={<NotFoundPage />} />
        <Route
          path={ROUTES.UNDEFINED}
          element={<Navigate to={ROUTES.NOT_FOUND_404} state={{ from: location }} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
