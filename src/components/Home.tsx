import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { increment, decrement } from '../../slices/counterSlice';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Webpack + React + Tailwind + Redux Toolkit</h1>
      <p className="mt-2">Главные паттерны Webpack + современный стек</p>
      <div className="mt-4 flex items-center gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => dispatch(increment())}>+</button>
        <span className="text-lg font-mono">{count}</span>
        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => dispatch(decrement())}>-</button>
      </div>
      <div className="mt-4">
        <Link to="/about" className="text-blue-700 underline">About</Link>
      </div>
    </div>
  );
};

export default Home;
