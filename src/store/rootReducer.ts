import { combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from '../features/counter';

export const rootReducer = combineReducers({
  counter: counterReducer,
  // Здесь можно добавить другие редьюсеры по мере роста приложения
});

export type RootReducer = typeof rootReducer;
