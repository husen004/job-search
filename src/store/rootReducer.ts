import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '../api/baseApi';

export const rootReducer = combineReducers({
  counter: {
    
  },
  // Add the generated API reducer to the store
  [baseApi.reducerPath]: baseApi.reducer,
  // Здесь можно добавить другие редьюсеры по мере роста приложения
});

export type RootReducer = typeof rootReducer;
