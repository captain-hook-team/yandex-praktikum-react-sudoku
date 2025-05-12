import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../components/utils';
import style from './MainPage.module.scss';
import ROUTES from '../../constants/constants';
import mainPageImg from '../../assets/images/mainPage.png';
import CustomButton from '../../components/custom-button/CustomButton';

type Action = {
  text: string;
  onNavigate: () => void;
  style?: string;
};

export default function MainPage() {
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
    <section className={style.mainPage}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </section>
  );
}
