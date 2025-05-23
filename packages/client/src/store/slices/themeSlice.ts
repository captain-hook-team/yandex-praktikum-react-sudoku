import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { isServer } from '../../constants/constants';

export type Theme = 'light' | 'dark';

export interface ThemeState {
  currentTheme: Theme;
  availableThemes: Theme[];
}

const initialState: ThemeState = {
  currentTheme: 'light',
  availableThemes: ['light', 'dark'],
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;

      // Проверяем, что код выполняется на клиенте
      if (!isServer) {
        // Для клиента: обновляем DOM и localStorage
        document.documentElement.setAttribute('data-theme', action.payload);
        localStorage.setItem('userTheme', action.payload);

        // Записываем в куки (срок действия 1 год)
        document.cookie = `theme=${action.payload}; path=/; max-age=${365 * 24 * 60 * 60}`;
      } // Для сервера ничего не делаем, сервер не имеет доступа к DOM и LocalStorage
    },
  },
});

// Чтение темы из кук (для SSR)
export const getThemeFromCookies = (cookies: Record<string, string>): Theme => (cookies.theme === 'dark' ? 'dark' : 'light');

export const { setTheme } = themeSlice.actions;
export const selectCurrentTheme = (state: RootState) => state.theme.currentTheme;
export const selectAvailableThemes = (state: RootState) => state.theme.availableThemes;

export default themeSlice.reducer;
