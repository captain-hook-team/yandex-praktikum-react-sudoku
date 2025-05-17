import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/slices/userSlice';
import SafeRedirect from './SafeRedirect';
import ROUTES from '../../constants/constants';

function UnauthOnlyRoute({ children }: { children: React.JSX.Element }) {
  const loggedIn = useAppSelector(selectAuth);
  return !loggedIn ? children : <SafeRedirect to={ROUTES.MAIN} />;
}

export default UnauthOnlyRoute;
