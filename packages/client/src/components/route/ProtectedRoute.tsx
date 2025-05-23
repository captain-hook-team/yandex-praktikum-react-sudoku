/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/slices/userSlice';
import SafeRedirect from './SafeRedirect';
import ROUTES from '../../constants/constants';

function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const loggedIn = useAppSelector(selectAuth);
  return loggedIn ? children : <SafeRedirect to={ROUTES.LOGIN} />;
}

export default ProtectedRoute;
