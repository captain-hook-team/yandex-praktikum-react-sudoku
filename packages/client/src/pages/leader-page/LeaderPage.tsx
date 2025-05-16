/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import style from './LeaderPage.module.scss';
import avatar from '../../assets/images/avatar.jpg';
import leftBlueArrow from '../../assets/icons/left_blue_arrow.svg';
import leaders from './mock';
import { AppHeader, Pagination } from '../../components';

import { selectUser } from '../../store/slices/userSlice';
import { fetchUserData } from '../../store/slices/userExtraReducers';
import { PageInitArgs } from '../../routes-object';
import usePage from '../../hooks/usePage';

export const initLeaderPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    await dispatch(fetchUserData());
  }
};

export default function LeaderPage() {
  usePage({ initPage: initLeaderPage });

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8; // Количество строк на странице
  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(leaders.length / rowsPerPage);

  // Определяем начальный и конечный индексы для текущей страницы
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentLeaders = leaders.slice(startIndex, startIndex + rowsPerPage);

  // TODO: реализовать логику нажатия на кнопку назад
  const handleBackBtnClick = () => {
    console.log('The back button is clicked');
  };

  const headNames = ['Место', 'Аватар', 'Имя', 'Время'];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Таблица лидеров</title>
        <meta name="description" content="Страница лидеров" />
      </Helmet>
      <AppHeader />
      <section className={style.leaderPage}>
        <div className={style.leaderPage__wrap}>
          <button className={style.leaderPage__backWrap} type="button" onClick={handleBackBtnClick}>
            <img className={style.leaderPage__backIcon} src={leftBlueArrow} alt="Стрелка назад" />
            <p className={style.leaderPage__backText}>Назад</p>
          </button>
          <h1 className={style.leaderPage__title}>Таблица лидеров</h1>

          <div className={style.leaderPage__table}>
            <ul className={style.leaderPage__raw}>
              {headNames.map((headName, ind) => (
                <li className={`${style.leaderPage__headText} ${style.leaderPage__text} ${headName === 'Имя' ? style.leaderPage__name : ''}`} key={ind}>{headName}</li>
              ))}
            </ul>
            <ul className={style.leaderPage__tableContent}>
              {currentLeaders.map((leader, index) => (
                <li className={style.leaderPage__raw} key={index}>
                  <p className={`${style.leaderPage__rawText} ${style.leaderPage__text}`}>{leader.place}</p>
                  <div className={style.leaderPage__avatarWrap}>
                    <img className={style.leaderPage__avatar} src={avatar} alt="Аватар" />
                  </div>
                  <p className={`${style.leaderPage__rawText} ${style.leaderPage__text} ${style.leaderPage__name}`}>{leader.name}</p>
                  <p className={`${style.leaderPage__rawText} ${style.leaderPage__text} ${style.leaderPage__lastChild}`}>{leader.time}</p>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </>
  );
}
