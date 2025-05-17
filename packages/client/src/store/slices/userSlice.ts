import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProfile } from '../../models/Profile';
import { UserState } from '../types';
import { fetchUserData, fetchAuthorize } from './userExtraReducers';

const initialState: UserState = {
  user: null,
  isAuth: false,
  loading: false,
  error: null,
};

// Вспомогательная функция для проверки, является ли объект валидным
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidUserObject = (obj: any): obj is IProfile => obj !== null && typeof obj === 'object' && !Array.isArray(obj);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IProfile>) {
      state.user = action.payload;
      state.isAuth = isValidUserObject(action.payload);
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logoutUser(state) {
      state.user = null;
      state.isAuth = false;
    },
    updateUser(state, action: PayloadAction<Partial<IProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // После обновления также проверяем валидность user
        state.isAuth = isValidUserObject(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state) => {
        // Добавляем проверку для extraReducers
        state.isAuth = isValidUserObject(state.user);
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchAuthorize.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthorize.fulfilled, (state) => {
        // Добавляем проверку для extraReducers
        state.isAuth = isValidUserObject(state.user);
        state.loading = false;
      })
      .addCase(fetchAuthorize.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectAuth: (state) => state.isAuth,
    selectError: (state) => state.error,
    selectLoading: (state) => state.loading,
  },
});

export const { setUser, setLoading, setError, logoutUser, updateUser } = userSlice.actions;
export const { selectUser, selectAuth, selectError, selectLoading } = userSlice.selectors;

export default userSlice.reducer;
