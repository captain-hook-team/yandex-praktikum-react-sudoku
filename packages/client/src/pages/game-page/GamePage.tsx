/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Helmet } from 'react-helmet';
import { AppHeader, GameField } from '../../components';
import style from './GamePage.module.scss';
import { selectUser } from '../../store/slices/userSlice';
import { fetchUserData } from '../../store/slices/userExtraReducers';
import { PageInitArgs } from '../../routes-object';
import usePage from '../../hooks/usePage';

export const initGamePage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    await dispatch(fetchUserData());
  }
};

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

HelmetComponent.displayName = 'Helmet';

export default function GamePage() {
  usePage({ initPage: initGamePage });

  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </HelmetComponent>
      <AppHeader />
      <section className={style.main}>
        <GameField />
      </section>
    </>
  );
}
