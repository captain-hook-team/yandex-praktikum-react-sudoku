import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentTheme, setTheme } from '../../store/slices/themeSlice';
import styles from './ThemeSwitcher.module.scss';
import sunIcon from '../../assets/icons/sun.svg';
import moonIcon from '../../assets/icons/moon.svg';

function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectCurrentTheme);

  const toggleTheme = () => {
    dispatch(setTheme(currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      className={styles.switcher}
      data-theme={currentTheme}
      onClick={toggleTheme}
      aria-label="Переключить тему"
    >
      <span className={styles.toggleTrack}>
        <span className={styles.toggleThumb}>
          {currentTheme === 'light' ? (
            <img className={styles.icon} src={sunIcon} alt="Светлая тема" />
          ) : (
            <img className={styles.icon} src={moonIcon} alt="Темная тема" />
          )}
        </span>
      </span>
    </button>
  );
}

export default ThemeSwitcher;
