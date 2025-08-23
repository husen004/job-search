import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '../api/baseApi';
import toastReducer from './slices/toastSlice';

export const rootReducer = combineReducers({
  toast: toastReducer,
  // Add the generated API reducer to the store
  [baseApi.reducerPath]: baseApi.reducer,
  // Здесь можно добавить другие редьюсеры по мере роста приложения
});

export type RootState = ReturnType<typeof rootReducer>;
