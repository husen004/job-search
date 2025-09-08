import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '../api/baseApi';
import toastReducer from './slices/toastSlice';

export const rootReducer = combineReducers({
  toast: toastReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
