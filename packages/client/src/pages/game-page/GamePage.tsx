/* eslint-disable import/no-extraneous-dependencies */
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

export default function GamePage() {
  usePage({ initPage: initGamePage });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <AppHeader />
      <section className={style.main}>
        <GameField />
      </section>
    </>
  );
}
