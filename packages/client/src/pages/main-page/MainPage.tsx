/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import style from './MainPage.module.scss';
import ROUTES from '../../constants/constants';
import mainPageImg from '../../assets/images/mainPage.png';
import CustomButton from '../../components/custom-button/CustomButton';
import { AppHeader } from '../../components';
import { fetchUserByCode, fetchUserData } from '../../store/slices/userExtraReducers';
import { selectUser } from '../../store/slices/userSlice';
import { PageInitArgs } from '../../routes-object';
import usePage from '../../hooks/usePage';

type Action = {
  text: string;
  onNavigate: () => void;
  style?: string;
};

export const initMainPage = async ({ dispatch, state, ctx }: PageInitArgs) => {
  const queue: Array<Promise<unknown>> = [dispatch(fetchUserByCode({
    clientToken: ctx.clientToken,
  }))];
  if (!selectUser(state)) {
    queue.push(dispatch(fetchUserData()));
  }
  return Promise.all(queue);
};

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

function MainPage() {
  usePage({ initPage: initMainPage });

  const navigate = useNavigate();

  const actions: Action[] = [
    {
      text: 'Продолжить',
      onNavigate: () => navigate(ROUTES.GAME),
    },
    {
      text: 'Новая игра',
      onNavigate: () => navigate(ROUTES.GAME),
    },
    {
      text: 'Личный кабинет',
      onNavigate: () => navigate(ROUTES.PROFILE),
    },
    {
      text: 'Таблица лидеров',
      onNavigate: () => navigate(ROUTES.LEADERBOARD),
    },
    {
      text: 'Форум',
      onNavigate: () => navigate(ROUTES.TOPICS),
    },
  ];

  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta name="description" content="Главная страница" />
      </HelmetComponent>
      <AppHeader />
      <section className={style.mainPage}>
        <h1 className={style.mainPage__title}>SUDOKU</h1>
        <div className={style.mainPage__resultContainer}>
          <img
            src={mainPageImg}
            alt="Result game"
            className={style.mainPage__result}
          />
        </div>
        <div className={style.mainPage__actions}>
          {actions.map(({ text, onNavigate }) => (
            <CustomButton
              key={text}
              className={[style.button]}
              type="button"
              color="secondary"
              text={text}
              onClick={onNavigate}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default MainPage;
