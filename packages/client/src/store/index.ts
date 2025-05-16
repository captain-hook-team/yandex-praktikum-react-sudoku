import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import ssrReducer from './slices/ssrSlice';
import { isServer } from '../constants/constants';

export const rootReducer = combineReducers({
  user: userReducer,
  ssr: ssrReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

declare global {
  interface Window {
    APP_INITIAL_STATE?: RootState;
  }
}

// Создание и настройка Redux-хранилища
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: isServer ? undefined : window.APP_INITIAL_STATE,
});

export type AppDispatch = typeof store.dispatch;
