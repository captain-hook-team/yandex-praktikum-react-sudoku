import { useNavigate } from 'react-router-dom';
import style from './GameOverForm.module.scss';
import { CustomButton } from '../index';
import ROUTES from '../../constants/constants';
import { useEffect } from 'react';
import { addLeaderboardResult } from '../../services/LeaderBoardServices';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/userSlice';

interface GameOverFormProps {
    countErrors: number;
    isOpen: boolean;
    handleRefreshField: () => void;
    time: number;
}

function GameOverForm(props: GameOverFormProps) {
  const { isOpen, countErrors, handleRefreshField, time } = props;
  const isWinGame = countErrors < 3;
  const navigate = useNavigate();
  const user = useAppSelector((state) => selectUser(state));

  useEffect(() => {
    if (isWinGame && isOpen && user) {
      addLeaderboardResult({
        data: {
          time: time + 10000,
          name: `${user.first_name} ${user.second_name}`,
          avatar: user.avatar,
        },
        ratingFieldName: "time",
        teamName: "CaptainHook"
      }).then(res => console.log(res));
    }
  }, [isWinGame, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={style.gameOverWrapper}>
      <div
        className={style.gameOverForm}
      >
        {isWinGame && (
          <>
            <p className={style.gameOverForm_title}>Вы победили!</p>

            <CustomButton
              className={[style.gameOverForm_button]}
              type="button"
              color="primary"
              text="Начать новую игру"
              onClick={() => handleRefreshField()}
            />
          </>
        )}

        {!isWinGame && (
          <>
            <p className={style.gameOverForm_title}>Вы проиграли</p>

            <CustomButton
              className={[style.gameOverForm_button]}
              type="button"
              color="primary"
              text="Повторить игру"
              onClick={() => handleRefreshField()}
            />

            <CustomButton
              className={[style.gameOverForm_button]}
              type="button"
              color="primary"
              text="Начать новую игру"
              onClick={() => handleRefreshField()}
            />
          </>
        )}

        <CustomButton
          className={[style.gameOverForm_button]}
          type="button"
          color="secondary"
          text="Главное меню"
          onClick={() => navigate(ROUTES.MAIN)}
        />
      </div>
    </div>
  );
}

export default GameOverForm;
