import { useEffect, useState } from 'react';

import { Pagination } from '../../components';
import { getLeaderboard } from '../../services/LeaderBoardServices';
import { ILeaderScore } from '../../models/LeaderBoard';

import style from './LeaderPage.module.scss';
import leftBlueArrow from '../../assets/icons/left_blue_arrow.svg';
import defaultAvatar from '../../assets/images/default-avatar.png';

const ROWS_PER_PAGE = 8;
const TABLE_HEADER_NAME = ['Место', 'Аватар', 'Имя', 'Время'];

function LeaderPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [currentLeaders, setCurrentLeaders] = useState<ILeaderScore[]>([]);

  useEffect(() => {
    getLeaderboard({
      ratingFieldName: 'time',
      cursor: 0,
      limit: 100,
    }).then((res) => setPagesCount(Math.ceil(res.length / ROWS_PER_PAGE)));
  }, []);

  useEffect(() => {
    getLeaderboard({
      ratingFieldName: 'time',
      cursor: currentPage - 1,
      limit: ROWS_PER_PAGE,
    })
      .then((res) => {
        const leaderboard = res.map((item) => item.data);
        setCurrentLeaders(leaderboard);
      });
  }, [currentPage]);

  // TODO: реализовать логику нажатия на кнопку назад
  const handleBackBtnClick = () => {
    console.log('The back button is clicked');
  };

  return (
    <section className={style.leaderPage}>
      <div className={style.leaderPage__wrap}>
        <button className={style.leaderPage__backWrap} type="button" onClick={handleBackBtnClick}>
          <img className={style.leaderPage__backIcon} src={leftBlueArrow} alt="Стрелка назад" />
          <p className={style.leaderPage__backText}>Назад</p>
        </button>
        <h1 className={style.leaderPage__title}>Таблица лидеров</h1>

        <table className={style.leaderPage__table}>
          <thead>
            <tr className={style.leaderPage__raw}>
              {TABLE_HEADER_NAME.map((headName) => (
                <th
                  className={`${style.leaderPage__headText} ${style.leaderPage__text} ${headName === 'Имя' ? style.leaderPage__name : ''}`}
                  key={headName}
                >
                  {headName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={style.leaderPage__tableContent}>
            {currentLeaders.map((leader, index) => (
              <tr className={style.leaderPage__raw} key={leader.name}>
                <td><p className={`${style.leaderPage__rawText} ${style.leaderPage__text}`}>{index + 1 + ROWS_PER_PAGE * (pagesCount - 1)}</p></td>
                <td>
                  <div className={style.leaderPage__avatarWrap}>
                    {
                      leader?.avatar
                        ? <img src={`https://ya-praktikum.tech/api/v2/resources${leader.avatar}`} alt="Аватар" className={style.leaderPage__avatar} />
                        : <img src={defaultAvatar} alt="Avatar" className={style.leaderPage__avatar} />
                    }
                  </div>
                </td>
                <td>
                  <p className={`${style.leaderPage__rawText} ${style.leaderPage__text} ${style.leaderPage__name}`}>
                    {leader.name}
                  </p>
                </td>
                <td>
                  <p className={`${style.leaderPage__rawText} ${style.leaderPage__text} ${style.leaderPage__lastChild}`}>
                    {leader.time}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={pagesCount}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default LeaderPage;
