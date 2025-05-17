/**
 * Counter Feature View
 * Компонент с UI для работы с функционалом счетчика
 */
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { increment, decrement } from './counterSlice';
import { selectCount } from './counterSlice';

export const CounterView: React.FC = () => {
  // Используем селектор для получения значения из стора
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  
  return (
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => dispatch(increment())}>+</button>
      <span className="text-lg font-mono">{count}</span>
      <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
};

export default CounterView;
