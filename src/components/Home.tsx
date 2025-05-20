import React from 'react';
import { Link } from 'react-router-dom';
import { Counter } from '../features/counter';
import PostsList from './PostsList';

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Webpack + React + Tailwind + Redux Toolkit</h1>
      <p className="mt-2">Главные паттерны Webpack + современный стек</p>
      <div className="mt-4">
        <Counter />
      </div>
      <div className="mt-6">
        <PostsList />
      </div>
      <div className="mt-4">
        <Link to="/about" className="text-blue-700 underline">About</Link>
      </div>
    </div>
  );
};

export default Home;

export default Home;
