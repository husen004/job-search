// ...existing code...
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './store';
import './style.css';
import { increment, decrement } from './slices/counterSlice';

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

const About: React.FC = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold">About</h2>
    <p className="mt-2">React Router работает!</p>
    <Link to="/" className="text-blue-700 underline">Home</Link>
  </div>
);

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
